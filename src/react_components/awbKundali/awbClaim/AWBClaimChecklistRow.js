import React, { Component } from "react";
import AWBClaimChecklistRowType from './AWBClaimChecklistRowType';

export default class AWBClaimChecklistRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			id: props.data[0],
			title: props.data[1],
			type: props.data[2],

			document_selection: props.initialValues ? props.initialValues.doc : false,
			document_na_selection: props.initialValues ? props.initialValues.no_doc : false,
			comment: props.initialValues ? props.initialValues.comment : ''
		}
	}

	_onDocumentSelected = (event) => {
		this.props.onDocumentSelected(this.state.id, event.target.checked);
		this.setState({
			document_selection: event.target.checked,
			document_na_selection: false,
			comment: ''
		});
	}

	_onDocumentNASelected = (event) => {
		this.props.onDocumentNASelected(this.state.id, event.target.checked);
		this.setState({
			document_selection: false,
			document_na_selection: event.target.checked,
			comment: ''
		});
	}

	_onCommentAdded = (event) => {
		this.props.onCommentAdded(this.state.id, event.target.value);
		this.setState({comment: event.target.value});
	}

	render() {
		switch(this.state.type) {
			case AWBClaimChecklistRowType.TITLE:
				return (
					<tr>
						<td colSpan={4} style={{backgroundColor: 'lightgray'}}>{this.state.title}</td>
					</tr>
				);
			case AWBClaimChecklistRowType.MANDATORY:
				return (
					<tr>
						<td>{this.state.title}</td>
						<td style={{backgroundColor: 'lightgray'}}>
							<input type="checkbox" onChange={this._onDocumentSelected} checked={this.state.document_selection} />
						</td>
						<td colSpan={2} style={{backgroundColor: 'black'}} />
					</tr>
				);
			case AWBClaimChecklistRowType.OPTIONAL:
				return (
					<tr>
						<td>{this.state.title}</td>
						<td style={{backgroundColor: 'lightgray'}}>
							<input type="checkbox" onChange={this._onDocumentSelected} checked={this.state.document_selection} />
						</td>
						<td style={{backgroundColor: 'lightgray'}}>
							<input type="checkbox" onChange={this._onDocumentNASelected} checked={this.state.document_na_selection} />
						</td>
						<td>
							<input id='someid' type="text" style={{ width: '100%' }} placeholder="N/A" onChange={this._onCommentAdded} value={this.state.comment} disabled={!this.state.document_na_selection} />
							{
								(this.state.id == "deliveryreceipt")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_deliveryreceipt_error ? this.props.closing_deliveryreceipt_error : ""}
							</span>):""
							}
							{
								(this.state.id == "hawb")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_comment_error ? this.props.closing_comment_error : ""}
							</span>):""
							}
							{
								(this.state.id == "alltransfer")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_alltransfer_error ? this.props.closing_alltransfer_error : ""}
							</span>):""
							}
							{
								(this.state.id == "alltruckmanifest")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_alltruckmanifest_error ? this.props.closing_alltruckmanifest_error : ""}
							</span>):""
							}
							{
								(this.state.id == "liveanimalchecklist")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_liveanimalchecklist_error ? this.props.closing_liveanimalchecklist_error : ""}
							</span>):""
							}
							{
								(this.state.id == "dangergoodschecklist")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_dangergoodschecklist_error ? this.props.closing_dangergoodschecklist_error : ""}
							</span>):""
							}
							{
								(this.state.id == "healthcerts")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_healthcerts_error ? this.props.closing_healthcerts_error : ""}
							</span>):""
							}
							{
								(this.state.id == "importlicenses")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_importlicenses_error ? this.props.closing_importlicenses_error : ""}
							</span>):""
							}
							{
								(this.state.id == "irregularityreport")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_irregularityreport_error ? this.props.closing_irregularityreport_error : ""}
							</span>):""
							}
							{
								(this.state.id == "damagereport")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_damagereport_error ? this.props.closing_damagereport_error : ""}
							</span>):""
							}
							{
								(this.state.id == "irregularity3rdparty")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_irregularity3rdparty_error ? this.props.closing_irregularity3rdparty_error : ""}
							</span>):""
							}
							{
								(this.state.id == "photoevidence")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_photoevidence_error ? this.props.closing_photoevidence_error : ""}
							</span>):""
							}
							{
								(this.state.id == "letterofintent")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_letterofintent_error ? this.props.closing_letterofintent_error : ""}
							</span>):""
							}
							{
								(this.state.id == "otherdocs")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_otherdocs_error ? this.props.closing_otherdocs_error : ""}
							</span>):""
							}
							{
								(this.state.id == "docprovidedbyclaimant")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_docprovidedbyclaimant_error ? this.props.closing_docprovidedbyclaimant_error : ""}
							</span>):""
							}
							{
								(this.state.id == "shipperinstruction")?(<span className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
								{this.props.closing_shipperinstruction_error ? this.props.closing_shipperinstruction_error : ""}
							</span>):""
							}
						</td>
					</tr>
				);
			default:
				return (<div />);
		}
	}
}