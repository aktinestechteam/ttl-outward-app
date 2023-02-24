import React, { Component } from "react";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "./react-datepicker.css";
import APIService from "../APIService";

export default class AddNewFlightModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// route: '',
			season: props.selectedSeason,
			createdby:'manual',
			flight_no: '',
			source_station: '',
			destination_station: '',
			arrival_day: '',
			start_date: new Date(),
			// start_date2_for_departure_day: '',
			dep_time_hrs: '',
			dep_time_min: '',
			arr_time_hrs: '',
			arr_time_min: '',
			vehicle_no: '',
			errors: {route_error: '', season_error: '', flight_no_error: '', vehicle_no_error: '',source_station_error: '', destination_station_error: '', arrival_day_error: '', start_date_error: '', start_date2_for_departure_day_error: '', dep_time_hrs_error: '', dep_time_min_error: '', arr_time_hrs_error: '', arr_time_min_error: '', },
		}
	}

	componentDidMount() {
		if (this.state.season === ''){
			this.onCloseModal();
			window.swal_error('Please select season first')
		}
	}

	sourceChanged = (event) => {
		this.setState({source_station: event.target.value});
	}

	destinationChanged = (event) => {
		this.setState({destination_station: event.target.value});
	}

	flightNo = (event) => {
		let errors = this.state.errors;
		let rules = [{text: event.target.value,	regex_name: 'free_text', 	 errmsg: 'Please Enter Flight Number ', min: 4, required: true}];
		let isValidatedFlightNo = window.validate(rules );
		console.log('isValidatedFlightNo ' + JSON.stringify(isValidatedFlightNo));
		if(isValidatedFlightNo.errmsg){
			errors.flight_no_error= isValidatedFlightNo.errmsg;
			this.setState({errors});
		} else{
			errors.flight_no_error = '';
			this.setState({errors});
			this.setState({flight_no: event.target.value});
		}
	}

	vehicleNo = (event) => {
		let errors = this.state.errors;
		let rules = [{text: event.target.value,	regex_name: 'free_text', 	 errmsg: 'Please Enter Vehicle Number', min: 3, required: true}];
		let isValidatedVehicle = window.validate(rules );
		console.log('isValidatedVehicle ' + JSON.stringify(isValidatedVehicle));
		if(isValidatedVehicle.errmsg){
			errors.vehicle_no_error= isValidatedVehicle.errmsg;
			this.setState({errors});
		} else{
			errors.vehicle_no_error = '';
			this.setState({errors});
			this.setState({vehicle_no: event.target.value});
		}
	}

	arrivalDay = (event) => {
		this.setState({arrival_day: event.target.value});
	}

	deptTimeHrs = (event) => {
		this.setState({dep_time_hrs: event.target.value});
	}

	deptTimeMin = (event) => {
		this.setState({dep_time_min: event.target.value});
	}

	arrTimeHrs = (event) => {
		this.setState({arr_time_hrs: event.target.value});
	}

	arrTimeMin = (event) => {
		this.setState({arr_time_min: event.target.value});
	}


	handleDateChange = (date) => {
		this.setState({
			start_date: date
		});
	}

	addNewFlightAction = () =>{
		let errors = this.state.errors;
		
		if(!this.state.source_station){
			errors.source_station_error= 'select source';
			this.setState({errors});
		} else{
			errors.source_station_error = '';
			this.setState({errors});
		}

		if(!this.state.destination_station){
			errors.destination_station_error= 'select destination';
			this.setState({errors});
		} else{
			errors.destination_station_error = '';
			this.setState({errors});
		}

		if(!this.state.flight_no){
			errors.flight_no_error= 'required field';
			this.setState({errors});
		} else{
			errors.flight_no_error = '';
			this.setState({errors});
		}

		if(!this.state.vehicle_no){
			errors.vehicle_no_error= 'required field';
			this.setState({errors});
		} else{
			errors.vehicle_no_error = '';
			this.setState({errors});
		}

		if(!this.state.start_date){
			errors.start_date_error= 'Select Date';
			this.setState({errors});
		} else{
			errors.start_date_error = '';
			this.setState({errors});
		}

		if(!this.state.arrival_day){
			errors.arrival_day_error= 'select arrivle day';
			this.setState({errors});
		} else{
			errors.arrival_day_error = '';
			this.setState({errors});
		}

		if(!this.state.dep_time_hrs){
			errors.dep_time_hrs_error= 'select hrs';
			this.setState({errors});
		} else{
			errors.dep_time_hrs_error = '';
			this.setState({errors});
		}

		if(!this.state.dep_time_min){
			errors.dep_time_min_error= 'select minutes';
			this.setState({errors});
		} else{
			errors.dep_time_min_error = '';
			this.setState({errors});
		}

		if(!this.state.arr_time_hrs){
			errors.arr_time_hrs_error= 'select hrs';
			this.setState({errors});
		} else{
			errors.arr_time_hrs_error = '';
			this.setState({errors});
		}

		if(!this.state.arr_time_min){
			errors.arr_time_min_error= 'select minutes';
			this.setState({errors});
		} else{
			errors.arr_time_min_error = '';
			this.setState({errors});
		}

		let error_count = Object.keys(errors).filter((key) =>{
			if(errors[key]){
				return false;
			} 
				return true;
		}).length;
		let error_type_count = Object.keys(errors).length;
		if (error_count < error_type_count){
			console.log('yes errors'+ error_count + ' ==> '+ JSON.stringify(this.state.errors))
		} else{
			console.log('no errors'+ error_count + ' ==> '+ JSON.stringify(this.state.errors));
			let data = new FormData()
			data.append('season', this.state.season)
			data.append('createdby', this.state.createdby)
			data.append('flight_no', this.state.flight_no)
			data.append('vehicle_no', this.state.vehicle_no)
			data.append('source_station', this.state.source_station)
			data.append('destination_station', this.state.destination_station)
			data.append('arrival_day', this.state.arrival_day)
			data.append('start_date', (this.state.start_date).getTime())
			data.append('start_date2_for_departure_day', this.state.start_date)
			data.append('dep_time_hrs', this.state.dep_time_hrs)
			data.append('dep_time_min', this.state.dep_time_min)
			data.append('arr_time_hrs', this.state.arr_time_hrs)
			data.append('arr_time_min', this.state.arr_time_min)
			// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/addFlight`, data, 
			// 	// receive two    parameter endpoint url ,form data
			// 	JwtToken.getJwtTokenHeader()
			// )
			APIService.post('/addFlight', data,
			res => { // then print response status
				console.log(res.result)
				window.swal_success("Flight added successfully");
			})
			this.onFetchTableData();
		}
	}

	onCloseModal = (event) =>{
		this.props.closeAddNewFlightModal();
	}
	
	onFetchTableData = (event) =>{
		this.props.fetchTableData();
	}

	render() {
		
		return (
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h4 className="modal-title">
							<i className="mdi mdi-airplane" id="addNewFlightModalTitle"> Add New Flight ({this.state.season})</i>
						</h4>
						<button className="close" type="button" onClick={this.onCloseModal}>×</button>
					</div>
					<div className="modal-body">
						<div className="row">
							<div className="col-lg-6" id="addNewFlightModalSource">
								<label className="control-label">Source</label>
								<select className="p-0 select3 form-control custom-select browser-default" id="addNewFlightModalSourceSelect" type="text" onChange={this.sourceChanged}>
								{
									window.station_records.map((station)=>{
										return <option value={station.iata}>{station.iata}</option>
									})
								}
								</select>
							</div>
							<div className="col-lg-6" id="addNewFlightModalDestination">
								<label className="control-label">Destination</label>
								<select className="p-0 select3 form-control custom-select browser-default" id="addNewFlightModalDestinationSelect" type="text" onChange={this.destinationChanged}>
								{
									window.station_records.map((station)=>{
										return <option value={station.iata}>{station.iata}</option>
									})
								}
								</select>
							</div>
						</div>
						<div className="row">
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.source_station_error ? this.state.errors.source_station_error : ""}
							</label>
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.destination_station_error ? this.state.errors.destination_station_error : ""}
							</label>
						</div>
						<div className="row">
							<div className="col-lg-6">
								<label className="control-label">Flight No</label>
								<input className="form-control form-white" id="addNewFlightModalFlightNoInput" placeholder="Enter flight number" type="text"  required="" onChange={this.flightNo}/>
							</div>
							<div className="col-lg-6">
								<label className="control-label">Vehicle</label>
								<input className="form-control form-white" id="addNewFlightModalVehicleInput" placeholder="Enter Vehicle" type="text" required="" onChange={this.vehicleNo}/>
							</div>
						</div>
						<div className="row">
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.flight_no_error ? this.state.errors.flight_no_error : ""}
							</label>
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.vehicle_no_error ? this.state.errors.vehicle_no_error : ""}
							</label>
						</div>
						<div className="row">
							<div className="col-lg-6">
								<div id="addNewFlightModalStartDateDatePicker">
									<label className="control-label">Start Date</label>
									<DatePicker
										selected={this.state.start_date}
										onChange={this.handleDateChange}
									/>
								</div>
							</div>
							<div className="col-lg-6">
								<div id="addNewFlightModalArrivalDay">
									<label className="control-label">Arrival Day</label>
									<select className="select2 form-control custom-select browser-default" id="addNewFlightModalArrivalDaySelect" type="text" onChange={this.arrivalDay}>
										<option>Select Day</option>
										<option value='0'>0</option>
										<option value='1'>1</option>
										<option value='2'>2</option>
										<option value='3'>3</option>
										<option value='4'>4</option>
									</select>
								</div>
							</div>
						</div>
						<div className="row">
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.start_date_error ? this.state.errors.start_date_error : ""}
							</label>
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.arrival_day_error ? this.state.errors.arrival_day_error : ""}
							</label>
						</div>
						<div className="row">
							<div className="col-lg-6">
								<label className="control-label">Local Departure Time</label>
							</div>
							<div className="col-lg-6">
								<label className="control-label">Local Arrival Time  </label>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-3">
								<select className="form-control form-white" id="addNewFlightModalDepartureTimeHours" onChange={this.deptTimeHrs}>
									<option>-</option>
									<option value='00'>00</option>
									<option value='01'>01</option>
									<option value='02'>02</option>
									<option value='03'>03</option>
									<option value='04'>04</option>
									<option value='05'>05</option>
									<option value='06'>06</option>
									<option value='07'>07</option>
									<option value='08'>08</option>
									<option value='09'>09</option>
									<option value='10'>10</option>
									<option value='11'>11</option>
									<option value='12'>12</option>
									<option value='13'>13</option>
									<option value='14'>14</option>
									<option value='15'>15</option>
									<option value='16'>16</option>
									<option value='17'>17</option>
									<option value='18'>18</option>
									<option value='19'>19</option>
									<option value='20'>20</option>
									<option value='21'>21</option>
									<option value='22'>22</option>
									<option value='23'>23</option>
								</select>
							</div>
							<div className="col-lg-3">
								<select className="form-control form-white" id="addNewFlightModalDepartureTimeMinutesSelect" onChange={this.deptTimeMin}>
									<option>-</option>
									<option value='00'>00</option>
									<option value='01'>01</option>
									<option value='02'>02</option>
									<option value='03'>03</option>
									<option value='04'>04</option>
									<option value='05'>05</option>
									<option value='06'>06</option>
									<option value='07'>07</option>
									<option value='08'>08</option>
									<option value='09'>09</option>
									<option value='10'>10</option>
									<option value='11'>11</option>
									<option value='12'>12</option>
									<option value='13'>13</option>
									<option value='14'>14</option>
									<option value='15'>15</option>
									<option value='16'>16</option>
									<option value='17'>17</option>
									<option value='18'>18</option>
									<option value='19'>19</option>
									<option value='20'>20</option>
									<option value='21'>21</option>
									<option value='22'>22</option>
									<option value='23'>23</option>
									<option value='24'>24</option>
									<option value='25'>25</option>
									<option value='26'>26</option>
									<option value='27'>27</option>
									<option value='28'>28</option>
									<option value='29'>29</option>
									<option value='30'>30</option>
									<option value='31'>31</option>
									<option value='32'>32</option>
									<option value='33'>33</option>
									<option value='34'>34</option>
									<option value='35'>35</option>
									<option value='36'>36</option>
									<option value='37'>37</option>
									<option value='38'>38</option>
									<option value='39'>39</option>
									<option value='40'>40</option>
									<option value='41'>41</option>
									<option value='42'>42</option>
									<option value='43'>43</option>
									<option value='44'>44</option>
									<option value='45'>45</option>
									<option value='46'>46</option>
									<option value='47'>47</option>
									<option value='48'>48</option>
									<option value='49'>49</option>
									<option value='50'>50</option>
									<option value='51'>51</option>
									<option value='52'>52</option>
									<option value='53'>53</option>
									<option value='54'>54</option>
									<option value='55'>55</option>
									<option value='56'>56</option>
									<option value='57'>57</option>
									<option value='58'>58</option>
									<option value='59'>59</option>
								</select>
							</div>
							<div className="col-lg-3">
								<select className="form-control form-white" id="addNewFlightModalArrivalTimeHoursSelect" onChange={this.arrTimeHrs}>
									<option>-</option>
									<option value='00'>00</option>
									<option value='01'>01</option>
									<option value='02'>02</option>
									<option value='03'>03</option>
									<option value='04'>04</option>
									<option value='05'>05</option>
									<option value='06'>06</option>
									<option value='07'>07</option>
									<option value='08'>08</option>
									<option value='09'>09</option>
									<option value='10'>10</option>
									<option value='11'>11</option>
									<option value='12'>12</option>
									<option value='13'>13</option>
									<option value='14'>14</option>
									<option value='15'>15</option>
									<option value='16'>16</option>
									<option value='17'>17</option>
									<option value='18'>18</option>
									<option value='19'>19</option>
									<option value='20'>20</option>
									<option value='21'>21</option>
									<option value='22'>22</option>
									<option value='23'>23</option>
								</select>
							</div>
							<div className="col-lg-3">
								<select className="form-control form-white" id="addNewFlightModalArrivalTimeMinutesSelect" onChange={this.arrTimeMin}>
									<option>-</option>
									<option value='00'>00</option>
									<option value='01'>01</option>
									<option value='02'>02</option>
									<option value='03'>03</option>
									<option value='04'>04</option>
									<option value='05'>05</option>
									<option value='06'>06</option>
									<option value='07'>07</option>
									<option value='08'>08</option>
									<option value='09'>09</option>
									<option value='10'>10</option>
									<option value='11'>11</option>
									<option value='12'>12</option>
									<option value='13'>13</option>
									<option value='14'>14</option>
									<option value='15'>15</option>
									<option value='16'>16</option>
									<option value='17'>17</option>
									<option value='18'>18</option>
									<option value='19'>19</option>
									<option value='20'>20</option>
									<option value='21'>21</option>
									<option value='22'>22</option>
									<option value='23'>23</option>
									<option value='24'>24</option>
									<option value='25'>25</option>
									<option value='26'>26</option>
									<option value='27'>27</option>
									<option value='28'>28</option>
									<option value='29'>29</option>
									<option value='30'>30</option>
									<option value='31'>31</option>
									<option value='32'>32</option>
									<option value='33'>33</option>
									<option value='34'>34</option>
									<option value='35'>35</option>
									<option value='36'>36</option>
									<option value='37'>37</option>
									<option value='38'>38</option>
									<option value='39'>39</option>
									<option value='40'>40</option>
									<option value='41'>41</option>
									<option value='42'>42</option>
									<option value='43'>43</option>
									<option value='44'>44</option>
									<option value='45'>45</option>
									<option value='46'>46</option>
									<option value='47'>47</option>
									<option value='48'>48</option>
									<option value='49'>49</option>
									<option value='50'>50</option>
									<option value='51'>51</option>
									<option value='52'>52</option>
									<option value='53'>53</option>
									<option value='54'>54</option>
									<option value='55'>55</option>
									<option value='56'>56</option>
									<option value='57'>57</option>
									<option value='58'>58</option>
									<option value='59'>59</option>
								</select>
							</div>
						</div>
						<div className="row">
							<label className="col-md-3 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.dep_time_hrs_error ? this.state.errors.dep_time_hrs_error : ""}
							</label>
							<label className="col-md-3 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.dep_time_min_error ? this.state.errors.dep_time_min_error : ""}
							</label>
							<label className="col-md-3 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.arr_time_hrs_error ? this.state.errors.arr_time_hrs_error : ""}
							</label>
							<label className="col-md-3 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.arr_time_min_error ? this.state.errors.arr_time_min_error : ""}
							</label>
						</div>
					</div>
					<div className="modal-footer">
						<button className="btn btn-info waves-effect waves-light save-category" id="addNewFlightModalSaveBtn" type="button" name="outwardcargo_airport_list_id_save" onClick={this.addNewFlightAction}>
							<i className="fa fa-edit" aria-hidden="true"></i>&nbsp;&nbsp;Save
						</button>
						<button className="btn btn-secondary waves-effect" type="button" id="addNewFlightModalCloseBtn" onClick={this.onCloseModal}>
							<i className="fa fa-times-circle" aria-hidden="true"></i>&nbsp;&nbsp;Close
						</button>
					</div>
				</div>
			</div>
		);
	}
}
