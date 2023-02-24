import React, { Component } from 'react'
import AWBNumber from '../shared/AWBNumber.js';
import Modal from 'react-bootstrap/Modal';
import AWBKundaliModal from '../awbKundali/AWBKundaliModal.js';
import { Observer } from "mobx-react";
import custom from '../../config/custom.js';


class AWBQueryRecords extends Component {

	constructor(props) {
		super(props);
		this.state = {
			awbQueryRecord: props.awbQueryRecord,
			isAWBKundaliModalShow: false,
		}
	}

	// onClickAWBNoAction = (event) =>{
	// 	this.openAWBKundaliModal();
	// }

	openAWBKundaliModal = () =>{
		this.setState ({
			isAWBKundaliModalShow: true,
		});
	}

	closeAWBKundaliModal = () =>{
		this.setState ({
			isAWBKundaliModalShow: false
		});
	}

	render() {
		let modalSize = "xl";
		let background_color = " border border-success alert alert-success ";
		console.log('accessing mainStore inside : '+ this.props.MainStore.departmentIs);
		if(this.state.awbQueryRecord && this.state.awbQueryRecord.awb_info){
			return(
				<Observer>{()=>
					<div>
				<div className={background_color + " m-0 p-1"} onClick={this.openAWBKundaliModal}>
				<AWBNumber priority_class={this.state.awbQueryRecord.awb_info.priority_class} awb_no={this.state.awbQueryRecord.awb_no}/>
				
				
				</div>
				<div>
				<Modal className='none-border'  style={{display: "block"}} size={modalSize} aria-labelledby="awbKundaliModalEditTitle"  show={this.state.isAWBKundaliModalShow} onHide={this.closeAWBKundaliModal}>
					<AWBKundaliModal closeAWBKundaliModal={this.closeAWBKundaliModal} awbNo={this.state.awbQueryRecord.awb_no} tabid={custom.custom.tab_name.query} MainStore={this.props.MainStore}/>
				</Modal>

				</div>
				</div>
			
				}</Observer>
			);
		}
		else{
			return(
				<Observer>{()=>
					<div>
					<div className={background_color + " m-0 p-1"} onClick={this.openAWBKundaliModal}>
					<AWBNumber priority_class='M_CLASS' awb_no={this.state.awbQueryRecord.awb_no}/>
					
					
					</div>
					<div>
					<Modal className='none-border'  style={{display: "block"}} size={modalSize} aria-labelledby="awbKundaliModalEditTitle"  show={this.state.isAWBKundaliModalShow} onHide={this.closeAWBKundaliModal}>
						<AWBKundaliModal closeAWBKundaliModal={this.closeAWBKundaliModal} awbNo={this.state.awbQueryRecord.awb_no} tabid={custom.custom.tab_name.query}/>
					</Modal>
	
					</div>
					</div>
				}</Observer>
			);
		}
		
	}
}
export default AWBQueryRecords;