import React, { Component } from "react";
import custom from '../../config/custom.js';
import { Observer } from "mobx-react"
import AWBLegDetails from "./AWBLegDetails.js"
import ReasonBA80Details from "./ReasonBA80Details.js";
import PriorityClass from "../shared/PriorityClass.js";
import NavigationButton from "../shared/NavigationButton.js";
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import OperationModalLockableFooter from "../shared/OperationModalLockableFooter.js";
import APIService from "../APIService.js";
class RCFPendingModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			legop_record: props.legop_record,
			pieces: 0,
			weight: 0,
			reason: "",
			ba80_notes: "",
			tabNumber: '',
			errors: { pieces_error: '', weight_error: '', closing_reason_error: '', closing_ba80_notes_error: '' },
		}
	}

	pieces = (event) => {
		let errors = this.state.errors;
		let rules = [{ text: event.target.value, regex_name: 'min_number', errmsg: 'Please enter minimum 1 Piece', min: 1, required: true }];
		let isValidatedPieces = window.validate(rules);
		console.log('isValidatedPieces ' + JSON.stringify(isValidatedPieces));
		if (isValidatedPieces.errmsg) {
			errors.pieces_error = isValidatedPieces.errmsg;
			this.setState({ errors });
		} else {
			errors.pieces_error = '';
			this.setState({ errors });
			this.setState({ pieces: event.target.value });
		}
	}

	weight = (event) => {
		let errors = this.state.errors;
		let rules = [{ text: event.target.value, regex_name: 'min_number', errmsg: 'Please enter weight more than 0 Kg.', min: 0.0001, required: true }];
		let isValidatedWeight = window.validate(rules);
		console.log('isValidatedWeight ' + JSON.stringify(isValidatedWeight));
		if (isValidatedWeight.errmsg) {
			errors.weight_error = isValidatedWeight.errmsg;
			this.setState({ errors });
		} else {
			errors.weight_error = '';
			this.setState({ errors });
			this.setState({ weight: event.target.value });
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

	rcfPendingAction = (legop_record) => {
		let errors = this.state.errors;

		if (!this.state.pieces) {
			errors.pieces_error = 'enter pieces';
			this.setState({ errors });
		} else {
			errors.pieces_error = '';
			this.setState({ errors });
		}

		if (!this.state.weight) {
			errors.weight_error = 'enter weight';
			this.setState({ errors });
		} else {
			errors.weight_error = '';
			this.setState({ errors });
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
			console.log('no errors' + error_count + ' ==> ' + JSON.stringify(this.state.errors));

			// let mySocket = io.sails.connect('http://localhost:1337');
			APIService.post('/rcfPending', {
				awb_legop_id: legop_record.id,
				awb_leg_id: legop_record.awb_leg.id,
				reason: this.state.reason,
				ba80_notes: this.state.ba80_notes,
				pieces: this.state.pieces,
				weight: this.state.weight,
				awb_no: legop_record.awb_no,
				station: legop_record.station,
				closing_status: custom.custom.awb_leg_ops_status.rcf_done,
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
							<label className="ml-2" id="rcfPendingModalEditTitle">RCF Pending
							<NavigationButton awb_no={this.state.legop_record.awb_no} tabNumber={this.state.tabNumber} MainStore={this.props.MainStore} onCloseModal={this.onCloseModal}/>
								<span>-<PriorityClass PriorityClass={this.state.priorityClass} /></span></label>
						</h4>
					</ModalHeader>  
					<ModalBody>  
						<AWBLegDetails AWBLegDetails={this.state.legop_record.awb_leg} />
						<ReasonBA80Details reason={this.reason} errors={this.state.errors} setStateReason={this.setStateReason} setStateBA80={this.setStateBA80} error_reason={this.state.error_reason} ba80_notes={this.ba80_notes} closing_ba80_notes_error={this.state.errors.closing_ba80_notes_error} closing_reason_error={this.state.errors.closing_reason_error} />
						<div className="row">
							<div className="col-md-6" id="rcfPendingModalPieces">
								<label className="control-label">Pieces</label>
								<input className="form-control form-white" id="rcfPendingModalPiecesInput" placeholder="Enter Total Pieces Received" type="text" name="rcfPendingModalPiecesInput" autocomplete="off" required="" onChange={this.pieces} />
							</div>
							<div className="col-md-6" id="rcfPendingModalWeight">
								<label className="control-label">Weight</label>
								<input className="form-control form-white" id="rcfPendingModalWeightInput" placeholder="Enter Total Weight Received" type="text" name="rcfPendingModalWeightInput" autocomplete="off" required="" onChange={this.weight} />
							</div>
						</div>
						<div className="row">
							<label className="col-md-6 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.state.errors.pieces_error ? this.state.errors.pieces_error : ""}
							</label>
							<label className="col-md-6 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.state.errors.weight_error ? this.state.errors.weight_error : ""}
							</label>
						</div>
					</ModalBody>  
					<OperationModalLockableFooter MainStore={this.props.MainStore} lockedOpsData={this.props.lockedOpsData} awbLegOp={this.props.legop_record} onCloseModal={this.onCloseModal} name={"rcfPendingModalAction"} onClickHandler={() => this.rcfPendingAction(this.state.legop_record)} text={"RCF Done"}/>

				</div>

			}</Observer>

		);
	}
}
export default RCFPendingModal;