import React, { Component } from 'react'
import custom from '../../config/custom.js';

export class AWBLegDetails extends Component {

	constructor(props) {
		super(props);
		this.state = {
			awb_leg_details : props.AWBLegDetails,
		}
	}


	render(){
		let plannedArrival = undefined;
		if (this.state.awb_leg_details.planned_arrival !== 0){
			plannedArrival = window.moment(this.state.awb_leg_details.planned_arrival).format("HH:mm DD/MM/YYYY")
		}

		let remoteDeparture = window.moment(this.state.awb_leg_details.planned_departure).tz(this.state.awb_leg_details.from_tz);
		let remoteArrival = window.moment(this.state.awb_leg_details.planned_arrival).tz(this.state.awb_leg_details.to_tz);
		let localDeparture = window.moment(this.state.awb_leg_details.planned_departure).tz(custom.custom.local_tz);
		let localArrival = window.moment(this.state.awb_leg_details.planned_arrival).tz(custom.custom.local_tz);

		console.log('++++=============local departure======= '+ localDeparture);
		return(				
			<div className="row border-bottom border-top border-secondary py-1 ">
				<div className="col-md-1 text-white text-center">
					<div className="bg-dark"><i className='mdi mdi-plane-shield mr-1'></i>{this.state.awb_leg_details.station}</div>
				</div>
				<div className="col-md-1 text-white text-center px-0">
					<div className="bg-info"><i className='mdi mdi-airplane mr-1'></i>{this.state.awb_leg_details.flight_no}</div>
				</div>
				<div className="col-md-1">
					<div className="bg-warning my-auto text-dark text-center">{this.state.awb_leg_details.from}</div>
					<div className="bg-dark my-auto text-white text-center">{this.state.awb_leg_details.to}</div></div>
				<div className="col-md-6 px-0">
					<div className="border border-warning alert-warning text-center"><i className='mdi mdi-airplane-takeoff mr-2'></i><strong>{this.state.awb_leg_details.from} - {window.moment(remoteDeparture).format("HH:mm DD/MM/YYYY")}</strong> - <small>[ {this.state.awb_leg_details.station} - {window.moment(localDeparture).format("HH:mm DD/MM/YYYY")} ]</small></div>
					{plannedArrival !== undefined &&
						<div className="border border-info alert-info text-center"><i className='mdi mdi-airplane-landing mr-2'></i><strong>{this.state.awb_leg_details.to} - {window.moment(remoteArrival).format("HH:mm DD/MM/YYYY")}</strong> - <small>[ {this.state.awb_leg_details.station} - {window.moment(localArrival).format("HH:mm DD/MM/YYYY")} ]</small></div>
					}
				</div>
				<div className="col-md-3">
					<div>
						<small>Planned - </small>
						<span className="text-info">{this.state.awb_leg_details.pieces} pcs, </span>
						<span className="text-info">{this.state.awb_leg_details.weight} kg</span>
					</div>
					{this.state.awb_leg_details.actual_pieces_flown > 0 &&
						<div>
							<small>Actual - </small>
							<span className="text-success">{this.state.awb_leg_details.actual_pieces_flown} pcs, </span>
							<span className="text-success">{this.state.awb_leg_details.actual_weight_flown} kg</span>
						</div>
					}
					{this.state.awb_leg_details.actual_pieces_flown <= 0 &&
						<div className="badge-xl badge-primary text-center text-white">
							Awaiting flight departure
						</div>
					}
				</div>
			</div>
		);
	}
}

export default AWBLegDetails;