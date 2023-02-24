import React, { Component } from "react";
import custom from '../../config/custom.js';
import CCAMultiReason from '../shared/CCAMultiReason';
import { Observer } from "mobx-react"
import AWBLegDetails from "./AWBLegDetails.js"
import PriorityClass from "../shared/PriorityClass.js";
import ReasonBA80Details from "./ReasonBA80Details.js";
import NavigationButton from "../shared/NavigationButton.js";
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import OperationModalLockableFooter from "../shared/OperationModalLockableFooter.js";
import APIService from "../APIService.js";
class EUICSPendingModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			legop_record: props.legop_record,
			reason: "",
			ba80_notes: "",
			closing_status: custom.custom.awb_leg_ops_status.euics_done,
			checked: true,
			cca: [],
			tabNumber: '',
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


	callbackCCA = (ccaData) => {
		this.setState({ cca: ccaData })
	}



	euics_discrepancy = (event) => {
		// console.log("checkbox change "+ this.state.checked);
		this.setState({ checked: !this.state.checked });
		if (this.state.checked === true) {
			this.setState({ closing_status: custom.custom.awb_leg_ops_status.euics_discrepancy });
		} else {
			this.setState({ closing_status: custom.custom.awb_leg_ops_status.euics_done });
		}
		// console.log(this.state.closing_status);
	}

	euicsPendingAction = (legop_record) => {
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
			APIService.post('/euicsPending', {
				awb_legop_id: legop_record.id,
				awb_leg_id: legop_record.awb_leg.id,
				reason: this.state.reason,
				ba80_notes: this.state.ba80_notes,
				awb_no: legop_record.awb_no,
				station: legop_record.station,
				closing_status: this.state.closing_status,
				created_by: legop_record.awb_leg.created_by,
				from: legop_record.awb_leg.from,
				CCA: this.state.cca
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
							<label className="ml-2" id="euicsPendingModalEditTitle">EUICS Pending
							<NavigationButton awb_no={this.state.legop_record.awb_no} tabNumber={this.state.tabNumber} MainStore={this.props.MainStore} onCloseModal={this.onCloseModal}/>
								<span>-<PriorityClass PriorityClass={this.state.priorityClass} /></span></label>
						</h4>
					</ModalHeader>  
					<ModalBody>  
						<AWBLegDetails AWBLegDetails={this.state.legop_record.awb_leg} />
						<div>
							<CCAMultiReason ccaCallback={this.callbackCCA} />
						</div>
						<ReasonBA80Details reason={this.reason} errors={this.state.errors} setStateReason={this.setStateReason} setStateBA80={this.setStateBA80} error_reason={this.state.error_reason} ba80_notes={this.ba80_notes} closing_ba80_notes_error={this.state.errors.closing_ba80_notes_error} closing_reason_error={this.state.errors.closing_reason_error} />
						<div class="col-lg-10">
							<ul class="list-style-none">
								<li style={{ paddingTop: "1rem", paddingRight: "1rem", paddingLeft: "1rem" }}>
									<label class="customcheckbox alert alert-primary" style={{ fontSize: "16px", fontWeight: " 600" }}>EUICS DISCREPANCY
										<input class="listCheckbox" id="euicsPendingModalEUICSDiscrepancy" type="checkbox" name="euicsPendingModalEUICSDiscrepancy" onChange={this.euics_discrepancy} />
										<span class="checkmark m-auto"></span>
									</label>
								</li>
							</ul>
						</div>
					</ModalBody>  
					<OperationModalLockableFooter MainStore={this.props.MainStore} lockedOpsData={this.props.lockedOpsData} awbLegOp={this.props.legop_record} onCloseModal={this.onCloseModal} name={"euicsPendingModalAction"} onClickHandler={() => this.euicsPendingAction(this.state.legop_record)} text={"SAVE"}/>


				</div>

			}</Observer>

		);
	}
}

export default EUICSPendingModal;