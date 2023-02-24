import React, { Component } from 'react'
// import custom from '../../config/custom.js';
import Modal from 'react-bootstrap/Modal';
import FlightsFileUpload from './FlightsFileUpload.js'
import ServerTable from '../shared/ServerTable.js';
import AddNewFlightModal from './AddNewFlightModal.js'
// import custom1 from '../test1.js';

export class Flights extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAddNewFlightModalShow: false,
			saveBtnClicked: false,
			selectedSeason: '',
		};
	}

	openAddNewRecordModal = () =>{
		this.setState ({
			isAddNewFlightModalShow: true,
		});
	}

	closeAddNewFlightModal = () =>{
		this.setState ({
			isAddNewFlightModalShow: false,
			saveBtnClicked: false,
		});
	}

	selectSeason = (season) =>{
		console.log('===========flightData==========='+ JSON.stringify(season));
		this.setState ({
			selectedSeason: season
		});
	}
	fileUploadSuccessfully =(data) =>{
		this.setState({
			fileUpload : data
		})
	} 

	fetchTableData = () =>{
		console.log('after save inside the flights.js =======');
		this.setState({ 
			saveBtnClicked: true,
			isAddNewFlightModalShow: false,
		});
	}

	render() {
		// let self = this;
		const url = `/fetchFlights`;
		const columns = ['flight_no', 'src', 'dest', 'route', 'vehicle', 'start_date', 'end_date', 'departure_time', 'arrival_time', 'flight_days'];
		
		const options = {
			perPage: 10,
			headings: {flight_no: 'Flight No.', src: 'Source', dest: 'Destination', route: 'Route', vehicle: 'Vehicle', start_date: 'Start Date', end_date: 'End Date', departure_time: 'Departure Time', arrival_time: 'Arrival Time',flight_days: 'Flight Days'},
			sortable: ['flight_no', 'src', 'dest', 'start_date', 'end_date', 'departure_time', 'arrival_time'],
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
				<FlightsFileUpload selectSeason={this.selectSeason} fileUploadSuccessfully= {this.fileUploadSuccessfully} allowToAdd={this.props.MainStore.allowToAdd}/>
				<Modal show={this.state.isAddNewFlightModalShow} onHide={this.closeAddNewFlightModal}>
					<AddNewFlightModal closeAddNewFlightModal={this.closeAddNewFlightModal} selectedSeason = {this.state.selectedSeason}  fetchTableData={this.fetchTableData}/>
				</Modal>
				<ServerTable season = {this.state.selectedSeason} columns={columns} url={url} options={options} title={'Flight Schedules'} add_new_button_title={'Add New Flight'} allowToAdd={this.props.MainStore.allowToAdd} openAddNewRecordModal ={this.openAddNewRecordModal} saveBtnClicked={this.state.saveBtnClicked} bordered hover>
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

export default Flights;

