import React from "react";

export default class KundaliAWBLegOps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			awb_leg_op: props.awb_leg_op
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.awb_leg_op !== nextState.awb_leg_op) {
			nextState.awb_leg_op = nextProps.awb_leg_op;
			return true;
		} else
			return false;
	}

	openCCAForm = (ccaRequest) => {
		//- //alert("ccaRequest Details are :   " +ccaRequest );//this will open to the uneditable cca form in new tab
		//- console.log("match this  = = = = = "+ JSON.stringify(ccaRequest));
		//- showCCARequestModal(ccaRequest);
		window.open("/ccaRequestForm", window.showCCARequestForm(ccaRequest));
	}


	render() {
		console.log('awb_kundali legops record deep inside###########################################' + JSON.stringify(this.state.awb_leg_op));
		let y = [];
		let ccaLegOp = "";
		if (this.state && this.state.awb_leg_op) {
			this.state.awb_leg_op.forEach((awb_leg_op, index) => {
				if (awb_leg_op.cca_leg_op) {
					ccaLegOp = awb_leg_op;
				}
			});
		}
		if (this.state && this.state.awb_leg_op) {
			this.state.awb_leg_op.sort(function(a,b){
				return b.createdAt > a.createdAt
			})
			this.state.awb_leg_op.forEach((awb_leg_op, index) => {
				let ccaReference = "";
				let ccaLegop = "";
				if (awb_leg_op.cca_raised) {
					console.log("--------------------------------------cca available" + JSON.stringify(awb_leg_op.cca_raised));
					ccaReference = (<button type="button" className="btn btn-xs btn-danger" data-toggle="tooltip" data-placement="top" title={awb_leg_op.cca_raised.id} onClick={() => this.openCCAForm(ccaLegOp)}>CCA Raised</button>);
				}

				//- if(awb_leg_op.cca_leg_op){
				//- 	console.log("--------------------------------------cca ccaLegop" + JSON.stringify(awb_leg_op.cca_leg_op));
				//- 	ccaLegop = 	(<button type="button" className="btn btn-xs btn-danger" >CCA legOp</button>);
				//- }(
				let actedAtTime = '-'
				if (awb_leg_op.acted_at_time !== 0) {
					actedAtTime = window.moment(awb_leg_op.acted_at_time).format("HH:mm DD/MM/YYYY")
				}

				y.push(
					<div className="timeline__item timeline__item--right animated fadeIn" side="right" style={{ zIndex:1}}>
						<div className="timeline__content">
							<div className="col-12 row">
								<div className="col-10">
									<div><span className="text-secondary">{window.moment(awb_leg_op.createdAt).format("DD/MM/YYYY")}</span>
										<strong className="text-info">{window.moment(awb_leg_op.createdAt).format(" HH:mm")}</strong>
										<span className="badge-xl badge-secondary px-2 mx-2">{awb_leg_op.opening_status}<i className="mx-3 fas fa-caret-right"/><strong>
										{awb_leg_op.closing_status}</strong></span>
									</div>
									<div>
										<span className="text-info badge-pill px-2 mx-2">{awb_leg_op.ba80_notes}</span>
										<span className="text-danger badge-pill px-2 mx-2">{awb_leg_op.release_notes}</span>
									</div>
									<div className="badge badge-primary badge-pill px-2 mx-2">
										<strong>Presented</strong>
										<div>{window.moment(awb_leg_op.trigger_time).format("HH:mm DD/MM/YYYY")}</div>
									</div>
									<div className="badge badge-danger badge-pill px-2 mx-2">
										<strong>Cut-off</strong>
										<div>{window.moment(awb_leg_op.cut_off_time).format("HH:mm DD/MM/YYYY")}</div>
									</div>
									<div className="badge badge-success badge-pill px-2 mx-2">
										<strong>Actioned At</strong>
										<div>{actedAtTime}</div>
									</div>
									<div className="badge badge-info badge-pill px-2 mx-2">
										<strong>Actioned By</strong>
										<div>{awb_leg_op.acted_by}</div>
									</div>
									<div className="badge badge-dark badge-pill px-2 mx-2">{awb_leg_op.released_by}</div>
								</div>
								<div className="col-2">
									{ccaReference}
									{ccaLegop}
									<div className="badge-info mx-1 text-center"><strong>{awb_leg_op.department}</strong></div>
								</div>
							</div>
						</div>
					</div>
				);
			});
			return (y);
		} else {
			return (<p>No LegOps Available</p>);
		}
	}
}