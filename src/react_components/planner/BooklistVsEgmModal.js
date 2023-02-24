import React, { Component } from "react";
import custom from '../../config/custom.js';
import Table from 'react-bootstrap/Table'
import axios from 'axios';
import EgmTableInputDetails from "../shared/EgmTableInputDetails.js";
import APIService from "../APIService.js";

export default class BooklistVsEgmModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			egmFileRecords: props.egmFileRecords,
			booklistFileRecords: props.booklistFileRecords,
			uploadedEGMFile: props.uploadedEGMFile,
			selectedFlightDetails: props.selectedFlightDetails,
			booklist_id_tobe_send: '',
			discarded_booklist_records:[],
			ready_to_submit: true,
			readOnly: props.readOnly,
			innitial_rule_stip_Show:this.props.preview_strip,
			displayInputView: props.uploadedEGMFile === ""//this.props.displayInputView
		}
	}

	componentDidMount() {
		if (!this.state.booklistFileRecords.length) {
			window.swal_error('Booklist is not selected');
			return;
		} else{
			let booklistFileRecords = this.state.booklistFileRecords;
			let egmFileRecords = this.state.egmFileRecords;
			let discarded_booklist_records_array =[];
			if(booklistFileRecords[0].actual_pieces_flown != 0){
				window.swal_error('EGM Already Uploaded');
				return;
			}else{
				this.setState({
					booklist_id_tobe_send: booklistFileRecords[0].booklist
				})
				for (let i = 0; i< booklistFileRecords.length; i++){
					let match_found = false;
					for(let j = 0; j < egmFileRecords.length; j++){
						if(booklistFileRecords[i].awb_no == egmFileRecords[j].awb_no){
							match_found = true;
							break;
						}
					}
					if(match_found == false) {
						discarded_booklist_records_array.push(booklistFileRecords[i].id);
					}
				}
				this.setState({
					discarded_booklist_records: discarded_booklist_records_array
				})
			}
		}
	}

	setChangedDataofPiecesWeight = (values) => {
		this.setState({ egmFileRecords: values })
	}

	onCloseBooklistVsEgmModal = (event) =>{
		this.props.closeBooklistVsEgmModal();
	}

	renderBooklistTableRecord = (booklistTableRecord, index) => {
		return (
			<tr key={index}>
				<td>{booklistTableRecord.awb_no}</td>
				<td>{booklistTableRecord.pieces}</td>
				<td>{booklistTableRecord.weight}</td>
			</tr>
		)
	}

	renderEGMTableRecord = (booklistTableRecord, egmTableRecord) => {
		let ready_to_submit = true;
		let booklistVsEgmRecords = [];
		if(booklistTableRecord.length < 1 || egmTableRecord.length < 1) {
			window.swal_error('Invalid Booklist or EGM Records')
			return;
		}else{
			if(booklistTableRecord[0].actual_pieces_flown != 0){
				window.swal_error('EGM Already Uploaded');
				return
			}else{
				console.log(booklistTableRecord);
				let row = 0;
				let egm_record_index_added = [];
				for (let i = 0; i< booklistTableRecord.length; i++){
					let match_found = false;
					
					for(let j = 0; j < egmTableRecord.length; j++){
						if(booklistTableRecord[i].awb_no == egmTableRecord[j].awb_no && egmTableRecord[j].pieces==0) {
							match_found = true;
							console.log(booklistTableRecord[i].pieces, egmTableRecord[j].pieces)
							let pieces_match = booklistTableRecord[i].pieces == egmTableRecord[j].pieces;
							if (booklistTableRecord[i].awb_info.rate_check === false || booklistTableRecord[i].awb_info.fdc === false) {
								ready_to_submit = false;
							}

							booklistVsEgmRecords.push(
								'<tr class="bg-danger"><td>' + (++row) +
							'</td><td>' + booklistTableRecord[i].awb_no +
							'</td><td>' + booklistTableRecord[i].pieces +
							'</td><td class="border-right">' + booklistTableRecord[i].weight +
							'</td><td colspan="3">' + booklistTableRecord[i].awb_no +
							' Will Be Off-loaded</td><td><i class="' + (booklistTableRecord[i].awb_info.rate_check ? "fas fa-check text-success" : "fas fa-times text-danger") +
							'"/></td><td><i class="' + (booklistTableRecord[i].awb_info.fdc ? "fas fa-check text-success" : "fas fa-times text-danger") +
							'"/></td></tr>');
							egm_record_index_added.push(j);
							break;

							
						}else

						if (booklistTableRecord[i].awb_no == egmTableRecord[j].awb_no ) {
							match_found = true;
							console.log(booklistTableRecord[i].pieces, egmTableRecord[j].pieces)

							let pieces_match = booklistTableRecord[i].pieces == egmTableRecord[j].pieces;
							
							if (booklistTableRecord[i].awb_info.rate_check === false || booklistTableRecord[i].awb_info.fdc === false) {
								ready_to_submit = false;
							}
							booklistVsEgmRecords.push('<tr class="'
								+ (pieces_match ? 'text-success' : 'alert-info') +
								'"><td>' + (++row) + '</td><td>'+booklistTableRecord[i].awb_no+
								'</td><td>'+booklistTableRecord[i].pieces+
								'</td><td class="border-right">'+booklistTableRecord[i].weight+
								'<td>'+egmTableRecord[j].awb_no+'</td><td>'+egmTableRecord[j].pieces+
								'</td><td>'+egmTableRecord[j].weight+
								'</td><td><i class="'+ (booklistTableRecord[i].awb_info.rate_check ? "fas fa-check text-success" : "fas fa-times text-danger") +
								'"/></td><td><i class="'+ (booklistTableRecord[i].awb_info.fdc ? "fas fa-check text-success" : "fas fa-times text-danger") +
								'"/></td></tr>');
							egm_record_index_added.push(j);
							break;
						}
					}

					if(match_found == false) {

						booklistVsEgmRecords.push(
							'<tr class="bg-danger"><td>' + (++row) +
							'</td><td>'+booklistTableRecord[i].awb_no+
							'</td><td>'+booklistTableRecord[i].pieces+
							'</td><td class="border-right">'+booklistTableRecord[i].weight +
							'</td><td colspan="3">' + booklistTableRecord[i].awb_no +
							' Will Be Off-loaded</td><td><i class="'+ (booklistTableRecord[i].awb_info.rate_check ? "fas fa-check text-success" : "fas fa-times text-danger") +
							'"/></td><td><i class="'+ (booklistTableRecord[i].awb_info.fdc ? "fas fa-check text-success" : "fas fa-times text-danger") +
							'"/></td></tr>');
					}
				}

				for(let j = 0; j < egmTableRecord.length; j++) {
					if(egm_record_index_added.indexOf(j) == -1) {

						ready_to_submit = false;
						booklistVsEgmRecords.push(
							'<tr class="bg-warning"><td>' + (++row) + 
							'</td><td class="border-right " colspan="3" > Not In Booklist </td><td>' +
							 egmTableRecord[j].awb_no + '</td><td>' + 
							 egmTableRecord[j].pieces + '</td><td>' + egmTableRecord[j].weight + '</td><td><i class="' + ("fas fa-times text-danger") + '"/></td><td><i class="' + ("fas fa-times text-danger") + '"/></td></tr>');
					}
				}
				

				//	To avoid calling setState infinitely.
				if (this.state.ready_to_submit === true && ready_to_submit === false) {
					this.setState({ready_to_submit: false});
				}

				return (booklistVsEgmRecords)
			}
		}
		
	}
	previewEGMFile = (e) => {
		this.setState({displayInputView: false})
		this.setState({innitial_rule_stip_Show:false})
	}

	manualDeparture = () => {
		let data = {
		'discarded_booklist_records': this.state.discarded_booklist_records,
		'booklist_id': this.state.booklist_id_tobe_send,
		'flightsSelector':this.state.selectedFlightDetails.flightDetails,
		'station':this.state.selectedFlightDetails.source,
		'user':custom.custom.hardcoded_values.savedBy,
		'egmFileRecords': this.state.egmFileRecords
		}
		// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/uploadEGMFile`, data, JwtToken.getJwtTokenHeader())
			
		APIService.post('/manuallyDepart', data,
		res => {
				console.log(res.result)
			})
		this.onCloseBooklistVsEgmModal();
	}

	uploadEGMFile = () => {
		let data = new FormData()
		data.append('discarded_booklist_records', this.state.discarded_booklist_records)
		data.append('booklist_id', this.state.booklist_id_tobe_send)
		data.append('flightsSelector',this.state.selectedFlightDetails.flightDetails)
		data.append('station',this.state.selectedFlightDetails.source)
		data.append('user',custom.custom.hardcoded_values.savedBy)
		data.append('egmFileUpload', this.state.uploadedEGMFile)
		// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/uploadEGMFile`, data, JwtToken.getJwtTokenHeader())
			
		APIService.post('/uploadEGMFile', data,
		res => {
				console.log(res.result)
			})
		this.onCloseBooklistVsEgmModal();
	}

	save = () => {
		if(this.props.isManuallyDepart){
			this.manualDeparture()
		}
		else{
			this.uploadEGMFile()
		}
	}

	onClickBack = () => {
		this.setState({displayInputView:true})
	}

	render() {
		
		let booklistTableRecords = this.state.booklistFileRecords;
		let egmTableRecords = this.state.egmFileRecords;
		return (
			<div>
				<div className="modal-header">
					<h4 className="modal-title" id="booklistVsEgmModalEditTitle">
						<span>
							<i className="fa fa-edit"></i>
						</span>
						<label className="ml-2">Booklist vs EGM Preview</label>
					</h4>
					<button className="close" type="button" onClick={this.onCloseBooklistVsEgmModal}>×</button>
				</div>
				<div className="modal-body">
					<div className="row">
						{/* <div className="col-6">
								<label className="control-label">Booklist Records</label>
								<Table  bordered >
									<thead>
										<tr>
											<th>AWB No.</th>
											<th>Pieces</th>
											<th>Weight</th>
										</tr>
									</thead>
									<tbody>
										{booklistTableRecords.map(this.renderBooklistTableRecord)}
									</tbody>
								</Table>
							</div> */}
						<div className="col-12">
							<label className="control-label">EGM Records</label>
							<Table bordered size="sm">
								<thead>
									<tr className="bg-info text-white">
										<th><strong>Sr.No</strong></th>
										<th><strong>AWB No.(From Booklist)</strong></th>
										<th><strong>Pieces</strong></th>
										<th><strong>Weight</strong></th>
										<th><strong>AWB No.(From EGM)</strong></th>
										<th><strong>Pieces</strong></th>
										<th><strong>Weight</strong></th>
										<th><strong>RC</strong></th>
										<th><strong>FDC</strong></th>
									</tr>
								</thead>
							
								{
									(this.state.displayInputView) ? 
									<tbody>	
										{
											<EgmTableInputDetails newEgmData={this.state.egmFileRecords} booklistTableRecords={booklistTableRecords}  setChangedDataofPiecesWeight={this.setChangedDataofPiecesWeight}/> 							
										}
									</tbody>
									: <tbody dangerouslySetInnerHTML={{ __html: this.renderEGMTableRecord(booklistTableRecords, egmTableRecords).join('') }} />
								}
							</Table>
						</div>
					</div>
				</div>
				{!this.state.readOnly && <div className="modal-footer col-md-12">
					{
						this.state.innitial_rule_stip_Show === true &&this.state.uploadedEGMFile=="" &&
						<span class="badge badge-danger">This booklist have AWB whose Rate Check / FDC is pending.</span>

					}
					{this.state.ready_to_submit === false &&
						<span class="badge badge-danger">This booklist have AWB whose Rate Check / FDC is pending.</span>
					}
					{this.state.displayInputView &&
						<>
							<button className="btn btn-success waves-effect waves-light save-category" id="booklistVsEgmModalSaveEgmBtn" type="button" name="booklistVsEgmModalSaveEgmBtn" onClick={() => this.previewEGMFile()}>
								<i className="fas fa-save" aria-hidden="true"></i>&nbsp;&nbsp;Preview
							</button>
						</>
					} 
					{(!this.state.displayInputView) && 
						<>
						{ (this.state.uploadedEGMFile=="")&&
							<button className="btn btn-success waves-effect waves-light save-category" id="booklistVsEgmModalSaveEgmBtn" type="button" name="booklistVsEgmModalSaveEgmBtn"  onClick={() => this.onClickBack()}>
							<i className="fas fa-back" aria-hidden="true"></i>&nbsp;&nbsp;Back
						</button>
						}
							<button className="btn btn-success waves-effect waves-light save-category" id="booklistVsEgmModalSaveEgmBtn" type="button" name="booklistVsEgmModalSaveEgmBtn" disabled={!this.state.ready_to_submit} onClick={() => this.save()}>
								<i className="fas fa-save" aria-hidden="true"></i>&nbsp;&nbsp;Save
							</button>
						</>
					}
				</div> }
			</div>
		);
	}
}

