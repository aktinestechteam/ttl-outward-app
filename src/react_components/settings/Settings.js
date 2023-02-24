import React, { Component } from 'react'
import { custom } from '../../config/custom';
import {Table, Button} from 'react-bootstrap';
import axios from 'axios';
import APIService from "../APIService.js";

let settings = [

	//	Ready To Rate Check
	{id:"ready_to_rate_check_trigger_trigger", title: "Ready to RateCheck Trigger", description: "Trigger time before departure"},
	{id:"ready_to_rate_check_cutoff_time", title: "Ready to RateCheck Cut-Off", description: "Cut-off time before departure"},
	{id:"ready_to_rate_check_avg_time", title: "Avg Time Ready to RateCheck", description: "Avg Time for user"},
	//	Rate Check
	//{id:"rate_check_pending_trigger_trigger", title: "", description: ""},
	{id:"rate_check_pending_cutoff_time", title: "Rate Check Cut-Off", description: "Cut-off time before departure"},
	{id:"rate_check_pending_avg_time", title: "Avg Time Rate Check", description: "Avg Time for user"},
	//	Rate Check Referred
	//{id:"rate_check_referred_trigger_trigger", title: "", description: ""},
	{id:"rate_check_referred_q_time", title: "Rate Check Referred Q-Time", description: "Timer value while in Q"},
	{id:"rate_check_referred_avg_time", title: "Avg Time Rate Check Referred", description: "Avg Time for user"},
	//	Rate Check Hold
	//{id:"rate_check_hold_trigger_trigger", title: "", description: ""},
	{id:"rate_check_hold_q_time", title: "Rate Check Hold Q-Time", description: "Timer value while in Q"},
	{id:"rate_check_hold_avg_time", title: "Avg Time Rate Check Hold", description: "Avg Time for user"},
	//	Ready to FDC
	//{id:"ready_to_fdc_trigger_trigger", title: "", description: ""},
	{id:"ready_to_fdc_q_time", title: "Ready to FDC Q-Time", description: "Timer value while in Q"},
	{id:"ready_to_fdc_avg_time", title: "Avg Time Ready to FDC", description: "Avg Time for user"},
	//	FDC
	//{id:"fdc_pending_trigger_trigger", title: "", description: ""},
	{id:"fdc_pending_cutoff_time", title: "FDC Cut-Off", description: "Cut-off time before departure"},
	{id:"ready_to_fdc_avg_time", title: "Avg Time FDC", description: "Avg Time for user"},
	//	RMS Review
	//{id:"rms_review_trigger_trigger", title: "", description: ""},
	{id:"rms_review_q_time", title: "RMS Review Q-Time", description: "Timer value while in Q"},
	{id:"rms_review_avg_time", title: "Avg Time RMS Review", description: "Avg Time for user"},
	//	RMS Hub Review
	//{id:"rms_hub_review_trigger_trigger", title: "", description: ""},
	{id:"rms_hub_review_q_time", title: "RMS Hub Review Q-Time", description: "Timer value while in Q"},
	{id:"rms_hub_review_avg_time", title: "Avg Time RMS Hub Review", description: "Avg Time for user"},
	//	EGM upload time
	{id:"egm_upload_enable_time_trigger_trigger", title: "EGM Upload Time", description: "Time after departure"},
	//{id:"egm_upload_enable_time_q_time", title: "", description: ""},
	//{id:"egm_upload_enable_time_avg_time", title: "Avg Time", description: "Avg Time for user"},
	//	Manual departure time
	{id:"manual_depature_enable_time_trigger_trigger", title: "Manual Departure Time", description: "Time after departure"},
	//{id:"manual_depature_enable_time_q_time", title: "", description: ""},
	//{id:"manual_depature_enable_time_avg_time", title: "Avg Time", description: "Avg Time for user"},
	//	Pre-Alert
	//{id:"pre_alert_pending_trigger_trigger", title: "", description: ""},
	{id:"pre_alert_pending_q_time", title: "Pre-Alert Q-Time", description: "Timer value while in Q"},
	{id:"pre_alert_pending_avg_time", title: "Avg Time Pre-Alert", description: "Avg Time for user"},
	//	CAP-A
	//{id:"cap_a_pending_trigger_trigger", title: "", description: ""},
	{id:"cap_a_pending_q_time", title: "CAP-A Q-Time", description: "Timer value while in Q"},
	{id:"cap_a_pending_avg_time", title: "Avg Time CAP-A", description: "Avg Time for user"},
	//	EUICS
	//{id:"euics_pending_trigger_trigger", title: "", description: ""},
	{id:"euics_pending_q_time", title: "EUICS Q-Time", description: "Timer value while in Q"},
	{id:"euics_pending_avg_time", title: "Avg Time EUICS", description: "Avg Time for user"},
	//	E-AWB
	//{id:"e_awb_check_pending_trigger_trigger", title: "", description: ""},
	{id:"e_awb_check_pending_q_time", title: "E-AWB Check Q-Time", description: "Timer value while in Q"},
	{id:"e_awb_check_pending_avg_time", title: "Avg Time E-AWB", description: "Avg Time for user"},
	//	EUICS Discrepency
	//{id:"euics_discr_pending_trigger_trigger", title: "", description: ""},
	{id:"euics_discr_pending_q_time", title: "EUICS Discrepancy Q-Time", description: "Timer value while in Q"},
	{id:"euics_discr_pending_avg_time", title: "Avg Time EUICS Discrepancy", description: "Avg Time for user"},
	//	CAP-A Discrepency
	//{id:"cap_a_discr_pending_trigger_trigger", title: "", description: ""},
	{id:"cap_a_discr_pending_q_time", title: "CAP-A Discrepancy Q-Time", description: "Timer value while in Q"},
	{id:"cap_a_discr_pending_avg_time", title: "Avg Time CAP-A Discrepancy", description: "Avg Time for user"},
	//	Recovery
	{id:"ready_to_recovery_trigger_trigger", title: "Recovery Trigger", description: "Time after departure"},
	{id:"ready_to_recovery_q_time", title: "Recovery Q-Time", description: "Timer value while in Q"},
	{id:"ready_to_recovery_avg_time", title: "Avg Time Recovery", description: "Avg Time for user"},
	//	P2 Escalation
	{id:"p2_escalation_F_trigger_trigger", title: "P2 Escalation Trigger F Class", description: "Trigger time for P2 F class Escalation"},
	{id:"p2_escalation_M_trigger_trigger", title: "P2 Escalation Trigger M Class", description: "Trigger time for P2 M class Escalation"},
	{id:"p2_escalation_q_time", title: "P2 Escalation Q-Time", description: "Timer value while in Q"},
	{id:"p2_escalation_avg_time", title: "Avg Time P2 Escalation", description: "Avg Time for user"},
	//	P1 Escalation
	{id:"p1_escalation_F_trigger_trigger", title: "P1 Escalation Trigger F Class", description: "Trigger time for P1 F Class Escalation"},
	{id:"p1_escalation_M_trigger_trigger", title: "P1 Escalation Trigger M Class", description: "Trigger time for P1 M Class Escalation"},
	{id:"p1_escalation_q_time", title: "P1 Escalation Q-Time", description: "Timer value while in Q"},
	{id:"p1_escalation_avg_time", title: "Avg Time P1 Escalation", description: "Avg Time for user"},
	//	Escalation
	{id:"escalation_F_trigger_trigger", title: "Escalation Trigger F Class", description: "Trigger time for F Class Escalation"},
	{id:"escalation_M_trigger_trigger", title: "Escalation Trigger M Class", description: "Trigger time for M Class Escalation"},
	{id:"escalation_q_time", title: "Escalation Q-Time", description: "Timer value while in Q"},
	{id:"escalation_avg_time", title: "Avg Time Escalation", description: "Avg Time for user"},
	//	RCF
	{id:"rcf_pending_trigger_trigger", title: "RCF Trigger", description: "Trigger time after arrival"},
	{id:"rcf_pending_q_time", title: "RCF Q-Time", description: "Timer value while in Q"},
	{id:"rcf_pending_avg_time", title: "Avg Time RFC", description: "Avg Time for user"},
	//	AWB Query
	//{id:"awb_query_pending_trigger_trigger", title: "", description: ""},
	{id:"awb_query_pending_q_time", title: "AWB Query Q-Time", description: "Timer value while in Q"},
	{id:"awb_query_pending_avg_time", title: "Avg Time AWB Query", description: "Avg Time for user"},
	//	CCA Request
	//{id:"cca_request_pending_trigger_trigger", title: "", description: ""},
	{id:"cca_request_pending_q_time", title: "CCA Request Q-Time", description: "Timer value while in Q"},
	{id:"cca_request_pending_avg_time", title: "Avg Time CCA Request", description: "Avg Time for user"},
	//	CCA Approval
	//{id:"cca_approval_pending_trigger_trigger", title: "", description: ""},
	{id:"cca_approval_pending_q_time", title: "CCA Approval Q-Time", description: "Timer value while in Q"},
	{id:"cca_approval_pending_avg_time", title: "Avg Time CCA Approval", description: "Avg Time for user"},
	{id:"f_class_delivery_time", title: "F class promised delivery time", description: "Maximum time for delvery for F class"},
	{id:"m_class_delivery_time", title: "M class promised delivery time", description: "Maximum time for delvery for M class"},
	//
	/*{id: "ready_to_rate_check", title: "Rate Check Q time", description: ""},
	{id: "rate_check_pending", title: "Rate Check Pending Q time", description: ""},
	{id: "rate_check_hold", title: "Rate Check hold Q time", description: ""},
	{id: "rate_check_referred", title: "Rate Check referred Q time", description: ""},
	{id: "rms_review", title: "RMS Review Q time", description: ""},
	{id: "rms_hub_review", title: "RMS Hub Review Q time", description: ""},
	{id: "ready_to_fdc", title: "Ready To FDC Q time", description: ""},
	{id: "fdc_pending", title: "FDC Pending Q time", description: ""},
	{id: "ready_to_recovery", title: "Ready to Recover Q time", description: ""},
	{id: "pre_alert_pending", title: "Pre-Alert Pending Q time", description: ""},
	{id: "euics_pending", title: "EUICS Pending Q time", description: ""},
	{id: "cap_a_pending", title: "CAP-A Pending Q time", description: ""},
	{id: "e_awb_check_pending", title: "E-AWB Pending Q time", description: ""},
	{id: "euics_discrepancy_pending", title: "EUICS Desc. Q time", description: ""},
	{id: "cap_a_discrepancy_pending", title: "CAP-A Desc. Q time", description: ""},
	{id: "escalation", title: "Escalation Q time", description: ""},
	{id: "p1_escalation", title: "P1 Escalation Q time", description: ""},
	{id: "p2_escalation", title: "P2 Escalation Q time", description: ""},
	//{id: "cca_request_pending", title: "CCA Request Pending Q time", description: ""},
	//{id: "cca_approval_pending", title: "CCA Approval Pending Q time", description: ""},
	{id: "rcf_pending", title: "RCF Pending Q time", description: ""},

	{id: "start_rate_check", title: "Trigger Rate Check", description: ""},
	{id: "egm_upload_after_duration", title: "Upload EGM after Departure", description: ""},
	{id: "recovery_after_flight_departure", title: "Recovery after Departure", description: ""},
	{id: "start_rcf_after", title: "Start RCF after arrival", description: ""},*/
];

export class Settings extends Component {
	constructor(props) {
		super(props)

		this.state = {
			settings: {}
		}
	}

	componentDidMount(){
		this.getSettings();
	}

	getSettings = () => {
		// axios.get(`${process.env.REACT_APP_API_BASE_PATH}/getAllOpsDurations`,
		// JwtToken.getJwtTokenHeader())
		APIService.get('/getAllOpsDurations', null,res =>{
			let tempSettings = {};
			
			res.data.map(item => {
				tempSettings[item.key] = item.duration;
			});

			this.setState({settings: tempSettings});
		});
	}

	saveSettings = () => {
		window.swal_info('Saving settings');
		// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/saveOpsDurations`, this.state.settings,
		// JwtToken.getJwtTokenHeader())
		APIService.post('/saveOpsDurations', this.state.settings,
		res =>{
			window.swal_success('Settings saved !');
		});
	}

	onValueChange = (event) => {
		let tempSettings = this.state.settings;
		tempSettings[event.target.name] = isNaN(event.target.value) ? 0 : Number(event.target.value);
		this.setState({settings: tempSettings});
	}
	
	render() {
		return (
			<div className="page-wrapper">
				<div className="row">
					{
						settings.map(setting => (
							<div className="col-lg-2 text-center">
								<div className="m-1 border border-success alert-primary">
									<small><strong>{setting.title}</strong></small>
									<div className="input-group">
										<input name={setting.id} id={setting.id} key={setting.id} className="form-control" onChange={this.onValueChange} value={this.state.settings[setting.id]} placeholder={"... in minutes"}/>
										{/*
											setting.description && 
												<span className="alert-success input-group-append py-auto px-1" title={setting.description}>
													<i className="my-auto text-success fa fa-question-circle"></i>
												</span>
										*/
										}
									</div>
									<div className="alert-danger">
										<small>{setting.description}</small>
									</div>
								</div>
							</div>
						)	
					)}
					{this.props.MainStore.allowToAdd &&
						<div className="col-lg-12">
							<Button className="m-2 w-100" onClick={this.saveSettings}>Save</Button>
						</div>
					}
				</div>
				
			</div>
		)
	}
}

export default Settings;
