import React, { Component } from "react";
import custom from '../../config/custom.js';
import AWBLegRecords from './AWBLegRecords.js';
import { Observer } from "mobx-react"


class TobePlannedAWB extends Component {
	constructor(props) {
		super(props);
		this.state = {
			awbLegRecords: props.awbLegRecords,
		}
	}
	
	componentWillReceiveProps(newProps) {
		this.setState({awbLegRecords: newProps.awbLegRecords});
	}

	handleTobePlannedModalChange = (awbLegRecord) =>{
		this.props.openTobePlannedModal(awbLegRecord)
	}
	
	render() {
		return (
			<Observer>{()=>
			<div>
				{this.state.awbLegRecords.length ? this.state.awbLegRecords.map((awbLegRecord) => {
					return (
					<AWBLegRecords awbLegRecord = {awbLegRecord} key={awbLegRecord.id}  openTobePlannedModal={this.handleTobePlannedModalChange}/>)
				}) : <div>No AWBlegs to plan</div>}
			</div>
			}</Observer>
			
		);
	}
}
export default TobePlannedAWB;