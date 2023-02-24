import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Observer } from "mobx-react"
import NavigationButton from "../shared/NavigationButton";
import APIService from "../APIService";

class CCAApprovalPendingModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			legop_record: props.legop_record,
			cca_request_record_table: '',
			cca_request_record_table_data: '',
			flightDetail: [],
			cca_request: [],
			legops_record: ''
		}
	}

	componentDidMount() {
		this.ccaApprovalModalExistingCCARequest(this.state.legop_record.awb_no);
	}

	ccaApprovalModalExistingCCARequest(awbNo) {
		let awbNumber = awbNo
		let queryParams = { awbNo: awbNumber };
		APIService.get('/getExistingCCAApprovalRequest', queryParams, function (results, status) {
			if (results) {
				this.setState({
					cca_request_record_table: results});
					this.setState({cca_request_record_table_data: results.cca_form_data});
					this.setState({flightDetail: results.cca_form_data.flightRecord});
					this.setState({legops_record: results.cca_form_data.legops_record});

					results.cca_request.map(request=>{
						for(let i=0;i<request.reason.length;i++){
							let reason = ("[")+request.reason[i].main_reason + (request.reason[i].sub_reason1? " - " + request.reason[i].sub_reason1:"") + (request.reason[i].sub_reason2? " - " + request.reason[i].sub_reason2:"") + (request.reason[i].sub_reason3.length>0? " - " + request.reason[i].sub_reason3:"")+("],");
							request.reason[i]=reason;
						}
					})
					this.setState({cca_request: results.cca_request});
					
				console.log('record found. ' + JSON.stringify(results));
			}
		}.bind(this));
	}

	onCloseModal = (event) =>{
		this.props.closeModal();
	}
	render() {

		return (

			<Observer>{()=>
			<div>
					<div className="modal-header">
						<h4 className="modal-title">
							<span>
								<i className="fa fa-delete"></i>
							</span>

							<label className="ml-2" id="ccaRequestPendingModalEditTitle">CCA Approval Pending
								<NavigationButton awb_no={this.state.legop_record.awb_no} tabNumber={this.state.tabNumber} MainStore={this.props.MainStore} onCloseModal={this.onCloseModal} /></label>
						</h4>
						<button className="close" type="button" onClick={this.onCloseModal}>×</button>
					</div>
					<div className="modal-body">
						<div className="col-12">
							<Table bordered size="sm">
									<thead>
										<tr>
											<th>Raised By</th>
											<th>Department</th>
											<th>CCA</th>
										</tr>
									</thead>
									<tbody>
										{
											this.state.cca_request.map((cca_request_data, index) => <tr key={index}>
												<td>{cca_request_data.raised_by}</td>
												<td>{cca_request_data.raised_by_dept}</td>
												<td>{cca_request_data.reason}</td>
											</tr>)
										}
	
									</tbody>
								</Table>
								 <table border="1" bordercolor="#e5e5e5">
									<tbody>
										<tr>
											<td colSpan="10" rowSpan="5" valign="top" align="left">
												<span style={{ "msoIgnore": "vglayout", "position": "absolute", "zIndex": "1", "marginLeft": "17px", "marginTop": "2px", "width": "127px", "height": "49px" }}>
													<img src="assets/images/cca_ba_logo.png" width="127" height="49" />
												</span>
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td>Date of Issue</td>
											<td>
												<input id="ccaRequestModalDateOfIssueInput" disabled="" placeholder="NoEdit" value={this.state.cca_request_record_table_data.dateofIssue} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height: "10px"}}>
											<td>Place of Issue</td>
											<td>
												<input id="ccaRequestModalPlaceOfIssueInput" disabled="" placeholder="NoEdit" value={this.state.cca_request_record_table_data.placeofIssue} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td>Number</td>
											<td>
												<input id="ccaRequestModalNumberInput" disabled="" placeholder="NoEdit" value={this.state.cca_request_record_table_data.number} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td>CCA Ref</td>
											<td>
												<input id="ccaRequestModalCCARefInput" disabled="" placeholder="NoEdit" value={this.state.cca_request_record_table_data.ccaref} />
											</td>
										</tr>
	
										{
											this.state.flightDetail.map((flightdata, index) =>
												<tr style={{"fontSize":"10px",height:"10px"}}>
													<td colSpan="2">To
														{index + 1}
													</td>
													<td colSpan="3">
														<input id="ccaRequestModalToInput" disabled="" placeholder="NoEdit"
															value={flightdata["to" + index]}
														/>
													</td>
													<td colSpan="2">Flight No</td>
													<td colSpan="3">
														<input id="ccaRequestModalToFlightNoInput" disabled="" placeholder="NoEdit"
															value={flightdata["flightNo" + index]}
														/>
													</td>
													<td>Date</td>
													<td>
														<input type="text" id="start" name="trip-start"
															value={window.moment(flightdata["date" + index]).format("MM/DD/YYYY")}
														/>
													</td>
												</tr>
											)
										}
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="12">Will transfer stations please fill in lines 2 or 3 as appropriate and re-forward this form immediately to next carrier.</td>
										</tr>

										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="12">The slip below must only be filled in and returned to issuing carri</td>
										</tr>

										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">Consignor's name and address:</td>
											<td colSpan="4">Consignee address:</td>
											<td colSpan="4">NOTIFY:</td>
										</tr>
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">
												<textarea id="ccaRequestModalConsignorAddressTextarea" placeholder="Editable" style={{ width: "100%" }} required="" row="5" value={this.state.cca_request_record_table_data.c_name_address}></textarea>
											</td>
											<td colSpan="4">
												<textarea id="ccaRequestModalConsigneeAddressTextarea" placeholder="Editable" style={{ width: "100%" }} required="" row="5" value={this.state.cca_request_record_table_data.c_address}></textarea>
											</td>
											<td colSpan="4">
												<textarea id="ccaRequestModalNotifyTextarea" placeholder="Editable" style={{ width: "100%" }} row="5" value={this.state.cca_request_record_table_data.notify}></textarea>
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">AWB No.</td>
											<td>From</td>
											<td>To</td>
											<td>Date</td>
											<td colSpan="5">Received From:</td>
										</tr>
	
	
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">
												<input id="ccaRequestModalAwbNoInput" disabled="" placeholder="NoEdit" value={this.state.legops_record.awb_no} />
											</td>
											<td>
												<input id="ccaRequestModalAwbNoFromInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.legops_record.from} />
											</td>
											<td>
												<input id="ccaRequestModalAwbNoToInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.legops_record.to} />
											</td>
											<td>
												<input id="ccaRequestModalAwbNoDateInput" disabled="" placeholder="NoEdit" value={window.moment(this.state.legops_record.date).format("DD/MM/YYYY")} />
											</td>
											<td colSpan="5">
												{
													this.state.cca_request.map((cca_request_data, index) => <input id="ccaRequestModalAwbNoReceivedFromInput" placeholder="Editable" style={{ width: "100%" }} value={cca_request_data.raised_by_dept} />)
												}
											</td>
										</tr>
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="12"></td>
										</tr>

										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td rowSpan="2" colSpan="4">Currency		INR</td>
											<td className="text-center" colSpan="4">Revised/Corrected Charges</td>
											<td className="text-center" colSpan="4">Original/Incorrect Charges</td>
										</tr>

										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td className="text-center" colSpan="2"> Prepaid</td>
											<td className="text-center" colSpan="2"> Collect</td>
											<td className="text-center" colSpan="2"> Prepaid</td>
											<td className="text-center" colSpan="2"> Collect</td>
										</tr>

										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">Charges Due</td>
											<td className="text-center">Carrier</td>
											<td className="text-center">Agent</td>
											<td className="text-center">Carrier</td>
											<td className="text-center">Agent</td>
											<td className="text-center">Carrier</td>
											<td className="text-center">Agent</td>
											<td className="text-center">Carrier</td>
											<td className="text-center">Agent</td>
										</tr>
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">Weight Charge</td>
											<td>
												<input id="ccaRequestModalWeightRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_wc_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalWeightRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_wc_agent} />
											</td>
											<td>
												<input id="ccaRequestModalWeightRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_wc_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalWeightRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_wc_agent} />
											</td>
											<td>
												<input id="ccaRequestModalWeightOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_wc_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalWeightOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_wc_agent} />
											</td>
											<td>
												<input id="ccaRequestModalWeightOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_wc_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalWeightOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_wc_agent} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">Valuation Charge</td>
											<td>
												<input id="ccaRequestModalValuationRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_vc_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalValuationRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_vc_agent} />
											</td>
											<td>
												<input id="ccaRequestModalValuationRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_vc_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalValuationRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_vc_agent} />
											</td>
											<td>
												<input id="ccaRequestModalValuationOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_vc_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalValuationOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_vc_agent} />
											</td>
											<td>
												<input id="ccaRequestModalValuationOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_vc_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalValuationOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_vc_agent} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">Tax</td>
											<td>
												<input id="ccaRequestModalTaxRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Tax_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalTaxRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Tax_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalTaxRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Tax_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalTaxRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Tax_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalTaxOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_Tax_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalTaxOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_Tax_agent} />
											</td>
											<td>
												<input id="ccaRequestModalTaxOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Tax_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalTaxOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Tax_agent} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">Clearance And Handling</td>
											<td>
												<input id="ccaRequestModalClearanceAndHandlingRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Clearance_And_Handl_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalClearanceAndHandlingRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Clearance_And_Handl_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalClearanceAndHandlingRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Clearance_And_Handl_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalClearanceAndHandlingRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Clearance_And_Handl_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalClearanceAndHandlingOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_Clearance_And_Handl_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalClearanceAndHandlingOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_Clearance_And_Handl_agent} />
											</td>
											<td>
												<input id="ccaRequestModalClearanceAndHandlingOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Clearance_And_Handl_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalClearanceAndHandlingOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Clearance_And_Handl_agent} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">Disbursements</td>
											<td>
												<input id="ccaRequestModalDisbursementsRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Disbursements_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementsRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Disbursements_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementsRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Disbursements_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementsRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Disbursements_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementsOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_Disbursements_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementsOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_Disbursements_agent} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementsOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Disbursements_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementsOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Disbursements_agent} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">Disbursement Fee</td>
											<td>
												<input id="ccaRequestModalDisbursementFeeRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Disbursement_Fee_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementFeeRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Disbursement_Fee_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementFeeRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Disbursement_Fee_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementFeeRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Disbursement_Fee_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementFeeOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_Disbursement_Fee_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementFeeOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_Disbursement_Fee_agent} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementFeeOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Disbursement_Fee_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalDisbursementFeeOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Disbursement_Fee_agent} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">Other Charge</td>
											<td>
												<input id="ccaRequestModalOtherRevisedCorrectedPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Other_Charge_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalOtherRevisedCorrectedPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Other_Charge_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalOtherRevisedCorrectedCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Other_Charge_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalOtherRevisedCorrectedCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Other_Charge_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalOtherOriginalIncorrectPrepaidCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_Other_Charge_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalOtherOriginalIncorrectPrepaidAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaidOther_Charge_agent} />
											</td>
											<td>
												<input id="ccaRequestModalOtherOriginalIncorrectCollectCarrierChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Other_Charge_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalOtherOriginalIncorrectCollectAgentChargesInput" placeholder="Editable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Other_Charge_agent} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">Amendment fee</td>
											<td>
												<input id="ccaRequestModalAmendmentFeeRevisedCorrectedPrepaidCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Amendment_fee_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalAmendmentFeeRevisedCorrectedPrepaidAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_prepaid_Amendment_fee_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalAmendmentFeeRevisedCorrectedCollectCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Amendment_fee_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalAmendmentFeeRevisedCorrectedCollectAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Amendment_fee_Agent} />
											</td>
											<td>
												<input id="ccaRequestModalAmendmentFeeOriginalIncorrectPrepaidCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_Amendment_fee_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalAmendmentFeeOriginalIncorrectPrepaidAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaidAmendment_fee_agent} />
											</td>
											<td>
												<input id="ccaRequestModalAmendmentFeeOriginalIncorrectCollectCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Amendment_fee_carrier} />
											</td>
											<td>
												<input id="ccaRequestModalAmendmentFeeOriginalIncorrectCollectAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_Amendment_fee_agent} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="12"></td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="4">Total</td>
											<td>
												<input id="ccaRequestModalTotalRevisedCorrectedPrepaidCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_Prepaid_carrier_total} />
											</td>
											<td>
												<input id="ccaRequestModalTotalRevisedCorrectedPrepaidAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_Prepaid_Agent_total} />
											</td>
											<td>
												<input id="ccaRequestModalTotalRevisedCorrectedCollectCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_carrier_total} />
											</td>
											<td>
												<input id="ccaRequestModalTotalRevisedCorrectedCollectAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.revised_collect_Agent_total} />
											</td>
											<td>
												<input id="ccaRequestModalTotalOriginalIncorrectPrepaidCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_carrier_total} />
											</td>
											<td>
												<input id="ccaRequestModalTotalOriginalIncorrectPrepaidAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_prepaid_Agent_total} />
											</td>
											<td>
												<input id="ccaRequestModalTotalOriginalIncorrectCollectCarrierChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_carrier_total} />
											</td>
											<td>  <input id="ccaRequestModalTotalOriginalIncorrectCollectAgentChargesInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.original_collect_agent_total} />  </td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>  <td colSpan="4">Remarks:</td>  <td colSpan="8">  <textarea id="ccaRequestModalRemarksTextarea" placeholder="Editable for cca reasons" row="5" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.Remarks}></textarea>  </td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>  <td colSpan="12">Please correct your documents accordingly and confirm action taken by returning to us, duly signed, the slip below. Thank you.</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>  <td colSpan="6">Distribution:</td>  <td colSpan="6">Yours Faithfully,</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>  <td colSpan="2">Original-</td>  <td colSpan="4">(Shipper)</td>  <td colSpan="6">British Airways World Cargo</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="2">Copy 1-</td>
											<td colSpan="4">(For Accounting Department of Issuing Carrier)</td>
											<td colSpan="6">
												<input id="ccaRequestModalLoginStationInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.account_Dep_of_Issuing_carrier} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="2">Copy 2-</td>
											<td colSpan="4">(For First Carrier)</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="2">Copy 3-</td>
											<td colSpan="4">(For Second Carrier)</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="2">Copy 4-</td>
											<td colSpan="4">(For Third Carrier)</td>
											<td colSpan="3">Address</td>
											<td colSpan="3">Email</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="2">Copy 5-</td>
											<td colSpan="4">(For Cargo Department of Carrier issuing CCA)</td>
											<td colSpan="3">
												<input id="ccaRequestModalAuthorityNameInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.cargo_Dep_of_Issuing_carrier} />
											</td>
											<td colSpan="3">
												<input id="ccaRequestModalAuthorityEmailInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.cargo_Dep_of_Issuing_carrier_email} />
											</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="2">Copy 6-</td>
											<td colSpan="4">(For CASS Settlement Office)</td>
											<td colSpan="4">
												<input id="ccaRequestModalDesignationInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.cass_settlement_office} />
											</td>
											<td colSpan="2">Signature</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="2">Copy 7-</td>
											<td colSpan="4">(For CASS Agent/Recipient)</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="12"></td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="2" rowSpan="8">To</td>
											<td colSpan="4" rowSpan="8">
												<textarea id="ccaRequestModalToBAAddressTextarea" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.to}></textarea>
											</td>
											<td colSpan="2">From</td>
											<td colSpan="3">British Airways World Cargo</td>
											<td>(Airline)</td></tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="6"></td></tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="2">At</td>
											<td colSpan="3">
												<input id="ccaRequestModalAtStationInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.at} />
											</td>
											<td>(Station)</td></tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="6"></td></tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="6">Date</td></tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="6"></td></tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="6"></td></tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="6">We herewith confirm having corrected our documents and </td></tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="2">Ref: AWB No.</td>
											<td colSpan="4">
												<input id="ccaRequestModalRefAwbNoInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table_data.ref_awb_no} />
											</td>
											<td colSpan="6">taken the necessary actions as per your instructions.</td></tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="12"></td></tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="2">Ref:CCA No.</td>
											<td colSpan="4">
												<input id="ccaRequestModalRefCCANoInput" disabled="" placeholder="NoEditable" style={{ width: "100%" }} value={this.state.cca_request_record_table.cca_no} />
											</td>
											<td colSpan="6">Carrier's Stamp ____________________________________</td>
										</tr>
	
										<tr style={{"fontSize":"10px",height:"10px"}}>
											<td colSpan="12"></td>
										</tr>
	
									</tbody>
								</table> 
						</div>
					</div>
				</div>
			}</Observer>
		);
	}
}
export default CCAApprovalPendingModal;