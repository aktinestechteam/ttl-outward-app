import React, { Component } from "react";
import custom from '../../config/custom.js';
import AWBClaimRecords from './AWBClaimRecords.js';
import { Observer } from "mobx-react"


class AWBClaim extends Component {
	constructor(props) {
		super(props);
		this.state = {
			awbClaimRecords: props.awbClaimRecords,
		}
	}
	
	componentWillReceiveProps(newProps) {
		this.setState({awbClaimRecords: newProps.awbClaimRecords});
	}

	// handleTobePlannedModalChange = (awbClaimRecord) =>{
	// 	this.props.openTobePlannedModal(awbClaimRecord)
	// }
	
	render() {
		return (
			<Observer>{()=>
			<div>
				{this.state.awbClaimRecords.length ? this.state.awbClaimRecords.map((awbClaimRecord) => {
					return (
					<AWBClaimRecords awbClaimRecord = {awbClaimRecord} key={awbClaimRecord.id} />)
				}) : <div>No AWB Claims to show</div>}
			</div>
			}</Observer>
			
		);
	}
}
export default AWBClaim;