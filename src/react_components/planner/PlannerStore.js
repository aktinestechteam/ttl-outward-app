import { observable, computed, action, decorate, autorun } from "mobx"
import custom from '../../config/custom.js';
import MainStore from '../MainStore';
import APIService from "../APIService.js";

class PlannerStore {

	plannerSocket = ''
	
	awbInfoRecords = []
	awbLegRecords = []
	booklistRecords = []
	storeSelectedFlightDetails = ''

	clearPlannerStore = () => {
		console.log ('=====+++++CALL for ComponentWillUnmount to clearPlannerStore')
		this.awbInfoRecords = [];
		this.awbLegRecords = [];
		this.booklistRecords = [];
		//this.plannerSocket = '';
		//this.storeSelectedFlightDetails = '';
	}

	// initPlannerStore = () => {
	// 	let token = APIService.getPlainJwtToken();
	// 	window.io.sails.headers = {
	// 		'Authorization': `Bearer ${token}`

	// 	};
	// 	let mySocket = window.io.sails.connect(`${process.env.REACT_APP_API_BASE_PATH}`);
	// 	this.plannerSocket = mySocket;
		
	// 	mySocket.on('connect', async function () {
	// 		window.swal_close();
	// 		mySocket.post('/subscribeToFunRoom', {roomname: custom.custom.socket.room_name.planner, function(data) {console.log(data)}});
	// 		this.refreshPlannerDataOnly();
	// 	}.bind(this));
		
	// 	mySocket.on('disconnect', async function () {
	// 		mySocket._raw.io._reconnection = Infinity;
	// 		window.swal_info("Connection Break!!!"+'\n'+"Wait we are trying to reconnect your server");
	// 	}.bind(this));

	// 	return mySocket;
	// }
			
	refreshPlannerDataOnly = () => {
		console.log('----------------------- connected');
		let queryParams = {station: MainStore.operatingStation} ;
		APIService.get('/getPlannerRecords', queryParams, async function (respData) {
			console.log('getPlannerRecords---------> '+JSON.stringify( respData));

			if(respData.data.awbInfoRecords && respData.data.awbInfoRecords.length > 0) {
				this.awbInfoRecords = respData.data.awbInfoRecords;
			} else {
				this.awbInfoRecords = [];
			}
			
			if(respData.data.awbLegRecords && respData.data.awbLegRecords.length > 0) {
				this.awbLegRecords = respData.data.awbLegRecords;
			} else {
				this.awbLegRecords = [];
			}
		}.bind(this));
	}

	addAWBToBeActioned = (local_socket) => {
		local_socket.on('addAWBToBeActioned', (awbInfoAdd) => {
			//console.log(' socket call for addAWBToBeActioned    '+ JSON.stringify(awbInfoAdd));
			if(awbInfoAdd.awb_info.on_hand && awbInfoAdd.awb_info.pieces==0){
				let fresh_rcs_pending_record_to_add = [];
				let rcs_pending_record_added = false;
				this.awbInfoRecords.map((rcs_pending_record, index) => {
					if(rcs_pending_record.id === awbInfoAdd.awb_info.id) {
						fresh_rcs_pending_record_to_add.push(awbInfoAdd.awb_info);
						rcs_pending_record_added = true;
					} else {
						fresh_rcs_pending_record_to_add.push(rcs_pending_record);
					}
				});
				if(rcs_pending_record_added === false)
				fresh_rcs_pending_record_to_add.push(awbInfoAdd.awb_info)
				console.log('fresh_rcs_pending_record_to_add---'+JSON.stringify(fresh_rcs_pending_record_to_add));

				this.awbInfoRecords = fresh_rcs_pending_record_to_add;
			}
			if(awbInfoAdd.awb_info.on_hand){
				let fresh_to_be_planned_record_on_hand=[];
				this.awbLegRecords.map((to_be_planned_record, index) => {
					if(awbInfoAdd.awb_info.awb_no == to_be_planned_record.awb_no) {
						to_be_planned_record.awb_info.on_hand = true;
					}
					fresh_to_be_planned_record_on_hand.push(to_be_planned_record);
				});
				this.awbLegRecords = fresh_to_be_planned_record_on_hand
			}
		});
	}

	removeAWBToBeActioned = (local_socket) => {
		local_socket.on('removeAWBToBeActioned', (awbInfoRemove) => {
			//console.log(' socket call for removeAWBToBeActioned    '+ JSON.stringify(awbInfoRemove));
			let fresh_rcs_pending_record_after_remove = [];

				this.awbInfoRecords.map((rcs_pending_record, index) => {
					if(awbInfoRemove.awb_info.id != rcs_pending_record.id) {
						fresh_rcs_pending_record_after_remove.push(rcs_pending_record);
					}
				});
				this.awbInfoRecords = fresh_rcs_pending_record_after_remove
		});
	}

	addAWBToBePlanned = (local_socket) => {
		local_socket.on('addAWBToBePlanned', (awbLegAdd) => {
			//console.log(' socket call for addAWBToBePlanned    '+ JSON.stringify(awbLegAdd.blankAwbLeg));
			// window.alert("rcs aya");
			let fresh_to_be_planned_record_to_add = [];
			let to_be_planned_record_added = false;
			this.awbLegRecords.map((to_be_planned_record, index) => {
				if(to_be_planned_record.awb_no === awbLegAdd.blankAwbLeg.awb_no) {
					fresh_to_be_planned_record_to_add.push(awbLegAdd.blankAwbLeg);
					to_be_planned_record_added = true;
				} else {
					fresh_to_be_planned_record_to_add.push(to_be_planned_record);
				}
			});
			if(to_be_planned_record_added == false)
			fresh_to_be_planned_record_to_add.push(awbLegAdd.blankAwbLeg)
			console.log('fresh_to_be_planned_record_to_add---'+JSON.stringify(fresh_to_be_planned_record_to_add));
			
			this.awbLegRecords = fresh_to_be_planned_record_to_add

		});
	}

	removeAWBToBePlanned = (local_socket) => {
		local_socket.on('removeAWBToBePlanned', (awbLegRemove) => {
			//console.log(' socket call for removeAWBToBePlanned    '+ JSON.stringify(awbLegRemove));
			let fresh_to_be_planned_record_after_remove = [];
			this.awbLegRecords.map((to_be_planned_record, index) => {
				if(awbLegRemove.awb_no != to_be_planned_record.awb_no) {
					fresh_to_be_planned_record_after_remove.push(to_be_planned_record);
				}
			});
			this.awbLegRecords = fresh_to_be_planned_record_after_remove
		});
	}

	existingBooklistRecords = async (selectedFlightDetails) => {
		console.log('call for existingBooklistRecords inside store' + JSON.stringify(selectedFlightDetails));
		this.storeSelectedFlightDetails = selectedFlightDetails;
		let flightDetail = (selectedFlightDetails.flightDetails).split(',');
		let selectedFlightNumber =  flightDetail[0];
		let selectedFlightTime = flightDetail[1];
		let queryParams = {flightNo: selectedFlightNumber, flightTime: selectedFlightTime, station: MainStore.operatingStation} ;
		APIService.get('/getBooklistRecords', queryParams, function(results, status) {
			if(results) {
				this.booklistRecords = results;
				console.log('getBooklistRecords found. '+ JSON.stringify(results));
			} else{
				this.booklistRecords = [];
				console.log('----no any record found----');
			}
		}.bind(this));
	}

	addAwbToBooklistRecord = (local_socket) =>{
		local_socket.on('addAwbToBooklistRecord', (awbBooklistRecordChange) => {
			console.log('addAwbToBooklistRecord==== ');
			// window.alert("booklist aya"+ awbBooklistRecordChange);
			let fresh_booklist_to_add = [];
			fresh_booklist_to_add.push(awbBooklistRecordChange.awbleg);
			this.booklistRecords.map((booklistRecord, index) => {
				fresh_booklist_to_add.push(booklistRecord);
			});
			this.booklistRecords = fresh_booklist_to_add;
		});
	}
	
	discardBooklistAwbLeg = (local_socket) =>{
		local_socket.on('discardBooklistAwbLeg', (discardBooklistRecord) => {
			console.log('0p0p0pdiscardBooklistRecord===$$$$$$$$$= '+ JSON.stringify(discardBooklistRecord));
			let fresh_booklist_to_add = [];
			this.booklistRecords.map((booklistRecord, index) => {
				//console.log(discardBooklistRecord.awbleg.id +' != '+booklistRecord.id)
				if(discardBooklistRecord.awbleg.id != booklistRecord.id) {
					fresh_booklist_to_add.push(booklistRecord);
				}
			});
			this.booklistRecords = fresh_booklist_to_add;
		});
	}

	onHandforToBePlanned = (local_socket) => {
		local_socket.on('onHandforToBePlanned', (response) => {
			//console.log(' ******socket call for onHandforToBePlanned *****   '+ JSON.stringify(response));
			let fresh_to_be_planned_record_on_hand = [];
			let fresh_booklist_to_add = [];
			this.awbLegRecords.map((to_be_planned_record, index) => {
				if(response.awb_info.awb_no == to_be_planned_record.awb_no) {
					to_be_planned_record.awb_info.on_hand = true;
				}
				fresh_to_be_planned_record_on_hand.push(to_be_planned_record);
			});
			this.awbLegRecords = fresh_to_be_planned_record_on_hand

			this.booklistRecords = this.booklistRecords.map((booklist_record, index) => {
				if(response.awb_info.awb_no == booklist_record.awb_no) {
					booklist_record.awb_info = response.awb_info;
				}
				return booklist_record;
			});
		});
	}

	changeInBooklist = (local_socket) => {
		local_socket.on('changeInBooklist', (legops) => {
			//console.log(' socket call for changeInBooklist    '+ JSON.stringify(legops));
			this.refreshPlannerDataOnly();
			this.existingBooklistRecords(this.storeSelectedFlightDetails);
		});
	}
}

decorate(PlannerStore, {
	awbInfoRecords :observable, 
	awbLegRecords :observable, 
	booklistRecords :observable, 
	plannerSocket :observable, 
	storeSelectedFlightDetails :observable, 
	clearPlannerStore:action,
	initPlannerStore:action,
	refreshPlannerDataOnly:action,
	addAWBToBeActioned:action,
	removeAWBToBeActioned:action,
	addAWBToBePlanned:action,
	removeAWBToBePlanned:action,
	existingBooklistRecords:action,
	addAwbToBooklistRecord:action,
	discardBooklistAwbLeg:action,
	onHandforToBePlanned:action,
	changeInBooklist:action
});

export default new PlannerStore