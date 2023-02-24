import React, { Component } from 'react'
import AWBNumber from '../shared/AWBNumber.js';
import QueueTimer from './QueueTimer.js';
import { Observer } from "mobx-react"
import {CopyToClipboard} from 'react-copy-to-clipboard';

class LegOps extends Component {

	constructor(props) {
		super(props);
		this.state = {
			legop_record: props.legop_record,
			type: props.type,
			status: props.status,
			queue_duration: props.queue_duration,
			locked: false
		}
	}
	componentWillReceiveProps(newProps) {
		let found=false;
		for(let i=0;i<newProps.lockedOpsData.length;i++){
			if(newProps.lockedOpsData[i].operationId==newProps.legop_record.id){
				found=true;
				break;
			}
		}
		if(found){
			this.setState({locked: true});
		}
		else{
			this.setState({locked: false});
		}
	}
	componentDidMount() {
		let found=false;
		for(let i=0;i<this.props.lockedOpsData.length;i++){
			if(this.props.lockedOpsData[i].operationId==this.props.legop_record.id){
				found=true;
				break;
			}
		}
		if(found){
			this.setState({locked: true});
		}
		else{
			this.setState({locked: false});
		}
	}
	handlelegops=()=>{
		this.props.openModal(this.state.legop_record)
	}
	
	render() {
		// console.log('legop_record details++++++++++++++++++++++++++++++++++++++++++++++'+JSON.stringify(this.state.legop_record));
		let icon = "";
		let icon_color = "";
		let background_color = "";

		// let cutoff_time = new Date(this.state.legop_record.cut_off_time);
		// let cutoff = (cutoff_time.getDate()+'/'+(cutoff_time.getMonth()+1)+'  '+cutoff_time.getHours()+':'+cutoff_time.getMinutes())

		// if(this.state.legop_record.awb_info.priority_class == 'F_CLASS') {
		// 	badge_text = "F";
		// 	badge_color = " badge-danger ";
		// } else {
		// 	badge_color = " badge-info ";
		// }

		if(!this.state.locked) {
			icon = " fas fa-lock-open ";
			icon_color = " text-success ";
			background_color = " border border-success ";
		} else {
			icon = " fas fa-lock ";
			icon_color = " text-danger ";
			background_color = "  border border-danger ";
		}
		
		if(this.state && this.state.legop_record){
				let temp = (
				"<h4>["+ this.state.legop_record.awb_leg.station + "] " + this.state.legop_record.awb_leg.from + " to " + (this.state.legop_record.awb_leg.to.length === 0 ? "---" : this.state.legop_record.awb_leg.to) + "</h4>" +
				"<span>" + "Pieces: " + this.state.legop_record.awb_leg.pieces + "</span><br/>" +
				"<span>" + "Weight: " + this.state.legop_record.awb_leg.weight + "</span><br/>" 
				 );
			return(
				<Observer>{()=>
				<div className={background_color + "d-flex justify-content-between"}>
					<div  className=" m-0 p-0" onClick={this.handlelegops }>
						<font size="2">
							<div className="row m-0 p-0 small">
								<span className="px-1 text-center alert-danger">{this.state.legop_record.awb_leg.station}</span>
								<span className="px-1 text-center alert-secondary">{this.state.legop_record.awb_leg.flight_no}</span>
								<span className="px-1 text-center alert-warning">{this.state.legop_record.awb_leg.from}-{this.state.legop_record.awb_leg.to}</span>
							</div>
							<div className=" row m-0 p-0">
								{/* <span className={badge_color + "badge-xs mx-1 p-1"}>{badge_text}</span> */}
								<span>
									<i className={icon + icon_color + " mx-1"}></i>
								</span>
								<AWBNumber priority_class={this.state.legop_record.awb_info ? this.state.legop_record.awb_info.priority_class : "M"} awb_no={this.state.legop_record.awb_no} bold={true} tooltipData={temp} />
								{/* <div>
									<small>{this.state.legop_record.awb_no}<br/>Dept - {window.moment(this.state.legop_record.awb_leg.planned_departure).format("DD/MM/YYYY, HH:mm")}<br/>Trigger -{window.moment(this.state.legop_record.trigger_time).format("DD/MM/YYYY, HH:mm")}</small>
								</div> */}
							</div>
							<div className=" m-0 p-0 d-flex justify-content-between">
								<span className="badge-xs badge-pill badge-warning">{this.state.type}</span>
							</div>
						</font>
						
					</div>
					<div>
						<CopyToClipboard text={this.state.legop_record.awb_no}
						onCopy={() => {window.swal_success('AWB Number copied !', 300)}}>
							<span>
								<i className='text-secondary p-0 mdi mdi-content-copy'></i>
							</span>
						</CopyToClipboard>
					</div>
					<QueueTimer trigger_time={this.state.legop_record.trigger_time} queue_duration={this.state.queue_duration} cut_off_time={this.state.legop_record.cut_off_time}/>

				</div>
				}</Observer>
				
			);

		} 
	}
}

export default LegOps;
