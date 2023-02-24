import React, { Component } from "react";
import custom from '../../config/custom.js';
import AWBNumber from '../shared/AWBNumber.js';
import AWBKundaliGraph from './AWBKundaliGraph.js'
import KundaliAWBLegs from './KundaliAWBLegs.js'
import { Tabs, Tab } from "react-bootstrap";
import AWBQuery from './AWBQuery.js';
import CCAMultiReason from '../shared/CCAMultiReason';
import CCAMultiSelect from '../Chart/CCAMultiSelect';
// import { Button } from "react-bootstrap";
import axios from 'axios';
// include ./render-components/KundaliAWBLegs.pug
import AWBClaim from './awbClaim/AWBClaim';
import { pdfjs } from 'react-pdf';
import SHCButton from "../shared/SHCButton.js";
import CAPAPendingModal from "../operations/CAPAPendingModal.js";
import KundaliAWBLegsCCATab from "./KundaliAWBLegsCCATab.js";
import OperationStore from "../operations/OperationStore.js";
import APIService from "../APIService";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// import PDFViewer from 'pdf-viewer-reactjs'

export default class AWBKundaliModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			awb_kundali_data: '',
			preAlertData:[],
			awb_no: props.awbNo,
			loading: true,
			awb_kundali_cca_data: '',
			cca: [],
			shc:[],
			total_query_count: 0,
			open_query_count: 0,
		}
	}


	onCloseModal = (event) => {
		this.props.closeAWBKundaliModal();
	}

	componentDidMount() {
		this.getAWBKundaliData(this.props.awbNo);
		this.getAWBQueryCount();
	}

	getAWBQueryCount = () => {
		let self = this;
		APIService.get(`/getAWBQueryCount/${this.props.awbNo}`, {}, function (response) {
			if(response.data) {
				self.setState({
					open_query_count: response.data.open_query_count,
					total_query_count: response.data.total_query_count
				});
			}
		});
	}

	getAWBKundaliData = (awbNumber) => {
		// console.log('++++++++call for getAWBKundaliData with awb no : ' + awbNumber);
		let awbNo = this.props.awbNo;
		if (awbNo.length === 11) {
			// let token=JwtToken.getPlainJwtToken();
			// axios.get(`${process.env.REACT_APP_API_BASE_PATH}/getAWBKundali`, {
			// 	params: {
			// 		awb_no: awbNo
			// 	},
			// 	headers:{
			// 		'Authorization': `Bearer ${token}`
			// 	}
			// })
			 //JwtToken.axiosget('/getAWBKundali', {awb_no: awbNo})
			APIService.get('/getAWBKundali',{awb_no: awbNo},function (response) {
					this.setState({ loading: false });
					console.log("getAWBKundali -====>" + JSON.stringify(response));
					if ((Object.keys(response.data).length) > 0) {
						console.log('result of kundali =-> ' + JSON.stringify(response.data));
						this.setState({ awb_kundali_data: response.data.awb });
						this.setState({ preAlertData: response.data.bookLists });
						this.setState({shc: response.data.awb.awb_info.shc})
						this.getCCA_Details(awbNo)
					}
					else {
						window.swal_error('No Records Found')
					}
				}.bind(this));

		}
		else {
			this.setState({ awb_kundali_data: '', loading: false });
		}
	}

	getCCA_Details = (awbNo) => {
		
		// axios.get(`${process.env.REACT_APP_API_BASE_PATH}/getCCAForAWB/` + awbNo, JwtToken.getJwtTokenHeader())
			
		APIService.get('/getCCAForAWB/' + awbNo, null, function (response) {
				this.setState({ loading: false });
				console.log("getCCAForAWB -====>" + JSON.stringify(response));
				if ((Object.keys(response.data).length) > 0) {
					console.log('result of getCCAForAWB =-> ' + JSON.stringify(response.data));
					// alert(JSON.stringify(response.data))
					console.log(JSON.stringify(response.data))
					response.data.map(op=>{
						op.cca_request.map(request=>{
							for(let i=0;i<request.reason.length;i++){
								let reason = request.reason[i].main_reason + (request.reason[i].sub_reason1? " - " + request.reason[i].sub_reason1:"") + (request.reason[i].sub_reason2? " - " + request.reason[i].sub_reason2:"") + (request.reason[i].sub_reason3.length>0? " - " + request.reason[i].sub_reason3:"");
								request.reason[i]=reason;
							}
						})
					})
					
					this.setState({ awb_kundali_cca_data: response.data });
				}
				else {
					// window.swal_error('No CCA Records Found')
					console.log("No CCA requests found!!!")
				}
			}.bind(this));
	}
	callbackCCA = (ccaData) => {
		this.setState({ cca: ccaData })
	}
	
	raiseCCA = () => {
		//API call to raise cca
		console.log("raiseCCA");
		APIService.post('/raiseCCA', {
			CCA: this.state.cca,
			awb_no: this.state.awb_no,
			station: this.props.MainStore.operatingStation,
			department: custom.custom.department_name.central_fin,
		
		}, function (response) {
			console.log("raiseCCA" + JSON.stringify(response));
				window.swal_success("CCA Raised");
			
		}.bind(this));
	}
	// onClickrefreashpage=(awbNumber)=>{
	// 	this.getAWBKundaliData(awbNumber);
	// }
	render() {
		console.log('========state============');
		if (this.state && this.state.awb_kundali_data !== '' && this.state.awb_kundali_data.awb_info !== '') {
			let hand_color = " text-danger ";
			let rate_check_color = " alert-secondary text-light ", fdc_color = " alert-secondary text-light ", pre_alert_color = " alert-secondary text-light ", euics_color = " alert-secondary text-light ", cap_a_color = " alert-secondary text-light ", eawb_check_color = " alert-secondary text-light ", rcf_color = " alert-secondary text-light ";
			let legDetails = this.state.awb_kundali_data.awb_info.awbLegs;
			let plannedLegs = [];
			let offLoadedLegs = [];
			let completedLegs = [];
			let plannerLegs = [];
			let tabId=this.props.tabid
			if (Array.isArray(legDetails) && legDetails.length > 0) {
				for (let i = 0; i < legDetails.length; i++) {
					if (legDetails[i].void_on > 0) {
						offLoadedLegs.push(legDetails[i]);
					} else if (legDetails[i].actual_pieces_flown > 0) {
						completedLegs.push(legDetails[i]);
					} else if (legDetails[i].pieces < 0) {
						plannerLegs.push(legDetails[i]);
					} else {
						plannedLegs.push(legDetails[i]);
					}
				}
			}
			if (this.state.awb_kundali_data.awb_info.on_hand === true) {
				hand_color = " text-success ";
			}
			if (this.state.awb_kundali_data.awb_info.rate_check === true) {
				rate_check_color = " badge-success ";
			}
			if (this.state.awb_kundali_data.awb_info.fdc === true) {
				fdc_color = " badge-success ";
			}
			if (this.state.awb_kundali_data.awb_info.pre_alert === true) {
				pre_alert_color = " badge-success ";
			}
			if (this.state.awb_kundali_data.awb_info.euics === true) {
				euics_color = " badge-success ";
			}
			if (this.state.awb_kundali_data.awb_info.cap_a === true) {
				cap_a_color = " badge-success ";
			}
			if (this.state.awb_kundali_data.awb_info.eawb_check === true) {
				eawb_check_color = " badge-success ";
			}
			if (this.state.awb_kundali_data.awb_info.rcf === true) {
				rcf_color = " badge-success ";
			}
			// console.log(window.location.href.includes("queryandclaims"));
			let non_focused_tab = 'alert-secondary border border-left border-right border-white';

			return (
				<div>
					<div className="modal-header">
						<h4 className="modal-title" id="awbKundaliModalEditTitle" >
							<span>
								<i className="fa fa-edit"></i>
							</span>
							<label className="ml-2">AWB Details </label>
						</h4>
						<button className="close" type="button" onClick={this.onCloseModal}>×</button>
					</div>
					<div className="modal-body p-1">
						<div className="row m-0 p-0">
							<h3 className="row mx-auto my-auto">
								<span className="text-info"></span>
								<AWBNumber awb_no={this.state.awb_kundali_data.awb_no} priority_class={this.state.awb_kundali_data.awb_info.priority_class} />
								<div className="mx-2">
									{/* <button onClick={this.onClickrefreashpage}> */}
									<span className="badge-xl badge-warning px-2">{this.state.awb_kundali_data.awb_info.src}</span>
									<span className="badge-xl badge-dark px-2">{this.state.awb_kundali_data.awb_info.dest}</span>
									{/* </button> */}
								</div>
								<i className={(this.state.awb_kundali_data.awb_info.unitized ? "text-primary" : "text-secondary") + " fas fa-magnet mx-2"} data-tip={this.state.awb_kundali_data.awb_info.unitized ? "Unitized Cargo" : "Loose Cargo"} data-html={true}></i>
								<span className="text-success">{this.state.awb_kundali_data.awb_info.pieces} pcs, </span>
								<span className="text-success ml-1">{this.state.awb_kundali_data.awb_info.weight} kg</span>
								<i className={hand_color + "fas fa-hand-paper mx-1"}></i>
								
								<div className="row bg-warning mx-2" >
									{this.state.awb_kundali_data.awb_info.shc.map((shc,index) =>
										(<SHCButton index={index} shc={shc} />))
									}
								</div>
							</h3>

							<h4 className="row mx-auto my-auto" >
								<span className={rate_check_color + "badge-sm badge-pill mx-1"}>Rate Check</span>
								<span className={fdc_color + "badge-sm badge-pill mx-1"}>FDC</span>
								<span className={pre_alert_color + "badge-sm badge-pill mx-1"}>Pre Alert</span>
								<span className={euics_color + "badge-sm badge-pill mx-1"}>EUICS</span>
								<span className={cap_a_color + "badge-sm badge-pill mx-1"}>CAP A</span>
								<span className={eawb_check_color + "badge-sm badge-pill mx-1"}>E AWB Check</span>
								<span className={rcf_color + "badge-sm badge-pill mx-1"}>RCF</span>
							</h4>
						</div>

						<AWBKundaliGraph awb_legs={this.state.awb_kundali_data.awb_info.awbLegs} origin={this.state.awb_kundali_data.awb_info.src} destination={this.state.awb_kundali_data.awb_info.dest} pieces={this.state.awb_kundali_data.awb_info.pieces} weight={this.state.awb_kundali_data.awb_info.weight} />
						<div className="accordion" id="accordionExample">
							<Tabs defaultActiveKey={tabId} id="uncontrolled-tab-example" variant='pills'>
								{/*All/ Documents / Planned / Off-loaded / Completed / Planner */}
								<Tab key={custom.custom.tab_name.all} eventKey={custom.custom.tab_name.all} title={(<span><i className='mr-2 mdi mdi-clock'></i>All ({this.state.awb_kundali_data.awb_info.awbLegs.length})</span>)} tabClassName={non_focused_tab}>
									<div>
										<KundaliAWBLegs awb_legs={this.state.awb_kundali_data.awb_info.awbLegs} getAWBKundaliData={this.getAWBKundaliData} />
									</div>
								</Tab>
								<Tab key={custom.custom.tab_name.completed} eventKey={custom.custom.tab_name.completed} title={(<span><i className='mr-2 mdi mdi-airplane'></i>Completed ({completedLegs.length})</span>)} tabClassName={non_focused_tab}>
									<div>
										<KundaliAWBLegs awb_legs={completedLegs} getAWBKundaliData={this.getAWBKundaliData} />
									</div>
								</Tab>
								<Tab key={custom.custom.tab_name.planned} eventKey={custom.custom.tab_name.planned} title={(<span><i className='mr-2 mdi mdi-plane-shield'></i>Planned ({plannedLegs.length})</span>)} tabClassName={non_focused_tab}>

									<div>
										<KundaliAWBLegs awb_legs={plannedLegs} getAWBKundaliData={this.getAWBKundaliData} />
									</div>
								</Tab>
								<Tab key={custom.custom.tab_name.offloaded} eventKey={custom.custom.tab_name.offloaded} title={(<span><i className='mr-2 mdi mdi-airplane-off'></i>Off-Loaded ({offLoadedLegs.length})</span>)} tabClassName={non_focused_tab}>
									<div>
										<KundaliAWBLegs awb_legs={offLoadedLegs} getAWBKundaliData={this.getAWBKundaliData} />
									</div>
								</Tab>
								<Tab key={custom.custom.tab_name.planner} eventKey={custom.custom.tab_name.planner} title={(<span><i className='mr-2 mdi mdi-routes'></i>Planner ({plannerLegs.length})</span>)} tabClassName={non_focused_tab}>
									<div>
										<KundaliAWBLegs awb_legs={plannerLegs} getAWBKundaliData={this.getAWBKundaliData} />
									</div>
								</Tab>
								<Tab key={custom.custom.tab_name.documents} eventKey={custom.custom.tab_name.documents} title={(<span><i className='mr-2 mdi mdi-file-document'></i>Documents</span>)} tabClassName={non_focused_tab} >
									<div className="card-body bg-dark" >
										<div>
											<strong className="text-white h4">AWB Scan: </strong>
											{
												this.state.awb_kundali_data.file_awb.sort((attachment1, attachment2) => attachment1.createdAt > attachment2.createdAt).map((attachment, index) => <button key={index} className="btn btn-xs btn-secondary mx-1" onClick={() => window.open(process.env.REACT_APP_API_BASE_PATH + attachment.new_filepath)}>{"R-" + index}</button>)
											}
											{
											this.state.awb_kundali_data.file_awb.length==0 && <label className="text-white">No Documents available</label>
											}
										</div><br></br>
										<div>
											<strong className="text-white h4">House-AWB Scan: </strong>
											{
												this.state.awb_kundali_data.file_house.sort((attachment1, attachment2) => attachment1.createdAt > attachment2.createdAt).map((attachment, index) => <button key={index} className="btn btn-xs btn-secondary mx-1" onClick={() => window.open(process.env.REACT_APP_API_BASE_PATH + attachment.new_filepath)}>{"R-" + index}</button>)
											}
											{
											this.state.awb_kundali_data.file_house.length==0 && <label className="text-white">No Documents available</label>
											}
										</div><br></br>
										{/* { this.state.preAlertData.map(booklist=>(
											<div>
											<strong className="text-white">Pre-alert Scan:  </strong>
											{
												booklist.file_prealert.sort((attachment1, attachment2) => attachment1.createdAt > attachment2.createdAt).map((attachment, index) => <button key={index} className="btn btn-xs btn-secondary mx-1" onClick={() => window.open(process.env.REACT_APP_API_BASE_PATH + attachment.new_filepath)}>{"R-" + index}</button>)
											}
										</div>
										))}	 */}
										<strong className="text-white h4">Pre-alert Scans:  </strong>	
										{
											
										this.state.shc.map((shc)=>(
											this.state.preAlertData.map(booklist=>(
											<div>
											<strong className="text-white">{shc}: </strong>
											{
												booklist.file_prealert.map((attachment, index) => 
												attachment.email_subject.split(' ')[2]==shc &&
													<button key={index} className="btn btn-xs btn-secondary mx-1" onClick={() => window.open(process.env.REACT_APP_API_BASE_PATH + attachment.new_filepath)}>{"R-" + index}</button>
												)
											}
											<br></br><br></br>
											</div>
											))
										))}	
										{
											this.state.shc.length==0 && <label className="text-white">No Documents available</label>
										}					
									</div>
								</Tab>
								<Tab key={custom.custom.tab_name.query} eventKey={custom.custom.tab_name.query} title={(<span><i className='mr-2 mdi mdi-comment-question-outline'></i>Queries ({this.state.open_query_count}/{this.state.total_query_count})</span>)} tabClassName={non_focused_tab}>
									<AWBQuery awb_kundali_data={this.state.awb_kundali_data} getAWBKundaliData={this.getAWBKundaliData} getAWBQueryCount={this.getAWBQueryCount}/>
								</Tab>
								<Tab key={custom.custom.tab_name.claim} eventKey={custom.custom.tab_name.claim} title={(<span><i className='mr-2 mdi mdi-file-document-box'></i>Claim</span>)} tabClassName={non_focused_tab}>
									{/* <Button className='btn btn-warning' onClick={() => {window.open('http://localhost:1337/claims', '_blank');}}>Initiate Claim</Button> */}
									<AWBClaim awb_legs_completed={completedLegs} awb_kundali_data={this.state.awb_kundali_data} awb_legs={plannedLegs} awb_info_pieces={this.state.awb_kundali_data.awb_info.pieces} MainStore={this.props.MainStore}/>
								</Tab>
								<Tab key={custom.custom.tab_name.cca} eventKey={custom.custom.tab_name.cca} title={(<span><i className='mr-2 mdi mdi-file-document-box'></i>CCA({this.state.awb_kundali_cca_data.length})</span>)} tabClassName={non_focused_tab}>
									<div>
										<KundaliAWBLegsCCATab awb_kundali_cca_data={this.state.awb_kundali_cca_data} getAWBKundaliData={this.getAWBKundaliData}  OperationStore={OperationStore}/>
									</div>
								</Tab>
								{(this.props.MainStore.departments.includes(custom.custom.department_name.central_fin) || this.props.MainStore.departments.includes(custom.custom.department_name.central_rec)) &&
									<Tab key={custom.custom.tab_name.raisecca} eventKey={custom.custom.tab_name.raisecca} title={(<span><i className='mr-1 mdi mdi-file-document-box'></i>Raise CCA</span>)} tabClassName={non_focused_tab}>
										<div>
											<CCAMultiReason ccaCallback={this.callbackCCA} />
											<button className="col-md-2 btn btn-danger m-auto" onClick={() => this.raiseCCA()}> Raise CCA </button>
										</div>
									</Tab>
								}
							</Tabs>
						</div>
					</div>
				</div>
			);
		} else {
			return (<div className='text-center'><p>{this.state.loading ? ('Fetching details for AWB - ' + this.state.awb_no) : 'Unable to find AWB Number'}</p></div>);
		}
	}
}