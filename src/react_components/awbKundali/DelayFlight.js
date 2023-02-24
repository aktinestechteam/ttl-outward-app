import React, { Component } from "react";
import custom from '../../config/custom.js';
// import OffloadMultiSelect from './OffloadMultiSelect.js';
import { Observer } from "mobx-react"
// import RadioOptions from "../shared/RadioOptions.js";
// import AWBLegDetails from "./AWBLegDetails.js"
// import CCAMultiSelect from './CCAMultiSelect.js';
// import PriorityClass from "../shared/PriorityClass.js";
// import ReasonBA80Details from "./ReasonBA80Details.js";
// import NavigationButton from "../shared/NavigationButton.js";
// import PiecesWeightDetails from "../shared/PiecesWeightDetails.js";
// import ModalHeader from 'react-bootstrap/ModalHeader';
// import ModalBody from 'react-bootstrap/ModalBody'
// import ModalFooter from 'react-bootstrap/ModalFooter'
// import OperationModalLockableFooter from "../shared/OperationModalLockableFooter.js";
// import CCAReasonAdd from "../shared/CCAReasonAdd.js";
import APIService from "../APIService"
class DelayFlight extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flightNo: props.awb_leg.flight_no,
			flightDelayTime: new Date(props.awb_leg.planned_departure),
			awb_leg: props.awb_leg,
			void_reason: "",
			errors: {time_error: '', flight_no_error: '' },
			showDelayModal: false
		}
	}

	delayFlight = () => {
		let errors = this.state.errors;

		if (this.state.flightDelayTime.getTime() < new Date(this.props.awb_leg.planned_departure).getTime()) {
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
			// this.setState({showDelayModal: false});
			let self=this;
			APIService.post('/delayFlight', {
				awb_leg_id: this.props.awb_leg.id,
				awb_no: this.props.awb_leg.awb_no,
				station: this.props.awb_leg.station,
				flight_delay: Date.parse(this.state.flightDelayTime),
				flight_no: this.state.flightNo,
				created_by: "System",
				from: this.props.awb_leg.from,
				to: this.props.awb_leg.to,
			}, function (data, status) {
				if (data) {
					console.log(data);
					window.swal_success('Flight Delayed');
					self.props.delayLeg(data)
				}
				else
					console.log(status);
			});
			// this.setState({showDelayModal: false});
		}
	}

	flightNoChanged = (event) => {
		this.setState({ flightNo: event.target.value });
	}
	showDelayModal = () =>{
		this.setState({showDelayModal: true});
	}

	onwardDateChange = (event) => {
		// this.setState({ flightDelayTime: flightDelayTime });
		console.log("getDate() " + this.state.flightDelayTime.getDate());
		this.state.flightDelayTime.setDate(new Date(this.props.awb_leg.planned_departure).getDate()+parseInt(event.target.value));
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

	render() {
		// let modalSize = "xl";
		console.log('flight delay' + JSON.stringify(this.props.awb_leg.awb_no));
		let dateList=[]
		let hourList=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
		let minuteList=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,
		32,33,34,35,36,37,38,39,40,41,42,43,44,45,45,47,48,49,50,51,52,53,54,55,56,57,58,59,60]
		
		var d = new Date(this.props.awb_leg.planned_departure);
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
					{this.state.showDelayModal?
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
									<div className="col-md-3 input-group">
										<div className="input-group-prepend">
											<span className="input-group-text bg-danger">
												<i className="fas fa-plane text-light"></i>
											</span>
										</div>
										<input contenteditable="true" type="text" id="flightName" name="flightName" value={this.state.flightNo} placeholder="Change Flight No" onChange={this.flightNoChanged}/>
										
									</div>
									<button className="col-md-2 btn btn-danger m-auto" onClick={this.delayFlight}> Confirm Delay Flight </button>
									
								</div>
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.time_error ? this.state.errors.time_error : ""}
								</label>
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.flight_no_error ? this.state.errors.flight_no_error : ""}
								</label>
							</div>
						:
						<button className="col-md-2 btn btn-danger" onClick={this.showDelayModal}> Delay Flight</button>
					}
			
			</div>
			}</Observer>

		);
	}
}
export default DelayFlight;