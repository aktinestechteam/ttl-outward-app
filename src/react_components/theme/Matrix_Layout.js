import React from 'react';

import Login from '../login/Login.js';
import Header from './Header.js';
import Sidebar from './Sidebar.js';
import SHC from '../shc/SHC.js';
import Settings from '../settings/Settings.js';
import Flights from '../flights/Flights.js';
import Reasons from '../reasons/Reasons.js';
import Operations from '../operations/Operations.js';
import Planner from '../planner/Planner.js';
import Stations from '../stations/Stations.js';
import Footer from '../theme/Footer.js';
import QueryAndClaims from "../queryAndClaims/QueryAndClaims.js";

import MainStore from "../MainStore";
import OperationStore from "../operations/OperationStore";
import PlannerStore from "../planner/PlannerStore";
import QueryAndClaimsStore from "../queryAndClaims/QueryAndClaimsStore";
import ChartRouter from "../Chart/ChartRouter";
import { Observer } from 'mobx-react';

import {
	BrowserRouter,
	HashRouter,
	Switch,
	Route,
	Link,
	Redirect
} from "react-router-dom";
import AWBKundaliModal from '../awbKundali/AWBKundaliModal.js';
import { Modal } from 'react-bootstrap';
import { custom } from '../../config/custom.js';
import { Agents } from '../agents/Agents.js';

export default class Matrix_Layout extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			chartdata: {},
			isAWBKundaliModal: false,
		}

		// MainStore.initMainStore();
		MainStore.initStore();
	}

	closeAWBKundaliModal = () => {

		this.setState({ isAWBKundaliModal: false })
		MainStore.setAwbNoToShowDetails("")

	}

	render() {

		return (
			<Observer>{
				() => {
					if (MainStore.jwttoken === "") {
						return (
							<Login MainStore={MainStore} />
						);
					}
					let modalSize = "xl";
					
					return (

						<div>
							{MainStore.awbNoToShowDetails ? (
							<Modal className='none-border' style={{ display: "block" }} size={modalSize} aria-labelledby="awbKundaliModalEditTitle" show={MainStore.awbNoToShowDetails ? true : false} onHide={false}>
								<AWBKundaliModal MainStore={MainStore} closeAWBKundaliModal={this.closeAWBKundaliModal} awbNo={MainStore.awbNoToShowDetails.awb_no} tabid={MainStore.awbNoToShowDetails.tabid ?? custom.custom.tab_name.all}/>
							</Modal>
							)
							: null}

							<HashRouter>

								<div id='main-wrapper' data-sidebartype="full" className='mini-sidebar'>

									<Header MainStore={MainStore} OperationStore={OperationStore}/>
									<Sidebar MainStore={MainStore} />
									<div className='position-relative'>
										<Switch>
											<Route exact={true} path='/stations'>
												{OperationStore.isSomethingLocked?
													(
														<Redirect to='/operations'></Redirect>
													):(
														<Stations MainStore={MainStore} />
													)
												}
											</Route>
											<Route path='/shc'>
												{OperationStore.isSomethingLocked?
													(
														<Redirect to='/operations'></Redirect>
													):(
														<SHC MainStore={MainStore} />
													)
												}
											</Route>
											<Route path='/reasons'>
												{OperationStore.isSomethingLocked?
													(
														<Redirect to='/operations'></Redirect>
													):(
														<Reasons MainStore={MainStore} />
													)
												}
											</Route>
											<Route path='/settings'>
												{OperationStore.isSomethingLocked?
													(
														<Redirect to='/operations'></Redirect>
													):(
														<Settings MainStore={MainStore} />
													)
												}
											</Route>
											<Route path='/flights'>
												{OperationStore.isSomethingLocked?
													(
														<Redirect to='/operations'></Redirect>
													):(
														<Flights MainStore={MainStore} />
													)
												}
											</Route>
											<Route path='/planner'>
												{OperationStore.isSomethingLocked?
													(
														<Redirect to='/operations'></Redirect>
													):(
														<Planner PlannerStore={PlannerStore} MainStore={MainStore} />
													)
												}
											</Route>
											<Route path='/operations'>
												<Operations OperationStore={OperationStore} MainStore={MainStore} />
											</Route>
											<Route path='/queryandclaims'>
												{OperationStore.isSomethingLocked?
													(
														<Redirect to='/operations'></Redirect>
													):(
														<QueryAndClaims QueryAndClaimsStore={QueryAndClaimsStore} MainStore={MainStore} />
													)
												}
											</Route>
											<Route path='/agents'>
												{OperationStore.isSomethingLocked?
													(
														<Redirect to='/operations'></Redirect>
													):(
														<Agents MainStore={MainStore} />
													)
												}
											</Route>
											<Route path='/'  >
												{OperationStore.isSomethingLocked?
													(
														<Redirect to='/operations'></Redirect>
													):(
														<ChartRouter MainStore={MainStore} />
													)
												}
											</Route>
										</Switch>
									</div>
									<Footer />
								</div>
							</HashRouter >

						</div>
					);
				}
			}</Observer>
		)
	};
}
