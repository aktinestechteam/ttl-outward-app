import React, { Component } from "react";
// import custom from '../../config/custom.js';
import axios from 'axios';
import APIService from "../APIService";

export default class FlightsFileUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uploadedFlightsFile: null,
			season: '',
			errors: {},
			seasons: [],
		}
	}

	componentDidMount() {
		this.getFlightSheduleUpdatedDate();
	}

	getFlightSheduleUpdatedDate = () => {
		// axios.get(`${process.env.REACT_APP_API_BASE_PATH}/seasonsFlights`, 
		// JwtToken.getJwtTokenHeader())
		APIService.get('/seasonsFlights', null,(res) => { // then print response status
				console.log(res.data)
				let flightSeasonDateApi = res.data.map(data => data.date);
				console.log(flightSeasonDateApi);
				this.setState({
					seasons: flightSeasonDateApi,season:flightSeasonDateApi[0]
				});
				this.props.selectSeason(this.state.seasons[0]);
			});
	}
	seasonChanged = (event) => {
		this.setState({ season: event.target.value });
		this.props.selectSeason(event.target.value);
	}

	handleFlightsFile = (event) => {
		console.log(event.target.files[0])
		this.setState({
			uploadedFlightsFile: event.target.files[0],
		})
	}

	uploadFlightsFile = () => {
		let errors = this.state.errors;

		if (!this.state.season) {
			errors.season_error = 'select season';
			this.setState({ errors });
		} else {
			errors.season_error = '';
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
			window.swal_error("Please Create New Season ")
			console.log('yes errors' + error_count + ' ==> ' + JSON.stringify(this.state.errors))
		} 
		else if(!this.state.uploadedFlightsFile){
			window.swal_error("Please select the file ")
		}
		else {
			window.swal_info('Uploading the file ...');
			let data = new FormData()
			data.append('season', this.state.season)
			data.append('flightsUpload', this.state.uploadedFlightsFile)
			// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/uploadFlightsFile`, data,
			//  JwtToken.getJwtTokenHeader())
			APIService.post('/uploadFlightsFile', data,
			res => { // then print response status
					console.log(res.result)
					this.props.fileUploadSuccessfully(true);
					window.swal_success('File Uploaded Successfully.');
				})
		}
	}
	AddSeason = () => {
		// axios.get(`${process.env.REACT_APP_API_BASE_PATH}/createFlightSeasons`, 
		// JwtToken.getJwtTokenHeader())
		APIService.get('/createFlightSeasons', null,
		res => { // then print response status
				console.log(res.data)
				let flightSeasonDateApi = JSON.stringify(res.data);
				console.log(flightSeasonDateApi);

				if (res.data == true) {
					window.swal_success('Flight shedule date added successfully.');
				}
				if (!res.data.errormsg == "") {
					window.swal_success('Flight shedule date already exists.');
				}
				this.getFlightSheduleUpdatedDate();
			})
	}

	render() {
				return (
			<div className="row my-2 col-md-12">
				<button className="btn btn-danger ml-1" id="flightlistUploadBtn" type="button" onClick={this.AddSeason} disabled={!this.props.allowToAdd}>Create New Season</button>
					<select className="select2 form-control custom-select my-auto col-md-3" id="seasonSelector" type="text" name="seasonSelector" onChange={this.seasonChanged}>
						{this.state.seasons.map(seasonDate => (
							<option key={seasonDate} value={seasonDate}>
								{seasonDate}
							</option>
						))}
					</select>
				<div className="custom-file col-md-5 ml-auto">
					<input className="custom-file-input" id="flightlistUpload" type="file" name="flightlistUpload" onChange={(e) => this.handleFlightsFile(e)} disabled={!this.props.allowToAdd} />
					<label className="custom-file-label" id="flightlistUploadLabel">{this.state.uploadedFlightsFile ? this.state.uploadedFlightsFile.name : "Choose Flight Schedule"}</label>
				</div>
				<div className="input-group-append col-md-1">
					<button className="btn btn-danger" id="flightlistUploadBtn" type="button" onClick={() => this.uploadFlightsFile()} disabled={!this.props.allowToAdd}>Upload</button>
				</div>
			</div>
		);
	}
}