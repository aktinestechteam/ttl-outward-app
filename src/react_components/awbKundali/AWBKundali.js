import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import AWBKundaliModal from './AWBKundaliModal.js';
import custom from "../../config/custom.js";
import '../shared/modalSize.css';
import { Observer } from "mobx-react"
import {withRouter} from 'react-router-dom';


class AWBKundali extends Component {
	constructor(props) {
		super(props);
		this.state = {
			base_station: '',
			department: props.MainStore.departmentIs,
			chart: props.MainStore.chartIs,
			awb_no: '12552466643',
			isAWBKundaliModalShow: false,
			errors: {base_station_error: '', awb_no_error: ''},
		};
	}

	componentWillReceiveProps(newProps) {
		this.state.department = newProps.MainStore.departmentIs;
	}

	onSelectBaseStation = (event)  => {
		console.log('change in base station == >  '+JSON.stringify(event.target.value));
		this.setState({base_station : event.target.value});
		this.props.MainStore.refreshOperatingStation(event.target.value, (focedStationfromLockedops)=>{
			this.setState({base_station : focedStationfromLockedops});
		});
	}

	onSelectDepartment = (event)  => {
		console.log('change in department == >  '+JSON.stringify(event.target.value));
		this.setState({department : event.target.value});
		this.props.MainStore.refreshDepartment(event.target.value, (focedDepartmentfromLockedops)=>{
			if(focedDepartmentfromLockedops!=event.target.value){
				this.setState({department : focedDepartmentfromLockedops});
			}
		});
	}
	
	onSelectChart = (event)  => {
		console.log('change in chart == >  '+JSON.stringify(event.target.value));
		this.setState({chart : event.target.value});
		this.props.MainStore.refreshChart(event.target.value);
	}

	onChangeAWBNo = (event)  => {
		this.setState({awb_no : event.target.value.trim()});
	}

	onSearchAWBNoAction = (event) => {
		let error = window.checkAWBNumber(this.state.awb_no);
		if(error.length === 0) {
			this.openAWBKundaliModal();
		} else {
			window.swal_error(error);
		}
		
	}

	callToOpenAWBKundaliModal = (awbNo) => {

		console.log('call to open with awbNo'+ awbNo);
		// this.setState ({
		// 	awb_no: this.props.MainStore.awbNoToFindIs,
		// });
		// if(this.state.awb_no){
		// 	this.setState ({
		// 		isAWBKundaliModalShow: true,
		// 	});
		// }
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
		this.setState({awb_no:''})
	}

	render() {
		console.log('call to open inside render with awbNo'+ this.props.MainStore.awbNoToFindIs);
		let modalSize = "xl";

		return (

			<Observer>{()=>
			<ul className = "navbar-nav w-100 row">	
				{/* We Should display the selection of station only when the user is 
					1. Planner Page
					2. Operations Page and the selected department is 
						a. airport operations
						b. planner operations
				 */}
				{(('/operations' === this.props.location.pathname && (this.props.MainStore.departmentIs === custom.custom.department_name.airport_ops || this.props.MainStore.departmentIs === custom.custom.department_name.planner_ops)) || ('/planner' === this.props.location.pathname)) &&
					<div className="input-group my-auto col-md-2">
						<select className="select2 form-control custom-select browser-default px-1" id="current_operating_station" name="current_operating_station" onChange={this.onSelectBaseStation}>
							{
								this.props.MainStore.station_options.map((station, index) => {
									if (station === this.state.base_station)
										// return <option value={station} selected key={id}>{station}</option>
										return <option key={index} value={station} selected>{station}</option>
									else
										return <option key={index} value={station}>{station}</option>
								})
							}
						</select>
					</div>
				}
				{'/' === this.props.location.pathname &&
					<div className="input-group my-auto col-md-3">
						<select className="select2 form-control custom-select browser-default px-1" id="current_chart" name="current_chart" onChange={this.onSelectChart}>
							{
								this.props.MainStore.charts.map((chart, index) => {
									if (chart == this.state.chart) {
										// return <option key={id} value={department} selected>{department}</option>
										return <option key={index} value={chart} selected>{chart}</option>
									} else {
										return <option key={index} value={chart}>{chart}</option>;
									}
								})
							}
						</select>
					</div>
				}

				{/* We Should display the selection of departments only when the user is on Operations Page */}
				{'/operations' === this.props.location.pathname &&
					<div className="input-group my-auto col-md-3">
						<select className="select2 form-control custom-select browser-default px-1" id="current_operating_station" name="current_operating_station" onChange={this.onSelectDepartment}>
							{
								this.props.MainStore.departments.map((department, index) => {
									if (department == this.state.department) {
										// return <option key={id} value={department} selected>{department}</option>
										return <option key={index} value={department} selected>{department}</option>
									} else {
										return <option key={index} value={department}>{department}</option>;
									}
								})
							}
						</select>
					</div>
				}
				<div className="input-group col-md-3 my-auto ml-2" id="awbKundliSearch">
					<input className="form-control form-white" id="awbKundliSearchAwbNoInput" placeholder="Enter 11 Digit AWB No" type="text" value={this.state.awb_no} name="awbKundliSearchAwbNoInput" onChange ={this.onChangeAWBNo}/>
					<div className="input-group-append">
						<button className="btn btn-secondary" id="awbKundliSearchBtn" onClick={() => this.onSearchAWBNoAction()}>Search</button>
					</div>
				</div>

				<strong className="col my-auto text-right text-white">{this.props.MainStore.user.username}</strong>

				<Modal className='none-border'  style={{display: "block"}} size={modalSize} aria-labelledby="awbKundaliModalEditTitle"  show={this.state.isAWBKundaliModalShow} onHide={this.closeAWBKundaliModal}>
					<AWBKundaliModal closeAWBKundaliModal={this.closeAWBKundaliModal} awbNo={this.state.awb_no} MainStore={this.props.MainStore}/>
				</Modal>
			</ul>
			}</Observer>
			
		)
	}
}

export default withRouter(AWBKundali);
