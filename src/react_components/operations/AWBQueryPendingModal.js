import React, { Component } from "react";
import custom from '../../config/custom.js';
import { Observer } from "mobx-react"
import AWBLegDetails from "./AWBLegDetails.js"
import APIService from "../APIService.js";


class AWBQueryPendingModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			legop_record: props.legop_record,
			reason: "",
			ba80_notes: "",
		}
	}



	awbQueryPendingAction = (legop_record) =>{
		let errors = this.state.errors;
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
			APIService.post('/awbQueryPending', {
				awb_legop_id: legop_record.id,
				awb_leg_id: legop_record.awb_leg.id,
				reason: this.state.reason,
				ba80_notes: this.state.ba80_notes,
				pieces: this.state.pieces,
				weight: this.state.weight,
				awb_no: legop_record.awb_no,
				station: legop_record.station,
				closing_status: custom.custom.awb_leg_ops_status.rcf_done,
				created_by: legop_record.awb_leg.created_by,
				from: legop_record.awb_leg.from
			}, function(data, status)  {
					if(data){
						console.log(data);
					}
					else
						console.log(status);
			});
			this.onCloseModal();
		}
	}

	onCloseModal = (event) =>{
		this.props.closeModal();
	}
	
	render() {
		console.log('legop record in modal rendering'+ JSON.stringify(this.state.legop_record.awb_no));
		return (
			<Observer>
				{()=>
				<div>
					<div className="modal-header">
						<h4 className="modal-title">
							<span>
								<i className="fa fa-delete"></i>
							</span>
							<label className="ml-2" id="awbQueryPendingModalEditTitle">AWB Query Pending {this.state.legop_record.awb_no}</label>
						</h4>
						<button className="close" type="button" onClick={this.onCloseModal}>×</button>
					</div>
					<div className="modal-body">
						<AWBLegDetails AWBLegDetails={this.state.legop_record.awb_leg}/>
						<h3>pending</h3>
					</div>
					<div className="modal-footer">
						<button className="btn btn-danger waves-effect waves-light save-category" id="awbQueryPendingModalAction" type="button" name="awbQueryPendingModalAction" onClick={() => this.awbQueryPendingAction(this.state.legop_record)}>
							<i className="fas fa-save" aria-hidden="true"></i>&nbsp;&nbsp;Done
						</button>
					</div>
				</div>
				}
			</Observer>
				
		);
	}
}
export default AWBQueryPendingModal;