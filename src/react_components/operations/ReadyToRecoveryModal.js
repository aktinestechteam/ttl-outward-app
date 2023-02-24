import React, { Component } from "react";
import custom from '../../config/custom.js';
import OffloadMultiSelect from './OffloadMultiSelect.js';
import { Observer } from "mobx-react"
import RadioOptions from "../shared/RadioOptions.js";
import AWBLegDetails from "./AWBLegDetails.js"
import CCAMultiSelect from './CCAMultiSelect.js';
import PriorityClass from "../shared/PriorityClass.js";
import ReasonBA80Details from "./ReasonBA80Details.js";
import NavigationButton from "../shared/NavigationButton.js";
import PiecesWeightDetails from "../shared/PiecesWeightDetails.js";
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import OperationModalLockableFooter from "../shared/OperationModalLockableFooter.js";
import CCAMultiReason from "../shared/CCAMultiReason";
import APIService from "../APIService"
class ReadyToRecoveryModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flightNo: props.legop_record.awb_leg.flight_no,
			flightDelayTime: new Date(props.legop_record.awb_leg.planned_departure),
			legop_record: props.legop_record,
			reason: "",
			ba80_notes: "",
			closing_status: "",
			offload: [],
			cca: [],
			priorityClass: props.legop_record.awb_info.priority_class,
			flight_selector: [],
			station_selector: [],
			pieces: 0,
			weight: 0,
			selected_destination: "",
			selected_flight: "",
			void_reason: "",
			tabNumber: '',
			customerUpdate: false,
			errors: { void_reason_error: '', src_error: '', dest_error: '', selected_flight_error: '', offload_error: '', closing_status_error: '', closing_reason_error: '', closing_ba80_error: '', pieces_error: '', weight_error: '', time_error: '', flight_no_error: '' },
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
		let isValidatedEscalation = window.validate(rules);
		console.log('isValidatedEscalation ' + JSON.stringify(isValidatedEscalation));
		if (isValidatedEscalation.errmsg) {
			errors.void_reason_error = isValidatedEscalation.errmsg;
			this.setState({ errors });
		} else {
			errors.void_reason_error = '';
			this.setState({ errors });
			this.setState({ void_reason: event.target.value });
		}
	}

	setClosingStatus = (status) => {

		console.log("radio button change " + status);
		this.setState({ errors: { void_reason_error: '', src_error: '', dest_error: '', selected_flight_error: '', offload_error: '', closing_status_error: '' } });
		this.setState({ closing_status: status });
	}

	callbackCCA = (ccaData) => {
		this.setState({ cca: ccaData })
	}

	callbackOffload = (offloadData) => {
		this.setState({ offload: offloadData })
	}

	destinationChanged = (event) => {
		this.setState({ selected_destination: event.target.value });
		console.log("going " + event.target.value);
		this.updateFlightsReadyToRecoveryModal(event.target.value);
	}

	flightChanged = (event) => {
		this.setState({ selected_flight: event.target.value });
	}

	updateFlightsReadyToRecoveryModal = (destination_value) => {
		let source = this.state.legop_record.awb_leg.from;
		let destination = destination_value;

		if (!source || !destination) {
			window.swal_error('source or destination is missing');
		} else {
			let queryParams = { source: source, destination: destination };
			// let mySocket = io.sails.connect('http://localhost:1337');
			APIService.get('/getFlightDetails', queryParams, function (resData) {
				console.log('succccsesflights');
				//console.log(JSON.stringify(resData.data));
				if (resData.errormsg) {
					console.log(resData.errormsg);
				} else {
					this.setState({
						selected_flight: this.constructFlightOption(resData.data[0]),
						flight_selector: resData.data
					});
				}
			}.bind(this));
		}
	}

	readyToRecoveryAction = (legop_record) => {
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


			if (this.state.offload.length < 1) {
				errors.offload_error = 'select offload';
				this.setState({ errors });
			} else {
				errors.offload_error = '';
				this.setState({ errors });
			}
		}
		if (this.state.closing_status === custom.custom.awb_leg_ops_status.recovered) {
			if (!this.state.pieces) {
				errors.pieces_error = 'enter valid pieces';
				this.setState({ errors });
			} else {
				errors.pieces_error = '';
				this.setState({ errors });
			}

			if (!this.state.weight) {
				errors.weight_error = 'enter valid weight';
				this.setState({ errors });
			} else {
				errors.weight_error = '';
				this.setState({ errors });
			}
		}

		if (this.state.closing_status === custom.custom.awb_leg_ops_status.flight_delay) {
			if (this.state.flightDelayTime.getTime() < new Date(this.props.legop_record.awb_leg.planned_departure).getTime()) {
				errors.time_error = 'new departure date should be greater than current date';
				this.setState({ errors });
			} else {
				errors.time_error = '';
				this.setState({ errors });
			}

			if (!this.state.flightNo) {
				errors.flight_no_error = 'enter valid flight number';
				this.setState({ errors });
			} else {
				errors.flight_no_error = '';
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
			console.log('no errors' + error_count + ' ==> ' + JSON.stringify(this.state.errors));
			if (this.state.closing_status === custom.custom.awb_leg_ops_status.recovered) {
				APIService.post('/readyToRecovery', {
					awb_legop_id: legop_record.id,
					awb_leg_id: legop_record.awb_leg.id,
					reason: this.state.offload + '-' + this.state.reason,
					ba80_notes: this.state.ba80_notes,
					awb_no: legop_record.awb_no,
					station: legop_record.station,
					closing_status: this.state.closing_status,
					created_by: legop_record.awb_leg.created_by,
					from: legop_record.awb_leg.from,
					pieces: this.state.pieces,
					weight: this.state.weight,
					flightSelector: "",
					void_reason: this.state.offload + '-' + "",
					to: legop_record.awb_leg.to,
					CCA: this.state.cca,
				}, function (data, status) {
					if (data) {
						console.log(data);
					}
					else
						console.log(status);
				});
			} else {
				APIService.post('/readyToRecovery', {
					awb_legop_id: legop_record.id,
					awb_leg_id: legop_record.awb_leg.id,
					reason: this.state.offload + '-' + this.state.reason,
					ba80_notes: this.state.ba80_notes,
					awb_no: legop_record.awb_no,
					station: legop_record.station,
					closing_status: this.state.closing_status,
					flight_delay: Date.parse(this.state.flightDelayTime),
					flight_no: this.state.flightNo,
					created_by: legop_record.awb_leg.created_by,
					from: legop_record.awb_leg.from,
					flightSelector: this.state.selected_flight,
					void_reason: this.state.offload + '-' + this.state.void_reason,
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
			}
			this.onCloseModal();
		}
	}

	onCloseModal = (event) => {
		this.props.closeModal();
	}

	constructFlightOption = (flight) => {
		return flight.flight_no + "," + flight.exactdeparturetime + "," + flight.exactarrivaltime;
	}

	onChangePiecesHandle = (event) => {
		this.setState({ pieces: event });
	}

	onChangeWeightHandle = (event) => {
		this.setState({ weight: event });
	}

	onwardDateChange = (event) => {
		// this.setState({ flightDelayTime: flightDelayTime });
		console.log("getDate() " + this.state.flightDelayTime.getDate());
		this.state.flightDelayTime.setDate(new Date(this.props.legop_record.awb_leg.planned_departure).getDate()+parseInt(event.target.value));
		console.log(this.state.flightDelayTime);
	}
	onwardHourChange = (event) => {
		
		this.state.flightDelayTime.setHours(event.target.value);
		this.setState({ flightDelayTime: this.state.flightDelayTime });
		console.log(this.state.flightDelayTime);
		
	}
	onwardMinuteChange = (event) => {
		this.state.flightDelayTime.setMinutes(event.target.value);
		this.setState({ flightDelayTime: this.state.flightDelayTime });
		console.log(this.state.flightDelayTime);
	}

	flightNoChanged = (event) => {
		this.setState({ flightNo: event.target.value });
	}
	customerUpdate= (event) => {
		// console.log("checkbox change "+ this.state.checked);
		this.setState({ customerUpdate: !this.state.customerUpdate });
	}

	render() {
		// let modalSize = "xl";
		console.log('legop record in modal rendering' + JSON.stringify(this.state.legop_record.awb_no));
		let dateList=[]
		let hourList=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
		let minuteList=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,
		32,33,34,35,36,37,38,39,40,41,42,43,44,45,45,47,48,49,50,51,52,53,54,55,56,57,58,59,60]
		
		var d = new Date(this.state.legop_record.awb_leg.planned_departure);
		let date = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
		dateList.push(date)
		for(let i=0;i<10;i++){
			d.setDate(d.getDate()+1);
			date = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
			dateList.push(date);
		}
		
		return (
			<Observer>{() =>
				<div>
					<ModalHeader>  
						<h4 className="modal-title">
							<span>
								<i className="fa fa-delete"></i>
							</span>
							<label className="ml-2" id="readyToRecoveryModalEditTitle">Ready To Recovery
								<NavigationButton awb_no={this.state.legop_record.awb_no} tabNumber={this.state.tabNumber} MainStore={this.props.MainStore} onCloseModal={this.onCloseModal} />
								<span>-<PriorityClass PriorityClass={this.state.priorityClass} /></span></label>
						</h4>
					</ModalHeader>  
					<ModalBody>  
						<AWBLegDetails AWBLegDetails={this.state.legop_record.awb_leg} />
						<ReasonBA80Details reason={this.reason} errors={this.state.errors} setStateReason={this.setStateReason} setStateBA80={this.setStateBA80} error_reason={this.state.error_reason} ba80_notes={this.ba80_notes} closing_ba80_notes_error={this.state.errors.closing_ba80_notes_error} closing_reason_error={this.state.errors.closing_reason_error} />
						<label className="col-md-12">Select Closing Status</label>
						{this.state.legop_record.awb_info.priority_class === "F_CLASS" &&
							<RadioOptions options={['ASSIGN_FLIGHT_TO_RECOVERY', 'P1_ESCALATION', 'ESCALATION', 'RECOVERED', 'FLIGHT_DELAY']} optionSelected={this.setClosingStatus} />
						}
						{this.state.legop_record.awb_info.priority_class === "M_CLASS" &&
							<RadioOptions options={['ASSIGN_FLIGHT_TO_RECOVERY', 'P2_ESCALATION', 'P1_ESCALATION', 'ESCALATION', 'RECOVERED', 'FLIGHT_DELAY']} optionSelected={this.setClosingStatus} />
						}
						<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
							{this.state.errors.closing_status_error ? this.state.errors.closing_status_error : ""}
						</label>
						{
							this.state.closing_status !== custom.custom.awb_leg_ops_status.recovered &&
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
						}
						{
							this.state.closing_status === custom.custom.awb_leg_ops_status.recovered &&
							<PiecesWeightDetails awb_leg_pieces={this.state.legop_record.awb_leg.pieces} setStateReason={this.setStateReason} pieces={this.onChangePiecesHandle} errors={this.state.errors} weight={this.onChangeWeightHandle} pieces_error={this.state.errors.pieces_error} weight_error={this.state.errors.weight_error}/>
						}
						<div>
							
							<CCAMultiReason ccaCallback={this.callbackCCA}/>
							{/* <NEWADD  ccaCallback={this.callbackCCA}/> */}
						</div>
						{
							this.state.closing_status == custom.custom.awb_leg_ops_status.flight_delay &&
							<div>
								<label>Select new flight time and new flight number</label>
								<div className="row">
									<div className="col-md-5 input-group">
										<div className="input-group-prepend">
											<span className="input-group-text bg-danger">
												<i className="mdi mdi-clock text-light"></i>
											</span>
										</div>
										<select className="p-0 select3 form-control custom-select browser-default" id="readyToRecoveryModalOnwardFlightDateChanged" type="text" onChange={this.onwardDateChange}>
											{
												dateList.map((date,index) => {
													return <option value={index}>{date}</option>
												})
											}
										</select>
										<select value={this.state.flightDelayTime.getHours()} className="p-0 select3 form-control custom-select browser-default" id="readyToRecoveryModalOnwardFlightTimeChanged" type="text" onChange={this.onwardHourChange}>
											{
												hourList.map((date) => {
													return <option value={date}>{date}</option>
												})
											}

										</select>
										<select value={this.state.flightDelayTime.getMinutes()} className="p-0 select3 form-control custom-select browser-default" id="readyToRecoveryModalOnwardFlightMinuteChanged" type="text" onChange={this.onwardMinuteChange}>
											{
												minuteList.map((date) => {
													return <option value={date}>{date}</option>
												})
											}

										</select>
									</div>
									<div className="col-md-5 input-group">
										<div className="input-group-prepend">
											<span className="input-group-text bg-danger">
												<i className="fas fa-plane text-light"></i>
											</span>
										</div>
										<input contenteditable="true" type="text" id="flightName" name="flightName" value={this.state.flightNo} placeholder="Change Flight No" onChange={this.flightNoChanged}/>
										
									</div>
								</div>
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.time_error ? this.state.errors.time_error : ""}
								</label>
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.flight_no_error ? this.state.errors.flight_no_error : ""}
								</label>
							</div>
						}
						{
							this.state.closing_status !== custom.custom.awb_leg_ops_status.assign_flight_to_recovery &&
							<div>
							</div>
						}
						{
							this.state.closing_status === custom.custom.awb_leg_ops_status.assign_flight_to_recovery &&
							<div>
								<OffloadMultiSelect offloadCallback={this.callbackOffload} />
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.offload_error ? this.state.errors.offload_error : ""}
								</label>
								<input className="col-md-12" id="readyToRecoveryModalVoidReasonInput" placeholder="Enter reason for assigning another flight" type="text" name="readyToRecoveryModalVoidReasonInput" autocomplete="off" required="" onChange={this.void_reason}></input>
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
										<select className="p-0 select3 form-control custom-select browser-default" id="readyToRecoveryModalStationSourceSelect" type="text">
											<option value={this.state.legop_record.awb_leg.from}>{this.state.legop_record.awb_leg.from}</option>
										</select>
										<select className="p-0 select3 form-control custom-select browser-default" id="readyToRecoveryModalStationDestinationSelect" type="text" onChange={this.destinationChanged}>
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
										<select className="select2 form-control custom-select my-auto" id="readyToRecoveryModalFlightsSelector" type="text" placeholder="Select flight" name="readyToRecoveryModalFlightsSelector" onChange={this.flightChanged}>
											{
												this.state.flight_selector.map((flight) => {
													return <option value={this.constructFlightOption(flight)}>{window.moment(flight.exactdeparturetime).format("DD/MM/YYYY HH:mm")} [{flight.flight_no}]</option>
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
					<OperationModalLockableFooter MainStore={this.props.MainStore} lockedOpsData={this.props.lockedOpsData} awbLegOp={this.props.legop_record} onCloseModal={this.onCloseModal} name={"readyToRecoveryModalAction"} onClickHandler={() => this.readyToRecoveryAction(this.state.legop_record)} text={"SAVE"}/>
 
				</div>

			}</Observer>

		);
	}
}
export default ReadyToRecoveryModal;