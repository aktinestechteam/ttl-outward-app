import React, { Component } from 'react'
import AWBNumber from '../shared/AWBNumber.js';
import Modal from 'react-bootstrap/Modal';
import AWBKundaliModal from '../awbKundali/AWBKundaliModal.js';
import { Observer } from "mobx-react";
import custom from '../../config/custom.js';


class AWBClaimRecords extends Component {

	constructor(props) {
		super(props);
		this.state = {
			awbClaimRecord: props.awbClaimRecord,
			isAWBKundaliModalShow: false,
		}
	}

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
		let background_color = " alert alert-warning border border-warning";
		if(this.state.awbClaimRecord && this.state.awbClaimRecord.awb_info){
			return(
				<Observer>{()=>
			// 	<div className={background_color + " m-0 p-1"}>
			// 	<AWBNumber priority_class={this.state.awbClaimRecord.awb_info.priority_class} awb_no={this.state.awbClaimRecord.awb_no}/>
			// </div>

			<div>
			<div className={background_color + " m-0 p-1"} onClick={this.openAWBKundaliModal}>
			<AWBNumber priority_class={this.state.awbClaimRecord.awb_info.priority_class} awb_no={this.state.awbClaimRecord.awb_no}/>


			</div>
			<div>
			<Modal className='none-border'  style={{display: "block"}} size={modalSize} aria-labelledby="awbKundaliModalEditTitle"  show={this.state.isAWBKundaliModalShow} onHide={this.closeAWBKundaliModal}>
				<AWBKundaliModal closeAWBKundaliModal={this.closeAWBKundaliModal} awbNo={this.state.awbClaimRecord.awb_no} tabid={custom.custom.tab_name.claim} />
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
					<AWBNumber priority_class='M_CLASS' awb_no={this.state.awbClaimRecord.awb_no}/>
		
		
					</div>
					<div>
					<Modal className='none-border'  style={{display: "block"}} size={modalSize} aria-labelledby="awbKundaliModalEditTitle"  show={this.state.isAWBKundaliModalShow} onHide={this.closeAWBKundaliModal}>
						<AWBKundaliModal closeAWBKundaliModal={this.closeAWBKundaliModal} awbNo={this.state.awbClaimRecord.awb_no} tabid={custom.custom.tab_name.claim} />
					</Modal>
		
					</div>
					</div>
				}</Observer>
			);
		}

		
	}
}
export default AWBClaimRecords;