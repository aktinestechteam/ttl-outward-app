import React, { Component } from "react";
import axios from 'axios';
import custom from '../../config/custom.js';
import APIService from "../APIService.js";

export default class AddNewReasonModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: (props.editReasonId ? props.editReasonId : ''),
			category: (props.editReasonCategory ? props.editReasonCategory : ''),
			code: (props.editReasonCode ? props.editReasonCode : ''),
			explanation: (props.editReasonExplanation ? props.editReasonExplanation : ''),
			make_it_visible: (props.editReasonMakeItVisible ? props.editReasonMakeItVisible : false),
			errors: {category_error: '', code_error: '', explanation_error: '', id_error: ''},
		}
	}

	reasonCode = (event) => {
		// let errors = this.state.errors;
		// let rules = [{text: event.target.value,	regex_name: 'free_text', errmsg: 'Please enter proper Reason Code ', required: true}];
		// let isValidatedReasonCode = validate(rules );
		// console.log('isValidatedReasonCode ' + JSON.stringify(isValidatedReasonCode));
		// if(isValidatedReasonCode.errmsg){
		// 	errors.code_error= isValidatedReasonCode.errmsg;
		// 	this.setState({errors});
		// } else{
		// 	errors.code_error = '';
		// 	this.setState({errors});
			this.setState({code: event.target.value.toUpperCase()});
		// }
	}

	explanation = (event) => {
		// let errors = this.state.errors;
		// let rules = [{text: event.target.value,	regex_name: 'free_text', 	 errmsg: 'Please Enter Explanation ', min: 10, required: true}];
		// let isValidatedExplanation = validate(rules );
		// console.log('isValidatedExplanation ' + JSON.stringify(isValidatedExplanation));
		// if(isValidatedExplanation.errmsg){
		// 	errors.explanation_error= isValidatedExplanation.errmsg;
		// 	this.setState({errors});
		// } else{
		// 	errors.explanation_error = '';
		// 	this.setState({errors});
			this.setState({explanation: event.target.value.toUpperCase()});
		// }
	}

	category = (event) => {
		this.setState({category: event.target.value});
	}

	makeItVisible = (event) => {
		console.log("checkbox change "+ this.state.checked);
		this.setState({make_it_visible: !this.state.make_it_visible});
	}

	addNewReasonSaveAction = () =>{
		let errors = this.state.errors;
		
		if(!this.state.code){
			errors.code_error= 'required field';
			this.setState({errors});
		} else{
			errors.code_error = '';
			this.setState({errors});
		}

		if(!this.state.explanation){
			errors.explanation_error= 'required field';
			this.setState({errors});
		} else{
			errors.explanation_error = '';
			this.setState({errors});
		}

		if(!this.state.category){
			errors.category_error= 'Select Category';
			this.setState({errors});
		} else{
			errors.category_error = '';
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
			data.append('id',this.state.id)
			data.append('category', this.state.category)
			data.append('code', this.state.code)
			data.append('explanation',this.state.explanation)
			data.append('make_it_visible', this.state.make_it_visible)
			// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/addReason`, data,  
			// 	// receive two    parameter endpoint url ,form data
			// 	JwtToken.getJwtTokenHeader())
			APIService.post('/addReason', data,
			res => { // then print response status
				console.log(res.result)
				window.swal_success("Reason added successfully");
			})
			this.onFetchTableData();
		}
	}
	
	addNewReasonDeleteAction = () =>{
		let errors = this.state.errors;
		
		if(!this.state.id){
			errors.id_error= 'invalid operation';
			this.setState({errors});
		} else{
			errors.id_error = '';
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
			data.append('reason_id', this.state.id)
			// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/deleteReason`, data,
			// 	// receive two    parameter endpoint url ,form data
			// 	JwtToken.getJwtTokenHeader())
			APIService.post('/deleteReason', data,
			res => { // then print response status
				console.log(res.result)
				window.swal_success("Reason deleted successfully");
			})
			this.onFetchTableData();
		}
	}

	onCloseModal = (event) =>{
		this.props.closeAddNewReasonModal();
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
							<i className="mdi mdi-airplane" id="modal_title"> Add New Reason</i>
						</h4>
						<button className="close" type="button" onClick={this.onCloseModal}>×</button>
					</div>
					<div className="modal-body">
						<div className="row">
							<div className="col-md-6">
								<label className="control-label">Category</label>
								<select className="select2 form-control custom-select browser-default" id="addNewReasonModalCategorySelect" type="text" value={this.state.category} onChange={this.category}>
									<option>Select Category</option>
									<option value={custom.custom.reason_category.offload_controllable}>{custom.custom.reason_category.offload_controllable}</option>
									<option value={custom.custom.reason_category.offload_uncontrollable}>{custom.custom.reason_category.offload_uncontrollable}</option>
									<option value={custom.custom.reason_category.short_ship}>{custom.custom.reason_category.short_ship}</option>
									<option value={custom.custom.reason_category.cca}>{custom.custom.reason_category.cca}</option>
								</select>
							</div>
							<div className="col-md-6">
								<label className="control-label">Reason Code</label>
								<input className="form-control form-white" id="addNewReasonModalCodeInput" name="addNewReasonModalCodeInput" placeholder="Enter Reason Code" type="text"  required="" value={this.state.code} onChange ={this.reasonCode}/>
							</div>
						</div>
						<div className="row">
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.category_error ? this.state.errors.category_error : ""}
							</label>
							<label className="col-md-6 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.code_error ? this.state.errors.code_error : ""}
							</label>
						</div>
						<div className="row">
							<div className="col-md-12">
								<label className="control-label">Explanation</label>
								<input className="form-control form-white" id="addNewReasonModalExplanationInput" name="addNewReasonModalExplanationInput" placeholder="Enter Explanation" type="text"  required=""  value={this.state.explanation} onChange ={this.explanation}/>
							</div>
						</div>
						<div className="row">
							<label className="col-md-12 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.explanation_error ? this.state.errors.explanation_error : ""}
							</label>
						</div>
						<div className="row">
							<div className="col-lg-4"></div>
								<label className="customcheckbox col-md-10" style={{fontSize: "16px",fontWeight: "600"}}>Make the Reason available to choose
									<input className="listCheckbox col-md-2" id="addNewReasonModalIsOutwardInput" type="checkbox" onChange={this.makeItVisible} checked={this.state.make_it_visible}/>
										<span className="checkmark"></span>
								</label>
						</div>
					</div>
					<div className="modal-footer">
						<button className="btn btn-info waves-effect waves-light save-category" id="addNewReasonModalSaveBtn" type="button" onClick={this.addNewReasonSaveAction}>
							<i className="fa fa-edit" aria-hidden="true"></i>&nbsp;&nbsp;Save
						</button>
						<button className="btn btn-secondary waves-effect" type="button" id="addNewReasonModalCloseBtn" onClick={this.onCloseModal}>
							<i className="fa fa-times-circle" aria-hidden="true"></i>&nbsp;&nbsp;Close
						</button>
						<button className="btn btn-danger waves-effect" type="button" id="addNewReasonModalDeleteBtn" onClick={this.addNewReasonDeleteAction}>
							<i className="fa fa-times-circle" aria-hidden="true"></i>&nbsp;&nbsp;Delete
						</button>
					</div>
				</div>
			</div>
		);
	}
}