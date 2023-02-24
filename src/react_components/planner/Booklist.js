import React, { Component } from "react";
import custom from '../../config/custom.js';
import Table from 'react-bootstrap/Table';
import AWBNumber from '../shared/AWBNumber.js';
import ReactTooltip from 'react-tooltip';
import { Observer } from "mobx-react"
import {CopyToClipboard} from 'react-copy-to-clipboard';

var moment = require('moment-timezone');


class Booklist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			existingBooklistRecords: props.booklistRecords,
			selectedBooklistRecord: [],
			selectedFlightDetails: props.flightSelectorDetails,
		}
	}

	renderBooklistTableRecord = (booklistTableRecord, index) => {
			let icon = " fas fa-cubes fa-2x ";
			let textColor = "";
			let actualFlownColor = 'text-info';
			let icon_color = "";
			let background_color = "";
			let totalPieces = (booklistTableRecord.awb_info.pieces);
			let totalWeight = (booklistTableRecord.awb_info.weight);
			
			if((booklistTableRecord.awb_info.on_hand) == true) {
				icon_color = " text-success ";
				//background_color = " border border-success alert alert-success ";
				console.log('booklist onhand record is here'+JSON.stringify(booklistTableRecord.awb_info.on_hand));
			} else{
				icon = " fas fa-box-open fa-2x ";
				icon_color = "";//" text-grey ";
			}

			if((totalPieces) > 0 || (totalWeight) > 0) {
				totalPieces = ' / '+ totalPieces;
				totalWeight = ' / '+ totalWeight;
			} else{
				totalPieces = ' ';
				totalWeight = ' ';
				
				if((booklistTableRecord.awb_info.on_hand) == true) {
					icon = " fas fa-question fa-2x ";
					icon_color = " text-warning ";
				}
			}

			if((totalPieces > 0) && (totalPieces < booklistTableRecord.pieces)){
				background_color = " border border-danger alert alert-danger";
			}

			console.log("booklistTableRecord", booklistTableRecord.awb_info.src);
			
			let arrival_date = new Date(booklistTableRecord.planned_departure);
			let temp = (
				"<h4> [" + booklistTableRecord.awb_info.station + "] " + booklistTableRecord.awb_info.src + " - " + booklistTableRecord.awb_info.dest + "</h4>" +
				//"<span>" + booklistTableRecord.from + " - " + booklistTableRecord.to + "</span><br/>" +
				"<span>" + "Pieces: " + booklistTableRecord.pieces + "</span><br/>" +
				"<span>" + "Weight: " + booklistTableRecord.weight + "</span><br/>" +
				//"<span>" + "Issuer Name: " + booklistTableRecord.issuer_name + "</span><br>" +
				"<span>" + "SHC: <strong>" + (booklistTableRecord.awb_info.shc.length === 0 ? "none" : booklistTableRecord.awb_info.shc.join(' - ')) + "</strong></span><br/>" +
				"<span>" + "Departed Time: " + moment(arrival_date).format('HH:mm') + "</span>"
			 );

			{
				return(	<tr className={background_color + " m-0 p-1"}>
						<td>
							<div className="mx-0">
								<span>
									<strong className="pr-2">{index + 1}</strong>
									<i className={icon + icon_color + " mx-1"} ></i>
								</span>
							</div>
						</td>
						<td>
							<AWBNumber priority_class={booklistTableRecord.awb_info.priority_class} awb_no={booklistTableRecord.awb_no} tooltipData={temp}/>
							<CopyToClipboard text={booklistTableRecord.awb_no} className={"ml-2"}
							onCopy={() => {window.swal_success('AWB Number copied !', 300)}}>
								<span>
									<i className='text-secondary p-0 mdi mdi-content-copy'></i>
								</span>
							</CopyToClipboard>
					
						</td>
						<td>{booklistTableRecord.from}</td>
						<td>{booklistTableRecord.to}</td>
						{/* <td className={textColor}>{booklistTableRecord.pieces}  {totalPieces}</td> */}
				
						<td><div><strong className='text-dark'>{booklistTableRecord.pieces}  {totalPieces}</strong></div><div><small> ({booklistTableRecord.weight}  {totalWeight}) kg</small></div></td>
				
						{(booklistTableRecord.actual_pieces_flown > 0) &&
						<td><div><strong className='text-info'>{booklistTableRecord.actual_pieces_flown}  {totalPieces}</strong></div><div><small> ({booklistTableRecord.actual_weight_flown}  {totalWeight}) kg</small></div></td>
						}
						{(booklistTableRecord.actual_pieces_flown == 0) &&
							<td>Not Flown</td>
						}
				
						{(booklistTableRecord.actual_pieces_flown == 0) &&
							<td><button className="btn btn-xs btn-danger waves-effect waves-light save-category" type="submit" name="editBooklistRecord" onClick = {()=>this.handleBooklistRecord(booklistTableRecord)}><i className="fas fa-times"></i></button></td>
						}
						{(booklistTableRecord.actual_pieces_flown > 0) &&
							<td>DEPARTED</td>
						}
					</tr>);
			}
			/*else{
				return(	<tr className={background_color + " m-0 p-1"}><td><div><span><i className={icon + icon_color + " mx-2"}></i></span><AWBNumber awb_no={booklistTableRecord.awb_no}/></div></td><td>{booklistTableRecord.from}</td><td>{booklistTableRecord.to}</td><td className={textColor}>{booklistTableRecord.pieces}  {totalPieces}</td><td>{booklistTableRecord.weight}  {totalWeight}</td><td>DEPARTED</td></tr>);
			}*/
	}

	handleBooklistRecord = (booklistTableRecord) =>{
		// alert(JSON.stringify(booklistTableRecord));
		this.props.openBooklistRecordDiscardModal(booklistTableRecord)
	}

	render() {
		let booklistTableRecords;
		
		if(this.props.booklistRecords){
			//booklistTableRecords = this.props.booklistRecords;
			//	To ensure that if the record already exists, then we do not add it, Its a temporary fix.
			booklistTableRecords = this.props.booklistRecords.filter((item, index) => {
				let addIt = true;
				for(let i = 0; i < this.props.booklistRecords.length; i++) {
					if (this.props.booklistRecords[i].id === item.id) {
						return (i === index)
					}
				}
				return (addIt)
			});
		}
		else{
			booklistTableRecords = null;
		}

		if(booklistTableRecords.length > 0) {
			booklistTableRecords.sort((a, b) => (a.awb_info.awb_no > b.awb_info.awb_no) ? 1 : -1)
			return (
				<Observer>{()=>
				<div className="row">
					<div className="col-12">
						<Table size="sm">
							<thead>
								<tr>
									<th><strong>#</strong></th>
									<th><strong>AWB Number</strong></th>
									<th><strong>From</strong></th>
									<th><strong>To</strong></th>
									<th><strong>Planned Pcs &amp; Wt</strong></th>
									<th><strong>Actual Pcs &amp; Wt</strong></th>
									<th><strong>Edit</strong></th>
								</tr>
							</thead>
							<tbody>
							{booklistTableRecords.map(this.renderBooklistTableRecord)}
							</tbody>
						</Table>
					</div>
				</div>
				}</Observer>
				
			);
		} else{
			return(
				<div className="col-12">
					<Table size="sm">
						<thead>
							<tr>
								<td style={{ textAlign: "center" }}><h4 className='m-3'>No AWBs Planned in Booklist</h4>
								</td>
							</tr>
						</thead>
					</Table>
				</div>
			);
		}
	}
}
export default Booklist;