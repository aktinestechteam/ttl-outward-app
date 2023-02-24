import React, { Component } from "react";
// import CCAMultiSelect from './CCAMultiSelect.js';
import OffloadMultiSelect from './OffloadMultiSelect.js';
import custom from "../../config/custom.js";
import { Observer } from "mobx-react"
import RadioOptions from "../shared/RadioOptions.js";
import AWBLegDetails from "./AWBLegDetails.js"
import PriorityClass from "../shared/PriorityClass.js"
import ReasonBA80Details from "./ReasonBA80Details.js";
import NavigationButton from "../shared/NavigationButton.js";
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import OperationModalLockableFooter from "../shared/OperationModalLockableFooter.js";
import APIService from "../APIService.js";
class RMSHubReviewModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			legop_record: props.legop_record,
			reason: "",
			ba80_notes: "",
			closing_status: "",
			// cca:[],
			offload: [],
			priorityClass: props.legop_record.awb_info.priority_class,
			void_reason: "",
			tabNumber: '',
			errors: { void_reason_error: '', offload_error: '', closing_status_error: '', closing_reason_error: '', closing_ba80_notes_error: '' },
			operation_window_time: props.queue_duration * 60 * 1000,
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

	void_reason = (event) => {
		let errors = this.state.errors;
		let rules = [{ text: event.target.value, regex_name: 'free_text', errmsg: 'Please enter reason min length of 10', min: 10, required: true }];
		let isValidatedRMSHubReview = window.validate(rules);
		console.log('isValidatedRMSHubReview ' + JSON.stringify(isValidatedRMSHubReview));
		if (isValidatedRMSHubReview.errmsg) {
			errors.void_reason_error = isValidatedRMSHubReview.errmsg;
			this.setState({ errors });
		} else {
			errors.void_reason_error = '';
			this.setState({ errors });
			this.setState({ void_reason: event.target.value });
		}
	}

	setClosingStatus = (status) => {
		console.log("radio button change " + status);
		this.setState({ errors: { void_reason_error: '', offload_error: '', closing_status_error: '' } });
		this.setState({ closing_status: status });
	}

	// callbackCCA = (ccaData) => {
	// 	this.setState({cca: ccaData})
	// }

	callbackOffload = (offloadData) => {
		this.setState({ offload: offloadData })
	}

	rmsHubReviewAction = (legop_record) => {
		let errors = this.state.errors;
		if (this.state.closing_status === custom.custom.awb_leg_ops_status.rate_check_rejected) {
			if (!this.state.void_reason) {
				errors.void_reason_error = 'required field';
				this.setState({ errors });
			} else {
				errors.void_reason_error = '';
				this.setState({ errors });
			}
			if (this.state.offload.length < 1) {
				errors.offload_error = 'select offload';
				this.setState({ errors });
			} else {
				errors.offload_error = '';
				this.setState({ errors });
			}
		}

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
			APIService.post('/rmsHubReview', {
				awb_legop_id: legop_record.id,
				awb_leg_id: legop_record.awb_leg.id,
				reason: this.state.offload + '-' + this.state.reason,
				ba80_notes: this.state.ba80_notes,
				awb_no: legop_record.awb_no,
				station: legop_record.station,
				closing_status: this.state.closing_status,
				created_by: legop_record.awb_leg.created_by,
				from: legop_record.awb_leg.from,
				// cca: this.state.cca,
				void_reason: this.state.offload + '-' + this.state.void_reason,
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
		let timeRemaining = this.state.legop_record.trigger_time + this.state.operation_window_time - Date.now();
		// let modalSize = "xl";
		console.log('=====+++ timeRemaining+==== ' + timeRemaining);

		return (
			<Observer>{() =>

				<div>
					<ModalHeader>  
						<h4 className="modal-title">
							<span>
								<i className="fa fa-delete"></i>
							</span>
							<label className="ml-2" id="rmsHubReviewModalEditTitle">RMS Hub Review
							<NavigationButton awb_no={this.state.legop_record.awb_no} tabNumber={this.state.tabNumber} MainStore={this.props.MainStore} onCloseModal={this.onCloseModal}/>
								<span>-<PriorityClass PriorityClass={this.state.priorityClass} /></span></label>
						</h4>
					</ModalHeader>  
					<ModalBody>  
						<AWBLegDetails AWBLegDetails={this.state.legop_record.awb_leg} />
						<div>
							<label className="col-md-12">Select Closing Status</label>
							{
								timeRemaining > 0 &&
								<div>
									<RadioOptions options={['RATE_CHECK_DONE', 'RATE_CHECK_REFERRED', 'RATE_CHECK_REJECTED']} optionSelected={this.setClosingStatus} />

								</div>
							}
							{
								timeRemaining < 0 &&
								<div>
									<RadioOptions options={['RATE_CHECK_REFERRED', 'RATE_CHECK_REJECTED']} optionSelected={this.setClosingStatus} />

								</div>
							}
							<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.state.errors.closing_status_error ? this.state.errors.closing_status_error : ""}
							</label>
						</div>

						{
							this.state.closing_status !== custom.custom.awb_leg_ops_status.rate_check_rejected &&
							<div>
							</div>
						}
						{
							this.state.closing_status === custom.custom.awb_leg_ops_status.rate_check_rejected &&
							<div>
								<OffloadMultiSelect offloadCallback={this.callbackOffload} />
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.offload_error ? this.state.errors.offload_error : ""}
								</label>
								<input className="col-md-12" id="rmsHubReviewModalVoidReasonInput" placeholder="Enter reason to discard awb leg" type="text" name="rmsHubReviewModalVoidReasonInput" autoComplete="off" required="" onChange={this.void_reason}></input>
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.void_reason_error ? this.state.errors.void_reason_error : ""}
								</label>
							</div>
						}
						<ReasonBA80Details reason={this.reason} errors={this.state.errors} setStateReason={this.setStateReason} setStateBA80={this.setStateBA80} error_reason={this.state.error_reason} ba80_notes={this.ba80_notes} closing_ba80_notes_error={this.state.errors.closing_ba80_notes_error} closing_reason_error={this.state.errors.closing_reason_error} />

					</ModalBody>  
					<OperationModalLockableFooter MainStore={this.props.MainStore} lockedOpsData={this.props.lockedOpsData} awbLegOp={this.props.legop_record} onCloseModal={this.onCloseModal} name={"rmsHubReviewModalAction"} onClickHandler={() => this.rmsHubReviewAction(this.state.legop_record)} text={"SAVE"}/>

				</div>

			}</Observer>

		);
	}
}
export default RMSHubReviewModal;