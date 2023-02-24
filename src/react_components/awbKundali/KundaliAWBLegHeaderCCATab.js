import React from "react";

export default class KundaliAWBLegHeaderCCATab extends React.Component {
	constructor(props) {
		super(props);
		console.log("header id", JSON.stringify(this.props.awb_cca_data_header))
		this.state = {
			awb_cca_data_header: props.awb_cca_data_header,
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.awb_cca_data_header !== nextState.awb_cca_data_header) {
			nextState.awb_cca_data_header = nextProps.awb_cca_data_header;
			
			return true;
		} else
			return false;
	}

	render() {
		let heading_id = ("heading" + this.state.awb_cca_data_header.id);
		let collapse_id = ("collapse" + this.state.awb_cca_data_header.id);
		let data_target = ("#" + collapse_id);
		if (this.state.awb_cca_data_header.cca_no === "")
			return null;
		else
			return (
				
				<div className="card-header border-top border-white" id={heading_id} key={this.state.awb_cca_data_header.id} style={{ zIndex: 1 }}>
					<h5 className="mb-0">
						<a data-toggle="collapse" data-target={data_target} aria-expanded="false" aria-controls={collapse_id} className="collapsed">
							<div>
								<div>
									<span className="badge-xl badge-warning border border-warning px-2">{this.state.awb_cca_data_header.cca_no}</span>
									{
										(this.state.awb_cca_data_header.status=="PENDING")&& <span className="badge-xl badge-info px-2 mx-1">{this.state.awb_cca_data_header.status}</span>
									}
									{
										(this.state.awb_cca_data_header.status=="APPROVED")&& <span className="badge-xl badge-success px-2 mx-1">{this.state.awb_cca_data_header.status}</span>
									}
									{
										(this.state.awb_cca_data_header.status=="REJECTED")&& <span className="badge-xl badge-danger px-2 mx-1">{this.state.awb_cca_data_header.status}</span>
									}
									{
										this.state.awb_cca_data_header.cca_request.map((n) => <span className="badge-xl badge-warning border border-warning px-2">{n.raised_by} </span>)
									}
									<span className="badge-xl badge-light px-2 mx-1"><i className='mdi mdi-clock mr-2'></i>{window.moment(this.state.awb_cca_data_header.updatedAt).format("DD/MM/YYYY")}</span>
								</div>
							</div>
						</a>
					</h5>
				</div>
			);
	}
}