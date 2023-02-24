import React, { Component } from "react";
// import custom from '../../config/custom.js';
import axios from 'axios';
import APIService from "../APIService";

export default class AgentsFileUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uploadedAgentFile: null,
			errors: {},
		}
	}

	componentDidMount() {
		//this.getFlightSheduleUpdatedDate();
	}

	// getFlightSheduleUpdatedDate = () => {
	// 	// axios.get(`${process.env.REACT_APP_API_BASE_PATH}/seasonsFlights`, 
	// 	// JwtToken.getJwtTokenHeader())
	// 	APIService.get('/seasonsFlights', null,(res) => { // then print response status
	// 			console.log(res.data)
	// 			let flightSeasonDateApi = res.data.map(data => data.date);
	// 			console.log(flightSeasonDateApi);
	// 			this.setState({
	// 				seasons: flightSeasonDateApi,season:flightSeasonDateApi[0]
	// 			});
	// 			this.props.selectSeason(this.state.seasons[0]);
	// 		});
	// }
	
	handleAgentFile = (event) => {
		console.log(event.target.files[0])
		this.setState({
			uploadedAgentFile: event.target.files[0],
		})
	}

	uploadAgentFile = () => {
		let errors = this.state.errors;

		this.setState({ errors });
		
		let error_count = Object.keys(errors).filter((key) => {
			if (errors[key]) {
				return false;
			}
			return true;
		}).length;
		let error_type_count = Object.keys(errors).length;
		if(!this.state.uploadedAgentFile){
			window.swal_error("Please select the file ")
		}
		else {
			window.swal_info('Uploading the file ...');
			let data = new FormData()
			data.append('agentUpload', this.state.uploadedAgentFile)
			// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/uploadAgentFile`, data,
			//  JwtToken.getJwtTokenHeader())
			APIService.post('/uploadAgentList', data,
			res => { // then print response status
					this.props.fileUploadSuccessfully(true);
					window.swal_success('File Uploaded Successfully.');
				})
		}
	}

	render() {
				return (
			<div className="row my-2 col-md-12">
				<div className="custom-file col-md-5 ml-auto">
					<input className="custom-file-input" id="agentlistUpload" type="file" name="agentlistUpload" onChange={(e) => this.handleAgentFile(e)} disabled={!this.props.allowToAdd} />
					<label className="custom-file-label" id="agentlistUploadLabel">{this.state.uploadedAgentFile ? this.state.uploadedAgentFile.name : "Choose Agent XLS file"}</label>
				</div>
				<div className="input-group-append col-md-1">
					<button className="btn btn-danger" id="uploadAgentFile" type="button" onClick={() => this.uploadAgentFile()} disabled={!this.props.allowToAdd}>Upload</button>
				</div>
			</div>
		);
	}
}