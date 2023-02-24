import React, { Component } from "react";
import custom from '../../config/custom.js';
// import OffloadMultiSelect from './OffloadMultiSelect.js';
import { Observer } from "mobx-react"
import RadioOptions from "../shared/RadioOptions.js";
import AWBLegDetails from "./AWBLegDetails.js"
import CCAMultiReason from '../shared/CCAMultiReason';
import PriorityClass from "../shared/PriorityClass.js";
import ReasonBA80Details from './ReasonBA80Details';
import NavigationButton from "../shared/NavigationButton.js";
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import OperationModalLockableFooter from "../shared/OperationModalLockableFooter.js";
import APIService from "../APIService.js";
class P2EscalationModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			legop_record: props.legop_record,
			reason: "",
			ba80_notes: "",
			closing_status: "",
			// offload:[],
			station_record: {tz: "Asia/Kolkata"},
			cca: [],
			priorityClass: props.legop_record.awb_info.priority_class,
			flight_selector: [],
			station_selector: [],
			selected_destination: "",
			selected_flight: "",
			void_reason: "",
			error_reason: "",
			tabNumber: '',
			customerUpdate: false,
			errors: { void_reason_error: '', src_error: '', dest_error: '', selected_flight_error: '', closing_status_error: '', closing_reason_error: '', closing_ba80_notes_error: '' },
		}
	}
	
	componentDidMount() {
		let station_record = window.station_records.find(station => station.iata === this.state.legop_record.awb_leg.from);

		if(station_record) {
			this.setState({station_record});
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

	void_reason = (event) => {

		let errors = this.state.errors;
		let rules = [{ text: event.target.value, regex_name: 'free_text', errmsg: 'Please enter reason min length of 10', min: 10, required: true }];
		let isValidatedP2Escalation = window.validate(rules);
		let reasonrules = [{ text: event.target.value, regex_name: 'free_text', errmsg: 'Please enter reason min length of 50', min: 50, required: true }];
		// let isValidatedP2Escalationreason = window.validate(reasonrules);
		console.log('isValidatedP2Escalation ' + JSON.stringify(isValidatedP2Escalation));
		if (isValidatedP2Escalation.errmsg) {
			errors.void_reason_error = window.isValidatedEscalation.errmsg;
			this.setState({ errors });
		} else {
			errors.void_reason_error = '';
			this.setState({ errors });
			this.setState({ void_reason: event.target.value });
		}


	}

	setClosingStatus = (status) => {
		console.log("radio button change " + status);
		this.setState({ errors: { void_reason_error: '', src_error: '', dest_error: '', selected_flight_error: '', closing_status_error: '', void_ba80_notes_error: '' } });
		this.setState({ closing_status: status });
	}

	customerUpdate= (event) => {
		// console.log("checkbox change "+ this.state.checked);
		this.setState({ customerUpdate: !this.state.customerUpdate });
	}

	destinationChanged = (event) => {
		this.setState({ selected_destination: event.target.value });
		console.log("going " + event.target.value);
		this.updateFlightsP2EscalationModal(event.target.value);
	}

	flightChanged = (event) => {
		this.setState({ selected_flight: event.target.value });
	}

	updateFlightsP2EscalationModal = (destination_value) => {
		let source = this.state.legop_record.awb_leg.from;
		let destination = destination_value;

		if (!source || !destination) {
			window.swal_error('Source / Destination is missing');
		} else {
			let queryParams = { source: source, destination: destination };
			// let mySocket = io.sails.connect('http://localhost:1337');
			APIService.get('/getFlightDetails', queryParams, function (resData) {
				console.log('succccsesflights');
				//console.log(JSON.stringify(resData.data));
				if (resData.errormsg) {
					console.log(resData.errormsg);
				} else {
					this.setState({ flight_selector: resData.data });
				}
			}.bind(this));
		}
	}

	p2EscalationAction = (legop_record) => {
		let errors = this.state.errors;


		if (this.state.closing_status === custom.custom.awb_leg_ops_status.assign_flight_to_recovery) {
			if (!this.state.selected_flight) {
				errors.selected_flight_error = 'select flight';
				this.setState({ errors });
			} else {
				errors.selected_flight_error = '';
				this.setState({ errors });
			}
			if (!this.state.void_reason) {
				errors.void_reason_error = 'required field';
				this.setState({ errors });
			} else {
				errors.void_reason_error = '';
				this.setState({ errors });
			}


			// if(this.state.offload.length < 1){
			// 	errors.offload_error= 'select offload';
			// 	this.setState({errors});
			// } else{
			// 	errors.offload_error = '';
			// 	this.setState({errors});
			// }
		}
		if (!this.state.reason) {
			// alert(this.state.reason)
			errors.closing_reason_error = 'enter reason ';
			this.setState({ errors });
		} else {
			errors.closing_reason_error = '';
			this.setState({ errors });
		}

		if (!this.state.ba80_notes) {
			// alert(this.state.ba80_notes)
			errors.closing_ba80_notes_error = 'enter BA80 notes ';
			this.setState({ errors });
		} else {
			errors.closing_ba80_notes_error = '';
			this.setState({ errors });
		}


		if (!this.state.closing_status) {
			errors.closing_status_error = 'select closing status';
			this.setState({ errors });
		} else {
			errors.closing_status_error = '';
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
			APIService.post('/p2Escalation', {

				awb_legop_id: legop_record.id,
				awb_leg_id: legop_record.awb_leg.id,
				reason: this.state.reason,
				ba80_notes: this.state.ba80_notes,
				awb_no: legop_record.awb_no,
				station: legop_record.station,
				closing_status: this.state.closing_status,
				created_by: legop_record.awb_leg.created_by,
				from: legop_record.awb_leg.from,
				pieces: legop_record.awb_leg.pieces,
				weight: legop_record.awb_leg.weight,
				flightSelector: this.state.selected_flight,
				void_reason: this.state.void_reason,
				to: legop_record.awb_leg.to,
				CCA: this.state.cca,
				customer_update: this.state.customerUpdate,
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
										<label className="ml-2" id="p2EscalationModalEditTitle">P2 Escalation
											{/* <button onClick={() => { this.onSearchAWBNoAction() }}>{this.state.legop_record.awb_no}</button> */}
											<NavigationButton awb_no={this.state.legop_record.awb_no} tabNumber={this.state.tabNumber} MainStore={this.props.MainStore} onCloseModal={this.onCloseModal}/>
											<span>-<PriorityClass PriorityClass={this.state.priorityClass} /></span></label>
									</h4>
								</ModalHeader>  
								<ModalBody>  
									<AWBLegDetails AWBLegDetails={this.state.legop_record.awb_leg} />
									<ReasonBA80Details reason={this.reason} errors={this.state.errors} setStateReason={this.setStateReason} setStateBA80={this.setStateBA80} error_reason={this.state.error_reason} ba80_notes={this.ba80_notes} closing_ba80_notes_error={this.state.errors.closing_ba80_notes_error} closing_reason_error={this.state.errors.closing_reason_error} />
									<label className="col-md-12">Select Closing Status</label>
									<RadioOptions options={['ASSIGN_FLIGHT_TO_RECOVERY', 'P1_ESCALATION', 'ESCALATION']} optionSelected={this.setClosingStatus} />

									<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
										{this.state.errors.closing_status_error ? this.state.errors.closing_status_error : ""}
									</label>
									<div class="col-lg-10">
										<ul class="list-style-none">
											<li style={{ paddingTop: "1rem", paddingRight: "1rem", paddingLeft: "1rem" }}>
												<label class="customcheckbox alert alert-primary" style={{ fontSize: "16px", fontWeight: " 600" }}>Customer Updated
													<input class="listCheckbox" id="euicsPendingModalEUICSDiscrepancy" type="checkbox" name="euicsPendingModalEUICSDiscrepancy" onChange={this.customerUpdate} />
													<span class="checkmark m-auto"></span>
												</label>
											</li>
										</ul>
									</div>
									<div>
										<CCAMultiReason ccaCallback={this.callbackCCA} />
									</div>
									{
										this.state.closing_status !== custom.custom.awb_leg_ops_status.assign_flight_to_recovery &&
										<div>
										</div>
									}
									{
										this.state.closing_status === custom.custom.awb_leg_ops_status.assign_flight_to_recovery &&
										<div>
											<input className="col-md-12" id="p2EscalationModalVoidReasonInput" placeholder="Enter reason for assigning another flight" type="text" name="p2EscalationModalVoidReasonInput" autocomplete="off" required="" onChange={this.void_reason}></input>
											<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
												{this.state.errors.void_reason_error ? this.state.errors.void_reason_error : ""}
											</label>
											<div className="row">
												<div className="col-md-5 input-group">
													<div className="input-group-prepend">
														<span className="input-group-text bg-danger">
															<i className="mdi mdi-map-marker text-light"></i>
														</span>
													</div>
													<select className="p-0 select3 form-control custom-select browser-default" id="p2EscalationModalStationSourceSelect" type="text">
														<option value={this.state.legop_record.awb_leg.from}>{this.state.legop_record.awb_leg.from}</option>
													</select>
													<select className="p-0 select3 form-control custom-select browser-default" id="p2EscalationModalStationDestinationSelect" type="text" onChange={this.destinationChanged}>
														{
															window.station_records.map((station) => {
																return <option value={station.iata}>{station.iata}</option>
															})
														}

													</select>
												</div>
												<div className="col-md-7 input-group">
													<div className="input-group-prepend">
														<span className="input-group-text bg-danger">
															<i className="fas fa-plane text-light"></i>
														</span>
													</div>
													<select className="select2 form-control custom-select my-auto" id="p2EscalationModalFlightsSelector" type="text" placeholder="Select flight" name="p2EscalationModalFlightsSelector" onChange={this.flightChanged}>
														{
															this.state.flight_selector.map((flight) => {
																return <option value={flight.flight_no + "," + flight.exactdeparturetime + "," + flight.exactarrivaltime}>{window.moment.tz(flight.exactdeparturetime, this.state.station_record.tz).format("DD/MM/YYYY HH:mm")} [{flight.flight_no}]</option>
															})
														}
													</select>
												</div>
											</div>
											<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
												{this.state.errors.selected_flight_error ? this.state.errors.selected_flight_error : ""}
											</label>
										</div>
									}
								</ModalBody>
								<OperationModalLockableFooter MainStore={this.props.MainStore} lockedOpsData={this.props.lockedOpsData} awbLegOp={this.props.legop_record} onCloseModal={this.onCloseModal} name={"p2EscalationModalAction"} onClickHandler={() => this.p2EscalationAction(this.state.legop_record)} text={"SAVE"}/>
							</div>
			}</Observer>

		);
	}
}
export default P2EscalationModal;