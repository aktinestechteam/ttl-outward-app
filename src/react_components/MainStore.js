import { observable, action, decorate } from "mobx"
import custom from '../config/custom.js';
import OperationStore from './operations/OperationStore'
import PlannerStore from './planner/PlannerStore'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import APIService from "./APIService.js";

class MainStore {

	socket = undefined;
	operatingStation = "";
	station_options = [];
	departments = [];
	charts = ["CentralOps", "CentralRec", "CentralFin", "Reports"];
	chartIs = "CentralOps";
	allowToAdd = false;
	departmentIs = "";
	visibleOps = [];//[custom.custom.awb_leg_ops_status.ready_to_rate_check, custom.custom.awb_leg_ops_status.ready_to_fdc];
	awbNoToFindIs = "";
	isHeaderOps = "";
	jwttoken = "";
	user = {};
	awbNoToShowDetails="";

	login = (username, password) => {
		axios.post(`${process.env.REACT_APP_API_BASE_PATH}/jwtlogin`, {
			username: username,
			password: password
		}, {})
			.then(res => {
				if (res.data && res.data.errormsg) {
					window.swal_error(res.data.errormsg);
				} else if (res.data && res.data.data) {

					localStorage.setItem("ttl.accessToken", res.data.token);
					localStorage.setItem("ttl.refreshToken", res.data.refreshToken);

					this.initMainStore();
				}
			});
	}

	logout = () => {
		this.station_options = [];
		this.operatingStation = "";
		this.departments = [];
		this.departmentIs = "";
		this.allowToAdd = false;
		this.jwttoken = "";
		localStorage.setItem("ttl.accessToken", "");
		localStorage.setItem("ttl.refreshToken", "");
	}

	initStore = () => {

		let token=APIService.getPlainJwtToken();
		window.io.sails.headers = {
			'Authorization': `Bearer ${token}`

		};
		let mySocket = window.io.sails.connect(`${process.env.REACT_APP_API_BASE_PATH}`);
		OperationStore.operationSocket = mySocket;
		PlannerStore.plannerSocket = mySocket;
		//let sdtroomName = MainStore.operatingStation+'_'+custom.custom.awb_leg_ops_status.fdc_pending;
		
		mySocket.on('connect', async function onConnect () {
			console.log('OperationStore', "Socket connected now");
			window.swal_close();
			mySocket.post('/subscribeToFunRoom', {roomname: custom.custom.socket.room_name.operation, function(data) {console.log(data)}});
			//mySocket.post('/subscribeToFunRoom', {roomname: sdtroomName, function(data) {console.log(data)}});
			// OperationStore.refreshOperationsDataOnly();
			// PlannerStore.refreshPlannerDataOnly();
			this.initMainStore();
		}.bind(this));

		mySocket.on('disconnect', async function () {
			mySocket._raw.io._reconnection = Infinity;
			window.swal_info("Connection Break!!!"+'\n'+"Wait we are trying to reconnect your server");
		});

		return mySocket;
	}

	initMainStore = () => {
		let jwttoken = localStorage.getItem('ttl.accessToken');

		if (!jwttoken) {
			return;
		}

		console.log("jwttoken", jwttoken);

		let decodedjwt = jwt_decode(jwttoken);
		console.log("decoded jwttoken", decodedjwt);
		console.log('jwt expiry', new Date(decodedjwt.exp * 1000), 'now', new Date());
		console.log('jwt expiry - date now', (decodedjwt.exp * 1000) - Date.now());

		//	If the token has expired then the user should be made to logout and relogin
		if ((new Date(decodedjwt.exp * 1000)).getTime() < Date.now()) {
			// this.logout();
			APIService.refreshToken(()=>{
				let jwttoken = localStorage.getItem('ttl.accessToken');

				if (!jwttoken) {
					return;
				}

				console.log("jwttoken", jwttoken);

				let decodedjwt = jwt_decode(jwttoken);
				console.log("decoded jwttoken", decodedjwt);
				console.log('jwt expiry', new Date(decodedjwt.exp * 1000), 'now', new Date());
				console.log('jwt expiry - date now', (decodedjwt.exp * 1000) - Date.now());

				this.user = decodedjwt;

				this.station_options = decodedjwt.stations;
				if (this.station_options) {
					this.operatingStation = this.station_options[0];
				}

				this.departments = decodedjwt.departments;
				if (this.departments) {
					this.departmentIs = this.departments[0];
				}

				this.allowToAdd = decodedjwt.allow_edit;

				this.jwttoken = jwttoken;

				OperationStore.refreshOperationsDataOnly();
				PlannerStore.refreshPlannerDataOnly();
				this.setVisibleOps();
			})
		} else {

			this.user = decodedjwt;

			this.station_options = decodedjwt.stations;
			if (this.station_options) {
				this.operatingStation = this.station_options[0];
			}

			this.departments = decodedjwt.departments;
			if (this.departments) {
				this.departmentIs = this.departments[0];
			}

			this.allowToAdd = decodedjwt.allow_edit;

			this.jwttoken = jwttoken;

			// PlannerStore.initPlannerStore();
			// OperationStore.initOperationStore();
			OperationStore.refreshOperationsDataOnly();
			PlannerStore.refreshPlannerDataOnly();
			this.setVisibleOps();
		}
	}
	refreshChart = (chart) =>{
		this.chartIs=chart;
	}
	refreshOperatingStation = (station, callback) => {
		console.log('this.operating old stn ' + this.operatingStation);
		console.log('in main store refresh operation ' + station);
		if(window.location.href.includes("operation")){
			let self=this;
			for(let i=0;i<OperationStore.lockedOpsData.length;i++){
				if(OperationStore.lockedOpsData[i].username==this.user.username){
					APIService.get('/getLegOp', {operationId: OperationStore.lockedOpsData[i].operationId},
					function (respData) {
						if(respData.data){
							if(self.operatingStation!=respData.data.station){
								self.operatingStation = respData.data.station;
								OperationStore.refreshOperationsDataOnly();
								PlannerStore.refreshPlannerDataOnly();
								// OperationStore.refreshOperationsDataOnly();
								// PlannerStore.initPlannerStore();
								callback(self.operatingStation);
							}
						}
					});
					break;
				}
			}
		}
		this.operatingStation = station;
		OperationStore.refreshOperationsDataOnly();
		PlannerStore.refreshPlannerDataOnly();
		console.log('this.operating new stn ' + this.operatingStation);
	}

	refreshDepartment = (department,callback) => {
		console.log('this.operating old department ' + this.departmentIs);
		console.log('in main store refresh department ' + department);
		let self=this;

		for(let i=0;i<OperationStore.lockedOpsData.length;i++){
			if(OperationStore.lockedOpsData[i].username==this.user.username){
				APIService.get('/getLegOp', {operationId: OperationStore.lockedOpsData[i].operationId},
				function (respData) {
					if(respData.data){
						if(self.departmentIs!=respData.data.department){
							self.departmentIs = respData.data.department;
							self.setVisibleOps();
							// OperationStore.initOperationStore();
							OperationStore.refreshOperationsDataOnly();
							callback(self.departmentIs);
						}
					}
				});
				break;
			}
		}

		this.departmentIs = department;
		this.setVisibleOps();
		// OperationStore.initOperationStore();
		OperationStore.refreshOperationsDataOnly();
		console.log('this.operating new department ' + this.departmentIs);
	}

	openKundaliModal = (awbNo) => {
		console.log('this.operating old awbNo ' + this.awbNoToFindIs);
		console.log('in main store refresh awbNo ' + awbNo);
		this.awbNoToFindIs = awbNo;
		console.log('this.operating new department ' + this.awbNoToFindIs);
	}

	opsselectOpen = (value) => {
		this.isHeaderOps = value;
	}

	updateawb_no(no) {
		// alert("in Mainstore",no)
		return this.modalawb_no = no
	};

	modalOpenComponent() {
		// alert("In maon")
		return this.modalcomponent = true
	}

	modalCloseComponent() {
		// alert("In maon")
		return this.modalcomponent = false
	}

	setAwbNoToShowDetails(awb_no){
		this.awbNoToShowDetails = awb_no
	}
	
	setVisibleOps = () => {
		switch (this.departmentIs) {
			case custom.custom.department_name.planner_ops:
				this.visibleOps = [custom.custom.awb_leg_ops_status.ready_to_rate_check, custom.custom.awb_leg_ops_status.ready_to_fdc];
				break;
			case custom.custom.department_name.central_ops:
				this.visibleOps = [custom.custom.awb_leg_ops_status.fdc_pending, custom.custom.awb_leg_ops_status.rate_check_pending, custom.custom.awb_leg_ops_status.rate_check_hold, custom.custom.awb_leg_ops_status.rate_check_referred, custom.custom.awb_leg_ops_status.rms_review, custom.custom.awb_leg_ops_status.rms_hub_review, custom.custom.awb_leg_ops_status.pre_alert_pending, custom.custom.awb_leg_ops_status.euics_pending, custom.custom.awb_leg_ops_status.cap_a_pending, custom.custom.awb_leg_ops_status.e_awb_check_pending];
				break;
			case custom.custom.department_name.airport_ops:
				this.visibleOps = [custom.custom.awb_leg_ops_status.euics_discrepancy_pending, custom.custom.awb_leg_ops_status.pre_alert_pending, custom.custom.awb_leg_ops_status.euics_pending, custom.custom.awb_leg_ops_status.cap_a_pending, custom.custom.awb_leg_ops_status.fdc_pending, custom.custom.awb_leg_ops_status.rate_check_pending];
				break;
			case custom.custom.department_name.central_fin:
				this.visibleOps = [custom.custom.awb_leg_ops_status.cap_a_discrepancy_pending, custom.custom.awb_leg_ops_status.cca_request_pending, custom.custom.awb_leg_ops_status.cca_approval_pending];
				break;
			case custom.custom.department_name.central_rec:
				this.visibleOps = [custom.custom.awb_leg_ops_status.ready_to_recovery, custom.custom.awb_leg_ops_status.rcf_pending, custom.custom.awb_leg_ops_status.p2_escalation, custom.custom.awb_leg_ops_status.p1_escalation, custom.custom.awb_leg_ops_status.escalation, custom.custom.awb_leg_ops_status.awb_query_pending];
				break;
			default:
				this.visibleOps = [];
		}

		console.log('new visibleOps', this.visibleOps)
	}
}

decorate(MainStore, {
	operatingStation: observable,
	visibleOps: observable,
	station_options: observable,
	allow_to_edit: observable,
	departmentIs: observable,
	chartIs: observable,
	awbNoToFindIs: observable,
	isHeaderOps: observable,
	jwttoken: observable,
	user: observable,
	awbNoToShowDetails:observable,
	refreshOperatingStation: action,
	refreshDepartment: action,
	openKundaliModal: action,
	opsselectOpen: action,
	login: action,
	logout: action,
	initMainStore: action,
	initStore: action,
	updateawb_no: action,
	setAwbNoToShowDetails:action

});

export default new MainStore
