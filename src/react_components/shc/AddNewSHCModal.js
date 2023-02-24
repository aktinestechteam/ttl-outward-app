import React, { Component } from "react";
import axios from 'axios';
import APIService from "../APIService";

export default class AddNewSHCModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: (props.editSHCId ? props.editSHCId : ''),
			shc_code: (props.editSHCCode ? props.editSHCCode : ''),
			explanation: (props.editSHCExplanation ? props.editSHCExplanation : ''),
			errors: {shc_code_error: '', explanation_error: '', id_error: ''},
		}
	}

	shcCode = (event) => {
		// let errors = this.state.errors;
		// let rules = [{text: event.target.value,	regex_name: 'free_text', 	 errmsg: 'Please Enter SHC Code ', min: 4, required: true}];
		// let isValidatedSHCCode = validate(rules );
		// console.log('isValidatedSHCCode ' + JSON.stringify(isValidatedSHCCode));
		// if(isValidatedSHCCode.errmsg){
		// 	errors.shc_code_error= isValidatedSHCCode.errmsg;
		// 	this.setState({errors});
		// } else{
		// 	errors.shc_code_error = '';
		// 	this.setState({errors});
			this.setState({shc_code: event.target.value});
		// }
	}

	explanation = (event) => {
		// let errors = this.state.errors;
		// let rules = [{text: event.target.value,	regex_name: 'free_text', 	 errmsg: 'Please Enter Explanation ', required: true}];
		// let isValidatedExplanation = validate(rules );
		// console.log('isValidatedExplanation ' + JSON.stringify(isValidatedExplanation));
		// if(isValidatedExplanation.errmsg){
		// 	errors.explanation_error= isValidatedExplanation.errmsg;
		// 	this.setState({errors});
		// } else{
		// 	errors.explanation_error = '';
		// 	this.setState({errors});
			this.setState({explanation: event.target.value});
		// }
	}

	addNewSHCSaveAction = () =>{
		let errors = this.state.errors;
		
		if(!this.state.shc_code){
			errors.shc_code_error= 'required field';
			this.setState({errors});
		} else{
			errors.shc_code_error = '';
			this.setState({errors});
		}

		if(!this.state.explanation){
			errors.explanation_error= 'select destination';
			this.setState({errors});
		} else{
			errors.explanation_error = '';
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
			data.append('shc_shc_code',this.state.shc_code)
			data.append('shc_explanation', this.state.explanation)
			data.append('shc_id', this.state.id)
			// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/addShcCode`, data, 
			// 	// receive two    parameter endpoint url ,form data
			// 	JwtToken.getJwtTokenHeader())
			
			APIService.post('/addShcCode', data,
			res => { // then print response status
				console.log(res.result)
				window.swal_success("SHC code added successfully");
			})
			this.onFetchTableData();
		}
	}
	
	addNewSHCDeleteAction = () =>{
		let errors = this.state.errors;
		
		if(!this.state.id){
			errors.id_error= 'invalid operation';
			this.setState({errors});
		} else{
			errors.id_error = '';
			this.setState({errors});
		}

		if(!this.state.shc_code){
			errors.shc_code_error= 'required field';
			this.setState({errors});
		} else{
			errors.shc_code_error = '';
			this.setState({errors});
		}

		if(!this.state.explanation){
			errors.explanation_error= 'select destination';
			this.setState({errors});
		} else{
			errors.explanation_error = '';
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
			data.append('shc_id', this.state.id)
			// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/deleteShcCodes`, data,
			// 	// receive two    parameter endpoint url ,form data
			// 	JwtToken.getJwtTokenHeader())
			APIService.post('/deleteShcCodes', data,
			res => { // then print response status
				console.log(res.result)
				window.swal_success("SHC code deleted successfully");
			})
			this.onFetchTableData();
		}
	}

	onCloseModal = (event) =>{
		this.props.closeAddNewSHCModal();
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
							<i className="mdi mdi-airplane" id="modal_title"> Add New SHC</i>
						</h4>
						<button className="close" type="button" onClick={this.onCloseModal}>×</button>
					</div>
					<div className="modal-body">
						<div className="row">
							<div className="col-lg-4" id="addNewSHCModalCode">
								<label className="control-label">SHC Code</label>
								<input className="form-control col-md-12 form-white" id="addNewSHCModalCodeInput" type="text" value={this.state.shc_code} required="" onChange={this.shcCode}/>
							</div>
							<div className="col-lg-8" id="addNewSHCModalExplanation">
								<label className="control-label">Explanation</label>
								<input className="form-control col-md-12 form-white" id="addNewSHCModalExplanationInput" type="text" value={this.state.explanation} required="" onChange={this.explanation}/>
							</div>
						</div>
						<div className="row">
							<label className="col-md-4 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.shc_code_error ? this.state.errors.shc_code_error : ""}
							</label>
							<label className="col-md-8 text-danger" style={{fontSize: "14px",fontWeight:" 400"}}>
								{this.state.errors.explanation_error ? this.state.errors.explanation_error : ""}
							</label>
						</div>
					</div>
					<div className="modal-footer">
						<button className="btn btn-info waves-effect waves-light save-category" id="addNewSHCModalSaveBtn" type="button" name="outwardcargo_airport_list_id_save" onClick={this.addNewSHCSaveAction}>
							<i className="fa fa-edit" aria-hidden="true"></i>&nbsp;&nbsp;Save
						</button>
						<button className="btn btn-secondary waves-effect" type="button" id="addNewSHCModalCloseBtn" onClick={this.onCloseModal}>
							<i className="fa fa-times-circle" aria-hidden="true"></i>&nbsp;&nbsp;Close
						</button>
						<button className="btn btn-danger waves-effect" type="button" id="addNewSHCModalDeleteBtn" onClick={this.addNewSHCDeleteAction}>
							<i className="fa fa-times-circle" aria-hidden="true"></i>&nbsp;&nbsp;Delete
						</button>
					</div>
				</div>
			</div>
		);
	}
}