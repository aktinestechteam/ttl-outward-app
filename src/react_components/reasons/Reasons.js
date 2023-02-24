import React, { Component } from 'react'
import custom from '../../config/custom.js';
import Modal from 'react-bootstrap/Modal';
import ServerTable from '../shared/ServerTable.js';
import AddNewReasonModal from './AddNewReasonModal.js'
// import custom1 from '../test1.js';

export class Reason extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAddNewReasonModalShow: false,
			saveBtnClicked: false,
			reason_to_edit_id: '',
			reason_to_edit_category: '',
			reason_to_edit_code: '',
			reason_to_edit_explanation: '',
			reason_to_edit_make_it_visible: ''
		};
		this.editReasonModal = this.editReasonModal.bind(this);
	}

	openAddNewRecordModal = () =>{
		this.setState ({
			isAddNewReasonModalShow: true,
		});
	}

	closeAddNewReasonModal = () =>{
		this.setState ({
			isAddNewReasonModalShow: false,
			saveBtnClicked: false,
			reason_to_edit_id: '',
			reason_to_edit_category: '',
			reason_to_edit_code: '',
			reason_to_edit_explanation: '',
			reason_to_edit_make_it_visible: '',
		});
	}

	fetchTableData = () =>{
		console.log('after save inside the reason.js =======');
		this.setState({ 
			isAddNewReasonModalShow: false,
			saveBtnClicked: true,
			reason_to_edit_id: '',
			reason_to_edit_category: '',
			reason_to_edit_code: '',
			reason_to_edit_explanation: '',
			reason_to_edit_make_it_visible: '',
		});
	}

	editReasonModal = (row) =>{
		// alert (JSON.stringify(rowValue));
		this.setState({
			reason_to_edit_id: row.id,
			reason_to_edit_category: row.category,
			reason_to_edit_code: row.code,
			reason_to_edit_explanation: row.explanation,
			reason_to_edit_make_it_visible: row.make_it_visible,
		});
		this.openAddNewRecordModal();
	}

	render() {
		let self = this;
		const url = `/fetchReasons`;
		const columns = ['make_it_visible', 'category', 'code', 'explanation', 'id'];
		
		const options = {
			perPage: 10,
			headings: {make_it_visible: 'In Use', category: 'Category', code: 'Code', explanation: 'Explanation', id: 'Edit'},
			sortable: ['category','code'],
			responseAdapter: function (resp_data) {
				let usersIDs = resp_data.data.map(a => a.id);
				console.log('data ==> '+ JSON.stringify(resp_data));
				return {data: resp_data.data, total: resp_data.total}
			},
		};


		return (
			<div className = "page-wrapper">
				<Modal show={this.state.isAddNewReasonModalShow} onHide={this.closeAddNewReasonModal}>
					<AddNewReasonModal closeAddNewReasonModal={this.closeAddNewReasonModal} fetchTableData={this.fetchTableData} 
					editReasonId= {this.state.reason_to_edit_id}
					editReasonCategory= {this.state.reason_to_edit_category}
					editReasonCode= {this.state.reason_to_edit_code}
					editReasonExplanation= {this.state.reason_to_edit_explanation}
					editReasonMakeItVisible= {this.state.reason_to_edit_make_it_visible}/>
				</Modal>
				<ServerTable columns={columns} url={url} options={options} title={'Reasons Table'} add_new_button_title={'Add New Reason'} allowToAdd={this.props.MainStore.allowToAdd} openAddNewRecordModal ={this.openAddNewRecordModal} saveBtnClicked={this.state.saveBtnClicked} bordered hover>
				{
					function (row, column) {
						switch (column) {
							case 'id':
								return (
									<div>
										<button className="btn btn-danger waves-effect" type="button" id="addNewReasonModalEditBtn" onClick = {() => self.editReasonModal(row)}disabled={!self.props.MainStore.allowToAdd}>
											<i className="fa fa-pencil-alt" aria-hidden="true"></i>
										</button>
									</div>
								);
							case 'make_it_visible':
								return (
									<div>
										{
											row.make_it_visible == true &&
											<i className="fas fa-check text-success" aria-hidden="true"></i>
										}
										{
											row.make_it_visible == false &&
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

export default Reason;

