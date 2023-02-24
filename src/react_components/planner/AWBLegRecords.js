import React, { Component } from 'react'
import AWBNumber from '../shared/AWBNumber.js';
import { Observer } from "mobx-react"
import {CopyToClipboard} from 'react-copy-to-clipboard';

class AWBLegRecords extends Component {

	constructor(props) {
		super(props);
		this.state = {
			awbLegRecord: props.awbLegRecord,
		}
		
	}

	componentWillReceiveProps(newProps) {
		this.setState({awbLegRecord: newProps.awbLegRecord});
	}

	render() {
		let icon = "";
		let icon_color = "";
		let background_color = "";
		
		if(this.state.awbLegRecord && this.state.awbLegRecord.awb_info && this.state.awbLegRecord.awb_info.on_hand) {
			icon = " fas fa-clock ";
			icon_color = " text-success ";
			background_color = " alert alert-warning border border-warning";
		} else {
			icon = " fas fa-clock ";
			icon_color = " text-danger ";
			background_color = " alert alert-warning border border-warning";
		}
		
		if(this.state.awbLegRecord && this.state.awbLegRecord.awbinfo && this.state.awbLegRecord.awbinfo.transhipment) {
			background_color = " border border-secondary alert alert-secondary ";
		}
		
		let temp = (
			"<h4> [" + this.state.awbLegRecord.awb_info.station + "] " + this.state.awbLegRecord.awb_info.src + " to " + (this.state.awbLegRecord.awb_info.dest.length === 0 ? "---" : this.state.awbLegRecord.awb_info.dest) + "</h4>" +
			"<span>" + "Pieces: " + Math.abs(this.state.awbLegRecord.pieces) + " Remaining</span><br/>" +
			"<span>" + "Weight: " + Math.abs(this.state.awbLegRecord.weight) + " Remaining</span><br/>" +
			"<span>" + "Issuer Name: " + this.state.awbLegRecord.awb_info.issuer_name + "</span><br>" +
			"<span>" + "SHC: <strong>" + (this.state.awbLegRecord.awb_info.shc.length === 0 ? "none" : this.state.awbLegRecord.awb_info.shc.join(' - ')) + "</strong></span><br/>"

		 );
		 console.log(this.state.awbLegRecord.pieces);
		return(
			
			<Observer>{()=>
			<div className={background_color + " m-0 p-1"}>
				<span onClick= {() => this.props.openTobePlannedModal(this.state.awbLegRecord)} className='mr-2'>
					<span>
						<i className={icon + icon_color + " mx-2"}></i>
					</span>
					<AWBNumber priority_class={this.state.awbLegRecord.awb_info.priority_class} awb_no={this.state.awbLegRecord.awb_no} tooltipData={temp} />
				</span>
				
				<CopyToClipboard text={this.state.awbLegRecord.awb_no} onCopy={() => {window.swal_success('AWB Number copied !', 300)}}>
					<span>
						<i className='text-secondary p-0 mdi mdi-content-copy'></i>
					</span>
				</CopyToClipboard>
			</div>
			}</Observer>
		);
	}
}
export default AWBLegRecords;