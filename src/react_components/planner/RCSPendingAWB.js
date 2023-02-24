import React, { Component } from "react";
import custom from '../../config/custom.js';
import AWBInfoRecords from './AWBInfoRecords.js';
import { Observer } from "mobx-react"


class RCSPendingAWB extends Component {
	constructor(props) {
		super(props);
		this.state = {
			awbInfoRecords: props.awbInfoRecords,
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({awbInfoRecords: newProps.awbInfoRecords});
	}

	handleRCSPendingModalChange = (awbInfoRecord) =>{
		console.log('rcspendingawb handleRCSPendingModalChange====> '+JSON.stringify(awbInfoRecord));
		this.props.openRCSPendingModal(awbInfoRecord)
	}
	
	render() {
		return (
			<Observer>{()=>
			<div>
				{this.state.awbInfoRecords.length ? this.state.awbInfoRecords.map((awbInfoRecord) => {
					// console.log('rcspendingawb map awbinforecord====> '+JSON.stringify(awbInfoRecord));
					return (
					<AWBInfoRecords awbInfoRecord = {awbInfoRecord} key={awbInfoRecord.id} openRCSPendingModal={this.handleRCSPendingModalChange}/>
					
					)
				}) : <div>No AWBs to show</div>}
			</div>
			}</Observer>
			
		);
	}
}
export default RCSPendingAWB;