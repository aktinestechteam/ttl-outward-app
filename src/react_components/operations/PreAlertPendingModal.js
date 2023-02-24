import React, { Component } from "react";
import custom from '../../config/custom.js';
import { Observer } from "mobx-react"
import AWBLegDetails from "./AWBLegDetails.js"
import PriorityClass from "../shared/PriorityClass.js";
import ReasonBA80Details from "./ReasonBA80Details.js";
import NavigationButton from "../shared/NavigationButton.js";
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import OperationModalLockableFooter from "../shared/OperationModalLockableFooter.js";
import APIService from "../APIService"
class PreAlertPendingModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			legop_record: props.legop_record,
			reason: "",
			ba80_notes: "",
			tabNumber: '',
			booklistData: '',
			shc:[],
			priorityClass: props.legop_record.awb_info.priority_class,
			errors: { void_reason_error: '', src_error: '', dest_error: '', selected_flight_error: '', closing_status_error: '', closing_reason_error: '', closing_ba80_notes_error: '' },
		}
	}

	setStateReason = (errors) => {
		this.setState({ errors });
	}

	setStateBA80 = (errors) => {
		this.setState({ errors });
	}

	reason = (event) => {
		this.setState({ reason: event });
	}

	ba80_notes = (event) => {
		this.setState({ ba80_notes: event })
	}

	componentDidMount() {
		this.getPreAlertDocs(this.props.legop_record.awb_leg.booklist,this.props.legop_record.awb_leg.awb_info);
	}

	getPreAlertDocs = (booklistId, awbInfoId) => {
		APIService.get('/getPrealertDocs',{booklistId: booklistId,awbInfoId: awbInfoId },function (response) {
			console.log(response);
			if ((Object.keys(response.data).length) > 0) {
				response.data.bookList.file_prealert.sort((attachment1, attachment2) => attachment1.createdAt > attachment2.createdAt);
				this.setState({booklistData: response.data.bookList,
					shc: response.data.awbInfo.shc});
			}
		}.bind(this));
	}


	preAlertPendingAction = (legop_record) => {
		let errors = this.state.errors;
		if (!this.state.reason) {
			errors.closing_reason_error = 'enter reason ';
			this.setState({ errors });
		} else {
			errors.closing_reason_error = '';
			this.setState({ errors });
		}

		if (!this.state.ba80_notes) {
			errors.closing_ba80_notes_error = 'enter BA80 notes ';
			this.setState({ errors });
		} else {
			errors.closing_ba80_notes_error = '';
			this.setState({ errors });
		}
		let error_count = Object.keys(errors).filter((key) => {
			if (errors[key]) {
				return false;
			}
			return true;
		}).length;
		let error_type_count = Object.keys(errors).length;
		if (error_count < error_type_count) {
			console.log('yes errors' + error_count + ' ==> ' + JSON.stringify(this.state.errors))
		} else {
			// let mySocket = io.sails.connect('http://localhost:1337');
			APIService.post('/preAlertPending', {
				awb_legop_id: legop_record.id,
				awb_leg_id: legop_record.awb_leg.id,
				reason: this.state.reason,
				ba80_notes: this.state.ba80_notes,
				awb_no: legop_record.awb_no,
				station: legop_record.station,
				closing_status: custom.custom.awb_leg_ops_status.pre_alert_done,
				created_by: legop_record.awb_leg.created_by,
				from: legop_record.awb_leg.from
			}, function (data, status) {
				if (data) {
					console.log(data);
				}
				else
					console.log(status);
			});
			this.onCloseModal();
		}
	}

	onCloseModal = (event) => {
		this.props.closeModal();
	}
	

	render() {
		// let modalSize = "xl";
		console.log('legop record in modal rendering' + JSON.stringify(this.state.legop_record.awb_no));
		
		return (
			<Observer>{() =>

				<div>
					<ModalHeader>  
						<h4 className="modal-title">
							<span>
								<i className="fa fa-delete"></i>
							</span>
							<label className="ml-2" id="preAlertPendingModalEditTitle">Pre Alert Pending
							<NavigationButton awb_no={this.state.legop_record.awb_no} tabNumber={this.state.tabNumber} MainStore={this.props.MainStore} onCloseModal={this.onCloseModal}/>
								<span>-<PriorityClass PriorityClass={this.state.priorityClass} /></span></label>
						</h4>
					</ModalHeader>  
					<ModalBody>  
						<AWBLegDetails AWBLegDetails={this.state.legop_record.awb_leg} />
						<strong>Pre-Alert Documents</strong><br></br>
						{
						this.state.shc.map((shc)=>(
							<div>
							<strong className="text-black">{shc}: </strong>
							{
								this.state.booklistData.file_prealert.map((attachment, index) => 
								 attachment.email_subject.split(' ')[2]==shc &&
									<button key={index} className="btn btn-xs btn-secondary mx-1" onClick={() => window.open(process.env.REACT_APP_API_BASE_PATH + attachment.new_filepath)}>{"R-" + index}</button>
								)
							}
							<br></br><br></br>
							</div>
						))}
						

						<ReasonBA80Details reason={this.reason} errors={this.state.errors} setStateReason={this.setStateReason} setStateBA80={this.setStateBA80} error_reason={this.state.error_reason} ba80_notes={this.ba80_notes} closing_ba80_notes_error={this.state.errors.closing_ba80_notes_error} closing_reason_error={this.state.errors.closing_reason_error} />
					</ModalBody>
					<OperationModalLockableFooter MainStore={this.props.MainStore} lockedOpsData={this.props.lockedOpsData} awbLegOp={this.props.legop_record} onCloseModal={this.onCloseModal} name={"preAlertPendingModalAction"} onClickHandler={() => this.preAlertPendingAction(this.state.legop_record)} text={"Pre Alert Done"}/>
  
				</div>

			}</Observer>

		);
	}
}
export default PreAlertPendingModal;