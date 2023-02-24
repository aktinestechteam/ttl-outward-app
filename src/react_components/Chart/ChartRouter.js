import React, { Component } from 'react'
import { Bar, Line, Bubble, Pie } from 'react-chartjs-2';
import { Observer } from "mobx-react"
import {withRouter} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import APIService from "../APIService";
import { ToggleButton,ButtonGroup} from "react-bootstrap";
import DatePicker from "react-datepicker";
import custom from '../../config/custom.js';
import Modal from 'react-bootstrap/Modal';
import AWBKundaliModal from '../awbKundali/AWBKundaliModal.js';
import CentralRecChart from "../Chart/CentralRecChart";
import CentralOpsChart from "../Chart/CentralOpsChart";
import CentralOpsChart2 from "../Chart/CentralOpsChart2";
import CentralOpsChart3 from "../Chart/CentralOpsChart3";
import CentralFinChart from "../Chart/CentralFinChart";
import OutOfRecChart from "./OutOfRecChart";
import ClaimsChart from "./ClaimsChart";
import CentralFinChartTop5 from "../Chart/CentralFinChartTop5";
import AllOpsAnalysisChart from "./AllOpsAnalysisChart";
import EAWBPerformanceChart from "./EAWBPerformanceChart";
import RecoveryProcessPerformance from "./RecoveryProcessPerformance";
import QueueManagementAnalysisChart from "./QueueManagementAnalysisChart";
import LifeCycleOfFlightChart from "./LifeCycleOfFlightChart";
import DetailedOutputReportBChart from "./DetailedOutputReportBChart";
import DetailedOutputReportAChart from "./DetailedOutputReportAChart";

export default class ChartRouter extends Component {
    constructor(props) {
        super(props)
        
    }
    
    componentWillReceiveProps(newProps) {

    }
    componentWillMount(){
		

	}
    componentDidMount(){
		

	}

    render() {
        return (
            <Observer>{()=>
            <div>
                {this.props.MainStore.chartIs=="CentralOps" &&
                    <div>
                        <div className = "page-wrapper">	
				        <div className = "container-fluid">
                           <h1 className="text-center">Total Queues Handled</h1>
                        <CentralOpsChart MainStore={this.props.MainStore} />
                        <br></br>
                        <h1 className="text-center">Process completion Performance %</h1>
                        <CentralOpsChart2 MainStore={this.props.MainStore} />
                        <br></br>
                        <h1 className="text-center">Performance Met / Not Met</h1>
                        <CentralOpsChart3 MainStore={this.props.MainStore} />
                        </div>
                        </div>
                    </div>
                }
                {this.props.MainStore.chartIs=="CentralRec" &&
                    <CentralRecChart MainStore={this.props.MainStore} />
                }
                {this.props.MainStore.chartIs=="CentralFin" &&
                    <div>
                        <div className = "page-wrapper">	
				        <div className = "container-fluid">
                        <CentralFinChart MainStore={this.props.MainStore} />
                        <CentralFinChartTop5 MainStore={this.props.MainStore} />
                        </div>
                        </div>
                    </div>
                }
                {this.props.MainStore.chartIs=="Reports" &&
                <div>
                    <div className = "page-wrapper">
                        
				        <div className = "container-fluid">
                            <div className="row">
                                <div className="col-md-6">
                                    <DetailedOutputReportAChart MainStore={this.props.MainStore}></DetailedOutputReportAChart>
                                </div>
                                <div className="col-md-6">
                                    <DetailedOutputReportBChart MainStore={this.props.MainStore}></DetailedOutputReportBChart>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <RecoveryProcessPerformance MainStore={this.props.MainStore}></RecoveryProcessPerformance>
                                </div>
                                <div className="col-md-6">
                                    <OutOfRecChart MainStore={this.props.MainStore} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <LifeCycleOfFlightChart MainStore={this.props.MainStore}/>
                                </div>
                                <div className="col-md-6">
                                    <QueueManagementAnalysisChart MainStore={this.props.MainStore}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                <AllOpsAnalysisChart MainStore={this.props.MainStore} />
                                </div>
                                <div className="col-md-6">
                                <ClaimsChart MainStore={this.props.MainStore} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                <EAWBPerformanceChart MainStore={this.props.MainStore} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
            }</Observer>
        )
    }
}
