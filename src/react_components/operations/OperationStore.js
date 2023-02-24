import { observable, action, decorate } from "mobx"
import custom from '../../config/custom.js';
import MainStore from "../MainStore";
import APIService from "../APIService.js";
import { useState } from "react";


class OperationStore{

	operationSocket = ''
	
	//awb_leg_ops_data = []
	//added_leg_ops = []
	ready_to_rate_check_legops = []
	ready_to_fdc_legops = []
	rate_check_pending_legops = []
	rate_check_referred_legops = []
	rate_check_hold_legops = []
	rms_review_legops = []
	rms_hub_review_legops = []
	fdc_pending_legops = []
	pre_alert_pending_legops = []
	euics_pending_legops = []
	cap_a_pending_legops = []
	e_awb_check_pending_legops = []
	euics_discrepancy_pending_legops = []
	cap_a_discrepancy_pending_legops = []
	ready_to_recovery_legops = []
	p2_escalation_legops = []
	p1_escalation_legops = []
	escalation_legops = []
	cca_request_pending_legops = []
	cca_approval_pending_legops = []
	awb_query_pending_legops = []
	rcf_pending_legops = []
    sdtStoreRecords = []
	lockedOpsData = []
	pre_alert_pending_legops_transhipment = []
	euics_pending_legops_transhipment = []
	cap_a_pending_legops_transhipment = []
	rate_check_pending_legops_transhipment = []
	fdc_pending_legops_transhipment = []

	isSomethingLocked = false


	clearOperationStore = () => {
		console.log('=====+++++CALL for ComponentWillUnmount to clearOperationStore');
		//this.awb_leg_ops_data = [];
		//this.added_leg_ops = [];
		//this.operationSocket = '';
		this.ready_to_rate_check_legops = [];
		this.ready_to_fdc_legops = [];
		this.rate_check_pending_legops = [];
		this.rate_check_referred_legops = [];
		this.rate_check_hold_legops = [];
		this.rms_review_legops = [];
		this.rms_hub_review_legops = [];
		this.fdc_pending_legops = [];
		this.pre_alert_pending_legops = [];
		this.euics_pending_legops = [];
		this.cap_a_pending_legops = [];
		this.e_awb_check_pending_legops = [];
		this.euics_discrepancy_pending_legops = [];
		this.cap_a_discrepancy_pending_legops = [];
		this.ready_to_recovery_legops = [];
		this.p2_escalation_legops = [];
		this.p1_escalation_legops = [];
		this.escalation_legops = [];
		this.cca_request_pending_legops = [];
		this.cca_approval_pending_legops = [];
		this.awb_query_pending_legops = [];
		this.rcf_pending_legops = [];
        this.sdtStoreRecords = [];
		this.lockedOpsData = [];
		this.pre_alert_pending_legops_transhipment = []
		this.euics_pending_legops_transhipment = []
		this.cap_a_pending_legops_transhipment = []
		this.rate_check_pending_legops_transhipment = []
		this.fdc_pending_legops_transhipment = []
		this.isSomethingLocked = false;
	}

	// initOperationStore = () => {

	// 	let token=APIService.getPlainJwtToken();
	// 	window.io.sails.headers = {
	// 		'Authorization': `Bearer ${token}`

	// 	};
	// 	let mySocket = window.io.sails.connect(`${process.env.REACT_APP_API_BASE_PATH}`);
	// 	this.operationSocket = mySocket;
	// 	//let sdtroomName = MainStore.operatingStation+'_'+custom.custom.awb_leg_ops_status.fdc_pending;
		
	// 	mySocket.on('connect', async function onConnect () {
	// 		console.log('OperationStore', "Socket connected now");
	// 		window.swal_close();
	// 		mySocket.post('/subscribeToFunRoom', {roomname: custom.custom.socket.room_name.operation, function(data) {console.log(data)}});
	// 		//mySocket.post('/subscribeToFunRoom', {roomname: sdtroomName, function(data) {console.log(data)}});
	// 		this.refreshOperationsDataOnly();
	// 	}.bind(this));

	// 	mySocket.on('disconnect', async function () {
	// 		mySocket._raw.io._reconnection = Infinity;
	// 		window.swal_info("Connection Break!!!"+'\n'+"Wait we are trying to reconnect your server");
	// 	});

	// 	return mySocket;
	// }

	refreshOperationsDataOnly = () => {

		console.log('refreshOperationsDataOnly')
		this.clearOperationStore();
		let query;
		let self = this;
		
		if(custom.custom.department_name.central_ops === MainStore.departmentIs || custom.custom.department_name.central_rec === MainStore.departmentIs || custom.custom.department_name.central_fin === MainStore.departmentIs)
		{
			query={department : MainStore.departmentIs, task : custom.custom.awb_leg_ops_status.fdc_pending}
		}else
		{
			query={ station : MainStore.operatingStation, department : MainStore.departmentIs, task : custom.custom.awb_leg_ops_status.fdc_pending}
		}

        APIService.get('/getLegOps', query, async function (respData) {
			// console.log(respData);
			console.log('!!!!!!!!!!!!!!!!!!!!!!!! 222')
			let operations = [];

			if(respData.data && respData.data.length > 0) {
				operations = respData.data;
			}

			console.log('operations data size', operations.length);

			let temp_ready_to_rate_check_legops = []
			let temp_ready_to_fdc_legops = []
			let temp_rate_check_pending_legops = []
			let temp_rate_check_referred_legops = []
			let temp_rate_check_hold_legops = []
			let temp_rms_review_legops = []
			let temp_rms_hub_review_legops = []
			let temp_fdc_pending_legops = []
			let temp_pre_alert_pending_legops = []
			let temp_euics_pending_legops = []
			let temp_cap_a_pending_legops = []
			let temp_e_awb_check_pending_legops = []
			let temp_euics_discrepancy_pending_legops = []
			let temp_cap_a_discrepancy_pending_legops = []
			let temp_ready_to_recovery_legops = []
			let temp_p2_escalation_legops = []
			let temp_p1_escalation_legops = []
			let temp_escalation_legops = []
			let temp_cca_request_pending_legops = []
			let temp_cca_approval_pending_legops = []
			let temp_awb_query_pending_legops = []
			let temp_rcf_pending_legops = []
			let temp_pre_alert_pending_legops_transhipment = []
			let temp_euics_pending_legops_transhipment = []
			let temp_cap_a_pending_legops_transhipment = []
			let temp_rate_check_pending_legops_transhipment = []
			let temp_fdc_pending_legops_transhipment = []

			operations.map((legop, index) => {
				switch(legop.opening_status) {
					case custom.custom.awb_leg_ops_status.ready_to_rate_check:
						temp_ready_to_rate_check_legops.push(legop);
						// if(this.ready_to_rate_check_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.ready_to_rate_check_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.ready_to_fdc:
						temp_ready_to_fdc_legops.push(legop);
						// if(this.ready_to_fdc_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.ready_to_fdc_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.rate_check_pending:
						if(!legop.awb_info.transhipment) {
							temp_rate_check_pending_legops.push(legop);
						} else {
							temp_rate_check_pending_legops_transhipment.push(legop);
						}
						// if(!legop.awb_info.transhipment && this.rate_check_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.rate_check_pending_legops.push(legop);
						// }
						// if(legop.awb_info.transhipment && this.rate_check_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.rate_check_pending_legops_transhipment.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.rate_check_referred:
						temp_rate_check_referred_legops.push(legop);
						// if(this.rate_check_referred_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.rate_check_referred_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.rate_check_hold:
						temp_rate_check_hold_legops.push(legop);
						// if(this.rate_check_hold_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.rate_check_hold_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.rms_review:
						temp_rms_review_legops.push(legop);
						// if(this.rms_review_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.rms_review_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.rms_hub_review:
						temp_rms_hub_review_legops.push(legop);
						// if(this.rms_hub_review_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.rms_hub_review_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.fdc_pending:
						if(!legop.awb_info.transhipment) {
							temp_fdc_pending_legops.push(legop);
						} else {
							temp_fdc_pending_legops_transhipment.push(legop);
						}
						// if(!legop.awb_info.transhipment && this.fdc_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.fdc_pending_legops.push(legop);
						// }
						// if(legop.awb_info.transhipment && this.fdc_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.fdc_pending_legops_transhipment.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.pre_alert_pending:
						if(!legop.awb_info.transhipment) {
							temp_pre_alert_pending_legops.push(legop);
						} else {
							temp_pre_alert_pending_legops_transhipment.push(legop);
						}
						// if(!legop.awb_info.transhipment && 
						// this.pre_alert_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 		this.pre_alert_pending_legops.push(legop);
						// }
						// if(legop.awb_info.transhipment && 
						// this.pre_alert_pending_legops_transhipment.filter(lop => lop.id === legop.id).length==0){
						// 	this.pre_alert_pending_legops_transhipment.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.euics_pending:
						if(!legop.awb_info.transhipment) {
							temp_euics_pending_legops.push(legop);
						} else {
							temp_euics_pending_legops_transhipment.push(legop);
						}
						// if(!legop.awb_info.transhipment && this.euics_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.euics_pending_legops.push(legop);
						// }
						// if(legop.awb_info.transhipment && this.euics_pending_legops_transhipment.filter(lop => lop.id === legop.id).length==0){
						// 	this.euics_pending_legops_transhipment.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.cap_a_pending:
						if(!legop.awb_info.transhipment) {
							temp_cap_a_pending_legops.push(legop);
						} else {
							temp_cap_a_pending_legops_transhipment.push(legop);
						}
						// if(!legop.awb_info.transhipment && this.cap_a_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.cap_a_pending_legops.push(legop);
						// }
						// if(legop.awb_info.transhipment && this.cap_a_pending_legops_transhipment.filter(lop => lop.id === legop.id).length==0){
						// 	this.cap_a_pending_legops_transhipment.push(legop);
						// }
					break;

					// case custom.custom.awb_leg_ops_status.pre_alert_pending && legop.awb_info.transhipment:
					// 	if(this.pre_alert_pending_legops_transhipment.filter(lop => lop.id === legop.id).length==0){
					// 		this.pre_alert_pending_legops_transhipment.push(legop);
					// 	}
					// break;

					// case custom.custom.awb_leg_ops_status.euics_pending && legop.awb_info.transhipment:
					// 	if(this.euics_pending_legops_transhipment.filter(lop => lop.id === legop.id).length==0){
					// 		this.euics_pending_legops_transhipment.push(legop);
					// 	}
					// break;

					// case custom.custom.awb_leg_ops_status.cap_a_pending && legop.awb_info.transhipment:
					// 	if(this.cap_a_pending_legops_transhipment.filter(lop => lop.id === legop.id).length==0){
					// 		this.cap_a_pending_legops_transhipment.push(legop);
					// 	}
					// break;

					case custom.custom.awb_leg_ops_status.e_awb_check_pending:
						temp_e_awb_check_pending_legops.push(legop);
						// if(this.e_awb_check_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.e_awb_check_pending_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.euics_discrepancy_pending:
						temp_euics_discrepancy_pending_legops.push(legop);
						// if(this.euics_discrepancy_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.euics_discrepancy_pending_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.cap_a_discrepancy_pending:
						temp_cap_a_discrepancy_pending_legops.push(legop);
						// if(this.cap_a_discrepancy_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.cap_a_discrepancy_pending_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.ready_to_recovery:
						temp_ready_to_recovery_legops.push(legop);
						// if(this.ready_to_recovery_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.ready_to_recovery_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.p2_escalation:
						temp_p2_escalation_legops.push(legop);
						// if(this.p2_escalation_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.p2_escalation_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.p1_escalation:
						temp_p1_escalation_legops.push(legop);
						// if(this.p1_escalation_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.p1_escalation_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.escalation:
						temp_escalation_legops.push(legop);
						// if(this.escalation_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.escalation_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.cca_request_pending:
						temp_cca_request_pending_legops.push(legop);
						// if(this.cca_request_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.cca_request_pending_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.cca_approval_pending:
						temp_cca_approval_pending_legops.push(legop);
						// if(this.cca_approval_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.cca_approval_pending_legops.push(legop);
						// }
					break;


					case custom.custom.awb_leg_ops_status.awb_query_pending:
						temp_awb_query_pending_legops.push(legop);
						// if(this.awb_query_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.awb_query_pending_legops.push(legop);
						// }
					break;

					case custom.custom.awb_leg_ops_status.rcf_pending:
						temp_rcf_pending_legops.push(legop);
						// if(this.rcf_pending_legops.filter(lop => lop.id === legop.id).length==0){
						// 	this.rcf_pending_legops.push(legop);
						// }
					break;
				}
			});

			console.log('naval', 'is it coming here');
			this.ready_to_rate_check_legops = temp_ready_to_rate_check_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.ready_to_fdc_legops = temp_ready_to_fdc_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.rate_check_pending_legops = temp_rate_check_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.rate_check_referred_legops = temp_rate_check_referred_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.rate_check_hold_legops = temp_rate_check_hold_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.rms_review_legops = temp_rms_review_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.rms_hub_review_legops = temp_rms_hub_review_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.fdc_pending_legops = temp_fdc_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.pre_alert_pending_legops = temp_pre_alert_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.euics_pending_legops = temp_euics_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.cap_a_pending_legops = temp_cap_a_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.e_awb_check_pending_legops = temp_e_awb_check_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.euics_discrepancy_pending_legops = temp_euics_discrepancy_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.cap_a_discrepancy_pending_legops = temp_cap_a_discrepancy_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.ready_to_recovery_legops = temp_ready_to_recovery_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.p2_escalation_legops = temp_p2_escalation_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.p1_escalation_legops = temp_p1_escalation_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.escalation_legops = temp_escalation_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.cca_request_pending_legops = temp_cca_request_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.cca_approval_pending_legops = temp_cca_approval_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.awb_query_pending_legops = temp_awb_query_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.rcf_pending_legops = temp_rcf_pending_legops.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.pre_alert_pending_legops_transhipment = temp_pre_alert_pending_legops_transhipment.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.euics_pending_legops_transhipment = temp_euics_pending_legops_transhipment.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.cap_a_pending_legops_transhipment = temp_cap_a_pending_legops_transhipment.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.rate_check_pending_legops_transhipment = temp_rate_check_pending_legops_transhipment.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)
			this.fdc_pending_legops_transhipment = temp_fdc_pending_legops_transhipment.sort((a,b) => a.awb_leg.planned_departure - b.awb_leg.planned_departure)

		}.bind(this));

		APIService.get('/getLockedAwbOps', {}, async function(lOps){
			console.log("Getting locked leg ops");
			// let lockedOps = [];
			if(lOps && lOps.data && lOps.data.length > 0){
				self.lockedOpsData = lOps.data;
			}
			for(let i=0;i<this.lockedOpsData.length;i++){
				if(this.lockedOpsData[i].username==MainStore.user.username){
					APIService.get('/getLegOp', {operationId: this.lockedOpsData[i].operationId},
					function (respData) {
						if(respData.data){
							if(MainStore.departmentIs!=respData.data.department){
								MainStore.refreshDepartment(respData.data.department);
							}
							if(MainStore.operatingStation!=respData.data.station){
								MainStore.refreshOperatingStation(respData.data.station);
							}
							self.isSomethingLocked = true;
						}
					});
					break;
				}
			}
		}.bind(this));
	}

	performAddLegOp = (legopAdd, socketListener) => {
		let stationCheck = true;
		if((custom.custom.department_name.planner_ops === MainStore.departmentIs ||
			custom.custom.department_name.airport_ops === MainStore.departmentIs)
			&& legopAdd.newLegOp.station != MainStore.operatingStation){
				stationCheck=false;
		}
		if(stationCheck){
			//console.log(' socket call for '+ socketListener +' is=>  '+ JSON.stringify(legopAdd));
			let leg_ops_status = (legopAdd.newLegOp.opening_status + "_legops").toLowerCase();
			if(legopAdd.newLegOp.awb_info.transhipment
				&& (legopAdd.newLegOp.opening_status===custom.custom.awb_leg_ops_status.pre_alert_pending
				|| legopAdd.newLegOp.opening_status===custom.custom.awb_leg_ops_status.euics_pending
				|| legopAdd.newLegOp.opening_status===custom.custom.awb_leg_ops_status.cap_a_pending
				|| legopAdd.newLegOp.opening_status===custom.custom.awb_leg_ops_status.rate_check_pending
				|| legopAdd.newLegOp.opening_status===custom.custom.awb_leg_ops_status.fdc_pending)){
					// window.alert("legop aya leg_ops_status")
				leg_ops_status=(leg_ops_status + "_transhipment").toLowerCase();
				// window.alert("legop aya"+ leg_ops_status);
			}

			let fresh_awb_legops_to_add = [];
			let awb_legop_added = false;
		
			this[leg_ops_status].map((leg_op_record, index) => {
				if(leg_op_record.id === legopAdd.newLegOp.id) {
					fresh_awb_legops_to_add.push(legopAdd.newLegOp);
					awb_legop_added = true;
				}
				else {
					fresh_awb_legops_to_add.push(leg_op_record);
				}
			});
		
			if(awb_legop_added === false){
				fresh_awb_legops_to_add.push(legopAdd.newLegOp)
			}
			this[leg_ops_status] = fresh_awb_legops_to_add;	
		}
	}

	addLegOps = (local_socket) => {
		// let mySocket = io.sails.connect('http://localhost:1337');
		local_socket.on(custom.custom.socket_listener.addLegOps_airport_operation, (legopAdd) => {this.performAddLegOp(legopAdd, custom.custom.socket_listener.addLegOps_airport_operation)});
		local_socket.on(custom.custom.socket_listener.addLegOps_central_operation, (legopAdd) => {this.performAddLegOp(legopAdd,custom.custom.socket_listener.addLegOps_central_operation)});
		local_socket.on(custom.custom.socket_listener.addLegOps_planner_operation, (legopAdd) => {this.performAddLegOp(legopAdd,custom.custom.socket_listener.addLegOps_planner_operation)});
		local_socket.on(custom.custom.socket_listener.addLegOps_central_finance, (legopAdd) => {this.performAddLegOp(legopAdd,custom.custom.socket_listener.addLegOps_central_finance)});
		local_socket.on(custom.custom.socket_listener.addLegOps_central_recovery, (legopAdd) => {this.performAddLegOp(legopAdd,custom.custom.socket_listener.addLegOps_central_recovery)});
	}

	getLockedOps = (local_socket) => {
		// let mySocket = io.sails.connect('http://localhost:1337');
		local_socket.on(custom.custom.socket_listener.lockedOps, (lockOp) => {this.updateLockedOp(lockOp, custom.custom.socket_listener.lockedOps, "LOCK")});
		local_socket.on(custom.custom.socket_listener.unlockedOps, (unlockOp) => {this.updateLockedOp(unlockOp, custom.custom.socket_listener.unlockedOps, "UNLOCK")});
	
	}

	updateLockedOp = (lockOp, socketListener, type) => {
		//console.log(' socket call for '+ socketListener +' is=>  '+ JSON.stringify(lockOp));
		if(type==="LOCK"){
			// alert("aila! lockOp aya, LOCK hua!!!");
			this['lockedOpsData'] = [lockOp, ...this.lockedOpsData];
			if(lockOp.username===MainStore.user.username){
				this.isSomethingLocked = true;
			}
		}
		if(type==="UNLOCK"){
			// alert("aila! lockOp aya, UNLOCK hua!!!");
			let index= -1;
			for(let i=0;i<this.lockedOpsData.length;i++){
				if(this.lockedOpsData[i].operationId===lockOp.operationId){
					index=i;
				}
			}
			if(index!=-1){
				this.lockedOpsData.splice(index,1);
				this['lockedOpsData'] = this.lockedOpsData;
			}
			if(lockOp.username===MainStore.user.username){
				this.isSomethingLocked = false;
			}
		}
		
		console.log("lockOp is : "+ lockOp)	
	}


	performRemoveLegOp = (legopRemove, socketListener) => {
		//console.log(' socket call for =>  ' + socketListener + '  =>' + JSON.stringify(legopRemove));
		let leg_ops_status = (legopRemove.oldLegOp.opening_status + "_legops").toLowerCase();
		if(legopRemove.oldLegOp.awb_info.transhipment 
			&& (legopRemove.oldLegOp.opening_status===custom.custom.awb_leg_ops_status.pre_alert_pending
			|| legopRemove.oldLegOp.opening_status===custom.custom.awb_leg_ops_status.euics_pending
			|| legopRemove.oldLegOp.opening_status===custom.custom.awb_leg_ops_status.cap_a_pending
			|| legopRemove.oldLegOp.opening_status===custom.custom.awb_leg_ops_status.rate_check_pending
			|| legopRemove.oldLegOp.opening_status===custom.custom.awb_leg_ops_status.fdc_pending)){
			leg_ops_status=(leg_ops_status + "_transhipment").toLowerCase();
		}
		let fresh_legops_to_add = [];
		console.log("leg_ops_status  : "+leg_ops_status);
		this[leg_ops_status].map((leg_op_record, index) => {
			if(legopRemove.oldLegOp.id != leg_op_record.id) {
				fresh_legops_to_add.push(leg_op_record);
			}
		});
		this[leg_ops_status] = fresh_legops_to_add;
	}

	removeLegOps = (local_socket) => {
		local_socket.on(custom.custom.socket_listener.removeLegOps_airport_operation, (legopRemove) => {this.performRemoveLegOp(legopRemove,custom.custom.socket_listener.removeLegOps_airport_operation) });
		local_socket.on(custom.custom.socket_listener.removeLegOps_central_operation, (legopRemove) => {this.performRemoveLegOp(legopRemove,custom.custom.socket_listener.removeLegOps_central_operation) });
		local_socket.on(custom.custom.socket_listener.removeLegOps_planner_operation, (legopRemove) => {this.performRemoveLegOp(legopRemove,custom.custom.socket_listener.removeLegOps_planner_operation) });
		local_socket.on(custom.custom.socket_listener.removeLegOps_central_finance, (legopRemove) => {this.performRemoveLegOp(legopRemove,custom.custom.socket_listener.removeLegOps_central_finance) });
		local_socket.on(custom.custom.socket_listener.removeLegOps_central_recovery, (legopRemove) => {this.performRemoveLegOp(legopRemove,custom.custom.socket_listener.removeLegOps_central_recovery) });
	}

	changeInBooklist = (local_socket) => {
		local_socket.on('changeInBooklist', (legops) => {
			//console.log(' socket call for changeInBooklist    '+ JSON.stringify(legops));
			this.refreshOperationsDataOnly();
		});
	}

	/*addSTDLegOps=(local_socket)=>
    {
        local_socket.on('addSTDLegOps', (addSTDLegOps) => {
			console.log('Stationand departmentcalled '+ JSON.stringify(addSTDLegOps));
			this.refreshOperationsDataOnly();
		});

    }*/

}

decorate(OperationStore, {
	//awb_leg_ops_data :observable,
	//added_leg_ops :observable,
	operationSocket :observable,
	ready_to_rate_check_legops :observable,
	ready_to_fdc_legops :observable,
	rate_check_pending_legops :observable,
	rate_check_referred_legops :observable,
	rate_check_hold_legops :observable,
	rms_review_legops :observable,
	rms_hub_review_legops :observable,
	fdc_pending_legops :observable,
	pre_alert_pending_legops :observable,
	euics_pending_legops :observable,
	cap_a_pending_legops :observable,
	pre_alert_pending_legops_transhipment :observable,
	euics_pending_legops_transhipment :observable,
	cap_a_pending_legops_transhipment :observable,
	rate_check_pending_legops_transhipment :observable,
	fdc_pending_legops_transhipment :observable,
	e_awb_check_pending_legops :observable,
	euics_discrepancy_pending_legops :observable,
	cap_a_discrepancy_pending_legops :observable,
	ready_to_recovery_legops :observable,
	p2_escalation_legops :observable,
	p1_escalation_legops :observable,
	escalation_legops :observable,
	cca_request_pending_legops :observable,
	cca_approval_pending_legops :observable,
	awb_query_pending_legops :observable,
	rcf_pending_legops :observable,
	sdtStoreRecords :observable,
	isSomethingLocked:observable,
	clearOperationStore:action,
	initOperationStore:action,
	refreshOperationsDataOnly:action,
	performAddLegOp:action,
	//addSTDLegOps:action,
	changeInBooklist:action,
	removeLegOps:action,
	performRemoveLegOp:action,
	addLegOps:action,
	lockedOpsData:observable,
	getLockedOps: action,
	updateLockedOp:action
  });
export default new OperationStore