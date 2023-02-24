import React, { Component } from "react";
import axios from 'axios';
import APIService from "../APIService"

export default class AddNewStationModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: (props.editStationId ? props.editStationId : ''),
			iata_code: (props.editStationIataCode ? props.editStationIataCode : ''),
			city_name: (props.editStationCityName ? props.editStationCityName : ''),
			country_name: (props.editStationCountryName ? props.editStationCountryName : ''),
			time_zone: (props.editStationTimeZone ? props.editStationTimeZone : ''),
			is_outward: (props.editStationIsOutward ? props.editStationIsOutward : false),
			errors: {iata_code_error: '', city_name_error: '', country_name_error: '', time_zone_error: '', city_name_error: '', id_error: ''},
		}
	}

	iataCode = (event) => {
		// let errors = this.state.errors;
		// let rules = [{text: event.target.value,	regex_name: 'free_text', errmsg: 'Please enter proper IATA Code ', min: 3, max: 3, required: true}];
		// let isValidatedIataCode = validate(rules );
		// console.log('isValidatedIataCode ' + JSON.stringify(isValidatedIataCode));
		// if(isValidatedIataCode.errmsg){
		// 	errors.iata_code_error= isValidatedIataCode.errmsg;
		// 	this.setState({errors});
		// } else{
		// 	errors.iata_code_error = '';
		// 	this.setState({errors});
			this.setState({iata_code: event.target.value});
		// }
	}

	cityName = (event) => {
		// let errors = this.state.errors;
		// let rules = [{text: event.target.value,	regex_name: 'free_text', 	 errmsg: 'Please Enter City Name ', min: 3, required: true}];
		// let isValidatedCityName = validate(rules );
		// console.log('isValidatedCityName ' + JSON.stringify(isValidatedCityName));
		// if(isValidatedCityName.errmsg){
		// 	errors.city_name_error= isValidatedCityName.errmsg;
		// 	this.setState({errors});
		// } else{
		// 	errors.city_name_error = '';
		// 	this.setState({errors});
			this.setState({city_name: event.target.value});
		// }
	}

	countryName = (event) => {
		// let errors = this.state.errors;
		// let rules = [{text: event.target.value,	regex_name: 'free_text', 	 errmsg: 'Please Enter City Name ', min: 3, required: true}];
		// let isValidatedCountryName = validate(rules );
		// console.log('isValidatedCountryName ' + JSON.stringify(isValidatedCountryName));
		// if(isValidatedCountryName.errmsg){
		// 	errors.country_name_error= isValidatedCountryName.errmsg;
		// 	this.setState({errors});
		// } else{
		// 	errors.country_name_error = '';
		// 	this.setState({errors});
			this.setState({country_name: event.target.value});
		// }
	}

	timeZone = (event) =>{
		this.setState({time_zone: event.target. value})
	}

	isOutward = (event) => {
		console.log("checkbox change "+ this.state.checked);
		this.setState({is_outward: !this.state.is_outward});
	}

	addNewStationSaveAction = () =>{
		let errors = this.state.errors;
		
		if(!this.state.iata_code){
			errors.iata_code_error= 'required field';
			this.setState({errors});
		} else{
			errors.iata_code_error = '';
			this.setState({errors});
		}

		if(!this.state.city_name){
			errors.city_name_error= 'required field';
			this.setState({errors});
		} else{
			errors.city_name_error = '';
			this.setState({errors});
		}

		if(!this.state.country_name){
			errors.country_name_error= 'required field';
			this.setState({errors});
		} else{
			errors.country_name_error = '';
			this.setState({errors});
		}

		if(!this.state.time_zone){
			errors.time_zone_error= 'required field';
			this.setState({errors});
		} else{
			errors.time_zone_error = '';
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
			data.append('iata_code',this.state.iata_code)
			data.append('city_name', this.state.city_name)
			data.append('country_name', this.state.country_name)
			data.append('timezone',this.state.time_zone)
			data.append('is_outward', this.state.is_outward)
			data.append('station_id', this.state.id)
			// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/addStation`, data, 
			// 	// receive two    parameter endpoint url ,form data
			// 	JwtToken.getJwtTokenHeader())
			APIService.post('/addStation', data,
			res => { // then print response status
				console.log(res.result)
				window.swal_success("Station added successfully");
			})
			this.onFetchTableData();
			this.onCloseModal()
		}
	}
	
	addNewStationDeleteAction = () =>{
		let errors = this.state.errors;
		
		if(!this.state.id){
			errors.id_error= 'invalid operation';
			this.setState({errors});
		} else{
			errors.id_error = '';
			this.setState({errors});
		}

		// if(!this.state.iata_code){
		// 	errors.iata_code_error= 'required field';
		// 	this.setState({errors});
		// } else{
		// 	errors.iata_code_error = '';
		// 	this.setState({errors});
		// }

		// if(!this.state.city_name){
		// 	errors.city_name_error= 'required field';
		// 	this.setState({errors});
		// } else{
		// 	errors.city_name_error = '';
		// 	this.setState({errors});
		// }

		// if(!this.state.country_name){
		// 	errors.country_name_error= 'required field';
		// 	this.setState({errors});
		// } else{
		// 	errors.country_name_error = '';
		// 	this.setState({errors});
		// }

		// if(!this.state.time_zone){
		// 	errors.time_zone_error= 'required field';
		// 	this.setState({errors});
		// } else{
		// 	errors.time_zone_error = '';
		// 	this.setState({errors});
		// }

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
			data.append('station_id', this.state.id)
			// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/deleteStation`, data, 
			// 	// receive two    parameter endpoint url ,form data
			// 	JwtToken.getJwtTokenHeader())
			APIService.post('/deleteStation', data,
			res => { // then print response status
				console.log(res.result)
				window.swal_success("Station deleted successfully");
			})
			this.onFetchTableData();
			this.onCloseModal();
		}
	}

	onCloseModal = (event) =>{
		this.props.closeAddNewStationModal();
	}

	onFetchTableData = (event) =>{
		this.props.saveBtnClicked();
	}

	render() {
		
		return (
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h4 className="modal-title">
							<i className="mdi mdi-airplane" id="modal_title"> Add New Station</i>
						</h4>
						<button className="close" type="button" onClick={this.onCloseModal}>×</button>
					</div>
					<div className="modal-body">
						<div className="row">
							<div className="col-md-6">
								<label className="control-label">IATA Code</label>
								<input className="form-control form-white" id="addNewStationModalIataCodeInput" placeholder="Enter IATA Code" type="text"  required="" onChange ={this.iataCode} value={this.state.iata_code}/>
							</div>
							<div className="col-md-6">
								<label className="control-label">City Name</label>
								<input className="form-control form-white" id="addNewStationModalCityNameInput" placeholder="Enter City Name" type="text"  required="" onChange ={this.cityName} value={this.state.city_name}/>
							</div>
						</div>
						<div className="row">
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.iata_code_error ? this.state.errors.iata_code_error : ""}
							</label>
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.city_name_error ? this.state.errors.city_name_error : ""}
							</label>
						</div>
						<div className="row">
							<div className="col-md-6" id="addNewStationModalCountryNameInput">
								<label className="control-label">Country Name</label>
								<input className="form-control form-white" id="addNewStationModalCountryNameInput" placeholder="Enter Country Name" type="text"  required="" onChange ={this.countryName} value={this.state.country_name}/>
							</div>
							<div className="col-md-6">
								<label className="control-label">Time Zone</label>
								<select className="select2 form-control custom-select" id="addNewStationModalTimezoneSelect" placeholder="Select TimeZone" type="text"  required="" value={this.state.time_zone} onChange={this.timeZone}>
								{
									window.time_zone_records.map((timezone_record)=>{
										return <option value={timezone_record.timezone}>{timezone_record.timezone}</option>
									})
								}
								</select>
							</div>
						</div>
						<div className="row">
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.country_name_error ? this.state.errors.country_name_error : ""}
							</label>
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.time_zone_error ? this.state.errors.time_zone_error : ""}
							</label>
						</div>
						<div className="row">
							<div className="col-md-4"></div>
								<label className="customcheckbox col-md-6" style={{fontSize: "16px",fontWeight: "600"}}>Is outward Destination
									<input className="listCheckbox col-md-2" id="addNewStationModalIsOutwardInput" type="checkbox" onChange={this.isOutward}/>
										<span className="checkmark"></span>
								</label>
						</div>
					</div>
					<div className="modal-footer">
						<button className="btn btn-info waves-effect waves-light save-category" id="addNewStationModalSaveBtn" type="button" onClick={this.addNewStationSaveAction}>
							<i className="fa fa-edit" aria-hidden="true"></i>&nbsp;&nbsp;Save
						</button>
						<button className="btn btn-secondary waves-effect" type="button" id="addNewStationModalCloseBtn" onClick={this.onCloseModal}>
							<i className="fa fa-times-circle" aria-hidden="true"></i>&nbsp;&nbsp;Close
						</button>
						<button className="btn btn-danger waves-effect" type="button" id="addNewStationModalDeleteBtn" onClick={this.addNewStationDeleteAction}>
							<i className="fa fa-times-circle" aria-hidden="true"></i>&nbsp;&nbsp;Delete
						</button>
					</div>
				</div>
			</div>
		);
	}
}