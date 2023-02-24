import React, { Component } from "react";
import {Observer} from 'mobx-react';
import APIService from "../APIService.js"
export default class FlightSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			source: props.station,
			destination: 'LHR',
			selectedFlight: '',
			flightSelector:[],
		}
	}

	reason = (event) => {
		this.setState({reason: event.target.value});
	}

	ba80_notes = (event) => {
		this.setState({ba80_notes: event.target.value});
	}

	sourceChanged = (event) => {
		this.setState({source: event.target.value});
	}

	destinationChanged = (event) => {
		this.setState({destination: event.target.value});
		//this.updateFlightsFlightSelector(event.target.value);
	}
	
	flightChanged = (event) => {
		// this.setState({selectedFlight: event.target.value});
		
		this.call_selectFlight(event.target.value);
		
		// console.log( '--flights details--'+ flightDetails );
		// console.log( '--flights number --'+ flightNumber +'--'+FlightTime);
		
		//this.props.selectFlight(flightSelectorDetails);
	}

	call_selectFlight = (flightDetails) => {
		let flightSelectorDetails= {flightDetails: flightDetails};
		flightSelectorDetails.source = this.state.source;
		flightSelectorDetails.destination = this.state.destination;

		this.props.selectFlight(flightSelectorDetails);
	}

	updateFlightsFlightSelector = (source, destination) => {
		if (!source || !destination) {
			window.swal_error('source or destination is missing');
		} else {
			if(this.props.planner_socket) {
				let queryParams = {source: source, destination: destination};
				// let mySocket = io.sails.connect('http://localhost:1337');
				APIService.get('/getFlightDetails',queryParams, function (resData) {
					if(resData.errormsg) {
						console.log(resData.errormsg);
					} else if (resData.data.length > 0) {
						let now = Date.now();
						for(let i = 0; i < resData.data.length; i++) {
							if(resData.data[i].exactdeparturetime > now) {
								this.call_selectFlight(this.constructFlightOption(resData.data[i]));
								break;
							}
						}
						this.setState({flightSelector: resData.data});
						window.swal_close();
					} else {
						window.swal_error("There are no flights between " + source + ' - ' + destination);
					}
				}.bind(this));
			} else {
				console.log('socket is not connected');
			}
		}
	}

	constructFlightOption = (flight) => {
		return flight.flight_no + "," + flight.exactdeparturetime + "," + flight.exactarrivaltime;
	}

	componentDidMount() {
		this.updateFlightsFlightSelector(this.state.source, this.state.destination)
	}

	componentDidUpdate(prevProps) {
		if(prevProps.station !== this.props.station) {
			window.swal_info("Please wait while we switch you to " + this.props.station);
			this.setState({source: this.props.station});
			this.updateFlightsFlightSelector(this.props.station, this.state.destination);
		}

		if(prevProps.planner_socket !== this.props.planner_socket) {
			this.updateFlightsFlightSelector(this.props.station, this.state.destination);
		}
	}

	render() {

		let optionSelected = false;

		return (
			<div className="card p-2 my-2 alert-info border border-info">
				<div className="row">
					<div className="col-md-6 input-group">
						<div className="input-group-prepend">
							<span className="input-group-text bg-danger">
								<i className="mdi mdi-map-marker text-light"></i>
							</span>
						</div>
						<select className="select2 form-control custom-select browser-default" id="flightSelectorStationSourceSelect" type="text" onChange={this.sourceChanged}>
							<option>{this.state.source}</option>
						</select>
						<select className="select2 form-control custom-select browser-default" id="flightSelectorStationDestinationSelect" type="text" onChange={this.destinationChanged}>
							<option>LHR</option>
						</select>
					</div>
					<div className="col-md-6 input-group">
						<div className="input-group-prepend">
							<span className="input-group-text bg-danger">
								<i className="fas fa-plane text-light"></i>
							</span>
						</div>
						<select className="select2 form-control custom-select my-auto" id="flightSelectorFlightsSelector" type="text" placeholder="Select flight" name="flightSelectorFlightsSelector" onChange={this.flightChanged}>
							{
								this.state.flightSelector.map((flight,id)=>{
									let now_time = Date.now();
									let option = {};

									option.value = this.constructFlightOption(flight);
									option.text = (window.moment(flight.exactdeparturetime).format("DD/MM/YYYY HH:mm") + ' ['+ flight.flight_no + ']');
									option.class = flight.exactdeparturetime > now_time ? 'text-success' : 'text-danger';
									
									if(flight.exactdeparturetime > now_time) {
										option.selected = (optionSelected === false);
										optionSelected = true;
										option.class = 'text-info';
										option.text += ' - Upcoming';
									}

									return (<option key={id} selected={option.selected} className={option.class} value= {option.value} >{option.text}</option>);

									// return (<option value={flight.flight_no + "," + flight.exactdeparturetime + "," + flight.exactarrivaltime}>{moment(flight.exactdeparturetime).format("DD/MM/YYYY HH:mm")} [{flight.flight_no}]</option>);
								})
							}
						</select>
					</div>
				</div>
			</div>
		);
	}
}