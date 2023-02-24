import React, { Component } from 'react'
import custom from '../../config/custom.js';
import AWBLegOpsParent from './AWBLegOpsParent.js';

import ReadyToRateCheckModal from './ReadyToRateCheckModal.js';
import ReadyToFDCModal from './ReadyToFDCModal.js'
import RateCheckPendingModal from './RateCheckPendingModal.js'
import RateCheckReferredModal from './RateCheckReferredModal.js'
import RateCheckHoldModal from './RateCheckHoldModal.js'
import RMSReviewModal from './RMSReviewModal.js'
import RMSHubReviewModal from './RMSHubReviewModal.js'
import FDCPendingModal from './FDCPendingModal.js'
import PreAlertPendingModal from './PreAlertPendingModal.js'
import EUICSPendingModal from './EUICSPendingModal.js'
import CAPAPendingModal from './CAPAPendingModal.js'
import EAWBCheckPendingModal from './EAWBCheckPendingModal.js'
import EUICSDiscrepancyPendingModal from './EUICSDiscrepancyPendingModal.js'
import CAPADiscrepancyPendingModal from './CAPADiscrepancyPendingModal.js'
import ReadyToRecoveryModal from './ReadyToRecoveryModal.js'
import P2EscalationModal from './P2EscalationModal.js'
import P1EscalationModal from './P1EscalationModal.js'
import EscalationModal from './EscalationModal.js'
import CCARequestPendingModal from './CCARequestPendingModal.js'
import CCAApprovalPendingModal from './CCAApprovalPendingModal.js'
import AWBQueryPendingModal from './AWBQueryPendingModal.js'
import RCFPendingModal from './RCFPendingModal.js'
import '../shared/modalSize.css';

import Modal from 'react-bootstrap/Modal';
// import custom1 from '../test1.js';
import { Observer } from "mobx-react"
// import MainStore from '../MainStore.js';
// import AWBKundaliModal from '../awbKundali/AWBKundaliModal.js';

class Operations extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isModalShow:false,
			currentLegop:''
			
		};
	}

	// async componentDidMount() {
	// 	// let local_socket = await this.props.OperationStore.initOperationStore();
	// 	let local_socket = await this.props.MainStore.initStore();
	// 	await this.props.OperationStore.addLegOps(local_socket);
	// 	await this.props.OperationStore.getLockedOps(local_socket);
	// 	await this.props.OperationStore.removeLegOps(local_socket);
	// 	await this.props.OperationStore.changeInBooklist(local_socket);
	// }

	async componentDidMount() {
		// let local_socket = await this.props.OperationStore.initOperationStore();
		let local_socket = this.props.OperationStore.operationSocket;
		await this.props.OperationStore.refreshOperationsDataOnly();
		await this.props.OperationStore.addLegOps(local_socket);
		await this.props.OperationStore.getLockedOps(local_socket);
		await this.props.OperationStore.removeLegOps(local_socket);
		await this.props.OperationStore.changeInBooklist(local_socket);
	}

	
	async componentWillUnmount() {
		await this.props.OperationStore.clearOperationStore();
	}

	componentWillReceiveProps(newProps) {
		console.log("newProps came in");
	}

	getVisibleOps = () => {
		switch (this.props.MainStore.departmentIs){
			case custom.custom.department_name.planner_ops: return [custom.custom.awb_leg_ops_status.ready_to_rate_check, custom.custom.awb_leg_ops_status.ready_to_fdc];

			case custom.custom.department_name.central_ops : return [custom.custom.awb_leg_ops_status.fdc_pending, custom.custom.awb_leg_ops_status.rate_check_pending, custom.custom.awb_leg_ops_status.rate_check_hold, custom.custom.awb_leg_ops_status.rate_check_referred, custom.custom.awb_leg_ops_status.rms_review, custom.custom.awb_leg_ops_status.rms_hub_review, custom.custom.awb_leg_ops_status.pre_alert_pending, custom.custom.awb_leg_ops_status.euics_pending, custom.custom.awb_leg_ops_status.cap_a_pending, custom.custom.awb_leg_ops_status.e_awb_check_pending];

			case custom.custom.department_name.airport_ops : return [custom.custom.awb_leg_ops_status.euics_discrepancy_pending];

			case custom.custom.department_name.central_fin : return [custom.custom.awb_leg_ops_status.cap_a_discrepancy_pending, custom.custom.awb_leg_ops_status.cca_request_pending, custom.custom.awb_leg_ops_status.cca_approval_pending];

			case custom.custom.department_name.central_rec : return [custom.custom.awb_leg_ops_status.ready_to_recovery, custom.custom.awb_leg_ops_status.rcf_pending,  custom.custom.awb_leg_ops_status.p2_escalation, custom.custom.awb_leg_ops_status.p1_escalation, custom.custom.awb_leg_ops_status.escalation, custom.custom.awb_leg_ops_status.awb_query_pending];

			default: return [];
		}
	}
	// changecom=()=>{
	// 	alert("in change")
	// 	// props.MainStore.modalcomponentfun()
	// 	// Mainmodalcomponent
	// }
	openModal = (currentLegop) =>{
		let result = this.props.OperationStore.lockedOpsData.filter((lockOp)=>{
			if(lockOp.operationId===currentLegop.id){
				return lockOp;
			}
		});
		if(result.length == 0 || result[0].username == this.props.MainStore.user.username){
			this.setState ({
				isModalShow: true,
				currentLegop: currentLegop
			});
		}
		else{
			window.swal_error("The operation is locked by "+ result[0].username);
		}
		
	}

	closeModal = () =>{
		this.setState ({
			isModalShow: false
		});
	}


	render() {
		// const {awb_leg_ops_data, added_legops } = this.props.OperationStore;
		console.log('props=== => '+ JSON.stringify(this.props.OperationStore.pre_alert_pending_legops));
		// console.log('props===lllllll => ');
		// let visibleOps = this.getVisibleOps();
		let modalSize ="lg";
		if (this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.cca_request_pending || this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.cca_approval_pending){
			modalSize ="xl";
		}

		// return (
			
		// 	<Observer>{()=><h1 style={{fontSize:"70px"}}>hfgdjfgfj{this.props.MainStore.departmentIs}</h1>}</Observer>
		// );

		return(
			<Observer>{()=> 
			<div className = "page-wrapper row">	
				{/* <div className="col-12"><center>{this.props.MainStore.departmentIs}</center></div> */}
				<div className = "container-fluid row col-12 flex-nowrap h-100 mb-4" style={{overflow: 'auto'}}>
					
					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.ready_to_rate_check) !== -1) &&
					<AWBLegOpsParent type={'READY TO RATE CHECK'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.ready_to_rate_check_queue_duration} status= {custom.custom.awb_leg_ops_status.ready_to_rate_check} legops={this.props.OperationStore.ready_to_rate_check_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.ready_to_fdc) !== -1) &&
					<AWBLegOpsParent type={'READY TO FDC'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.ready_to_fdc_queue_duration} status= {custom.custom.awb_leg_ops_status.ready_to_fdc} legops={this.props.OperationStore.ready_to_fdc_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.rate_check_pending) !== -1 && this.props.MainStore.departmentIs === custom.custom.department_name.airport_ops) && 
					<AWBLegOpsParent type={'RATE CHECK PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.rate_check_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.rate_check_pending} legops={this.props.OperationStore.rate_check_pending_legops_transhipment} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.rate_check_pending) !== -1 && this.props.MainStore.departmentIs === custom.custom.department_name.central_ops) &&
					<AWBLegOpsParent type={'RATE CHECK PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.rate_check_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.rate_check_pending} legops={this.props.OperationStore.rate_check_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.rate_check_referred) !== -1) &&
					<AWBLegOpsParent type={'RATE CHECK REFERRED'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.rate_check_referred_queue_duration} status= {custom.custom.awb_leg_ops_status.rate_check_referred} legops={this.props.OperationStore.rate_check_referred_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.rate_check_hold) !== -1) &&
					<AWBLegOpsParent type={'RATE CHECK HOLD'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.rate_check_hold_queue_duration} status= {custom.custom.awb_leg_ops_status.rate_check_hold} legops={this.props.OperationStore.rate_check_hold_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no}/>
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.rms_review) !== -1) &&
					<AWBLegOpsParent type={'RMS REVIEW'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.rms_review_queue_duration} status= {custom.custom.awb_leg_ops_status.rms_review} legops={this.props.OperationStore.rms_review_legops} openModal={this.openModal}  MainStore={this.props.MainStore} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.rms_hub_review) !== -1) &&
					<AWBLegOpsParent type={'RMS HUB REVIEW'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.rms_hub_review_queue_duration} status= {custom.custom.awb_leg_ops_status.rms_hub_review} legops={this.props.OperationStore.rms_hub_review_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.fdc_pending) !== -1 && this.props.MainStore.departmentIs === custom.custom.department_name.airport_ops) && 
					<AWBLegOpsParent type={'FDC PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.fdc_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.fdc_pending} legops={this.props.OperationStore.fdc_pending_legops_transhipment} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.fdc_pending) !== -1 && this.props.MainStore.departmentIs === custom.custom.department_name.central_ops) &&
					<AWBLegOpsParent type={'FDC PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.fdc_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.fdc_pending} legops={this.props.OperationStore.fdc_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.pre_alert_pending) !== -1 && this.props.MainStore.departmentIs === custom.custom.department_name.airport_ops) && 
					<AWBLegOpsParent type={'PRE-ALERT PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.pre_alert_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.pre_alert_pending} legops={this.props.OperationStore.pre_alert_pending_legops_transhipment} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.pre_alert_pending) !== -1 && this.props.MainStore.departmentIs === custom.custom.department_name.central_ops) &&
					<AWBLegOpsParent type={'PRE-ALERT PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.pre_alert_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.pre_alert_pending} legops={this.props.OperationStore.pre_alert_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.euics_pending) !== -1 && this.props.MainStore.departmentIs === custom.custom.department_name.airport_ops) && 
					<AWBLegOpsParent type={'EUICS PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.euics_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.euics_pending} legops={this.props.OperationStore.euics_pending_legops_transhipment} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.euics_pending) !== -1 && this.props.MainStore.departmentIs === custom.custom.department_name.central_ops) &&
					<AWBLegOpsParent type={'EUICS PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.euics_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.euics_pending} legops={this.props.OperationStore.euics_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.cap_a_pending) !== -1 && this.props.MainStore.departmentIs === custom.custom.department_name.airport_ops) && 
					<AWBLegOpsParent type={'CAP-A PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.cap_a_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.cap_a_pending} legops={this.props.OperationStore.cap_a_pending_legops_transhipment} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.cap_a_pending) !== -1 && this.props.MainStore.departmentIs === custom.custom.department_name.central_ops) &&
					<AWBLegOpsParent type={'CAP-A PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.cap_a_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.cap_a_pending} legops={this.props.OperationStore.cap_a_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.e_awb_check_pending) !== -1) &&
					<AWBLegOpsParent type={'E-AWB CHECK PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.e_awb_check_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.e_awb_check_pending} legops={this.props.OperationStore.e_awb_check_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.euics_discrepancy_pending) !== -1) &&
					<AWBLegOpsParent type={'EUICS DISCR PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.euics_discrepancy_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.euics_discrepancy_pending} legops={this.props.OperationStore.euics_discrepancy_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.cap_a_discrepancy_pending) !== -1) &&
					<AWBLegOpsParent type={'CAP-A DISCR PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.cap_a_discrepancy_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.cap_a_discrepancy_pending} legops={this.props.OperationStore.cap_a_discrepancy_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}
					
					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.ready_to_recovery) !== -1) &&
					<AWBLegOpsParent type={'READY TO RECOVERY'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.ready_to_recovery_queue_duration} status= {custom.custom.awb_leg_ops_status.ready_to_recovery} legops={this.props.OperationStore.ready_to_recovery_legops} openModal={this.openModal} MainStore={this.props.MainStore} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.p2_escalation) !== -1) &&
					<AWBLegOpsParent type={'P2 ESCALATION '} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.p2_escalation_queue_duration} status= {custom.custom.awb_leg_ops_status.p2_escalation} legops={this.props.OperationStore.p2_escalation_legops} openModal={this.openModal} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.p1_escalation) !== -1) &&
					<AWBLegOpsParent type={'P1 ESCALATION'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.p1_escalation_queue_duration} status= {custom.custom.awb_leg_ops_status.p1_escalation} legops={this.props.OperationStore.p1_escalation_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.escalation) !== -1) &&
					<AWBLegOpsParent type={'ESCALATION'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.escalation_queue_duration} status= {custom.custom.awb_leg_ops_status.escalation} legops={this.props.OperationStore.escalation_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.cca_request_pending) !== -1) &&
					<AWBLegOpsParent type={'CCA Request Pending'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.cca_request_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.cca_request_pending} legops={this.props.OperationStore.cca_request_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.cca_approval_pending) !== -1) &&
					<AWBLegOpsParent type={'CCA APPROVAL PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.cca_approval_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.cca_approval_pending} legops={this.props.OperationStore.cca_approval_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}		

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.awb_query_pending) !== -1) &&
						<AWBLegOpsParent type={'AWB QUERY PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.awb_query_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.awb_query_pending} legops={this.props.OperationStore.awb_query_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
						}

					{	(this.props.MainStore.visibleOps.indexOf(custom.custom.awb_leg_ops_status.rcf_pending) !== -1) &&
					<AWBLegOpsParent type={'RCF PENDING'} lockedOpsData={this.props.OperationStore.lockedOpsData} queue_duration={custom.custom.queue_timer.rcf_pending_queue_duration} status= {custom.custom.awb_leg_ops_status.rcf_pending} legops={this.props.OperationStore.rcf_pending_legops} openModal={this.openModal} mainstoreawbno={this.props.MainStore.modalawbNo} mainstoreawbnofun={this.props.MainStore.updateawb_no} />
					}
					
					<Modal show={this.state.isModalShow} onHide={this.closeModal} size={modalSize} backdrop={"static"} keyboard={false}>
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.ready_to_rate_check &&
								<ReadyToRateCheckModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.ready_to_fdc &&
								<ReadyToFDCModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.rate_check_pending &&
								<RateCheckPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.rate_check_referred &&
								<RateCheckReferredModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.rate_check_hold &&
								<RateCheckHoldModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.rms_review &&
								<RMSReviewModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} queue_duration={custom.custom.queue_timer.rms_review_queue_duration} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.rms_hub_review &&
								<RMSHubReviewModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} queue_duration={custom.custom.queue_timer.rms_hub_review_queue_duration} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.fdc_pending &&
								<FDCPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.pre_alert_pending &&
								<PreAlertPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.euics_pending &&
								<EUICSPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.cap_a_pending &&
								<CAPAPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.e_awb_check_pending &&
								<EAWBCheckPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.euics_discrepancy_pending &&
								<EUICSDiscrepancyPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.cap_a_discrepancy_pending &&
								<CAPADiscrepancyPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.ready_to_recovery &&
								<ReadyToRecoveryModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.p2_escalation &&
								<P2EscalationModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.p1_escalation &&
								<P1EscalationModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.escalation &&
								<EscalationModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>

						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.cca_request_pending &&
								<CCARequestPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>

						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.cca_approval_pending &&
								<CCAApprovalPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>

						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.awb_query_pending &&
								<AWBQueryPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>

						}
						{	this.state.currentLegop.opening_status === custom.custom.awb_leg_ops_status.rcf_pending &&
								<RCFPendingModal closeModal={this.closeModal} lockedOpsData={this.props.OperationStore.lockedOpsData} legop_record={this.state.currentLegop} operation_socket={this.props.OperationStore.operationSocket} MainStore={this.props.MainStore}/>
						}
					</Modal>
					
				</div>
				{/* <div className="col-2 alert-success"/> */}
			</div>
			}</Observer>
			
			
			
			
			
		);
	}
}

export default Operations;

