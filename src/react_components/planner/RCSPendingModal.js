import React, { Component } from "react";
import SHCMultiSelect from './SHCMultiSelect.js';
import Table from 'react-bootstrap/Table'
import { Observer } from "mobx-react"
import NavigationButton from "../shared/NavigationButton.js";
import APIService from "../APIService.js";

class RCSPendingModal extends Component {
	constructor(props) {
		super(props);
		let agent = window.agent_records.find(a => a.billing_code == props.awbInfoRecord.issuer_code);
		let issuer_code = (props.awbInfoRecord.issuer_code ? props.awbInfoRecord.issuer_code : '');
		let issuer_name = (props.awbInfoRecord.issuer_name ? props.awbInfoRecord.issuer_name : '');

		if(issuer_code == '' || issuer_name == '') {
			agent = undefined;
		}

		this.state = {
			awbInfoRecord: props.awbInfoRecord,
			station: props.operatingStation,
			awb_no: '',
			dest: (props.awbInfoRecord.dest ? props.awbInfoRecord.dest : ''),
			disable_select_agent: agent != undefined,
			issuer_name: issuer_name,
			issuer_src: (agent ? agent.station : props.operatingStation),
			issuer_code: issuer_code,
			shc: props.awbInfoRecord.shc,
			pieces: 0,
			weight: 0,
			rcs_table_records: [],
			awb_info_minimum_pieces_to_enter: 0,
			errors: {destination_error: '', issuer_name_error: '', pieces_error: '', weight_error: '', },
		}
		
	}

	componentDidMount() {
		this.existingRCSRecords(this.state.awbInfoRecord.awb_no, this.state.awbInfoRecord.station);
	}

	existingRCSRecords = (awbNo,station) => {
		let rcsAWBNo =  awbNo;
		let rcsStation = station;
		let queryParams = {awbNo: rcsAWBNo, from: rcsStation} ;
		// let mySocket = io.sails.connect('http://localhost:1337');
		APIService.get('/getExistingRecords', queryParams, function(results, status) {
			if(results) {
				this.setState({rcs_table_records: results});
				console.log('record found. '+ JSON.stringify(results));
			}
		}.bind(this));
	}

	destinationChanged = (event) => {
		this.setState({dest: event.target.value});
	}

	agentSourceChanged = (event) => {
		this.setState({issuer_src: event.target.value, issuer_code: '', issuer_name: ''});
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
		let agent = (window.agent_records.find(agent => agent.billing_code === issuer_code) ?? {});
		let issuer_name = agent.name ?? "";
		this.setState({issuer_name, issuer_code});
	}

	callbackSHC = (shcData) => {
		this.setState({shc: shcData/*.map(each_shc => each_shc.code)*/});
	}

	pieces = (event) => {
		let errors = this.state.errors;
		let awb_info_minimum_pieces_to_enter = 0;
		if (this.state.rcs_table_records.length > 0){
			for (let i=0 ; i<this.state.rcs_table_records.length ; i++){
				awb_info_minimum_pieces_to_enter += this.state.rcs_table_records[i].pieces;
			}
			this.setState({awb_info_minimum_pieces_to_enter: awb_info_minimum_pieces_to_enter});
		}
		let rules = [{text: event.target.value,	 regex_name: 'min_number', errmsg: 'Please enter min ' + awb_info_minimum_pieces_to_enter + ' Piece(s)', min: awb_info_minimum_pieces_to_enter, required: true}];
		let isValidatedPieces = window.validate(rules);
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

	rcsPendingAction = () =>{
		let errors = this.state.errors;
		if(!this.state.dest){
			errors.destination_error= 'select destination';
			this.setState({errors});
		} else{
			errors.destination_error = '';
			this.setState({errors});
		}
		
		if(this.state.issuer_code == ''){
			errors.issuer_name_error= 'Please select Issuer Name';
			this.setState({errors});
		} else{
			errors.issuer_name_error = '';
			this.setState({errors});
		}

		if(!this.state.pieces){
			errors.pieces_error= 'enter pieces';
			this.setState({errors});
		} else{
			errors.pieces_error = '';
			this.setState({errors});
		}

		if(!this.state.weight){
			errors.weight_error= 'enter weight';
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
			APIService.post('/updateAwbInfo', {
				awb_no: this.state.awbInfoRecord.awb_no,
				station: this.state.station,
				dest: this.state.dest,
				issuer_name: this.state.issuer_name,
				issuer_code: this.state.issuer_code,
				shc: this.state.shc,
				pieces: this.state.pieces,
				weight: this.state.weight,
			}, function(data, status)  {
					if(data) {
						window.swal_success('The AWB Info is saved successfully');
					}	
					else
						console.log(status);
					
			});
			this.closeRCSPendingModal();
		}
	}

	closeRCSPendingModal = (event) =>{
		this.props.closeRCSPendingModal();
	}

	renderRCSTableRecord = (rcsTableRecord, index) => {
		return (
		  <tr key={index}>
			<td>{rcsTableRecord.flight_no}</td>
			<td>{window.moment(rcsTableRecord.planned_departure).format("DD/MM/YYYY")}</td>
			<td>{rcsTableRecord.pieces}</td>
			<td>{rcsTableRecord.weight}</td>
		  </tr>
		)
	  }
	
	render() {
		let rcsTableRecords = this.state.rcs_table_records;
		return (
			<Observer>{()=>
			
			<div>
				<div className="modal-header">
					<h4 className="modal-title">
						<span>
							<i className="fa fa-edit"></i>
						</span>
						<label className="ml-2" id="rcsPendingModalEditTitle">RCS Pending for 
						<NavigationButton awb_no={this.state.awbInfoRecord.awb_no} tabNumber={this.state.tabNumber} MainStore={this.props.MainStore} onCloseModal={this.closeRCSPendingModal}/>
											{/* <span>-<PriorityClass PriorityClass={this.state.priorityClass} /></span> */}
											</label>
					</h4>
					<button className="close" type="button" onClick={this.closeRCSPendingModal}>×</button>
				</div>
				<div className="modal-body">
					<div className="row">
						<div className="col-md-6">
							<label className="control-label">Origin</label>
							<input className="form-control form-white" id="rcsPendingModalSrcInput"  type="text" name="rcsPendingModalSrcInput" defaultValue={this.state.awbInfoRecord.src} text={this.state.awbInfoRecord.src} autoComplete="off" required="" disabled="true"/>
						</div>
						<div className="col-md-6">
							<label className="control-label">Destination</label>
							<select className="p-0 select3 form-control custom-select browser-default" defaultValue={this.state.awbInfoRecord.dest} text={this.state.awbInfoRecord.dest} id="rcsPendingModalDestinationSelect" type="text" onChange={this.destinationChanged} disabled={this.state.awbInfoRecord.dest}>
							{
								window.station_records.map(station =>
									<option value={station.iata}>{station.iata} - {station.name}</option>)
							}
							</select>
							<label className="text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
							{this.state.errors.destination_error ? this.state.errors.destination_error : ""}
						</label>
						</div>
					</div>
					<div className="row">
						<div className="col-md-3">
							<label className="control-label">Pieces</label>
							<input className="form-control form-white" id="rcsPendingModalPiecesInput" placeholder="Enter Pieces" type="text" name="rcsPendingModalPiecesInput" autoComplete="off" required="" onChange={this.pieces}/>
						</div>
						<div className="col-md-3">
							<label className="control-label">Weight</label>
							<input className="form-control form-white" id="rcsPendingModalWeightInput" placeholder="Enter Weight" type="text" name="rcsPendingModalWeightInput" autoComplete="off" required="" onChange={this.weight}/>
						</div>
						<div className="col-md-6">
							<label className="control-label">Issuer Name</label>
							<div className="row">
								<select className="col-2 select2 form-control custom-select p-0 browser-default" id="addNewAWBModalAgentSourceSelect" type="text" onChange={this.agentSourceChanged} disabled={this.state.disable_select_agent}>
									{/* <option value={this.props.MainStore.operatingStation}>{this.props.MainStore.operatingStation}</option> */}
									{
										["AMD", "BOM","BLR", "CCU", "DEL", "HYD", "JAI", "MAA"].map(s => <option selected={s == this.state.issuer_src} value={s}>{s}</option>)
									}
								</select>
								<select className="col-9 p-0 select3 form-control custom-select browser-default" id="rcsPendingModalIssuerNameInput" type="text" onChange={this.agentSelected} disabled={this.state.disable_select_agent}>
									<option value="" selected>Select an Agent</option>
								{
									window.agent_records.filter(agent => agent.station == this.state.issuer_src).map(agent =>
									<option selected={agent.billing_code === this.state.issuer_code} key={agent.billing_code} value={agent.billing_code}>{agent.name} __ ({agent.billing_code} - {this.state.issuer_src})</option>)
								}
								</select>
							</div>
						</div>
					</div>					
					<div className="row">
						<label className="col-md-4 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
							{this.state.errors.pieces_error ? this.state.errors.pieces_error : ""}
						</label>
						<label className="col-md-4 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
							{this.state.errors.weight_error ? this.state.errors.weight_error : ""}
						</label>
						<label className="col-md-4 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
							{this.state.errors.issuer_name_error ? this.state.errors.issuer_name_error : ""}
						</label>	
					</div>
					<label className="control-label">Short handling codes</label>
					<SHCMultiSelect selectedSHC={this.state.shc} shcCallback = {this.callbackSHC}/>
					<div className="col-12">
						<label className="control-label">Existing Planned Records</label>
						<Table bordered  size="sm">
							<thead>
								<tr>
									<th><strong className="text-info">Flight No.</strong></th>
									<th><strong className="text-info">Date</strong></th>
									<th><strong className="text-info">Pieces</strong></th>
									<th><strong className="text-info">Weight</strong></th>
								</tr>
							</thead>
							<tbody>
							{rcsTableRecords.map(this.renderRCSTableRecord)}
							</tbody>
						</Table>

					</div>
				</div>
				<div className="modal-footer col-md-12">
					<button className="btn btn-success waves-effect waves-light save-category" id="rcsPendingModalRCSDone" type="button" name="rcsPendingModalRCSDone" onClick={() => this.rcsPendingAction()}>
						<i className="fas fa-save" aria-hidden="true"></i>&nbsp;&nbsp;RCS DONE
					</button>
				</div>
			</div>
			}</Observer>
			
		);
	}
}
export default RCSPendingModal;
