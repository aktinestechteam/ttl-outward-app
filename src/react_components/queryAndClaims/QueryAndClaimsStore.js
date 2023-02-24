import { observable, computed, action, decorate, autorun } from "mobx"
import custom from '../../config/custom.js';
import APIService from "../APIService.js";

class QueryAndClaimsStore{

	 awbQueryRecords = []
	 awbClaimRecords = []
	 queryAndClaimsrSocket = ''

	clearQueryAndClaimsStore = () => {
		console.log ('=====+++++CALL for ComponentWillUnmount to clear QueryAndClaimsStore')
		this.awbQueryRecords = [];
		this.awbClaimRecords = [];
		this.queryAndClaimsrSocket = '';
		//this.plannerSocket = '';
		//this.storeSelectedFlightDetails = '';
	}

	intiQueryAndClaims = () => {
		let token=APIService.getPlainJwtToken();
		window.io.sails.headers = {
			'Authorization': `Bearer ${token}`

		};
		let mySocket = window.io.sails.connect(`${process.env.REACT_APP_API_BASE_PATH}`);
		this.queryAndClaimsSocket = mySocket;

		mySocket.on('connect', async function onConnect () {
			APIService.post('/subscribeToFunRoom', {roomname: custom.custom.socket.room_name.queryAndClaims, function(data) {console.log(data)}});
		
			this.refreshQueryAndClaims();
		}.bind(this));
		return mySocket;
	}
			
	refreshQueryAndClaims = () => {
		console.log('----------------------- connected');
		let queryParams = {station: this.operatingStation} ;
		APIService.get('/getQueryAndClaimsRecords', queryParams, async function (respData) {
			console.log('getQueryAndClaimsRecords---------> '+JSON.stringify( respData));

			if(respData.data.awbQueryRecords && respData.data.awbQueryRecords.length > 0) {
				this.awbQueryRecords = respData.data.awbQueryRecords;
			}
			
			if(respData.data.awbClaimRecords && respData.data.awbClaimRecords.length > 0) {
				this.awbClaimRecords = respData.data.awbClaimRecords;
			}
		}.bind(this));
	}

	addAWBQuery = (local_socket) => {
		local_socket.on('addAWBQuery', (awbQueryAdd) => {
			//console.log(' socket call for addAWBQuery    '+ JSON.stringify(awbQueryAdd));

			let fresh_query_record_to_add = [];
			let query_record_added = false;
			this.awbQueryRecords.map((query_record, index) => {
				if(query_record.id === awbQueryAdd.awb_info.id) {
					fresh_query_record_to_add.push(awbQueryAdd.awb_query);
					query_record_added = true;
				} else {
					fresh_query_record_to_add.push(query_record);
				}
			});
			if(query_record_added === false)
			fresh_query_record_to_add.push(awbQueryAdd.awb_query)
			console.log('fresh_query_record_to_add---'+JSON.stringify(fresh_query_record_to_add));

			this.awbQueryRecords = fresh_query_record_to_add;
		});
	}

	removeAWBQuery = (local_socket) => {
		local_socket.on('removeAWBQuery', (awbQueryRemove) => {
			//console.log(' socket call for removeAWBQuery    '+ JSON.stringify(awbQueryRemove));
			let fresh_query_record_after_remove = [];

				this.awbQueryRecords.map((query_record, index) => {
					if(awbQueryRemove.awb_query.id != query_record.id) {
						fresh_query_record_after_remove.push(query_record);
					}
				});
				this.awbQueryRecords = fresh_query_record_after_remove
		});
	}



	addAWBClaim = (local_socket) => {
		local_socket.on('addAWBClaim', (awbClaimAdd) => {
			//console.log(' socket call for addAWBClaim    '+ JSON.stringify(awbClaimAdd.awb_claim));
			
			let fresh_claim_record_to_add = [];
			let claim_record_added = false;
			this.awbClaimRecords.map((claim_record, index) => {
				if(claim_record.awb_no === awbClaimAdd.awb_claim.awb_no) {
					fresh_claim_record_to_add.push(awbClaimAdd.awb_claim);
					claim_record_added = true;
				} else {
					fresh_claim_record_to_add.push(claim_record);
				}
			});
			if(claim_record_added == false)
			fresh_claim_record_to_add.push(awbClaimAdd.blankAwbLeg)
			console.log('fresh_claim_record_to_add---'+JSON.stringify(fresh_claim_record_to_add));
			
			this.awbClaimRecords = fresh_claim_record_to_add

		});
	}

	removeAWBClaim = (local_socket) => {
		local_socket.on('removeAWBClaim', (awbClaimRemove) => {
			//console.log(' socket call for removeAWBClaim    '+ JSON.stringify(awbClaimRemove));
			let fresh_claim_record_after_remove = [];
			this.awbClaimRecords.map((claim_record, index) => {
				if(awbClaimRemove.awb_no != claim_record.awb_no) {
					fresh_claim_record_after_remove.push(claim_record);
				}
			});
			this.awbClaimRecords = fresh_claim_record_after_remove
		});
	}

}

decorate(QueryAndClaimsStore, {
	awbQueryRecords:observable,
	 awbClaimRecords:observable,
	 queryAndClaimsrSocket:observable,
	 clearQueryAndClaimsStore:action,
	 intiQueryAndClaims:action,
	 refreshQueryAndClaims:action,
	 addAWBQuery:action,
	 removeAWBQuery:action,
	 addAWBClaim:action,
	 removeAWBClaim:action

	
  });

export default new QueryAndClaimsStore