import React, { Component } from "react";
import OffloadMultiSelect from '../operations/OffloadMultiSelect.js';
import APIService from "../APIService.js";
export default class BooklistRecordDiscardModal extends Component {
	constructor(props) {
		// console.log('-----BooklistRecordDiscardModalProps-----'+JSON.stringify(props));
		super(props);
		this.state = {
			booklistRecord: props.booklistRecord,
			offload:[],
			flight_selector: [],
			selected_flight: '',
			flightAssigned: false,
			selected_destination: '',
			reason:'',
			errors: {reason_error: '', offload_error: '', selected_flight_error: ''},
		};
	}

	destinationChanged = (event) => {
		this.setState({selected_destination: event.target.value});
		console.log("going "+ event.target.value);
		this.updateFlightsBooklistRecordDiscardModal(event.target.value);
	}

	updateFlightsBooklistRecordDiscardModal = (destination_value) => {
		let source = this.state.booklistRecord.from;
		let destination = destination_value;

		if (!source || !destination){
			window.swal_error('source or destination is missing');
		} else {
			let queryParams = {source: source, destination: destination};
			// let mySocket = io.sails.connect('http://localhost:1337');
			APIService.get('/getFlightDetails',queryParams, function (resData) {
				console.log('succccsesflights');
				if(resData.errormsg) {
					console.log(resData.errormsg);
				} else {
					this.setState({flight_selector: resData.data});
				}
			}.bind(this));
		}
	}

	reason = (event) => {
		let errors = this.state.errors;
		let rules = [{text: event.target.value,	regex_name: 'free_text', 	 errmsg: 'Please enter reason min length of 10', min: 10, required: true}];
		let isValidatedDiscardAwbLeg = window.validate(rules );
		console.log('isValidatedDiscardAwbLeg ' + JSON.stringify(isValidatedDiscardAwbLeg));
		if(isValidatedDiscardAwbLeg.errmsg){
			errors.reason_error= isValidatedDiscardAwbLeg.errmsg;
			this.setState({errors});
		} else{
			errors.reason_error = '';
			this.setState({errors});
			this.setState({reason: event.target.value});
		}
	}

	callbackOffload = (offloadData) => {
		this.setState({offload: offloadData})
	}

	flightChanged = (event) => {
		this.setState({selected_flight: event.target.value});
	}

	assignFlight = (event) => {
		this.setState({flightAssigned: !this.state.flightAssigned});
	}

	discardSelectedBooklistRecord = () =>{
		let errors = this.state.errors;
		if(!this.state.reason){
			errors.reason_error= 'required field';
			this.setState({errors});
		} else{
			errors.reason_error = '';
			this.setState({errors});
		}
		
		if(this.state.offload.length < 1){
			errors.offload_error= 'select offload';
			this.setState({errors});
		} else{
			errors.offload_error = '';
			this.setState({errors});
		}

		if(this.state.flightAssigned){
			if(!this.state.selected_flight){
				errors.selected_flight_error= 'select flight';
				this.setState({errors});
			}else{
				errors.selected_flight_error = '';
				this.setState({errors});
			}
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
		
			// let mySocket = io.sails.connect('http://localhost:1337');
			APIService.post('/discardBooklistRecord', {
				awb_leg_id: this.state.booklistRecord.id,
				reason: this.state.offload +'-'+ this.state.reason,
				awb_no: this.state.booklistRecord.awb_no,
				station: this.state.booklistRecord.station,
				created_by: this.state.booklistRecord.created_by,
				from: this.state.booklistRecord.from,
				assignFlight: this.state.flightAssigned,
				flightSelector: this.state.selected_flight,
				awb_info_id: this.state.booklistRecord.awb_info.id,
				to: this.state.selected_destination,
				pieces: this.state.booklistRecord.pieces,
				weight: this.state.booklistRecord.weight,

			}, function(data, status)  {
					if(data){
						console.log(data);
					}
					else
						console.log(status);
			});
			this.onCloseBooklistRecordDiscardModal();
		}
	}

	onCloseBooklistRecordDiscardModal = (event) =>{
		this.props.closeBooklistRecordDiscardModal();
	}
	
	render() {
		
		return (
			<div>
				<div className="modal-header">
					<h4 className="modal-title">
						<span>
							<i className="fa fa-delete"></i>
						</span>
						<label className="ml-2" id="booklistRecordDiscardEditTitle">Reason to Discard AWB {this.state.booklistRecord.awb_no} Record</label>
					</h4>
					<button className="close" type="button" onClick={this.onCloseBooklistRecordDiscardModal}>×</button>
				</div>
				<div className="modal-body">
					<input className="form-control col-md-12 form-white" id="booklistRecordDiscardModalReasonInput" placeholder="Enter Reason" type="text" name="booklistRecordDiscardModalReasonInput" autocomplete="off" required="" 
					onChange={this.reason}
					/>
					<label className="col-md-12 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
						{this.state.errors.reason_error ? this.state.errors.reason_error : ""}
					</label>
					<label className="control-label" for="booklistRecordDiscardModalOffloadCodeSelect">Offload Code</label>
					<OffloadMultiSelect offloadCallback = {this.callbackOffload}/>
					<label className="col-md-12 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
						{this.state.errors.offload_error ? this.state.errors.offload_error : ""}
					</label>
					{/*<label className="control-label my-2" for="booklistRecordDiscardModalFlightAssign">Assign Another Flight</label>
					<input className="listCheckbox m-2" id="booklistRecordDiscardModalFlightAssign" type="checkbox" name="booklistRecordDiscardModalFlightAssign" onChange={this.assignFlight}/>*/}
					{
						this.state.flightAssigned == false &&
						<div>
						</div>
					}
					{
						this.state.flightAssigned == true &&
						<div>
							<div className="row">
								<div className="col-md-5 input-group">
									<div className="input-group-prepend">
										<span className="input-group-text bg-danger">
											<i className="mdi mdi-map-marker text-light"></i>
										</span>
									</div>
									<select className="p-0 select3 form-control custom-select browser-default" id="booklistRecordDiscardModalStationSourceSelect" type="text">
										<option value={this.state.booklistRecord.from}>{this.state.booklistRecord.from}</option>
									</select>
									<select className="p-0 select3 form-control custom-select browser-default" id="booklistRecordDiscardModalStationDestinationSelect" type="text" onChange={this.destinationChanged}>
										{
											window.station_records.map((station)=>{
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
									<select className="select2 form-control custom-select my-auto" id="booklistRecordDiscardModalFlightsSelector" type="text" placeholder="Select flight" name="booklistRecordDiscardModalFlightsSelector" onChange={this.flightChanged}>
										{
											this.state.flight_selector.map((flight)=>{
												return <option value={flight.flight_no + "," + flight.exactdeparturetime + "," + flight.exactarrivaltime}>{window.moment(flight.exactdeparturetime).format("DD/MM/YYYY HH:mm")} [{flight.flight_no}]</option>
											})
										}
									</select>
								</div>
							</div>
							<label className="col-md-12 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.selected_flight_error ? this.state.errors.selected_flight_error : ""}
							</label>
						</div>
					}
				</div>
				<div className="modal-footer">
					<button className="btn btn-danger waves-effect waves-light save-category" id="booklistRecordDiscardModalDiscardRecord" type="button" name="booklistRecordDiscardModalDiscardRecord" onClick={() => this.discardSelectedBooklistRecord()}>&nbsp;&nbsp;Discard</button>
				</div>
			</div>
		);
	}
}
