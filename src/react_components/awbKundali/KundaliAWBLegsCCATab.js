import React from "react";
import KundaliAWBLegHeaderCCATab from "./KundaliAWBLegHeaderCCATab.js";
import CCAApprovalPendingForm from "../shared/CCAApprovalPendingForm.js";

export default class KundaliAWBLegsCCATab extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			awb_kundali_cca_data: props.awb_kundali_cca_data,
			errors: { discard_reason_error: '', offload_error: '' },
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.awb_kundali_cca_data !== nextState.awb_kundali_cca_data) {
			nextState.awb_kundali_cca_data = nextProps.awb_kundali_cca_data;
			return true;
		} else
			return false;
	}
	render() {
		console.log('awb_leg record deep inside+++++++++++++++++++++++++++++++++++++++++++++++' + JSON.stringify(this.state.errors));
		console.log(JSON.stringify(this.state.awb_kundali_cca_data))
		let cca_request_details = [];
		if (this.state && this.state.awb_kundali_cca_data) {
			this.state.awb_kundali_cca_data.forEach((awb_cca_data, index) => {
				let heading_id = ("heading" + awb_cca_data.id);
				let collapse_id = ("collapse" + awb_cca_data.id);
				cca_request_details.push(
					<div className="card m-b-0 bg-dark">
						<KundaliAWBLegHeaderCCATab awb_cca_data_header={awb_cca_data} />
						<div className="collapse" id={collapse_id} aria-labelledby={heading_id} data-parent="#accordionExample" key={awb_cca_data.id}>
							<div className="timeline">
								<div className="timeline__wrap">
									<div className="timeline__items">
										<div style={{ backgroundColor: "white" }}>
											<CCAApprovalPendingForm legop_record={awb_cca_data} operation_socket={this.props.OperationStore.operationSocket}  ccaRequestDetailsRecords={awb_cca_data} cca_request_record_table={awb_cca_data} cca_request_record_table_data={awb_cca_data.cca_form_data} flightDetail={awb_cca_data.cca_form_data.flightRecord} cca_request={awb_cca_data.cca_request} legops_record={awb_cca_data.cca_form_data.legops_record}/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				);

			});
			return (cca_request_details);
		} else {
			return (<p>No CCA Request Available</p>);
		}
	}
}