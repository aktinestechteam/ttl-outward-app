import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Observer } from "mobx-react"
import NavigationButton from "../shared/NavigationButton";
import APIService from "../APIService";

class TobePlannedModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			awbLegRecord: props.awbLegRecord,
			pieces: '',
			weight: '',
			to_be_planned_table_records: [],
			selectedFlightDetails: props.flightSelectorDetails,
			errors: {pieces_error: '', weight_error: ''},
		}
	}

	componentDidMount() {
		if (this.state.selectedFlightDetails){
			this.existingTobePlannedRecords(this.state.awbLegRecord.awb_no, this.state.awbLegRecord.station);
		}
		else{
			window.swal_error('Please select flight first')
			this.closeTobePlannedModal();
		}
	}

	existingTobePlannedRecords = (awbNo,station) => {
		let awbNumber =  awbNo;
		let operatingStation = station;
		let queryParams = {awbNo: awbNumber, from: operatingStation} ;
		let mySocket = window.io.sails.connect(`${process.env.REACT_APP_API_BASE_PATH}`);
		APIService.get('/getExistingRecords', queryParams, function(results, status) {
			if(results) {
				this.setState({to_be_planned_table_records: results});
				console.log('record found. '+ JSON.stringify(results));
			}
		}.bind(this));

	}

	pieces = (event) => {
		let remaining_pieces = Math.abs(this.state.awbLegRecord.pieces);
		let errors = this.state.errors;
		let rules = [{text: event.target.value,	regex_name: 'min_number', 	 errmsg: 'Please enter minimum 1 Piece' + (remaining_pieces > 1 ? ' & maximum ' + remaining_pieces + ' pieces' : ''), min: 1, required: true},{text: event.target.value,	regex_name: 'max_number', 	 errmsg: 'Maximum pieces to enter are '+ remaining_pieces , max: remaining_pieces, required: true}];
		let isValidatedToBePlanned = window.validate(rules );
		console.log('isValidatedToBePlanned ' + JSON.stringify(isValidatedToBePlanned));
		if(isValidatedToBePlanned.errmsg){
			errors.pieces_error= isValidatedToBePlanned.errmsg;
			this.setState({errors});
		} else{
			errors.pieces_error = '';
			this.setState({errors});
			this.setState({pieces: event.target.value});
		}
	}

	weight = (event) => {
		let errors = this.state.errors;
		let rules = [{text: event.target.value, regex_name: 'min_number', 	 errmsg: 'Please enter weight more than 0 Kg.', min: 0.0001, required: true},{text: event.target.value, regex_name: 'any_number', 	 errmsg: 'Please enter proper weight values', allow_decimal: true, required: true}];
		let isValidatedToBePlanned = window.validate(rules );
		console.log('isValidatedToBePlanned ' + JSON.stringify(isValidatedToBePlanned));
		if(isValidatedToBePlanned.errmsg){
			errors.weight_error= isValidatedToBePlanned.errmsg;
			this.setState({errors});
		} else{
			errors.weight_error = '';
			this.setState({errors});
			this.setState({weight: event.target.value});
		}
	}


	tobePlannedAction = () =>{
		let errors = this.state.errors;
		if(!this.state.pieces){
			errors.pieces_error= 'required field';
			this.setState({errors});
		} else{
			errors.pieces_error = '';
			this.setState({errors});
		}
		if(!this.state.weight){
			errors.weight_error= 'required field';
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
			let mySocket = window.io.sails.connect(`${process.env.REACT_APP_API_BASE_PATH}`);
			APIService.post('/addAwbLeg', {
				awb_leg_id: this.state.awbLegRecord.id,
				pieces: this.state.pieces,
				weight: this.state.weight,
				station: this.state.awbLegRecord.station,
				awb_no: this.state.awbLegRecord.awb_no,
				created_by: this.state.awbLegRecord.created_by,
				to: this.state.selectedFlightDetails.destination,
				from: this.state.selectedFlightDetails.source,
				flightsSelectorModal: this.state.selectedFlightDetails.flightDetails,
			}, function(data, status)  {
					if(data){
						window.swal_success('The AWB leg is Planned successfully');
					}
					else {
						console.log('status will receieve'+status);
					}
			});
			this.closeTobePlannedModal();
		}
	}

	closeTobePlannedModal = (event) =>{
		this.props.closeTobePlannedModal();
	}
	
	renderToBePlannedTableRecord = (toBePlannedTableRecord, index) => {
		return (
			<tr key={index}>
				<td>{toBePlannedTableRecord.flight_no}</td>
				<td>{window.moment(toBePlannedTableRecord.planned_departure).format("DD/MM/YYYY")}</td>
				<td>{toBePlannedTableRecord.pieces}</td>
				<td>{toBePlannedTableRecord.weight}</td>
				<td>{toBePlannedTableRecord.actual_pieces_flown}</td>
				<td>{toBePlannedTableRecord.actual_weight_flown}</td>
			</tr>
		)
	}
	
	render() {
		let toBePlannedTableRecords = this.state.to_be_planned_table_records;
		// console.log('this.state.awbLegRecord ===>'+JSON.stringify(this.state.awbInfoRecord));
		let pieces_to_show = Math.abs(this.state.awbLegRecord.pieces);
		let weight_to_show = Math.abs(this.state.awbLegRecord.weight);

		return (
			<Observer>{()=>
			<div>
				<div className="modal-header">
					<h4 className="modal-title">
						<span>
							<i className="fa fa-edit"></i>
						</span>
						<label className="ml-2" id="tobePlannedModalEditTitle">Plans AWB for 
						<NavigationButton awb_no={this.state.awbLegRecord.awb_no} tabNumber={this.state.tabNumber} MainStore={this.props.MainStore} onCloseModal={this.closeTobePlannedModal}/>

						</label>
					</h4>
					<button className="close" type="button" onClick={this.closeTobePlannedModal}>×</button>
				</div>
				<div className="modal-body">
					<div className="row">
						<div className="h4">Available for Planning - 
							<span className="badge badge-warning m-2" id="tobePlannedModalRemainingPieces">{pieces_to_show} Pcs. </span>
							<span className="badge badge-info m-2" id="tobePlannedModalRemainingWeight">{weight_to_show} Kg.</span>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6">
							<label className="control-label">Pieces in Leg</label>
							<input className="form-control form-white" id="tobePlannedModalLegPiecesInput" placeholder="Enter Pieces" type="text" name="tobePlannedModalLegPiecesInput" autoComplete="off" required="" onChange={this.pieces}/>
						</div>
						<div className="col-md-6">
							<label className="control-label">Weight in Leg</label>
							<input className="form-control form-white" id="tobePlannedModalLegWeightInput" placeholder="Enter Weight" type="text" name="tobePlannedModalLegWeightInput" autoComplete="off" required="" onChange={this.weight}/>
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
						<div className="col-12">
							<label className="control-label">Existing Planned Records</label>
							<Table  bordered  size="sm">
								<thead>
									<tr>
										<th>Flight No.</th>
										<th>Date</th>
										<th>Planned Pieces</th>
										<th>Planned Weight</th>
										<th>Flown Pieces</th>
										<th>Flown Weight</th>
									</tr>
								</thead>
								<tbody>
									{toBePlannedTableRecords.map(this.renderToBePlannedTableRecord)}
								</tbody>
							</Table>
						</div>
					</div>
				</div>
				<div className="modal-footer col-md-12">
					<button className="btn btn-success waves-effect waves-light save-category" id="tobePlannedModalPlanLeg" type="button" name="tobePlannedModalPlanLeg" onClick={() => this.tobePlannedAction()}>
						<i className="fas fa-save" aria-hidden="true"></i>&nbsp;&nbsp;Plan 
					</button>
				</div>
			</div>
			}</Observer>
			
		);
	}
}
export default TobePlannedModal;