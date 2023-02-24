import React, { Component } from 'react'
// import custom from '../../config/custom.js';
import Modal from 'react-bootstrap/Modal';
import AgentsFileUpload from './AgentsFileUpload.js'
import ServerTable from '../shared/ServerTable.js';
import { Badge } from 'react-bootstrap';

export class Agents extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saveBtnClicked: false,
		};
	}

	openAddNewRecordModal = () =>{
	}

	closeAddNewAgentModal = () =>{
	}

	fileUploadSuccessfully =(data) =>{
		this.setState({
			fileUpload : data
		})
	} 

	fetchTableData = () =>{
		this.setState({ 
			saveBtnClicked: true,
		});
	}

	render() {
		// let self = this;
		const url = `/fetchAgents`;
		const columns = [ 
			"country_code", 
			"billing_code", 
			//"account_no", 
			//"uk_company_no", 
			"name", 
			"location", 
			//"iata", 
			//"cass", 
			"billing_method", 
			"billing_station", 
			"station", 
			"currency", 
			//"start_date", 
			//"end_date", 
			"updated_terminal", 
			//"updated_date"
		];
		
		const options = {
			perPage: 10,
			headings: {
				country_code: "Country Code",
				billing_code: "Billing Code",
				//account_no: "Account No.",
				//uk_company_no: "UK Company No.",
				name: "Name",
				location: "Location",
				// iata: "IATA",
				// cass: "CASS",
				billing_method: "Billing Method",
				billing_station: "Billing Station",
				station: "Station",
				currency: "Currency",
				// start_date: "Start Date",
				// end_date: "End Date",
				updated_terminal: "Updated Terminal",
				//updated_date: "Updated Date",
			},
			sortable: ['billing_code', 'name', 'billing_station', 'station'],
			// columnsWidth: {name: 30, email: 30, id: 5},
			// columnsAlign: {id: 'center', avatar: 'center'},
			responseAdapter: function (resp_data) {
				// let usersIDs = resp_data.data.map(a => a.id);
				console.log('data ==> '+ JSON.stringify(resp_data));
				return {data: resp_data.data, total: resp_data.total}
			},
		};

		// "monday":true,"tuesday":false,"wednesday":true,"thursday":true,"friday":false,"saturday":true,"sunday":true,
		// {moment(awb_leg_op.createdAt).format("HH:mm DD/MM/YYYY")}

		return (
			<div className = "page-wrapper" >	
				<AgentsFileUpload fileUploadSuccessfully= {this.fileUploadSuccessfully} allowToAdd={this.props.MainStore.allowToAdd}/>
				<Badge variant="warning">Please upload the file which has xls extention, the sheet name is Report1, the 1st row must contain all the column names (remove rows if any are part of the sheet)</Badge>
				<ServerTable columns={columns} url={url} options={options} title={'Agent List'} add_new_button_title={'Add New Agent'} allowToAdd={false} openAddNewRecordModal ={this.openAddNewRecordModal} saveBtnClicked={false} bordered hover>
				{
					function (row, column) {
						let startDate = Number(row.start_date);
						let endDate = Number(row.end_date);
						let departureTimeHrs = (row.departure_time -row.departure_time% 100) / 100;
						if(departureTimeHrs.toString().length === 1){
							departureTimeHrs = departureTimeHrs.toString().padStart(2, "0");
						}
						let departureTimeMin = (row.departure_time)%100;
						if(departureTimeMin.toString().length === 1){
							departureTimeMin = departureTimeMin.toString().padStart(2, "0");
						}
						let arrivalTimeHrs = (row.arrival_time -row.arrival_time% 100) / 100;
						if(arrivalTimeHrs.toString().length === 1){
							arrivalTimeHrs = arrivalTimeHrs.toString().padStart(2, "0");
						}
						let arrivalTimeMin = (row.arrival_time)%100;
						if(arrivalTimeMin.toString().length === 1){
							arrivalTimeMin = arrivalTimeMin.toString().padStart(2, "0");
						}
						
						switch (column) {
							case 'flight_days':
								return (
									<div>
										{
											row.sunday === true &&
											<span className="badge badge-success m-1" style={{width:"20px"}}>S</span>
										}
										{
											row.sunday === false &&
											<span className="badge badge-light m-1" style={{width:"20px"}}>S</span>
										}
										{
											row.monday === true &&
											<span className="badge badge-success m-1" style={{width:"20px"}}>M</span>
										}
										{
											row.monday === false &&
											<span className="badge badge-light m-1" style={{width:"20px"}}>M</span>
										}
										{
											row.tuesday === true &&
											<span className="badge badge-success m-1" style={{width:"20px"}}>T</span>
										}
										{
											row.tuesday === false &&
											<span className="badge badge-light" style={{width:"20px"}}>T</span>
										}
										{
											row.wednesday === true &&
											<span className="badge badge-success m-1" style={{width:"20px"}}>W</span>
										}
										{
											row.wednesday === false &&
											<span className="badge badge-light m-1" style={{width:"20px"}}>W</span>
										}
										{
											row.thursday === true &&
											<span className="badge badge-success m-1" style={{width:"20px"}}>T</span>
										}
										{
											row.thursday === false &&
											<span className="badge badge-light m-1" style={{width:"20px"}}>T</span>
										}
										{
											row.friday === true &&
											<span className="badge badge-success m-1" style={{width:"20px"}}>F</span>
										}
										{
											row.friday === false &&
											<span className="badge badge-light m-1" style={{width:"20px"}}>F</span>
										}
										{
											row.saturday === true &&
											<span className="badge badge-success m-1" style={{width:"20px"}}>S</span>
										}
										{
											row.saturday === false &&
											<span className="badge badge-light m-1" style={{width:"20px"}}>S</span>
										}
									</div>
								);
							case 'start_date':
								return (<span>{window.moment(startDate).format("DD/MM/YYYY")}</span>);
							case 'end_date':
								return (<span>{window.moment(endDate).format("DD/MM/YYYY")}</span>);
							case 'departure_time':
								return (<span>{departureTimeHrs}:{departureTimeMin}</span>);
							case 'arrival_time':
								return (<div><span>{arrivalTimeHrs}:{arrivalTimeMin}</span>{row.arrival_day > 0 && <span>&nbsp;(+{row.arrival_day})</span>}</div>);
							default:
								return (row[column]);
						}
					}
				}
				</ServerTable>
			</div>

		);
	}
}

export default Agents;

