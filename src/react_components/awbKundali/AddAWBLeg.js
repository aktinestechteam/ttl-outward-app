import React from "react";
import axios from 'axios';
import APIService from "../APIService";

export default class AddAWBLeg extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			blank_awb_leg: props.blank_awb_leg,
			planned_pieces: 0,
			planned_weight: 0,
			flight_selector: [],
			// station_selector: [],
			station_record: {tz: "Asia/Kolkata"},
			selected_destination: "",
			selected_flight:"",
			errors:{planned_pieces_error: '', planned_weight_error: ''},
		}
	}

	componentDidMount() {
		// this.updateStationsAWBKundaliModal();
		let station_record = window.station_records.find(station => station.iata === this.state.blank_awb_leg.from);

		if(station_record) {
			this.setState({station_record});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log(JSON.stringify(nextProps))
		console.log(JSON.stringify(nextState))
		if (nextProps !== nextState) {
			nextState.blank_awb_leg = nextProps.blank_awb_leg;
			return true;
		}
		return true;
	}

	planAWBLeg = () => {
		let selected_flight = this.state.selected_flight;
		let flight_details = selected_flight.split(",");
		let flight_time = Number(flight_details[1]);
		
		if(flight_time > Date.now()){
			let errors = this.state.errors;
		
			if(!this.state.planned_pieces){
				errors.planned_pieces_error= 'required field';
				this.setState({errors});
			} else{
				errors.planned_pieces_error = '';
				this.setState({errors});
			}
			if(!this.state.planned_weight){
				errors.planned_weight_error= 'required field';
				this.setState({errors});
			} else{
				errors.planned_weight_error = '';
				this.setState({errors});
			}

			let error_count = Object.keys(errors).filter((key) =>{
				if(errors[key]){
					return true;
				} 
					return false;
			}).length;
			if (error_count > 0){
				console.log('yes errors'+ error_count + ' ==> '+ JSON.stringify(this.state.errors))
			} else{
				console.log('no errors'+ error_count + ' ==> '+ JSON.stringify(this.state.errors));
				let data = new FormData()
				data.append('awb_leg_id', this.state.blank_awb_leg.id)
				data.append('to', this.state.selected_destination)
				data.append('from', this.state.blank_awb_leg.from)
				data.append('pieces', this.state.planned_pieces)
				data.append('weight', this.state.planned_weight)
				data.append('station', this.state.blank_awb_leg.station)
				data.append('awb_no', this.state.blank_awb_leg.awb_no)
				data.append('created_by', "XXXXXXXXTODO-FROM-KUNDALI-XXXXXXXXXXXXXX")
				data.append('flightsSelectorModal', this.state.selected_flight)
				// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/addAwbLeg`, data, JwtToken.getJwtTokenHeader())
				APIService.post('/addAwbLeg', data,
				res => {
					if(res.data){
						this.props.getAWBKundaliData(this.state.blank_awb_leg.awb_no);
						window.swal_success('The Leg is Planned successfully');
							this.setState({planned_weight:""})		
							this.setState({planned_pieces:""})		
						console.log(res);
					}
				})
			}
		} else {
			window.swal_error('This flight has already departed');
		}
		// this.props.getAWBKundaliData(this.state.blank_awb_leg.awb_no);
	}

	destinationChanged = (event) => {
		this.setState({selected_destination: event.target.value});
		console.log("going "+ event.target.value);
		this.updateFlightsAWBKundaliModal(event.target.value);
	}
	piecesChanged = (event) => {
		// this.setState({planned_pieces: event.target.value});
		let remaining_pieces = Math.abs(this.state.blank_awb_leg.pieces);
		let errors = this.state.errors;
		let rules = [{text: event.target.value,	regex_name: 'min_number', 	 errmsg: 'Please enter minimum 1 Piece' + (remaining_pieces > 1 ? ' & maximum ' + remaining_pieces + ' pieces' : ''), min: 1, required: true},{text: event.target.value,	regex_name: 'max_number', 	 errmsg: 'Maximum pieces to enter are '+ remaining_pieces , max: remaining_pieces, required: true}];
		let isValidatedToBePlanned = window.validate(rules );
		console.log('isValidatedToBePlanned ' + JSON.stringify(isValidatedToBePlanned));
		if(isValidatedToBePlanned.errmsg){
			errors.planned_pieces_error= isValidatedToBePlanned.errmsg;
			this.setState({errors});
		} else{
			errors.planned_pieces_error = '';
			this.setState({errors});
			this.setState({planned_pieces: event.target.value});
		}
	}

	weightChanged = (event) => {
		// this.setState({planned_weight: event.target.value});
		let errors = this.state.errors;
		let rules = [{text: event.target.value, regex_name: 'min_number', 	 errmsg: 'Please enter weight more than 0 Kg.', min: 0.0001, required: true},{text: event.target.value, regex_name: 'any_number', 	 errmsg: 'Please enter proper weight values', allow_decimal: true, required: true}];
		let isValidatedToBePlanned = window.validate(rules );
		console.log('isValidatedToBePlanned ' + JSON.stringify(isValidatedToBePlanned));
		if(isValidatedToBePlanned.errmsg){
			errors.planned_weight_error= isValidatedToBePlanned.errmsg;
			this.setState({errors});
		} else{
			errors.planned_weight_error = '';
			this.setState({errors});
			this.setState({planned_weight: event.target.value});
		}
	}

	flightChanged = (event) => {
		this.setState({selected_flight: event.target.value});
	}

	updateFlightsAWBKundaliModal = (destination_value) => {
		let source = this.state.blank_awb_leg.from;
		let destination = destination_value;

		if (!source || !destination){
			window.swal_error('source or destination is missing');
		} else {
			// JwtToken.axiosget('/getFlightDetails', {source: source, destination: destination})
			// let token=JwtToken.getPlainJwtToken();
			// axios.get(`${process.env.REACT_APP_API_BASE_PATH}/getFlightDetails`, {
			// 	params: {source: source, destination: destination},
			// 	headers:{
			// 		'Authorization': `Bearer ${token}`
			// 	}
				
			// })
			APIService.get('/getFlightDetails', {source: source, destination: destination},
			function (response) {
				console.log('succccsesflights');
				console.log(JSON.stringify(response));
				if(response.errormsg) {
					console.log(response.errormsg);
				} else {
					if(response.data.length === 0) {
						window.swal_error("There are no flights between \n" + source + " - " + destination);
					}
					this.setState({
						selected_flight: response.data.length === 0 ? "" : this.constructFlightOption(response.data[0]),
						flight_selector: response.data
					});
				}
			}.bind(this));
		}
	}

	constructFlightOption = (flight) => {
		return flight.flight_no + "," + flight.exactdeparturetime + "," + flight.exactarrivaltime;
	}

	// updateStationsAWBKundaliModal = () => {
	// 	let mySocket = io.sails.connect('http://localhost:1337');
	// 		mySocket.get('/getStations', function (resData) {
	// 	axios.get('/http://localhost:1337/getFlightDetails', {
	// 		queryParams: {source: source, destination: destination}
	// 	}).then(function (response) {
	// 		console.log('succccsesforstations');
	// 		//console.log(JSON.stringify(resData));
	// 		if(resData.errormsg) {
	// 			console.log(resData.errormsg);
	// 		} else {
	// 			this.setState({station_selector: resData.data});
	// 		}
	// 	}.bind(this));
	// }
	
	render() {
		let piecesId = (this.state.blank_awb_leg.id + "awbKundaliModalPiecesInput");
		let weightId = (this.state.blank_awb_leg.id + "awbKundaliModalWeightInput");
		return(
			<div className="row mx-auto">
				<div className="col-md-3 input-group my-auto">
					<div className="input-group-prepend">
						<span className="input-group-text bg-primary">
							<i className="mdi mdi-map-marker text-light"></i>
						</span>
					</div>

					<select className="p-0 select3 form-control custom-select browser-default" id="awbKundaliModalStationSourceSelect" type="text">
						<option value={this.state.blank_awb_leg.from}>{this.state.blank_awb_leg.from}</option>
					</select>
					<select className="p-0 select3 form-control custom-select browser-default" id="awbKundaliModalStationDestinationSelect" type="text" onChange={this.destinationChanged}>
						{
						window.station_records.map((station,id)=>{
								return <option value={station.iata} key={id}>{station.iata} - {station.name}</option>
							})
						}
						
					</select>

				</div>
				
				<div className="col-md-3 input-group my-auto">
					<div className="input-group-prepend">
						<span className="input-group-text bg-primary">
							<i className="fas fa-plane text-light"></i>
						</span>
					</div>
					<select className="select2 form-control custom-select my-auto" id="awbKundaliModalFlightsSelector" type="text" placeholder="Select flight" name="awbKundaliModalFlightsSelector" onChange={this.flightChanged}>
						{this.state.flight_selector &&
							this.state.flight_selector.map((flight,index)=>{
								return <option key={index} value={this.constructFlightOption(flight)}>{window.moment.tz(flight.exactdeparturetime, this.state.station_record.tz).format("DD/MM/YYYY HH:mm")} [{flight.flight_no}]{Date.now()>window.moment(flight.exactdeparturetime)?" (Departed)":""}</option>
							})
						}
					</select>
				</div>
				<div className="col-md-2">
					<input className="form-control form-white" id={piecesId} placeholder="Enter Pieces" type="text" name={piecesId} value={this.state.planned_pieces} onChange={this.piecesChanged}></input>
					{this.state.errors.planned_pieces_error &&
						<span className='text-warning'>{this.state.errors.planned_pieces_error}</span>
					}
				</div>
				<div className="col-md-2">
					<input className="form-control form-white" id={weightId} placeholder="Enter Weight" type="text" name={weightId} value={this.state.planned_weight} onChange={this.weightChanged}></input>
					{this.state.errors.planned_weight_error &&
						<span className='text-warning'>{this.state.errors.planned_weight_error}</span>
					}
				</div>

				<button className="col-md-1 btn btn-primary my-auto" onClick={this.planAWBLeg} id="awbKundaliModalPlanLegBtn" type="button" disabled={this.state.selected_flight.length === 0}>Plan</button>
			</div>
		);
	}
}