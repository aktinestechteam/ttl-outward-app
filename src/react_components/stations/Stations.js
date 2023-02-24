import React, { Component } from 'react'
import custom from '../../config/custom.js';
import Modal from 'react-bootstrap/Modal';
import ServerTable from '../shared/ServerTable.js';
import AddNewStationModal from './AddNewStationModal.js'
// import custom1 from '../test1.js';

export class Station extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saveBtnClicked: false,
			isAddNewStationModalShow: false,
			station_to_edit_id: '',
			station_to_edit_iata_code: '',
			station_to_edit_city_name: '',
			station_to_edit_country_name: '',
			station_to_edit_time_zone: '',
			station_to_edit_is_outward: ''
		};
		this.editStationModal = this.editStationModal.bind(this);
	}

	openAddNewRecordModal = () =>{
		this.setState ({
			isAddNewStationModalShow: true,
			saveBtnClicked: false
		});
	}

	closeAddNewStationModal = () =>{
		this.setState ({
			isAddNewStationModalShow: false,
			station_to_edit_id: '',
			station_to_edit_iata_code: '',
			station_to_edit_city_name: '',
			station_to_edit_country_name: '',
			station_to_edit_time_zone: '',
			station_to_edit_is_outward: ''
		});
	}

	editStationModal = (row) =>{
		// alert (JSON.stringify(rowValue));
		this.setState({
			station_to_edit_id: row.id,
			station_to_edit_iata_code: row.iata,
			station_to_edit_city_name: row.name,
			station_to_edit_country_name: row.country,
			station_to_edit_time_zone: row.tz,
			station_to_edit_is_outward: row.is_outward
		});
		this.openAddNewRecordModal();
	}

	fetchTableData = () =>{
		this.setState({ 
			saveBtnClicked: true,
		});
	}

	render() {
		let self = this;
		const url = `/fetchStations`;
		const columns = ['is_outward', 'iata', 'name', 'country', 'tz', 'gmt', 'dst', 'id'];
		
		const options = {
			perPage: 10,
			headings: {is_outward: 'Outward', iata: 'IATA', name: 'City', country: 'Country', tz: 'Time Zone', gmt: 'GMT', dst: 'DST', id: 'Edit'},
			sortable: ['iata'],
			responseAdapter: function (resp_data) {
				let usersIDs = resp_data.data.map(a => a.id);
				console.log('data ==> '+ JSON.stringify(resp_data));
				return {data: resp_data.data, total: resp_data.total}
			},
		};


		return (
			<div className = "page-wrapper">
				{this.props.MainStore.allowToAdd &&
					<Modal show={this.state.isAddNewStationModalShow} onHide={this.closeAddNewStationModal}>
						<AddNewStationModal closeAddNewStationModal={this.closeAddNewStationModal} saveBtnClicked={this.fetchTableData}
						editStationId= {this.state.station_to_edit_id}
						editStationIataCode= {this.state.station_to_edit_iata_code}
						editStationCityName= {this.state.station_to_edit_city_name}
						editStationCountryName= {this.state.station_to_edit_country_name}
						editStationTimeZone= {this.state.station_to_edit_time_zone}
						editStationIsOutward= {this.state.station_to_edit_is_outward}/>
					</Modal>		
				}
				<ServerTable columns={columns} url={url} options={options} title={'Stations Table'} add_new_button_title='Add New Station' allowToAdd={this.props.MainStore.allowToAdd} openAddNewRecordModal ={this.openAddNewRecordModal} bordered hover saveBtnClicked={this.state.saveBtnClicked}>
				{
					function (row, column) {
						switch (column) {
							case 'id':
								
								return (
									<div>
										<button className="btn btn-danger waves-effect" type="button" id="addNewStationModalEditBtn" onClick = {() => self.editStationModal(row)} disabled={!self.props.MainStore.allowToAdd}>
											<i className="fa fa-pencil-alt" aria-hidden="true"></i>
										</button>
									</div>
								);

								if(self.props.MainStore.allowToAdd === false) {
									return (<></>);
								}
								else {
									
								}
							case 'is_outward':
								return (
									<div>
										{
											row.is_outward == true &&
											<i className="fas fa-check text-success" aria-hidden="true"></i>
										}
										{
											row.is_outward == false &&
											<i className="fas fa-times text-danger" aria-hidden="true"></i>
										}
									</div>
								);
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

export default Station;

