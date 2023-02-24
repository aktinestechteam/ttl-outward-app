import React, { Component } from "react";
import custom from '../../config/custom.js';
import AWBQueryRecords from './AWBQueryRecords.js';
import { Observer } from "mobx-react"


class AWBQuery extends Component {
	constructor(props) {
		super(props);
		this.state = {
			awbQueryRecords: props.awbQueryRecords,
		}
	}

	componentWillReceiveProps(newProps) {
		this.setState({awbQueryRecords: newProps.awbQueryRecords});
	}

	// handleRCSPendingModalChange = (awbInfoRecord) =>{
	// 	console.log('rcspendingawb handleRCSPendingModalChange====> '+JSON.stringify(awbInfoRecord));
	// 	this.props.openRCSPendingModal(awbInfoRecord)
	// }
	
	render() {

		// console.log('accessing mainStore : '+ this.props.mainStore.departmentIs);
		console.log('in awbquery render' +JSON.stringify(this.props.awbQueryRecords) );

		return (
			<Observer>{()=>
			<div>
				{this.state.awbQueryRecords.length ? this.state.awbQueryRecords.map((awbQueryRecord) => {
					console.log('rcspendingawb map awbinforecord====> '+JSON.stringify(awbQueryRecord));
					return (
					<AWBQueryRecords awbQueryRecord = {awbQueryRecord} key={awbQueryRecord.id} MainStore={this.props.MainStore}/>
					
					)
				}) : <div>No AWB Queries to show</div>}
			</div>
			}</Observer>
			
		);
	}
}
export default AWBQuery;