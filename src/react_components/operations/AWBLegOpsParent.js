import React, { Component } from 'react'
import custom from '../../config/custom.js';
import LegOps from './LegOps.js';
import { Observer } from "mobx-react"
import MainStore from '../MainStore.js';

let pageSize = 10;

class AWBLegOpsParent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			legops : props.legops,
			type : props.type,
			status : props.status,
			queue_duration : props.queue_duration,
			modalawbNo:MainStore.modalawbNo,
			page: 1
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({legops: newProps.legops});
	}

	handleModalChange = (legop) =>{
		this.props.openModal(legop)
	}

	handlePageChangeClick = () => {
		let maxPage = Math.ceil(this.state.legops.length / pageSize);
		this.setState({page: (this.state.page + 1 <= maxPage) ? this.state.page + 1 : 1});
	}

	render() {
		//- console.log("type  : " + this.state.type);
		//- console.log("status  : " + this.state.status);
		//- console.log("legops  : " + this.state.legops);
		let bgColor = " bg-secondary ";
		if((this.state.status === custom.custom.awb_leg_ops_status.ready_to_rate_check) || (this.state.status === custom.custom.awb_leg_ops_status.ready_to_fdc) || (this.state.status === custom.custom.awb_leg_ops_status.ready_to_recovery)||(this.state.status === custom.custom.awb_leg_ops_status.p2_escalation)||(this.state.status === custom.custom.awb_leg_ops_status.p1_escalation)||(this.state.status === custom.custom.awb_leg_ops_status.awb_query_pending)||(this.state.status === custom.custom.awb_leg_ops_status.escalation)){
			bgColor = " bg-dark ";
		} else if((this.state.status === custom.custom.awb_leg_ops_status.rate_check_pending) || (this.state.status === custom.custom.awb_leg_ops_status.rate_check_referred) || (this.state.status === custom.custom.awb_leg_ops_status.rate_check_hold) || (this.state.status === custom.custom.awb_leg_ops_status.rms_review) || (this.state.status === custom.custom.awb_leg_ops_status.rms_hub_review) || (this.state.status === custom.custom.awb_leg_ops_status.fdc_pending)){
			bgColor = " bg-dark ";
		} else if(this.state.status === custom.custom.awb_leg_ops_status.rcf_pending){
			bgColor = " bg-primary ";
		}

		return (
			<Observer>{()=>
			<div className="col-2">
				<div className={bgColor + "text-center"} onClick={this.handlePageChangeClick}>
					<label className="text-white font-10">{this.state.type}</label>
					<strong className="ml-2 text-warning font-10">{this.state.page}/{Math.ceil(this.state.legops.length / pageSize)}</strong>
				</div>
				{(this.state.legops.length) ? this.state.legops.slice((this.state.page - 1) * pageSize, this.state.page * pageSize).map((legop_record, index) => {
					return (
					<LegOps legop_record = {legop_record} lockedOpsData={this.props.lockedOpsData}
					queue_duration={this.state.queue_duration} 
					key={legop_record.id} type = {this.state.type}
					 status = {this.state.status} 
					 openModal={this.handleModalChange} queueTimerOut={this.props.queueTimerOut}/>)
				}) : <div>No Tasks</div>}
				<br></br>
				<br></br>
				<br></br>
			</div>
			
			}</Observer>
			
		);
	}
}

export default AWBLegOpsParent;
