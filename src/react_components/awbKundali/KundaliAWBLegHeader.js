import React from "react";

export default class KundaliAWBLegHeader extends React.Component {
	constructor(props) {

		super(props);
		console.log("header id", JSON.stringify(this.props.awb_leg))
		let flight_icon = "";
		let flight_color = "";

		if (props.awb_leg.void_on > 0) {
			flight_icon = " mdi mdi-airplane-off ";
			flight_color = " text-danger ";
		}
		else if (props.awb_leg.actual_pieces_flown > 0) {
			flight_icon = " mdi mdi-airplane-takeoff ";
			flight_color = " text-success ";
		}
		else if (!(props.awb_leg.flight_no) && (props.awb_leg.status === "PENDING")) {
			//flight_icon = " mdi mdi-airplane ";
			//flight_color = " text-warning ";
		}
		else {
			flight_icon = " mdi mdi-airplane ";
			flight_color = " text-warning ";
		}

		this.state = {
			flight_icon: flight_icon,
			flight_color: flight_color,
			awb_leg: props.awb_leg
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.awb_leg !== nextState.awb_leg) {
			nextState.awb_leg = nextProps.awb_leg;
			
			return true;
		} else
			return false;
	}

	render() {
		let heading_id = ("heading" + this.state.awb_leg.id);
		let collapse_id = ("collapse" + this.state.awb_leg.id);
		let data_target = ("#" + collapse_id);
		if (this.state.awb_leg.pieces === 0)
			return null;
		else
			return (
				<div className="card-header border-top border-white" id={heading_id} key={this.state.awb_leg.id} style={{ zIndex: 1 }}>
					<h5 className="mb-0">
						<a data-toggle="collapse" data-target={data_target} aria-expanded="false" aria-controls={collapse_id} className="collapsed">
							<div>
								{
									this.state.awb_leg.pieces < 0 &&
									<div className="row">
										<span className="badge-xl text-warning px-2">{Math.abs(this.state.awb_leg.pieces)} pcs / {Math.abs(this.state.awb_leg.weight)} kg - </span>
										<span className="badge-xl badge-danger px-1">{this.state.awb_leg.from}</span>
										<span className="badge-xl text-warning px-1">Unplanned Cargo</span>
									</div>
								}

								{
									this.state.awb_leg.pieces > 0 &&
									<div>
										<i className={this.state.flight_icon + this.state.flight_color + "mr-3"}></i>
										<span className="badge-xl badge-warning border border-warning px-2">{this.state.awb_leg.from}</span>
										<span className="badge-xl badge-dark border border-warning px-2 mr-2">{this.state.awb_leg.to}</span>
										<span className="badge-xl badge-info px-2 mx-1"><i className='mdi mdi-airplane-takeoff mr-2'></i>{this.state.awb_leg.flight_no}</span>
										<span className="badge-xl badge-light px-2 mx-1"><i className='mdi mdi-clock mr-2'></i>{window.moment(this.state.awb_leg.planned_departure).format("DD/MM/YYYY")}</span>
										<span className="badge-xl badge-secondary px-2 mx-1">{this.state.awb_leg.actual_pieces_flown > 0 ? this.state.awb_leg.actual_pieces_flown : this.state.awb_leg.pieces} pcs / {this.state.awb_leg.actual_weight_flown > 0 ? this.state.awb_leg.actual_weight_flown : this.state.awb_leg.weight} kg {this.state.note}</span>
									</div>
								}

							</div>
						</a>
					</h5>
				</div>
			);
	}
}