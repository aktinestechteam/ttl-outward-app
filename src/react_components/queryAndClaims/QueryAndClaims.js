import React, { Component } from 'react'
import custom from '../../config/custom.js';
import Modal from 'react-bootstrap/Modal';
import AWBQuery from './AWBQuery.js'
import AWBClaim from './AWBClaim'
import { Observer } from "mobx-react"


class QueryAndClaims extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isRCSPendingModalShow: false,
			isTobePlannedModalShow: false,
			// awbInfoRecords:[],
			// awbLegRecords:[],
			currentAwbQueryRecord: '',
			currentAwbClaimRecord: '',
		};
	}

	async componentDidMount() {
		let local_socket = await this.props.QueryAndClaimsStore.intiQueryAndClaims();
		await this.props.QueryAndClaimsStore.addAWBQuery(local_socket);
		await this.props.QueryAndClaimsStore.removeAWBQuery(local_socket);
		await this.props.QueryAndClaimsStore.addAWBClaim(local_socket);
		await this.props.QueryAndClaimsStore.removeAWBClaim(local_socket);
	}

	async componentWillUnmount() {
		await this.props.QueryAndClaimsStore.clearQueryAndClaimsStore();
	}


	// openRCSPendingModal = (awbInfoRecord) =>{
	// 	this.setState ({
	// 		isRCSPendingModalShow: true,
	// 		currentAwbInfoRecord: awbInfoRecord
	// 	});
	// }

	// closeRCSPendingModal = () =>{
	// 	this.setState ({
	// 		isRCSPendingModalShow: false
	// 	});
	// }

	// openTobePlannedModal = (awbLegRecord) =>{
	// 	this.setState ({
	// 		isTobePlannedModalShow: true,
	// 		currentAwbLegRecord: awbLegRecord
	// 	});
	// }

	// closeTobePlannedModal = () =>{
	// 	this.setState ({
	// 		isTobePlannedModalShow: false
	// 	});
	// }

	render() {
		console.log('accessing mainStore : '+ this.props.MainStore.departmentIs);

		return(
			<Observer>{()=>
			<div className = "page-wrapper">	
				<div className = "container-fluid row">
					<div className="col-md-4">
						
						<div className="row">
							<div className="col-6">
								<div className="text-center bg-dark p-1">
									<label className="my-auto text-white">Queries</label>
								</div>
								<div className="scrollable">
									<AWBQuery awbQueryRecords={this.props.QueryAndClaimsStore.awbQueryRecords} MainStore={this.props.MainStore}/>
								</div>
							</div>
							<div className="col-6">
								<div className="text-center bg-dark p-1">
									<label className="my-auto text-white">Claims</label>
								</div>
								<div className="scrollable">
									<AWBClaim awbClaimRecords={this.props.QueryAndClaimsStore.awbClaimRecords} MainStore={this.props.MainStore}/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			}</Observer>
						
		);
	}
}

export default QueryAndClaims;

