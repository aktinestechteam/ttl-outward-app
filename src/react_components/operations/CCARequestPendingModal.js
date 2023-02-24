import React, { Component } from "react";
import custom from '../../config/custom.js';
import Table from 'react-bootstrap/Table'
import { Observer } from "mobx-react"
import NavigationButton from "../shared/NavigationButton";
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import APIService from "../APIService.js";
import DatePicker from "react-datepicker";

// import { thisExpression } from "@babel/types";


class CCARequestPendingModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			date: undefined,
			destination: props.legop_record.awb_info.dest,
			legop_record: props.legop_record,
			cca_request_record_table: [],
			cca_request_table_selected: [],
			flightRecords: [],
			dateofIssue: window.moment(Date.now()).format("DD/MM/YYYY"),
			placeofIssue: props.legop_record.awb_info.station,
			number: '',
			ccaref: '',

			c_name_address: '',//props.legop_record.awb_info.issuer_name
			c_address: '',
			notify: '',

			acc_dep_issue_carrier: props.legop_record.awb_info.station,
			cargo_dep_issue_carrier: "",//custom.custom.ccaFormFixedData.carrier_issue_cca_name,
			cargo_dep_issue_carrier_email: "",//custom.custom.ccaFormFixedData.carrier_issue_cca_email,
			cass_settlement_office: "",//custom.custom.ccaFormFixedData.cass_settlement_office,

			to: custom.custom.ccaFormFixedData.to,
			at: props.legop_record.awb_info.station,
			ref_awb_no: props.legop_record.awb_no,
			ref_cca_no: props.legop_record.cca_no,

			revised_prep_wc_carrier: 0,
			revised_prep_wc_agent: 0,
			rcwc_carrier: 0,
			rcwc_agent: 0,
			opwc_carrier: 0,
			opwc_agent: 0,
			ocwc_carrier: 0,
			ocwc_agent: 0,

			rpvc_carrier: 0,
			rpvc_agent: 0,
			rcvc_carrier: 0,
			rcvc_agent: 0,
			opvc_carrier: 0,
			opvc_agent: 0,
			ocvc_carrier: 0,
			ocvc_agent: 0,

			rptax_carrier: 0,
			rptax_agent: 0,
			rctax_carrier: 0,
			rctax_gent: 0,
			optax_carrier: 0,
			optax_agent: 0,
			octax_carrier: 0,
			octax_agent: 0,

			rp_clear_hand_carrier: 0,
			rp_clear_hand_agent: 0,
			rc_clear_hand_carrier: 0,
			rc_clear_hand_agent: 0,
			op_clear_hand_carrier: 0,
			op_clear_hand_agent: 0,
			oc_clear_hand_carrier: 0,
			oc_clear_hand_agent: 0,

			rp_disbursement_carrier: 0,
			rp_disbursement_agent: 0,
			rc_disbursement_carrier: 0,
			rc_disbursement_agent: 0,
			op_disbursement_carrier: 0,
			op_disbursement_agent: 0,
			oc_disbursement_carrier: 0,
			oc_disbursement_agent: 0,

			rp_disbursement_fee_carrier: 0,
			rp_disbursement_fee_agent: 0,
			rc_disbursement_fee_carrier: 0,
			rc_disbursement_fee_agent: 0,
			op_disbursement_fee_carrier: 0,
			op_disbursement_fee_agent: 0,
			oc_disbursement_fee_carrier: 0,
			oc_disbursement_fee_agent: 0,

			rp_ocharge_carrier: 0,
			rp_ocharge_agent: 0,
			rc_ocharge_carrier: 0,
			rc_ocharge_agent: 0,
			op_ocharge_carrier: 0,
			op_ocharge_agent: 0,
			oc_ocharge_carrier: 0,
			oc_ocharge_agent: 0,

			rp_amendment_fee_carrier: 0,
			rp_amendment_fee_agent: 0,
			rc_amendment_fee_carrier: 0,
			rc_amendment_fee_agent: 0,
			op_amendment_fee_carrier: 0,
			op_amendment_fee_agent: 0,
			oc_amendment_fee_carrier: 0,
			oc_amendment_fee_agent: 0,

			remarks: '',

			total: 0,
			rpvc_agent_total: 0,
			rcwe_total: 0,
			rcwc_agent_total: 0,
			opwc_carrier_total: 0,
			opwc_agent_total: 0,
			ocwc_carrier_total: 0,
			ocwc_agent_total: 100,
			discardReason: '',
		}

		this.handleChange = this.handleChange.bind(this);
		this.ccaRequestPendingAction = this.ccaRequestPendingAction.bind(this);
	}
	handleClick = () => {
		if (this.state.rp_amendment_fee_carrier === 0) {
			this.setState({ rp_amendment_fee_carrier: 1500 })
		} else {
			this.setState({ rp_amendment_fee_carrier: 0 })
		}
	}
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value })
		console.log({ [event.target.name]: event.target.value });
	}

	flightInputChange = (event) => {
		// this.setState(prevState => ({
		// 	flightRecords: prevState.flightRecords.map(data => 
		// 		{
		// 			for (const [key, value] of Object.entries(data)) {
		// 			if(`${key}` === event.target.name){
		// 				data[`${key}`] = event.target.value
		// 			}
		// 		  }
		// 		})
		// }));
		// this.setState(prevState => ({
		// 	flightRecords: prevState.flightRecords.map(
		// 	obj => (obj.to0 === event.target.name ? Object.assign(obj) : obj)
		//   )
		// }));
		this.state.flightRecords.forEach((data, index) => {
			for (const [key, value] of Object.entries(data)) {
				if (`${key}` === event.target.name) {
					data[`${key}`] = event.target.value
				}
			}
		});
		this.setState({ flightRecords: this.state.flightRecords })
	}

	componentDidMount() {
		console.log("CCA FORM DATA", JSON.stringify(this.state.legop_record));
		this.ccaRequestModalExistingCCARequest(this.state.legop_record.awb_no, this.state.legop_record.awb_leg.id);
	}

	ccaRequestModalExistingCCARequest(awbNo, awbLeg) {
		let awbNumber = awbNo;
		let awbLegId = awbLeg;
		let queryParams = { awbNo: awbNumber, awb_leg_id: awbLegId };
		APIService.get('/getExistingCCARequest', queryParams, function (results, status) {
			if (results) {
				console.log(JSON.stringify(results))
				let flightData = [];
				let reasonRecord = [];
				reasonRecord.push(...results, {}, {}, {});
				if (reasonRecord.length > 0) {
					for (let index = 0; index < reasonRecord.length; index++) {
						let data = {}
						let singleResult = reasonRecord[index];
						if (singleResult.awb_leg_details) {
							data["to" + index] = singleResult.awb_leg_details.to;
							data["flightNo" + index] = singleResult.awb_leg_details.flight_no;
							data["date" + index] = singleResult.awb_leg_details.planned_departure;
						} else {
							data["to" + index] = '';
							data["flightNo" + index] = '';
							data["date" + index] = '';
						}
						flightData.push(data)
					}
				}
				this.setState({ cca_request_record_table: results, flightRecords: flightData });
				console.log('record found. ' + JSON.stringify(flightData));
			}
		}.bind(this));
	}

	ccaRequestPendingAction = (event) => {
		if(this.state.cca_request_table_selected.length == 0) {
			window.swal_error("Please include the CCA reasons before sending for approval !!!")
		} else if(!this.state.date){
			window.swal_error("Please enter a valid Date for the CCA !!!")
		} else if(!this.state.c_name_address || this.state.c_name_address.length == 0) {
			window.swal_error("Please enter a valid consignor's name and address !!!")
		} else if(!this.state.c_address || this.state.c_address.length == 0) {
			window.swal_error("Please enter a valid consignee address: !!!")
		} else if(!this.state.notify || this.state.notify.length == 0) {
			window.swal_error("Please fill NOTIFY field !!!")
		} else if(!this.state.cargo_dep_issue_carrier_email || this.state.cargo_dep_issue_carrier_email.length == 0) {
			window.swal_error("Please enter a valid Email !!!")
		} else if(!this.state.cass_settlement_office || this.state.cass_settlement_office.length == 0) {
			window.swal_error("Please enter a valid Designation !!!")
		} else {
			let ccaFormData = {
				legops_record: {
					awb_no: this.state.legop_record.awb_leg.awb_no,
					from: this.state.legop_record.awb_leg.from,
					to: this.state.destination,
					date: this.state.date.getTime()
				},
				dateofIssue: this.state.dateofIssue,
				placeofIssue: this.state.placeofIssue,
				number: this.state.number,
				ccaref: this.state.ccaref,
				flightRecord: this.state.flightRecords,
				revised_prepaid_wc_carrier: this.state.revised_prep_wc_carrier,
				revised_prepaid_wc_agent: this.state.revised_prep_wc_agent,
				revised_collect_wc_carrier: this.state.rcwc_carrier,
				revised_collect_wc_agent: this.state.rcwc_agent,
				original_prepaid_wc_carrier: this.state.opwc_carrier,
				original_prepaid_wc_agent: this.state.opwc_agent,
				original_collect_wc_carrier: this.state.ocwc_carrier,
				original_collect_wc_agent: this.state.ocwc_agent,

				revised_prepaid_vc_carrier: this.state.rpvc_carrier,
				revised_prepaid_vc_agent: this.state.rpvc_agent,
				revised_collect_vc_carrier: this.state.rcvc_carrier,
				revised_collect_vc_agent: this.state.rcvc_agent,
				original_prepaid_vc_carrier: this.state.opvc_carrier,
				original_prepaid_vc_agent: this.state.opvc_agent,
				original_collect_vc_carrier: this.state.ocvc_carrier,
				original_collect_vc_agent: this.state.ocvc_agent,

				revised_prepaid_Tax_carrier: this.state.rptax_carrier,
				revised_prepaid_Tax_Agent: this.state.rptax_agent,
				revised_collect_Tax_carrier: this.state.rctax_carrier,
				revised_collect_Tax_Agent: this.state.rctax_gent,
				original_prepaid_Tax_carrier: this.state.optax_carrier,
				original_prepaid_Tax_agent: this.state.optax_agent,
				original_collect_Tax_carrier: this.state.octax_carrier,
				original_collect_Tax_agent: this.state.octax_agent,

				c_name_address: this.state.c_name_address,
				c_address: this.state.c_address,
				notify: this.state.notify,

				revised_prepaid_Clearance_And_Handl_carrier: this.state.rp_clear_hand_carrier,
				revised_prepaid_Clearance_And_Handl_Agent: this.state.rp_clear_hand_agent,
				revised_collect_Clearance_And_Handl_carrier: this.state.rc_clear_hand_carrier,
				revised_collect_Clearance_And_Handl_Agent: this.state.rc_clear_hand_agent,
				original_prepaid_Clearance_And_Handl_carrier: this.state.op_clear_hand_carrier,
				original_prepaid_Clearance_And_Handl_agent: this.state.op_clear_hand_agent,
				original_collect_Clearance_And_Handl_carrier: this.state.oc_clear_hand_carrier,
				original_collect_Clearance_And_Handl_agent: this.state.oc_clear_hand_agent,

				revised_prepaid_Disbursements_carrier: this.state.rp_disbursement_carrier,
				revised_prepaid_Disbursements_Agent: this.state.rp_disbursement_agent,
				revised_collect_Disbursements_carrier: this.state.rc_disbursement_carrier,
				revised_collect_Disbursements_Agent: this.state.rc_disbursement_agent,
				original_prepaid_Disbursements_carrier: this.state.op_disbursement_carrier,
				original_prepaid_Disbursements_agent: this.state.op_disbursement_agent,
				original_collect_Disbursements_carrier: this.state.oc_disbursement_carrier,
				original_collect_Disbursements_agent: this.state.oc_disbursement_agent,

				revised_prepaid_Disbursement_Fee_carrier: this.state.rp_disbursement_fee_carrier,
				revised_prepaid_Disbursement_Fee_Agent: this.state.rp_disbursement_fee_agent,
				revised_collect_Disbursement_Fee_carrier: this.state.rc_disbursement_fee_carrier,
				revised_collect_Disbursement_Fee_Agent: this.state.rc_disbursement_fee_agent,
				original_prepaid_Disbursement_Fee_carrier: this.state.op_disbursement_fee_carrier,
				original_prepaid_Disbursement_Fee_agent: this.state.op_disbursement_fee_agent,
				original_collect_Disbursement_Fee_carrier: this.state.oc_disbursement_fee_carrier,
				original_collect_Disbursement_Fee_agent: this.state.oc_disbursement_fee_agent,

				revised_prepaid_Other_Charge_carrier: this.state.rp_ocharge_carrier,
				revised_prepaid_Other_Charge_Agent: this.state.rp_ocharge_agent,
				revised_collect_Other_Charge_carrier: this.state.rc_ocharge_carrier,
				revised_collect_Other_Charge_Agent: this.state.rc_ocharge_agent,
				original_prepaid_Other_Charge_carrier: this.state.op_ocharge_carrier,
				original_prepaidOther_Charge_agent: this.state.op_ocharge_agent,
				original_collect_Other_Charge_carrier: this.state.oc_ocharge_carrier,
				original_collect_Other_Charge_agent: this.state.oc_ocharge_agent,

				revised_prepaid_Amendment_fee_carrier: this.state.rp_amendment_fee_carrier,
				revised_prepaid_Amendment_fee_Agent: this.state.rp_amendment_fee_agent,
				revised_collect_Amendment_fee_carrier: this.state.rc_amendment_fee_carrier,
				revised_collect_Amendment_fee_Agent: this.state.rc_amendment_fee_agent,
				original_prepaid_Amendment_fee_carrier: this.state.op_amendment_fee_carrier,
				original_prepaidAmendment_fee_agent: this.state.op_amendment_fee_agent,
				original_collect_Amendment_fee_carrier: this.state.oc_amendment_fee_carrier,
				original_collect_Amendment_fee_agent: this.state.oc_amendment_fee_agent,

				revised_Prepaid_carrier_total: Number(this.state.revised_prep_wc_carrier) + Number(this.state.rpvc_carrier) + Number(this.state.rptax_carrier) + Number(this.state.rp_clear_hand_carrier) + Number(this.state.rp_disbursement_carrier) + Number(this.state.rp_disbursement_fee_carrier) + Number(this.state.rp_ocharge_carrier) + Number(this.state.rp_amendment_fee_carrier),
				revised_Prepaid_Agent_total: Number(this.state.revised_prep_wc_agent) + Number(this.state.rpvc_agent) + Number(this.state.rptax_agent) + Number(this.state.rp_clear_hand_agent) + Number(this.state.rp_disbursement_agent) + Number(this.state.rp_disbursement_fee_agent) + Number(this.state.rp_ocharge_agent) + Number(this.state.rp_amendment_fee_agent),
				revised_collect_carrier_total: Number(this.state.rcwc_carrier) + Number(this.state.rcvc_carrier) + Number(this.state.rctax_carrier) + Number(this.state.rc_clear_hand_carrier) + Number(this.state.rc_disbursement_carrier) + Number(this.state.rc_disbursement_fee_carrier) + Number(this.state.rc_ocharge_carrier) + Number(this.state.rc_amendment_fee_carrier),
				revised_collect_Agent_total: Number(this.state.rcwc_agent) + Number(this.state.rcvc_agent) + Number(this.state.rctax_gent) + Number(this.state.rc_clear_hand_agent) + Number(this.state.rc_disbursement_agent) + Number(this.state.rc_disbursement_fee_agent) + Number(this.state.rc_ocharge_agent) + Number(this.state.rc_amendment_fee_agent),
				original_prepaid_carrier_total: Number(this.state.opwc_carrier) + Number(this.state.opvc_carrier) + Number(this.state.optax_carrier) + Number(this.state.op_clear_hand_carrier) + Number(this.state.op_disbursement_carrier) + Number(this.state.op_disbursement_fee_carrier) + Number(this.state.op_ocharge_carrier) + Number(this.state.op_amendment_fee_carrier),
				original_prepaid_Agent_total: Number(this.state.opwc_agent) + Number(this.state.opvc_agent) + Number(this.state.optax_agent) + Number(this.state.op_clear_hand_agent) + Number(this.state.op_disbursement_agent) + Number(this.state.op_disbursement_fee_agent) + Number(this.state.op_ocharge_agent) + Number(this.state.op_amendment_fee_agent),
				original_collect_carrier_total: Number(this.state.ocwc_carrier) + Number(this.state.ocvc_carrier) + Number(this.state.octax_carrier) + Number(this.state.oc_clear_hand_carrier) + Number(this.state.oc_disbursement_carrier) + Number(this.state.oc_disbursement_fee_carrier) + Number(this.state.oc_amendment_fee_carrier) + Number(this.state.oc_ocharge_carrier),
				original_collect_agent_total: Number(this.state.ocwc_agent) + Number(this.state.ocvc_agent) + Number(this.state.octax_agent) + Number(this.state.oc_clear_hand_agent) + Number(this.state.oc_disbursement_agent) + Number(this.state.oc_disbursement_fee_agent) + Number(this.state.oc_ocharge_agent) + Number(this.state.oc_amendment_fee_agent),
				Remarks: this.state.remarks,

				account_Dep_of_Issuing_carrier: this.state.acc_dep_issue_carrier,
				cargo_Dep_of_Issuing_carrier: this.state.cargo_dep_issue_carrier,
				cargo_Dep_of_Issuing_carrier_email: this.state.cargo_dep_issue_carrier_email,
				cass_settlement_office: this.state.cass_settlement_office,

				to: this.state.to,
				at: this.state.at,
				ref_awb_no: this.state.ref_awb_no,
				ref_cca_no: this.state.ref_cca_no,
			}
			// let mySocket = io.sails.connect('http://localhost:1337');
			if (true) {
				APIService.post('/ccaRequest', {
					awb_legop_id: this.state.legop_record.id,
					awb_leg_id: this.state.legop_record.awb_leg.id,
					awb_no: this.state.legop_record.awb_no,
					cca_request_table: this.state.cca_request_table_selected,
					created_by: this.state.legop_record.awb_leg.created_by,
					station: this.state.legop_record.awb_leg.station,
					from: this.state.legop_record.awb_leg.from,
					ccaFormData: ccaFormData,
					email: this.state.cargo_dep_issue_carrier_email,
				}, function (data, status) {
					if (data) {
						// console.log(data);
					}
					else {
						// console.log(status);
					}
				});
				this.onCloseModal();
			}
		}
	}

	onCloseModal = (event) => {
		this.props.closeModal();
	}

	ccaRejectRequestAction= (event) => {
		if(this.state.discardReason.length == 0){
			window.swal_error("Please enter a reason for discard");
		}
		else {

			let index=-1;
			let ccaDiscardId;
			for(let i=0;i<this.state.cca_request_record_table.length;i++){
				if(this.state.cca_request_record_table[i].id == event.target.value){
					index=i;
					break;
				}
			}
			let ccaDiscardedlegOpId = this.state.cca_request_record_table[index].cca_leg_op.id;
			if(index!=-1){
				ccaDiscardId=this.state.cca_request_record_table[index].id;
				this.state.cca_request_record_table.splice(index,1);
				this.setState({cca_request_record_table: this.state.cca_request_record_table});
			}
			index = this.state.cca_request_table_selected.indexOf(event.target.value);
			if(index>=0){
				this.state.cca_request_table_selected.splice(index,1);
				this.setState({cca_request_table_selected: this.state.cca_request_table_selected});
			}

			APIService.post('/discardCCA', {
				awb_legop_id: ccaDiscardedlegOpId,
				awb_leg_id: this.state.legop_record.awb_leg.id,
				awb_no: this.state.legop_record.awb_no,
				cca_request_id: ccaDiscardId,
				created_by: this.state.legop_record.awb_leg.created_by,
				station: this.state.legop_record.awb_leg.station,
				from: this.state.legop_record.awb_leg.from,
				discardReason: this.state.discardReason
			}, function (data, status) {
				if (data) {
					// console.log(data);
				}
				else {
					// console.log(status);
				}
			});
		}
	}

	handleCheckClick = (event) => {
		// console.log('selected item = ' + JSON.stringify(event.target.value));
		let fresh_cca_to_add = this.state.cca_request_table_selected.map(x => x);
		let index = fresh_cca_to_add.indexOf(event.target.value);
		if (index >= 0) {
			fresh_cca_to_add = fresh_cca_to_add.filter(item => item !== event.target.value);
		}
		else {
			fresh_cca_to_add.push(event.target.value)
		}

		this.setState({ cca_request_table_selected: fresh_cca_to_add });
	}

	handleDiscardReasonChange = (event) => {
		this.setState({discardReason: event.target.value})
	}

	onDateChange = (date) => {
		if(date){
			console.log(date)
			this.setState({date: date});
		}
	}

	renderCCARequestTableRecords = (ccaRequestTableRecord, index) => {
		// console.log('ccaRequestTableRecord======== ' + JSON.stringify(ccaRequestTableRecord));

		let cca_reasons = window.ccareasons;
		if (ccaRequestTableRecord.cca_approval) {
			return (
				<tr key={index}>
					<td><input name="requestChecked[]" type="checkbox" checked disabled data-toggle="toggle" value={ccaRequestTableRecord.id} onChange={()=>{}}/></td>
					<td>{ccaRequestTableRecord.raised_by}</td>
					<td>{ccaRequestTableRecord.raised_by_dept}</td>
					<td>
						{
							ccaRequestTableRecord.reason.map(function(cca) {
								for(let i = 0; i < cca_reasons.length; i++) {
									if(cca_reasons[i].main_reason === cca.main_reason) {
										return (
											<div>
												{"["+cca.main_reason + (cca.sub_reason1? " - " + cca.sub_reason1:"") + (cca.sub_reason2?" - " + cca.sub_reason2:"") + (cca.sub_reason3.length>0?" - " + cca.sub_reason3:"")+"]"}
											</div>
										)
										break;
									}
								}
								return (
									<div>

									</div>
								)
							}
							)
						}
					</td>
				</tr>
			)
		}
		else {
			return (
				<tr key={index}>
					<td><input name="requestChecked[]" type="checkbox" data-toggle="toggle" value={ccaRequestTableRecord.id} onChange={this.handleCheckClick} /></td>
					<td>{ccaRequestTableRecord.raised_by}</td>
					<td>{ccaRequestTableRecord.raised_by_dept}</td>
					<td>
						{
							ccaRequestTableRecord.reason.map(function(cca) {
								for(let i = 0; i < cca_reasons.length; i++) {
									if(cca_reasons[i].main_reason === cca.main_reason) {
										return (
											<div>
												{"["+cca.main_reason + (cca.sub_reason1? " - " + cca.sub_reason1:"") + (cca.sub_reason2?" - " + cca.sub_reason2:"") + (cca.sub_reason3.length>0?" - " + cca.sub_reason3:"")+"]"}
											</div>
										)
										break;
									}
								}
								return (
									<div>

									</div>
								)
							}
							)
						}
					</td>
					<td>
						<div className="row">
							<input id="discardReason" placeholder="Discard reason" name="discardReason" onChange={this.handleDiscardReasonChange} />
							<button className="btn btn-danger waves-effect waves-light save-category" id="ccaRejectRequestAction" type="button" name="ccaRejectRequestAction" value={ccaRequestTableRecord.id} onClick={this.ccaRejectRequestAction}>
								<i className="fas fa-bin" aria-hidden="true"></i>&nbsp;&nbsp;Discard Request
							</button>
						</div>
					</td>
				</tr>
			)
		}
	}

	render() {
		let ccaRequestTableRecords = this.state.cca_request_record_table;
		let ccaFlightDetailShown = [];
		ccaFlightDetailShown.push(...this.state.cca_request_record_table, {}, {}, {})
		let flightDetail = [];
		let awbDetails = "";
		let reasonsList = [];
		let receivedFrom = [];

		if (this.state.flightRecords.length > 0) {
			this.state.flightRecords.forEach((existing_cca_request, index) => {
				flightDetail.push(<tr style={{ "fontSize": "10px", height: "10px" }}>
					<td colSpan="2">To {index + 1}</td>
					<td colSpan="3">
						<input id="ccaRequestModalToInput" name={`to${index}`} disabled="" placeholder="" onChange={this.flightInputChange} value={existing_cca_request["to" + index]} />
					</td>
					<td colSpan="2">Flight No</td>
					<td colSpan="3">
						<input id="ccaRequestModalToFlightNoInput" name={`flightNo${index}`} disabled="" placeholder="" onChange={this.flightInputChange} value={existing_cca_request["flightNo" + index]} />
					</td>
					<td>Date</td>
					<td>
					<input type="date" data-date="" data-date-format="DD MMMM YYYY" id="ccaRequestModalToDateInput" name={`date${index}`} value={window.moment(existing_cca_request["date" + index]).format("YYYY-MM-DD")} disabled="" placeholder="NoEdit" onChange={this.flightInputChange}/>
					</td>
				</tr>);

				awbDetails = (<tr style={{ "fontSize": "10px", height: "10px" }}>
					<td colSpan="4">
						<input id="ccaRequestModalAwbNoInput" disabled={true} placeholder="NoEdit" value={this.state.legop_record.awb_leg.awb_no} />
					</td>
					<td>
						<input id="ccaRequestModalAwbNoFromInput" disabled={true} placeholder="Editable" style={{ width: "100%" }} value={this.state.legop_record.awb_leg.from} />
					</td>
					<td>
						<input id="ccaRequestModalAwbNoToInput" disabled={false} placeholder="Editable" style={{ width: "100%" }} value={this.state.destination} name="destination" onChange={this.handleChange}/>
					</td>
					<td>
						{/* <input id="ccaRequestModalAwbNoDateInput" value={window.moment(this.state.legop_record.awb_leg.planned_departure).format("DD/MM/YYYY")} /> */}
						<DatePicker className="" minDate={new Date(new Date().setDate(new Date().getDate() - 30))} maxDate={new Date(new Date().setDate(new Date().getDate() + 5))} selected={this.state.date} onChange={this.onDateChange} />
					</td>
					<td colSpan="5">
						<input id="ccaRequestModalAwbNoReceivedFromInput" disabled={true} placeholder="Editable" style={{ width: "100%" }} value={receivedFrom} />
					</td>
				</tr>);
				reasonsList.push(existing_cca_request.reason + ' [ ' + existing_cca_request.reason_text + ']');
				receivedFrom.push(existing_cca_request.raised_by_dept);
			});
		}

		return (

			<Observer>
				{() =>
					<div>
						<ModalHeader>  
							<h4 className="modal-title">
								<span>
									<i className="fa fa-delete"></i>
								</span>
								<label className="ml-2" id="ccaRequestPendingModalEditTitle">CCA Request Pending
									<NavigationButton awb_no={this.state.legop_record.awb_no} tabNumber={this.state.tabNumber} MainStore={this.props.MainStore} onCloseModal={this.onCloseModal}/>
								</label>
							</h4>
							<button className="close" type="button" onClick={this.onCloseModal}>×</button>
						</ModalHeader>  
						<ModalBody>  
							<div className="col-12">
								<label className="control-label">Existing CCA Records</label>
								<Table bordered size="sm">
									<thead>
										<tr>
											<th>Included</th>
											<th>Raised By</th>
											<th>Department</th>
											<th>CCA</th>
										</tr>
									</thead>
									<tbody>
										{ccaRequestTableRecords.map(this.renderCCARequestTableRecords)}
									</tbody>
								</Table>
								<table border="1" bordercolor="#e5e5e5">

									<tbody>
										<tr>
											<td colSpan="10" rowSpan="5" valign="top" align="left">
												<span style={{ "msoIgnore": "vglayout", "position": "absolute", "zIndex": "1", "marginLeft": "17px", "marginTop": "2px", "width": "127px", "height": "49px" }}>
													<img src="assets/images/cca_ba_logo.png" width="127" height="49" alt="" />
												</span>
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td>Date of Issue</td>
											<td>
												<input id="ccaRequestModalDateOfIssueInput" disabled={true} placeholder="NoEdit" value={this.state.dateofIssue} onChange={this.handleChange} name="dateofIssue" />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td>Place of Issue</td>
											<td>
												<input id="ccaRequestModalPlaceOfIssueInput" disabled={true} placeholder="NoEdit" name="placeofIssue" value={this.state.placeofIssue} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td>Number</td>
											<td>
												<input id="ccaRequestModalNumberInput" disabled={true} placeholder="It will show after saving" name="number" value={this.state.number} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td>CCA Ref</td>
											<td>
												<input id="ccaRequestModalCCARefInput" disabled={true} placeholder="It will show after saving" name="caaRef" value={this.state.caaRef} onChange={this.handleChange} />
											</td>
										</tr>

										{flightDetail}
										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="12">Will transfer stations please fill in lines 2 or 3 as appropriate and re-forward this form immediately to next carrier.</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="12">The slip below must only be filled in and returned to issuing carri</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="5">Consignor's name and address:</td>
											<td colSpan="4">Consignee address:</td>
											<td colSpan="4">NOTIFY:</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="5">
												<textarea id="ccaRequestModalConsignorAddressTextarea" placeholder="Consignor's name and address"  style={{ width: "100%", height: "100px" }} required="" row="5" name="c_name_address" value={this.state.c_name_address} onChange={this.handleChange} ></textarea>
											</td>
											<td colSpan="4">
												<textarea id="ccaRequestModalConsigneeAddressTextarea" placeholder="Consignee address"  style={{ width: "100%", height: "100px" }} required="" row="5" name="c_address" value={this.state.c_address} onChange={this.handleChange} ></textarea>
											</td>
											<td colSpan="4">
												<textarea id="ccaRequestModalNotifyTextarea" placeholder="NOTIFY Text"  style={{ width: "100%", height: "100px" }} row="5" name="notify" value={this.state.notify} onChange={this.handleChange}></textarea>
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="4">AWB No.</td>
											<td>From</td>
											<td>To</td>
											<td>Date</td>
											<td colSpan="5">Received From:</td>
										</tr>

										{awbDetails}

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="12"></td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td rowSpan="2" colSpan="4">Currency		INR</td>
											<td className="text-center" colSpan="4">Revised/Corrected Charges</td>
											<td className="text-center" colSpan="4">Original/Incorrect Charges</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td className="text-center" colSpan="2"> Prepaid</td>
											<td className="text-center" colSpan="2"> Collect</td>
											<td className="text-center" colSpan="2"> Prepaid</td>
											<td className="text-center" colSpan="2"> Collect</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="4">Charges Due</td>
											<td className="text-center">Carrier</td>
											<td className="text-center">Agent</td>
											<td className="text-center">Carrier</td>
											<td className="text-center">Agent</td>
											<td className="text-center">Carrier</td>
											<td className="text-center">Agent</td>
											<td className="text-center">Carrier</td>
											<td className="text-center">Agent</td>
										</tr>
										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="4">Weight Charge</td>
											<td>
												<input type="number" id="ccaRequestModalWeightRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="revised_prep_wc_carrier" value={this.state.revised_prep_wc_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalWeightRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editableb" style={{ width: "100%" }} name="revised_prep_wc_agent" value={this.state.revised_prep_wc_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalWeightRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rcwc_carrier" value={this.state.rcwc_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalWeightRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rcwc_agent" value={this.state.rcwc_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalWeightOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="opwc_carrier" value={this.state.opwc_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalWeightOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="opwc_agent" value={this.state.opwc_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalWeightOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="ocwc_carrier" value={this.state.ocwc_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalWeightOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="ocwc_agent" value={this.state.ocwc_agent} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="4">Valuation Charge</td>
											<td>
												<input type="number" id="ccaRequestModalValuationRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rpvc_carrier" value={this.state.rpvc_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalValuationRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rpvc_agent" value={this.state.rpvc_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalValuationRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rcvc_carrier" value={this.state.rcvc_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalValuationRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rcvc_agent" value={this.state.rcvc_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalValuationOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="opvc_carrier" value={this.state.opvc_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalValuationOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="opvc_agent" value={this.state.opvc_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalValuationOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="ocvc_carrier" value={this.state.ocvc_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalValuationOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="ocvc_agent" value={this.state.ocvc_agent} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="4">Tax</td>
											<td>
												<input type="number" id="ccaRequestModalTaxRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rptax_carrier" value={this.state.rptax_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalTaxRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rptax_agent" value={this.state.rptax_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalTaxRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rctax_carrier" value={this.state.rctax_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalTaxRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rctax_gent" value={this.state.rctax_gent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalTaxOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="optax_carrier" value={this.state.optax_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalTaxOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="optax_agent" value={this.state.optax_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalTaxOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="octax_carrier" value={this.state.octax_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalTaxOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="octax_agent" value={this.state.octax_agent} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="4">Clearance And Handling</td>
											<td>
												<input type="number" id="ccaRequestModalClearanceAndHandlingRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rp_clear_hand_carrier" value={this.state.rp_clear_hand_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalClearanceAndHandlingRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rp_clear_hand_agent" value={this.state.rp_clear_hand_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalClearanceAndHandlingRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rc_clear_hand_carrier" value={this.state.rc_clear_hand_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalClearanceAndHandlingRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rc_clear_hand_agent" value={this.state.rc_clear_hand_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalClearanceAndHandlingOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="op_clear_hand_carrier" value={this.state.op_clear_hand_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalClearanceAndHandlingOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="op_clear_hand_agent" value={this.state.op_clear_hand_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalClearanceAndHandlingOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="oc_clear_hand_carrier" value={this.state.oc_clear_hand_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalClearanceAndHandlingOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="oc_clear_hand_agent" value={this.state.oc_clear_hand_agent} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="4">Disbursements</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementsRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rp_disbursement_carrier" value={this.state.rp_disbursement_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementsRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rp_disbursement_agent" value={this.state.rp_disbursement_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementsRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rc_disbursement_carrier" value={this.state.rc_disbursement_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementsRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rc_disbursement_agent" value={this.state.rc_disbursement_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementsOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="op_disbursement_carrier" value={this.state.op_disbursement_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementsOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="op_disbursement_agent" value={this.state.op_disbursement_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementsOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="oc_disbursement_carrier" value={this.state.oc_disbursement_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementsOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="oc_disbursement_agent" value={this.state.oc_disbursement_agent} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="4">Disbursement Fee</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementFeeRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rp_disbursement_fee_carrier" value={this.state.rp_disbursement_fee_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementFeeRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rp_disbursement_fee_agent" value={this.state.rp_disbursement_fee_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementFeeRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rc_disbursement_fee_carrier" value={this.state.rc_disbursement_fee_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementFeeRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rc_disbursement_fee_agent" value={this.state.rc_disbursement_fee_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementFeeOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="op_disbursement_fee_carrier" value={this.state.op_disbursement_fee_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementFeeOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="op_disbursement_fee_agent" value={this.state.op_disbursement_fee_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementFeeOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="oc_disbursement_fee_carrier" value={this.state.oc_disbursement_fee_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalDisbursementFeeOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="oc_disbursement_fee_agent" value={this.state.oc_disbursement_fee_agent} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="4">Other Charge</td>
											<td>
												<input type="number" id="ccaRequestModalOtherRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rp_ocharge_carrier" value={this.state.rp_ocharge_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalOtherRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rp_ocharge_agent" value={this.state.rp_ocharge_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalOtherRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rc_ocharge_carrier" value={this.state.rc_ocharge_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalOtherRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="rc_ocharge_agent" value={this.state.rc_ocharge_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalOtherOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="op_ocharge_carrier" value={this.state.op_ocharge_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalOtherOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="op_ocharge_agent" value={this.state.op_ocharge_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalOtherOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} name="oc_ocharge_carrier" value={this.state.oc_ocharge_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalOtherOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} name="oc_ocharge_agent" value={this.state.oc_ocharge_agent} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="4">Amendment fee</td>
											<td>
												<div onClick={this.handleClick}>{this.state.rp_amendment_fee_carrier}</div>
											</td>
											<td>
												<input type="number" id="ccaRequestModalAmendmentFeeRevisedCorrectedPrepaidAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} name="rp_amendment_fee_agent" value={this.state.rp_amendment_fee_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalAmendmentFeeRevisedCorrectedCollectCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} name="rc_amendment_fee_carrier" value={this.state.rc_amendment_fee_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalAmendmentFeeRevisedCorrectedCollectAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} name="rc_amendment_fee_agent" value={this.state.rc_amendment_fee_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalAmendmentFeeOriginalIncorrectPrepaidCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} name="op_amendment_fee_carrier" value={this.state.op_amendment_fee_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalAmendmentFeeOriginalIncorrectPrepaidAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} name="op_amendment_fee_agent" value={this.state.op_amendment_fee_agent} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalAmendmentFeeOriginalIncorrectCollectCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} name="oc_amendment_fee_carrier" value={this.state.oc_amendment_fee_carrier} onChange={this.handleChange} />
											</td>
											<td>
												<input type="number" id="ccaRequestModalAmendmentFeeOriginalIncorrectCollectAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} name="oc_amendment_fee_agent" value={this.state.oc_amendment_fee_agent} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="12"></td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="4">Total</td>
											<td>
												<input id="ccaRequestModalTotalRevisedCorrectedPrepaidCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={Number(this.state.revised_prep_wc_carrier) + Number(this.state.rpvc_carrier) + Number(this.state.rptax_carrier) + Number(this.state.rp_clear_hand_carrier) + Number(this.state.rp_disbursement_carrier) + Number(this.state.rp_disbursement_fee_carrier) + Number(this.state.rp_ocharge_carrier) + Number(this.state.rp_amendment_fee_carrier)} disabled />
											</td>
											<td>
												<input id="ccaRequestModalTotalRevisedCorrectedPrepaidAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={Number(this.state.revised_prep_wc_agent) + Number(this.state.rpvc_agent) + Number(this.state.rptax_agent) + Number(this.state.rp_clear_hand_agent) + Number(this.state.rp_disbursement_agent) + Number(this.state.rp_disbursement_fee_agent) + Number(this.state.rp_ocharge_agent) + Number(this.state.rp_amendment_fee_agent)} disabled />
											</td>
											<td>
												<input id="ccaRequestModalTotalRevisedCorrectedCollectCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={Number(this.state.rcwc_carrier) + Number(this.state.rcvc_carrier) + Number(this.state.rctax_carrier) + Number(this.state.rc_clear_hand_carrier) + Number(this.state.rc_disbursement_carrier) + Number(this.state.rc_disbursement_fee_carrier) + Number(this.state.rc_ocharge_carrier) + Number(this.state.rc_amendment_fee_carrier)} disabled />
											</td>
											<td>
												<input id="ccaRequestModalTotalRevisedCorrectedCollectAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={Number(this.state.rcwc_agent) + Number(this.state.rcvc_agent) + Number(this.state.rctax_gent) + Number(this.state.rc_clear_hand_agent) + Number(this.state.rc_disbursement_agent) + Number(this.state.rc_disbursement_fee_agent) + Number(this.state.rc_ocharge_agent) + Number(this.state.rc_amendment_fee_agent)} disabled />
											</td>
											<td>
												<input id="ccaRequestModalTotalOriginalIncorrectPrepaidCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={Number(this.state.opwc_carrier) + Number(this.state.opvc_carrier) + Number(this.state.optax_carrier) + Number(this.state.op_clear_hand_carrier) + Number(this.state.op_disbursement_carrier) + Number(this.state.op_disbursement_fee_carrier) + Number(this.state.op_ocharge_carrier) + Number(this.state.op_amendment_fee_carrier)} disabled />
											</td>
											<td>
												<input id="ccaRequestModalTotalOriginalIncorrectPrepaidAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={Number(this.state.opwc_agent) + Number(this.state.opvc_agent) + Number(this.state.optax_agent) + Number(this.state.op_clear_hand_agent) + Number(this.state.op_disbursement_agent) + Number(this.state.op_disbursement_fee_agent) + Number(this.state.op_ocharge_agent) + Number(this.state.op_amendment_fee_agent)} disabled />
											</td>
											<td>
												<input id="ccaRequestModalTotalOriginalIncorrectCollectCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={Number(this.state.ocwc_carrier) + Number(this.state.ocvc_carrier) + Number(this.state.octax_carrier) + Number(this.state.oc_clear_hand_carrier) + Number(this.state.oc_disbursement_carrier) + Number(this.state.oc_disbursement_fee_carrier) + Number(this.state.oc_amendment_fee_carrier) + Number(this.state.oc_ocharge_carrier)} disabled />
											</td>
											<td>  <input id="ccaRequestModalTotalOriginalIncorrectCollectAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={Number(this.state.ocwc_agent) + Number(this.state.ocvc_agent) + Number(this.state.octax_agent) + Number(this.state.oc_clear_hand_agent) + Number(this.state.oc_disbursement_agent) + Number(this.state.oc_disbursement_fee_agent) + Number(this.state.oc_ocharge_agent) + Number(this.state.oc_amendment_fee_agent)} disabled />  </td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>  <td colSpan="4">Remarks:</td>  <td colSpan="8">  <textarea id="ccaRequestModalRemarksTextarea" placeholder="Editable for cca reasons" row="5" value={reasonsList} style={{ width: "100%" }} name="remarks" value={this.state.remarks} onChange={this.handleChange}  ></textarea>  </td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>  <td colSpan="12">Please correct your documents accordingly and confirm action taken by returning to us, duly signed, the slip below. Thank you.</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>  <td colSpan="6">Distribution:</td>  <td colSpan="6">Yours Faithfully,</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>  <td colSpan="2">Original-</td>  <td colSpan="4">(Shipper)</td>  <td colSpan="6">British Airways World Cargo</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="2">Copy 1-</td>
											<td colSpan="4">(For Accounting Department of Issuing Carrier)</td>
											<td colSpan="6">
												<input id="ccaRequestModalLoginStationInput" disabled={true} placeholder="NoEditable " style={{ width: "100%" }} name="acc_dep_issue_carrier" value={this.state.acc_dep_issue_carrier} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="2">Copy 2-</td>
											<td colSpan="4">(For First Carrier)</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="2">Copy 3-</td>
											<td colSpan="4">(For Second Carrier)</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="2">Copy 4-</td>
											<td colSpan="4">(For Third Carrier)</td>
											<td colSpan="3">Address</td>
											<td colSpan="3">Email</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="2">Copy 5-</td>
											<td colSpan="4">(For Cargo Department of Carrier issuing CCA)</td>
											<td colSpan="3">
												<input id="ccaRequestModalAuthorityNameInput" placeholder="Approver's Name " disabled={false} style={{ width: "100%" }} name="cargo_dep_issue_carrier" value={this.state.cargo_dep_issue_carrier} onChange={this.handleChange} />
											</td>
											<td colSpan="3">
												<input id="ccaRequestModalAuthorityEmailInput" placeholder="Approver's Email " disabled={false} style={{ width: "100%" }} name="cargo_dep_issue_carrier_email" value={this.state.cargo_dep_issue_carrier_email} onChange={this.handleChange} />
											</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="2">Copy 6-</td>
											<td colSpan="4">(For CASS Settlement Office)</td>
											<td colSpan="4">
												<input id="ccaRequestModalDesignationInput" placeholder="Designation" style={{ width: "100%" }} disabled={false} name="cass_settlement_office" value={this.state.cass_settlement_office} onChange={this.handleChange} />
											</td>
											<td colSpan="2">Signature</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="2">Copy 7-</td>
											<td colSpan="4">(For CASS Agent/Recipient)</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="12"></td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="2" rowSpan="8">To</td>
											<td colSpan="4" rowSpan="8">
												<textarea id="ccaRequestModalToBAAddressTextarea" placeholder="NoEditable" disabled={true} style={{ width: "100%", height: '100px' }} name="to" value={this.state.to} onChange={this.handleChange}></textarea>
											</td>
											<td colSpan="2">From</td>
											<td colSpan="3">British Airways World Cargo</td>
											<td>(Airline)</td></tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="6"></td></tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="2">At</td>
											<td colSpan="3">
												<input id="ccaRequestModalAtStationInput" placeholder="NoEditable " disabled={true} style={{ width: "100%" }} name="at" value={this.state.at} onChange={this.handleChange} />
											</td>
											<td>(Station)</td></tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="6"></td></tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="6">Date</td></tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="6"></td></tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="6"></td></tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="6">We herewith confirm having corrected our documents and </td></tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="2">Ref: AWB No.</td>
											<td colSpan="4">
												<input id="ccaRequestModalRefAwbNoInput" disabled={true} placeholder="NoEditable" style={{ width: "100%" }} name="ref_awb_no" value={this.state.ref_awb_no} onChange={this.handleChange} />
											</td>
											<td colSpan="6">taken the necessary actions as per your instructions.</td></tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="12"></td></tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="2">Ref:CCA No.</td>
											<td colSpan="4">
												<input id="ccaRequestModalRefCCANoInput" disabled={true} placeholder="It will show after approval" style={{ width: "100%" }} name="ref_cca_no" value={this.state.ref_cca_no} onChange={this.handleChange} />
											</td>
											<td colSpan="6">Carrier's Stamp ____________________________________</td>
										</tr>

										<tr style={{ "fontSize": "10px", height: "10px" }}>
											<td colSpan="12"></td>
										</tr>

									</tbody>
								</table>
							</div>
						</ModalBody>  
						{/* <div className="modal-footer col-md-12"> */}
						{/* <OperationModalLockableFooter MainStore={this.props.MainStore} awbLegOp={this.props.legop_record} onCloseModal={this.onCloseModal} name={"ccaRequestPendingModalAction"} onClickHandler={() => this.capADiscrepancyPendingAction(this.state.legop_record)} text={"CAP A Discrepancy Done"}/> */}

						<ModalFooter>  
							<button className="btn btn-success waves-effect waves-light save-category" id="ccaRequestPendingModalAction" type="button" name="ccaRequestPendingModalAction" onClick={() => this.ccaRequestPendingAction()}>
								<i className="fas fa-save" aria-hidden="true"></i>&nbsp;&nbsp;Send For Approval
							</button>
						</ModalFooter>  
					</div>
				}
			</Observer>

		);
	}
}

export default CCARequestPendingModal;
