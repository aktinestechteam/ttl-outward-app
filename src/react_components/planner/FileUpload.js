import React, { Component } from "react";
import custom from '../../config/custom.js';
import axios from 'axios';
import APIService from "../APIService.js";

export default class FileUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			booklistFileRecords: [],
			egmFileRecords: [],
			uploadedBooklistFile: null,
			uploadedEGMFile: null,
			selectedFlightDetails: props.flightSelectorDetails,
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({selectedFlightDetails: newProps.flightSelectorDetails, });
	}

	handleEGMFile = async (e) => {

		if (this.state.selectedFlightDetails){
			this.setState({
				uploadedEGMFile: e.target.files[0],
			});
			let egm_records = [];
			e.preventDefault()
			const reader = new FileReader()
			reader.onload = async (e) => {
				let text = (e.target.result)
				// console.log('=============>>>'+text)
				let arrayOfLines = text.match(/[^\r\n]+/g);
				let testdigits = /\d{11}/;

				if (arrayOfLines == null) {
					window.swal_error("Selected File is Blank")
				} else {

					for (let j = 0; j < arrayOfLines.length; j++) {
						if(testdigits.test(arrayOfLines[j])) {
							// console.log('arrayOfLines = : ' +j+' = = '+ arrayOfLines[j]);
							arrayOfLines[j]=arrayOfLines[j].trim();
							let egm_record = {};
							let egm_record_detail = arrayOfLines[j].split(' ');
							egm_record_detail = egm_record_detail.filter(i => i.length!=0);
							// console.log('egm_record_detail == > > '+ egm_record_detail);
							// let manifest_data =(window._.compact(arrayOfLines[j].slice(27).split(' ')));
							egm_record.awb_no = egm_record_detail[1].substr(0, 11);
							console.log(`egm_record_detail[4] = ${egm_record_detail[4]}, and ${typeof egm_record_detail[4]}`);
							egm_record.pieces = Number(egm_record_detail[4]);
							egm_record.weight = parseInt(egm_record_detail[5]);
							//- egm_record.volume = parseFloat(manifest_data[2]);
							egm_record.class = egm_record_detail[6].charAt(egm_record_detail[6].length-1);

							console.log(`egm_record.pieces = ${egm_record.pieces}, and ${typeof egm_record.pieces}`);

							if(isNaN(egm_record.pieces)) {
								window.swal_error(`EGM has error for the AWB ${egm_record.awb_no}`)
								this.setState({uploadedEGMFile: null});
								return
							}

							// console.log(' egm_record ====:  '+egm_record);
							egm_records.push(egm_record);

						}
					}
					console.log(' egm_recordss ====:  '+JSON.stringify(egm_records));
					this.setState({egmFileRecords: egm_records})
				}
			};
			reader.readAsText(e.target.files[0])
			this.existingBooklistRecords(this.state.selectedFlightDetails, false, false);
			e.target.value = ''
		} else{
			window.swal_error('Please select flight first');
		}
	}

	existingBooklistRecords = (selectedFlightDetails, isOpenBooklist, readOnly = false) => {
		let fileUploadflightDetail = (selectedFlightDetails.flightDetails).split(',');
		let fileUploadselectedFlightNumber = fileUploadflightDetail[0];
		let fileUploadselectedFlightTime = fileUploadflightDetail[1];
		let fileUploadqueryParams = {flightNo: fileUploadselectedFlightNumber, flightTime: fileUploadselectedFlightTime};
		// let mySocket = io.sails.connect('http://localhost:1337');
		APIService.get('/getBooklistRecords', fileUploadqueryParams, function (results, status) {
			if(results) {
				this.setState({booklistFileRecords: results, loading: false });
				if (isOpenBooklist) {
					this.props.openBooklistVsInputEgmModal(this.state.booklistFileRecords, true, readOnly);
				}
				console.log('record found. ' + JSON.stringify(results));
			} else{
				this.setState({booklistFileRecords: []});
				console.log('----no any record found----');
			}
		}.bind(this));
	}

	handleBooklistFile = (event) => {
		console.log(event.target.files[0])
		this.setState({
			uploadedBooklistFile: event.target.files[0],
		});
		event.target.value = ''
	}

	uploadBooklistFile = () =>{
		if(!this.state.uploadedBooklistFile){
			window.swal_error('Please insert booklist');
		}
		else if (this.state.selectedFlightDetails){
			window.swal_info('Please wait while we upload the booklist ...');
			let flyflightDetails = this.state.selectedFlightDetails.flightDetails.split(",");
			let now_date = Date.now();
			let flightNo = flyflightDetails[0];
			let flightTime = flyflightDetails[1]; // get this from ui and ask to add departure_time also
			console.log('flightDetails===== >  '+ flightTime)
			if (flightTime < now_date){
				console.log('flightTime smaller===== >  ' + flightTime + ' > ' + now_date);
				window.swal_error('This Flight is Already Departed');

			} else {
				console.log('flightTime greater===== >  ' + flightTime + ' < ' + now_date);
				let data = new FormData()
				data.append('flightsSelector', this.state.selectedFlightDetails.flightDetails)
				data.append('stationSourceInput', this.state.selectedFlightDetails.source)
				data.append('stationDestinationInput', this.state.selectedFlightDetails.destination)
				data.append('booklistUpload', this.state.uploadedBooklistFile)
				// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/uploadBooklistFile`, data, 
				// 	// receive two    parameter endpoint url ,form data
				// 	JwtToken.getJwtTokenHeader())
				APIService.post('/uploadBooklistFile', data,
				res => { // then print response status
						console.log('booklist uploaded ==== ^^^====' + JSON.stringify(res));
						this.setState({
							uploadedBooklistFile: undefined,
						});

						let errmsg = "";

						if (res.data.uploadedAWBCount === 0) {
							errmsg += "No AWB is added from the uploaded Booklist";
							errmsg += "</br>";
							errmsg += "</br>";
						}

						if (res.data.notAvailableDestination.length) {
							errmsg += "<strong>Following Destinations Not Available</strong></br>";
							errmsg += res.data.notAvailableDestination.reduce((prevVal, currVal) => prevVal + currVal + "<br/>", "");
							errmsg += "</br>";
						}
						if (res.data.notAvailableFlight.length) {
							errmsg += "<strong>Flight Schedule Not Available For Flights</strong></br>";
							errmsg += res.data.notAvailableFlight.reduce((prevVal, currVal) => prevVal + currVal + "<br/>", "");
							errmsg += "</br>";
						}
						if (res.data.notAddedAWB.length) {
							errmsg += "<strong>Following AWB Be Uplifted from</strong><br/>";
							errmsg += res.data.notAddedAWB.reduce((prevVal, currVal) => prevVal + currVal + "<br/>", "");
							errmsg += "</br>";
						}

						if (errmsg) {
							window.swal_error("Booklist Upload Information", errmsg);
						}
						else {
							window.swal_close();
						}
					})
			}
			this.setState({uploadedBooklistFile: null});

		} else{
			window.swal_error('Please select flight first');
		}
	}

	handleBooklistVsEgmModal = () =>{
		console.log(this.state.selectedFlightDetails);
		let fileUploadflightDetail = (this.state.selectedFlightDetails.flightDetails).split(',');
		if(fileUploadflightDetail[1]>Date.now()){
			window.swal_error("There is still time left for flight departure");
		}
		else{
			this.props.openBooklistVsEgmModal(this.state.uploadedEGMFile, this.state.egmFileRecords, this.state.booklistFileRecords);
			this.setState({uploadedEGMFile: null});
		}
	}
	/**
	 * this is for manually depart
	 */
	handleBooklistVsInputEgmModal = () =>{
		console.log(this.state.selectedFlightDetails);
		let fileUploadflightDetail = (this.state.selectedFlightDetails.flightDetails).split(',');

		if(fileUploadflightDetail[1] > Date.now()){
			//window.swal_error("There is still time left for flight departure");
			this.existingBooklistRecords(this.state.selectedFlightDetails, true, true);
		}
		else{
			this.existingBooklistRecords(this.state.selectedFlightDetails, true, false);
		}
	}

	render() {
		let flightTime = 0;
		let flightFlag = false;
		let now_date = Date.now();
		let cannot_upload_booklist = true;
		let cannot_upload_egm = true;

		if(this.state.selectedFlightDetails){
			let flyflightDetails = this.state.selectedFlightDetails.flightDetails.split(",");
			let flightNo = flyflightDetails[0];
			flightFlag = true;
			flightTime = Number(flyflightDetails[1]); // get this from ui and ask to add departure_time also

			cannot_upload_booklist = flightTime < now_date;
			cannot_upload_egm = flightTime > now_date;
		}

		//	This is temporary during UAT only.
		cannot_upload_booklist = false;
		cannot_upload_egm = false;

		return (

			<div className="row my-2">
				<div className="col-md-6">
					<div className="input-group" id="booklistUploadParent">
						<div className="custom-file">
							<input className="custom-file-input" id="booklistUpload" type="file" name="booklistUpload" onChange={this.handleBooklistFile} disabled={cannot_upload_booklist}/>
							<label className="custom-file-label" id="booklistUploadLabel">{this.state.uploadedBooklistFile ? this.state.uploadedBooklistFile.name : 'Choose Booklist'}</label>
						</div>
						<div className="input-group-append">
							<button className="btn btn-danger" id="booklistUploadBtn" onClick={this.uploadBooklistFile} disabled={cannot_upload_booklist}>Upload</button>
						</div>
					</div>
				</div>

				<div className="col-md-6 input-group" >
					<div className="input-group-append">
						<button className="btn btn-danger" id="egmUploadBtn" type="button" onClick={() => this.handleBooklistVsInputEgmModal()} disabled={cannot_upload_egm}>Manually Depart</button>
					</div>
					<div className="custom-file">
						<input className="custom-file-input" id="egmFileUpload" type="file" name="egmFileUpload" onChange={(e) => this.handleEGMFile(e)} disabled={cannot_upload_egm}/>
						<label className="custom-file-label">{this.state.uploadedEGMFile ? this.state.uploadedEGMFile.name : 'Choose EGM'}</label>
					</div>
					<div className="input-group-append">
						<button className="btn btn-danger" id="egmUploadBtn" type="button" onClick={() => this.handleBooklistVsEgmModal()} disabled={cannot_upload_egm}>Upload</button>
					</div>
				</div>
			</div>
		);
	}
}