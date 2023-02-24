import React, { Component } from 'react'
import custom from '../../config/custom.js';
import Modal from 'react-bootstrap/Modal';
import AddNewAWBModal from './AddNewAWBModal.js'
import RCSPendingModal from './RCSPendingModal'
import TobePlannedModal from './TobePlannedModal'
import RCSPendingAWB from './RCSPendingAWB.js'
import TobePlannedAWB from './TobePlannedAWB.js'
import FlightSelector from './FlightSelector.js'
import FileUpload from './FileUpload.js'
import Booklist from './Booklist.js'
import BooklistRecordDiscardModal from './BooklistRecordDiscardModal.js'
import BooklistVsEgmModal from './BooklistVsEgmModal.js'
import { Observer } from "mobx-react"
import {withRouter} from 'react-router-dom';

class Planner extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAddNewAWBModalShow: false,
			isRCSPendingModalShow: false,
			isTobePlannedModalShow: false,
			isBooklistRecordDiscardModalShow: false,
			isMauallyDepart: false,
			// awbInfoRecords:[],
			// awbLegRecords:[],
			currentAwbInfoRecord: '',
			currentAwbLegRecord: '',
			currentBooklistRecord:'',
			flightSelectorDetails:'',
			booklistFileRecords: '',
			egmFileRecords: '',
			uploadedEGMFile: '',
			preview_strip:false,
			readOnly: false
		};
	}

	async componentDidMount() {
		this.props.MainStore.opsselectOpen(this.props.location.pathname);
		let local_socket = this.props.PlannerStore.plannerSocket;
		this.props.PlannerStore.refreshPlannerDataOnly();
		await this.props.PlannerStore.addAWBToBeActioned(local_socket);
		await this.props.PlannerStore.removeAWBToBeActioned(local_socket);
		await this.props.PlannerStore.addAWBToBePlanned(local_socket);
		await this.props.PlannerStore.removeAWBToBePlanned(local_socket);
		await this.props.PlannerStore.onHandforToBePlanned(local_socket);
		await this.props.PlannerStore.changeInBooklist(local_socket);
		await this.props.PlannerStore.addAwbToBooklistRecord(local_socket);
		await this.props.PlannerStore.discardBooklistAwbLeg(local_socket);
	}

	async componentWillUnmount() {
		await this.props.PlannerStore.clearPlannerStore();
	}


	openAddNewAWBModal = () =>{
		this.setState ({
			isAddNewAWBModalShow: true,
		});
	}

	closeAddNewAWBModal = () =>{
		this.setState ({
			isAddNewAWBModalShow: false
		});
	}

	openRCSPendingModal = (awbInfoRecord) =>{
		this.setState ({
			isRCSPendingModalShow: true,
			currentAwbInfoRecord: awbInfoRecord
		});
	}

	closeRCSPendingModal = () =>{
		this.setState ({
			isRCSPendingModalShow: false
		});
	}

	openTobePlannedModal = (awbLegRecord) =>{
		this.setState ({
			isTobePlannedModalShow: true,
			currentAwbLegRecord: awbLegRecord
		});
	}

	closeTobePlannedModal = () =>{
		this.setState ({
			isTobePlannedModalShow: false
		});
	}

	openBooklistRecordDiscardModal = (booklistRecord) =>{
		this.setState ({
			isBooklistRecordDiscardModalShow: true,
			currentBooklistRecord: booklistRecord
		});
	}

	closeBooklistRecordDiscardModal = () =>{
		this.setState ({
			isBooklistRecordDiscardModalShow: false
		});
	}

	openBooklistVsEgmModal = (uploadedEGMFile, egmFileRecords, booklistFileRecords) =>{
		this.state.isMauallyDepart = false;
		if(booklistFileRecords.length === 0) {
			window.swal_error('There are no AWB in this Booklist');
			return;
		}

		if(egmFileRecords.length === 0) {
			window.swal_error('There are no AWB in the uploaded EGM');
			return;
		}

		this.setState ({
			readOnly: false,
			preview_strip:false,
			isBooklistVsEgmModalShow: true,
			booklistFileRecords: booklistFileRecords,
			egmFileRecords: egmFileRecords,
			uploadedEGMFile: uploadedEGMFile,
		});
	}
	openBooklistVsInputEgmModal=(booklistFileRecords,isMauallyDepart, readOnly = false) => {

		this.state.isMauallyDepart = isMauallyDepart;
		
		if(booklistFileRecords.length === 0) {
			window.swal_error('There are no AWB in this Booklist');
			return;
		}
		// let x;
		// if (booklistFileRecords.length>0) {
			
		// 	booklistFileRecords.forEach((booklistFileRecord,index)=>{
		// 		let breakCondition = false;
		// 		if(booklistFileRecord.awb_info.fdc === false &&!breakCondition)
		// 		{
		// 				console.log(JSON.stringify(this.state.preview_strip))
						
		// 				breakCondition  = true
		// 				this.setState({preview_strip:breakCondition});
		// 		}
		// 	})
		// }


		let newEgm = [];
		if (booklistFileRecords.length>0) {
			booklistFileRecords.forEach((booklistTableRecords, index) => {
				let temp = {};
				let breakCondition = false;
				temp.awb_no = booklistTableRecords.awb_no.substr(0, 11);
				temp.pieces = 0;
				temp.weight = 0;
				temp.class = booklistTableRecords.class
				newEgm.push(temp)
				if(booklistTableRecords.awb_info.fdc === false &&!breakCondition)
				{
						console.log(JSON.stringify(this.state.preview_strip))
						
						breakCondition  = true
						this.setState({preview_strip:breakCondition});
				}
			});
		}
		
		this.setState ({
			readOnly: readOnly,
			isBooklistVsEgmModalShow: true,
			booklistFileRecords: booklistFileRecords,
			egmFileRecords: newEgm,
			// newEgmData:newEgm,
			uploadedEGMFile:'',
		});
	}

	closeBooklistVsEgmModal = () =>{
		this.setState ({
			isBooklistVsEgmModalShow: false
		});
	}

	 selectFlight = async(flightData) =>{
		console.log('===========flightData==========='+ JSON.stringify(flightData));
		this.setState ({
			flightSelectorDetails: flightData
		});
		await this.props.PlannerStore.existingBooklistRecords(flightData);
	}

	render() {
		return(
			<Observer>{()=>
			<div className = "page-wrapper">	
				<div className = "container-fluid row">
					<div className="col-md-4">
						<button className="btn alert-danger border border-danger col-md-12 mb-2" id="addNewAwbBtn" onClick={this.openAddNewAWBModal}>Create New AWB Manually</button>
						<Modal show={this.state.isAddNewAWBModalShow} onHide={this.closeAddNewAWBModal}>
							<AddNewAWBModal MainStore={this.props.MainStore} closeAddNewAWBModal={this.closeAddNewAWBModal} operatingStation={this.props.MainStore.operatingStation} planner_socket={this.props.PlannerStore.plannerSocket}/>
						</Modal>
						<div className="row">
							<div className="col-6">
								<div className="text-center bg-dark p-1">
									<label className="my-auto text-white">On-Hand (RCS)</label>
								</div>
								<div className="scrollable">
									<RCSPendingAWB awbInfoRecords={this.props.PlannerStore.awbInfoRecords} openRCSPendingModal={this.openRCSPendingModal}/>
								</div>
								<Modal show={this.state.isRCSPendingModalShow} onHide={this.closeRCSPendingModal}>
									<RCSPendingModal closeRCSPendingModal={this.closeRCSPendingModal} awbInfoRecord= {this.state.currentAwbInfoRecord} operatingStation={this.props.MainStore.operatingStation} planner_socket={this.props.PlannerStore.plannerSocket} MainStore={this.props.MainStore}/>
								</Modal>
							</div>
							<div className="col-6">
								<div className="text-center bg-dark p-1">
									<label className="my-auto text-white">To Be Planned</label>
								</div>
								<div className="scrollable">
									<TobePlannedAWB awbLegRecords={this.props.PlannerStore.awbLegRecords} openTobePlannedModal={this.openTobePlannedModal}/>
								</div>
								<Modal show={this.state.isTobePlannedModalShow} onHide={this.closeTobePlannedModal}>
									<TobePlannedModal closeTobePlannedModal={this.closeTobePlannedModal}  awbLegRecord= {this.state.currentAwbLegRecord} operatingStation={this.props.MainStore.operatingStation} flightSelectorDetails = {this.state.flightSelectorDetails}
									planner_socket={this.props.PlannerStore.plannerSocket} MainStore={this.props.MainStore}/>
								</Modal>
							</div>
						</div>
					</div>
					<div className="col-md-8 alert-light border border-warning">
						<FlightSelector station={this.props.MainStore.operatingStation} selectFlight= {this.selectFlight}  planner_socket={this.props.PlannerStore.plannerSocket}/>
						<FileUpload flightSelectorDetails = {this.state.flightSelectorDetails} openBooklistVsEgmModal={this.openBooklistVsEgmModal} planner_socket={this.props.PlannerStore.plannerSocket} openBooklistVsInputEgmModal={this.openBooklistVsInputEgmModal}/>
						<Booklist openBooklistRecordDiscardModal={this.openBooklistRecordDiscardModal} booklistRecords={this.props.PlannerStore.booklistRecords}/>
						<Modal show={this.state.isBooklistRecordDiscardModalShow} onHide={this.closeBooklistRecordDiscardModal}>
							<BooklistRecordDiscardModal closeBooklistRecordDiscardModal={this.closeBooklistRecordDiscardModal}  booklistRecord= {this.state.currentBooklistRecord}
							 planner_socket={this.props.PlannerStore.plannerSocket}/>
						</Modal>
					</div>
					<Modal size="lg" aria-labelledby="booklistVsEgmModalEditTitle" show={this.state.isBooklistVsEgmModalShow} onHide={this.closeBooklistVsEgmModal} backdrop={"static"} keyboard={false}>
							<BooklistVsEgmModal readOnly = {this.state.readOnly} isManuallyDepart = {this.state.isMauallyDepart} closeBooklistVsEgmModal={this.closeBooklistVsEgmModal} booklistFileRecords={this.state.booklistFileRecords} egmFileRecords={this.state.egmFileRecords} uploadedEGMFile={this.state.uploadedEGMFile} selectedFlightDetails={this.state.flightSelectorDetails} planner_socket={this.props.PlannerStore.plannerSocket} preview_strip={this.state.preview_strip}/>
					</Modal>
				</div>
			</div>
			}</Observer>
						
		);
	}
}

export default withRouter(Planner);