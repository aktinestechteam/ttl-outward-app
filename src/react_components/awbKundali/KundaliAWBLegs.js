import React from "react";
import KundaliAWBLegHeader from './KundaliAWBLegHeader.js'
import KundaliAWBLegOps from './KundaliAWBLegOps.js'
import AddAWBLeg from './AddAWBLeg.js'
import axios from 'axios';
import APIService from "../APIService.js";
import OffloadMultiSelect from '../operations/OffloadMultiSelect.js';
// import AWBKundaliCollapseBody from "./aWBKundaliCollapseBody.js";
import AWBKundaliCollapse from "./AWBKundaliCollapse.js";
import DelayFlight from "./DelayFlight.js"

export default class KundaliAWBLegs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			awb_legs: this.getSortedAwbLegs(props.awb_legs),
			discard_reason: "",
			offload: [],
			errors: { discard_reason_error: '', offload_error: '' },
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.awb_legs !== nextState.awb_legs) {
			nextState.awb_legs = this.getSortedAwbLegs(nextProps.awb_legs);
			return true;
		} else
			return false;
	}

	getSortedAwbLegs = (awb_legs) => {
		return awb_legs.sort((a, b) => b.updatedAt - a.updatedAt);
	}

	reasonToDiscard = (event) => {
		this.setState({ discard_reason: event.target.value });
	}

	delayLeg = (awb_leg) => {
		console.log(awb_leg);
		for(let i=0;i<this.state.awb_legs.length;i++){
			if(this.state.awb_legs[i].id===awb_leg.id){
				this.state.awb_legs[i].planned_departure=awb_leg.planned_departure;
				this.state.awb_legs[i].flight_no=awb_leg.flight_no;
				break;
			}
		}
		this.props.getAWBKundaliData(awb_leg.awb_no);
	}

	callbackOffload = (offloadData) => {
		this.setState({ offload: offloadData })
	}
	
	discardAWBLeg = (awb_leg_to_discard) => {
		
		let errors = {};//this.state.errors;

		if (!this.state.discard_reason) {
			errors.discard_reason_error = 'required field';
		} else {
			errors.discard_reason_error = '';
		}
		if (this.state.offload.length === 0) {
			errors.offload_error = 'select offload';
		} else {
			errors.offload_error = '';
		}

		let error_count = Object.keys(errors).filter((key) => {
			if (errors[key]) {
				return true;
			}
			return false;
		}).length;
		this.setState({ errors: errors });
		if (error_count > 0) {
		} else {
			let data = new FormData()
			data.append('awb_leg_id', awb_leg_to_discard.id)
			data.append('station', awb_leg_to_discard.station)
			data.append('awb_no', awb_leg_to_discard.awb_no)
			data.append('from', awb_leg_to_discard.from)
			data.append('to', awb_leg_to_discard.to)
			data.append('created_by', "XXXXDISCARDED-FROM-KUNDALIXXXX")
			data.append('reason', this.state.offload + '-' + this.state.discard_reason)
			
			APIService.post('/discardBooklistRecord', data,
			res => {
					this.props.getAWBKundaliData(awb_leg_to_discard.awb_no);
					window.swal_success('The Leg is Discarded successfully');					console.log(res.result)
				})
		}

	}

	render() {
		console.log('awb_leg record deep inside+++++++++++++++++++++++++++++++++++++++++++++++' + JSON.stringify(this.state.errors));
		let x = [];
		if (this.state && this.state.awb_legs) {
			this.state.awb_legs.forEach((awb_leg, index) => {
				let discard_id = awb_leg
				let heading_id = ("heading" + awb_leg.id);
				let collapse_id = ("collapse" + awb_leg.id);
				let reason_text_id = ("awbKundaliModalDiscardReasonInput" + awb_leg.id);
				let discard_btn_id = ("awbKundaliModalDiscardLegBtn" + awb_leg.id);
				x.push(
					<div className="card m-b-0 bg-dark">
						<KundaliAWBLegHeader awb_leg={awb_leg} />
						{
							awb_leg.pieces < 0 &&
							<div className="m-2">
								<AddAWBLeg blank_awb_leg={awb_leg}
									getAWBKundaliData={this.props.getAWBKundaliData} />
							</div>
						}
						{
							awb_leg.pieces > 0 &&
							<div className="collapse" id={collapse_id} aria-labelledby={heading_id} data-parent="#accordionExample" key={awb_leg.id}>
								<div className="timeline">
									<div className="timeline__wrap">
										<div className="timeline__items">
											{
												awb_leg.status === "PENDING" &&
												<div>
													<div className="row">
														<div className="timeline__item timeline__item--right animated fadeIn" side="right">
															<div className="timeline__content">
																<AWBKundaliCollapse reason_text_id={reason_text_id} discard_id={discard_id} reasonToDiscard={this.reasonToDiscard} errors-discard_reason_error={this.state.errors.discard_reason_error} offloadCallback={this.callbackOffload} offload_error={this.state.errors.offload_error} discard_btn_id={discard_btn_id} discardAWBLeg={this.discardAWBLeg} />
																<br></br><br></br>
																<DelayFlight awb_leg={awb_leg} delayLeg={this.delayLeg}/>
															</div>
														</div>
													</div>
												</div>
											}
											<KundaliAWBLegOps awb_leg_op={awb_leg.awbLegOps} />
										</div>
									</div>
								</div>
							</div>
						}
					</div>
				);

			});
			return (x);
		} else {
			return (<p>No Legs Available</p>);
		}
	}
}