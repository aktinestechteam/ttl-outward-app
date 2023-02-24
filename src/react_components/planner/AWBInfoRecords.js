import React, { Component } from 'react'
import AWBNumber from '../shared/AWBNumber.js';
import { Observer } from "mobx-react"
import {CopyToClipboard} from 'react-copy-to-clipboard';

class AWBInfoRecords extends Component {

	constructor(props) {
		super(props);
		this.state = {
			awbInfoRecord: props.awbInfoRecord,
		}
	}

	render() {
		console.log('awbInfoRecords details++++++++++++++++++++++++++++++++++++++++++++++'+JSON.stringify(this.state.awbInfoRecord));

		let icon = "";
		let icon_color = "";
		let background_color = "";
		
		if(this.state.awbInfoRecord.on_hand) {
			icon = " fas fa-box-open ";
			icon_color = " text-secondary ";
			background_color = " border border-success alert alert-success ";
		} else {
			icon = " fas fa-exclamation-triangle ";
			icon_color = " text-danger ";
			background_color = " alert alert-danger ";
		}
		
		if(this.state.awbInfoRecord.transhipment) {
			background_color = " border border-primary alert alert-secondary ";
		}

		console.log("awbInfoRecord", this.state.awbInfoRecord);

		let temp = (
			"<h4> [" + this.state.awbInfoRecord.station + "] " + this.state.awbInfoRecord.src + " to " + (this.state.awbInfoRecord.dest.length === 0 ? "---" : this.state.awbInfoRecord.dest) + "</h4>" +
			"<span>" + "Pieces: " + this.state.awbInfoRecord.pieces + "</span><br/>" +
			"<span>" + "Weight: " + this.state.awbInfoRecord.weight + "</span><br/>" +
			"<span>" + "Issuer Name: " + this.state.awbInfoRecord.issuer_name + "</span><br>" +
			"<span>" + "SHC: <strong>" + (this.state.awbInfoRecord.shc.length === 0 ? "none" : this.state.awbInfoRecord.shc.join(' - ')) + "</strong></span><br/>"
		 );

		return(
			<Observer>{()=>
				<div className={background_color + " m-0 p-1"}>
					<span onClick={() => this.props.openRCSPendingModal(this.state.awbInfoRecord)} className='mr-2'>
						<span>
							<i className={icon + icon_color + " mx-2"}>
							</i>
						</span>
						<AWBNumber priority_class={this.state.awbInfoRecord.priority_class} awb_no={this.state.awbInfoRecord.awb_no} tooltipData={temp}/>
					</span>
					<CopyToClipboard text={this.state.awbInfoRecord.awb_no} onCopy={() => {window.swal_success('AWB Number copied !', 300)}}>
					<span>
						<i className='text-secondary p-0 mdi mdi-content-copy'></i>
					</span>
				</CopyToClipboard>
				</div>
			}</Observer>
		);
	}
}
export default AWBInfoRecords;