import React, { Component } from 'react'
import custom from '../../config/custom.js';
import Modal from 'react-bootstrap/Modal';
import ServerTable from '../shared/ServerTable.js';
import AddNewSHCModal from './AddNewSHCModal.js'
// import custom1 from '../test1.js';

export class SHC extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAddNewSHCModalShow: false,
			saveBtnClicked: false,
			shc_to_edit_id: '',
			shc_to_edit_code: '',
			shc_to_edit_explanation: '',
		};
		this.editSHCModal = this.editSHCModal.bind(this);
	}

	openAddNewRecordModal = () =>{
		this.setState ({
			isAddNewSHCModalShow: true,
		});
	}

	closeAddNewSHCModal = () =>{
		this.setState ({
			saveBtnClicked: false,
			isAddNewSHCModalShow: false,
			shc_to_edit_id: '',
			shc_to_edit_code: '',
			shc_to_edit_explanation: '',
		});
	}

	fetchTableData = () =>{
		console.log('after save inside the shc.js =======');
		this.setState({ 
			saveBtnClicked: true,
			isAddNewSHCModalShow: false,
			shc_to_edit_id: '',
			shc_to_edit_code: '',
			shc_to_edit_explanation: ''
		});
	}

	editSHCModal = (row) =>{
		let rowValue = row
		// alert (JSON.stringify(rowValue));
		this.setState({
			shc_to_edit_id: row.id,
			shc_to_edit_code: row.code,
			shc_to_edit_explanation: row.explanation,
		});
		this.openAddNewRecordModal();
	}

	render() {
		let self = this;
		const url = `/fetchShcCodes`;
		const columns = ['code', 'explanation', 'id'];
		
		const options = {
			perPage: 10,
			headings: {code: 'SHC Code', explanation: 'Explanation', id: 'Edit'},
			sortable: ['code'],
			responseAdapter: function (resp_data) {
				let usersIDs = resp_data.data.map(a => a.id);
				console.log('data ==> '+ JSON.stringify(resp_data));
				return {data: resp_data.data, total: resp_data.total}
			},
		};


		return (
			<div className = "page-wrapper">
				<Modal show={this.state.isAddNewSHCModalShow} onHide={this.closeAddNewSHCModal}>
					<AddNewSHCModal closeAddNewSHCModal={this.closeAddNewSHCModal} fetchTableData={this.fetchTableData}
					editSHCId= {this.state.shc_to_edit_id}
					editSHCCode= {this.state.shc_to_edit_code}
					editSHCExplanation= {this.state.shc_to_edit_explanation}
					/>
				</Modal>
				<ServerTable columns={columns} url={url} options={options} title={'SHCs Table'} add_new_button_title={'Add New SHC'} openAddNewRecordModal ={this.openAddNewRecordModal} allowToAdd={this.props.MainStore.allowToAdd} saveBtnClicked={this.state.saveBtnClicked} bordered hover>
				{
					function (row, column) {
						switch (column) {
							case 'id':
								return (
									<div>
										<button className="btn btn-danger waves-effect" type="button" id="addNewSHCModalDeleteBtn" onClick = {() => self.editSHCModal(row)} disabled={!self.props.MainStore.allowToAdd}>
											<i className="fa fa-pencil-alt" aria-hidden="true"></i>
										</button>
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

export default SHC;

