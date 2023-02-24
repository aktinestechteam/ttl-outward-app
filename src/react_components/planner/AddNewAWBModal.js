import React, { Component } from "react";
import custom from '../../config/custom.js';
import SHCMultiSelect from './SHCMultiSelect.js';
import { Observer } from "mobx-react";
import APIService from "../APIService.js";
class AddNewAWBModal extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			operatingStation: props.operatingStation,
			awb_no: '',
			src: props.MainStore.operatingStation,
			dest: '',
			issuer_name: '',
			issuer_src: props.MainStore.operatingStation,
			issuer_code: '',
			shc: [],
			pieces: '',
			weight: '',
			transhipment: false,
			unitized: false,
			priority_class: "M_CLASS",
			errors: {issuer_name_error: '', pieces_error: '', src_error: '', dest_error: '', },
		}
	}

	awb_no = (event) => {
		let awbNo =  event.target.value;
		this.setState({awb_no: awbNo});

		if (awbNo.length == 11){
			let queryParams = {awbNo: awbNo} ;
			// let mySocket = io.sails.connect('http://localhost:1337');
			APIService.get('/getAwbDetails', queryParams, function(results, status) {
				// console.log("getAwbDetails -====>"+JSON.stringify(results));
				if(results[0] == null) {
					console.log('no record found. you can add this awb');
				}
				else {
					console.log('you cannot add this awb');
					window.swal_error(awbNo + " already exists, cannot add it again.");
				}
			});
		}
	}

	sourceChanged = (event) => {
		this.setState({src: event.target.value});
	}

	agentSourceChanged = (event) => {
		this.setState({issuer_src: event.target.value, issuer_code: '', issuer_name: ''});
	}

	destinationChanged = (event) => {
		this.setState({dest: event.target.value});
	}

	agentSelected = (event) => {
		let errors = this.state.errors;
		let rules = [{text: event.target.value,	regex_name: 'free_text', errmsg: 'Please Select Issuer Name ', min: 4, required: true}];
		let isValidatedIssuereName = window.validate(rules );
		/*console.log('isValidatedIssuerName ' + JSON.stringify(isValidatedIssuerName));
		if(isValidatedIssuerName.errmsg){
			errors.issuer_name_error= isValidatedIssuerName.errmsg;
			this.setState({errors});
		} else{
			errors.issuer_name_error = '';
			this.setState({errors});
			this.setState({issuer_name: event.target.value});
		}*/
		let issuer_code = event.target.value
		let issuer_name = ((window.agent_records.find(agent => agent.billing_code === issuer_code) ?? {}).name) ?? "";
		this.setState({issuer_name, issuer_code});
	}

	callbackSHC = (shcData) => {
		this.setState({shc: shcData.map(shc => shc)})
	}

	pieces = (event) => {
		let errors = this.state.errors;
		let rules = [{text: event.target.value,	regex_name: 'min_number', 	 errmsg: 'Please enter minimum 1 Piece', min: 1, required: true}];
		let isValidatedPieces = window.validate(rules );
		console.log('isValidatedPieces ' + JSON.stringify(isValidatedPieces));
		if(isValidatedPieces.errmsg){
			errors.pieces_error= isValidatedPieces.errmsg;
			this.setState({errors});
		} else{
			errors.pieces_error = '';
			this.setState({errors});
			this.setState({pieces: event.target.value});
		}
	}

	weight = (event) => {
		let errors = this.state.errors;
		let rules = [{text: event.target.value,	regex_name: 'min_number', 	 errmsg: 'Please enter weight more than 0 Kg.', min: 0.0001, required: true}];
		let isValidatedWeight = window.validate(rules );
		console.log('isValidatedWeight ' + JSON.stringify(isValidatedWeight));
		if(isValidatedWeight.errmsg){
			errors.weight_error= isValidatedWeight.errmsg;
			this.setState({errors});
		} else{
			errors.weight_error = '';
			this.setState({errors});
			this.setState({weight: event.target.value});
		}
	}

	setTranshipmentStatus = (event) => {
		this.setState({transhipment: JSON.parse(event.target.value)});
	}

	setUnitizedStatus = (event) => {
		this.setState({unitized: JSON.parse(event.target.value)});
	}

	setAWBPriorityClass = (event) => {
		this.setState({priority_class: event.target.value});
	}

	addNewAWBAction = () =>{
		let errors = this.state.errors;

		let awb_no_error = window.checkAWBNumber(this.state.awb_no);
		if(awb_no_error.length > 0) {
			errors.awb_no_error= awb_no_error;
			this.setState({errors});
		} else {
			errors.awb_no_error = '';
			this.setState({errors});
		}

		if(this.state.issuer_code == ''){
			errors.issuer_name_error= 'Please select Issuer Name';
			this.setState({errors});
		} else{
			errors.issuer_name_error = '';
			this.setState({errors});
		}
		
		if(!this.state.src){
			errors.src_error= 'Please select Source';
			this.setState({errors});
		} else{
			errors.src_error = '';
			this.setState({errors});
		}

		if(!this.state.dest){
			errors.dest_error= 'Pelase select Destination';
			this.setState({errors});
		} else{
			errors.dest_error = '';
			this.setState({errors});
		}

		if(!this.state.pieces){
			errors.pieces_error= 'Please enter pieces';
			this.setState({errors});
		} else{
			errors.pieces_error = '';
			this.setState({errors});
		}

		if(!this.state.weight){
			errors.weight_error= 'Please enter weight';
			this.setState({errors});
		} else{
			errors.weight_error = '';
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
			// let mySocket = io.sails.connect('http://localhost:1337');
			let self = this;
			APIService.post('/createAwbWithInfoManually', {
				station: this.state.operatingStation,
				awb_no: this.state.awb_no,
				src: this.state.src,
				dest: this.state.dest,
				issuer_name: this.state.issuer_name,
				issuer_code: this.state.issuer_code,
				shc: this.state.shc,
				pieces: this.state.pieces,
				weight: this.state.weight,
				transhipment: this.state.transhipment,
				unitized: this.state.unitized,
				priority_class: this.state.priority_class
			}, function(resposne) {
					console.log("response", resposne);
					if(resposne && resposne.error){
						window.swal_error(JSON.stringify(resposne.error));
					}
					else {
						window.swal_success("New AWB [" + self.state.awb_no + "] is created");
						self.onCloseModal();
					}
			});
		}
	}

	onCloseModal = (event) =>{
		this.props.closeAddNewAWBModal();
	}
	
	render() {
		
		return (
			<Observer>{()=>
			<div>
				<div className="modal-header">
					<h4 className="modal-title">
						<span>
							<i className="fa fa-edit"></i>
						</span>
						<label className="ml-2" id="addNewAWBModalEditTitle">Creating New AWB for {this.state.operatingStation}</label>
					</h4>
					<button className="close" type="button" onClick={this.onCloseModal}>×</button>
				</div>
				<div className="modal-body">
					<div className="row">
						<div className="col-md-6" id="addNewAWBModalStation">
							<label className="control-label">Station</label>
							<input className="form-control form-white" id="addNewAWBModalStationInput" value={this.state.operatingStation} text={this.state.operatingStation} type="text" name="addNewAWBModalStationInput" autocomplete="off" required="" disabled=""/>
						</div>
						<div className="col-md-6" id="addNewAWBModalAwbNo">
							<label className="control-label">AWB No</label>
							<input className="form-control form-white" id="addNewAWBModalAwbNoInput" placeholder="Enter 11 Digit AWB No" type="text" name="addNewAWBModalAwbNoInput" autocomplete="off" required="" onChange={this.awb_no}/>
							<label className="text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.awb_no_error ? this.state.errors.awb_no_error : ""}
							</label>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6" id="addNewAWBModalSource">
							<label className="control-label">Source</label>
							<select className="select2 form-control custom-select p-0 browser-default" id="addNewAWBModalSourceSelect" type="text" onChange={this.sourceChanged}>
								<option value={this.props.MainStore.operatingStation}>{this.props.MainStore.operatingStation}</option>
							</select>
						</div>
						<div className="col-md-6" id="addNewAWBModalDestination">
							<label className="control-label">Destination</label>
							<select className="p-0 select3 form-control custom-select browser-default" id="addNewAWBModalDestinationSelect" type="text" onChange={this.destinationChanged}>
								<option selected>Select Destination</option>
							{
								window.station_records.map((station)=>{
									return <option value={station.iata}>{station.iata + ' - ' + station.name}</option>
								})
							}
							</select>
						</div>
					</div>
					<div className="row">
						<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
							{this.state.errors.src_error ? this.state.errors.src_error : ""}
						</label>
						<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
							{this.state.errors.dest_error ? this.state.errors.dest_error : ""}
						</label>
					</div>
					<div className="row">
						<div className="col-md-6" id="addNewAWBModalPieces">
							<label className="control-label">Pieces</label>
							<input className="form-control form-white" id="addNewAWBModalPiecesInput" placeholder="Enter Total Pieces" type="text" name="addNewAWBModalPiecesInput" autocomplete="off" required="" onChange={this.pieces}/>
						</div>
						<div className="col-md-6" id="addNewAWBModalWeight">
							<label className="control-label">Weight</label>
							<input className="form-control form-white" id="addNewAWBModalWeightInput" placeholder="Enter Total Weight" type="text" name="addNewAWBModalWeightInput" autocomplete="off" required="" onChange={this.weight}/>
						</div>
					</div>
					<div className="row">
						<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
							{this.state.errors.pieces_error ? this.state.errors.pieces_error : ""}
						</label>
						<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
							{this.state.errors.weight_error ? this.state.errors.weight_error : ""}
						</label>
					</div>
					<div className="row">
						<div className="col-md-6" id="addNewAWBModalIssuerName">
							<label className="control-label">Issuer Name</label>
							<div className='row'>
								<select className="col-2 select2 form-control custom-select p-0 browser-default" id="addNewAWBModalAgentSourceSelect" type="text" onChange={this.agentSourceChanged}>
									{/* <option value={this.props.MainStore.operatingStation}>{this.props.MainStore.operatingStation}</option> */}
									{
										["AMD", "BOM","BLR", "CCU", "DEL", "HYD", "JAI", "MAA"].map(s => <option value={s}>{s}</option>)
									}
								</select>
								<select className="col-10 p-0 select3 form-control custom-select browser-default" id="addNewAWBModalIssuerNameInput" type="text" onChange={this.agentSelected}>
								<option value="" selected>Select an Agent</option>
							{
								window.agent_records.filter(agent => agent.station == this.state.issuer_src).map(agent =>
								<option key={agent.billing_code} value={agent.billing_code}>{agent.name} __ ({agent.billing_code} - {this.state.issuer_src})</option>)
							}
							</select>
							</div>
							<label className="text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.issuer_name_error ? this.state.errors.issuer_name_error : ""}
							</label>
						</div>
						<div className="col-md-6" onChange={this.setTranshipmentStatus.bind(this)}>
							<label className="col-md-12">Transhipment Status</label>
							<div className="row col-md-12 m-auto">
								<div className="custom-control custom-radio col-6">
									<input className="custom-control-input" id="transhipmentStatusYesRadio" type="radio" name="transhipmentStatus" required="" value="true" checked={this.state.transhipment}/>
										<label className="custom-control-label" for="transhipmentStatusYesRadio">Yes</label>
								</div>
								<div className="custom-control custom-radio col-6">
									<input className="custom-control-input" id="transhipmentStatusNoRadio" type="radio" name="transhipmentStatus" required="" value="false" checked={!this.state.transhipment}/>
										<label className="custom-control-label" for="transhipmentStatusNoRadio">No</label>
								</div>
							</div>
						</div>

						<div className="col-md-6" onChange={this.setAWBPriorityClass}>
							<label className="col-md-12">Priority Class</label>
							<div className="row col-md-12 m-auto">
								<div className="custom-control custom-radio col-6">
									<input className="custom-control-input" id="priorityClassMClassRadio" type="radio" name="priorityClassRadio" required="" value="M_CLASS" checked={this.state.priority_class === "M_CLASS"}/>
										<label className="custom-control-label" for="priorityClassMClassRadio">M Class</label>
								</div>
								<div className="custom-control custom-radio col-6">
									<input className="custom-control-input" id="priorityClassFClassRadio" type="radio" name="priorityClassRadio" required="" value="F_CLASS" checked={this.state.priority_class === "F_CLASS"}/>
										<label className="custom-control-label" for="priorityClassFClassRadio">F Class</label>
								</div>
							</div>
						</div>
						<div className="col-md-6" onChange={this.setUnitizedStatus}>
							<label className="col-md-12">Unitized / Loose</label>
							<div className="row col-md-12 m-auto">
								<div className="custom-control custom-radio col-6">
									<input className="custom-control-input" id="unitizedStatusRadioUnitized" type="radio" name="unitizedStatusRadio" required="" value="true" checked={this.state.unitized}/>
										<label className="custom-control-label" for="unitizedStatusRadioUnitized">Unitized</label>
								</div>
								<div className="custom-control custom-radio col-6">
									<input className="custom-control-input" id="unitizedStatusRadioLoose" type="radio" name="unitizedStatusRadio" required="" value="false" checked={!this.state.unitized}/>
										<label className="custom-control-label" for="unitizedStatusRadioLoose">Loose</label>
								</div>
							</div>
						</div>
					</div>
					<div>
						<label>SHC</label>
						<SHCMultiSelect selectedSHC={[]} shcCallback = {this.callbackSHC}/>
					</div>
				</div>
				<div className="modal-footer col-md-12">
					<button className="btn btn-success waves-effect waves-light save-category" id="addNewAWBModalCreateAWB" type="button" name="newAWBSave" onClick={() => this.addNewAWBAction()}>
						<i className="fas fa-save" aria-hidden="true"></i>&nbsp;&nbsp;Create New AWB
					</button>
				</div>
			</div>
			}</Observer>
			
		);
	}
}
export default AddNewAWBModal;
