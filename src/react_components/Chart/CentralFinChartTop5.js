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
import MultiSelect from "./MultiSelect";
import CCAMultiSelect from "./CCAMultiSelect";
import Awblist from "./Awblist";

const data = [['attribute', 'attribute2'], [30, 40]];

export default class CentralFinChartTop5 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            centralFinData: {
                BOM: ['-','-','-','-','-','-','-'],
                HYD: ['-','-','-','-','-','-','-'],
                DEL: ['-','-','-','-','-','-','-'],
                MAA: ['-','-','-','-','-','-','-'],
                BLR: ['-','-','-','-','-','-','-'],
                total: ['-','-','-','-','-','-','-']
            },
            startDate: new Date(),
            endDate: new Date(),
            awbInfos:[],
            stations: ["BOM","BLR", "DEL", "HYD", "MAA"],
            selectedStations: [],
            stationsToShowInTable:[],
            cca: [],
            awb_no:"",
            isAWBKundaliModalShow:false,
            topRange:5,
            topRangeToShow:5,
            topRanges:[5,10,15,20],

            customerData: [['-','-','-','-'],
            ['-','-','-','-'],
            ['-','-','-','-'],
            ['-','-','-','-'],
            ['-','-','-','-']],

            reasonData: [['-','-','-'],
            ['-','-','-'],
            ['-','-','-'],
            ['-','-','-'],
            ['-','-','-']],
            

        }
    }
    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPostion: "Right"

    }
    
    resetTable  = (callback)=>{
        let customerData = [['-','-','-','-'],
            ['-','-','-','-'],
            ['-','-','-','-'],
            ['-','-','-','-'],
            ['-','-','-','-']]
        let reasonData = [['-','-','-'],
            ['-','-','-'],
            ['-','-','-'],
            ['-','-','-'],
            ['-','-','-']]
        this.setState({customerData: customerData, reasonData: reasonData});
        callback();
    }
    
    componentWillMount(){}

    componentDidMount(){
        this.changeStartDate(this.state.startDate);
        this.changeEndDate(this.state.endDate);
	}
    
    changeStartDate = (date)=>{
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        this.setState({startDate: date});
    }
    changeEndDate = (date)=>{
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        this.setState({endDate: date});
    }
    changeTopRange = (event) => {
        this.setState({topRange: event.target.value});
    }
    
    
    getSelectedStations = (list) =>{
		let newList=[]
        for(let i=0;i<list.length;i++){
            newList.push(list[i].value);
        }
		this.setState ({
			selectedStations: newList
		});
	}
    loadData = () =>{
        window.swal_info("Loading data...");
		let req={}
        let stationsToDisplay = this.state.selectedStations.length == 0 ? this.state.stations : this.state.selectedStations;
        req.startDate=this.state.startDate;
        req.endDate=this.state.endDate;
        req.station=stationsToDisplay;
        req.topRange=this.state.topRange
        console.log(req);
        APIService.post('/getCentralFinTopData', req,(res) => {
            console.log(res);
            this.setState({stationsToShowInTable: stationsToDisplay});
            
            this.resetTable(()=>{
                if(res.topCustomerData.length>0){
                    this.setState({customerData: res.topCustomerData});
                }
                if(res.topReasons.length>0){
                    this.setState({reasonData: res.topReasons});
                }
                window.swal_close();
            });
        });
	}
    callbackCCA = (ccaData) => {
		this.setState({ cca: ccaData })
	}

    render() {
        return (
            <Observer>{()=>
            <div>
                <Modal className='none-border'  style={{display: "block"}} size="xl" aria-labelledby="awbKundaliModalEditTitle"  show={this.state.isAWBKundaliModalShow} onHide={this.closeAWBKundaliModal}>
					<AWBKundaliModal closeAWBKundaliModal={this.closeAWBKundaliModal} awbNo={this.state.awb_no} MainStore={this.props.MainStore}/>
				</Modal>
                    
                    <div className="row">
                        <div className="col-md-3 input-group">
                            <div className="input-group-prepend input-group-text text-white bg-danger">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="mdi mdi-clock text-light"></i>
                                </span> */}
                                Start Date
                            </div>
                            <DatePicker className="input-group-text bg-white" selected={this.state.startDate} onChange={this.changeStartDate} />
                        </div>
                        <div className="col-md-3 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                End Date   
                            </div>
                            <DatePicker className="input-group-text bg-white" selected={this.state.endDate}  onChange={this.changeEndDate}  />
                        </div>   
                        <div className="col-md-6 input-group">
                            <div className="input-group-prepend input-group-text text-white bg-danger">
                                Station
                            </div>
                            <MultiSelect data={this.state.stations} getList={this.getSelectedStations} selectAll={true}/>
                        </div> 
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-md-3 input-group">
                            <div className="input-group-prepend input-group-text text-white bg-danger">
                                Top Range
                            </div>
                            <select className="p-0 select3 form-control custom-select browser-default" id="addAgent" type="text" onChange={this.changeTopRange}>
								{
									this.state.topRanges.map((range)=>{
										if(range==this.state.topRange)
                                        return <option selected value={range}>{range}</option>
                                        else return <option value={range}>{range}</option>
									})
								}
								</select>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-md-2 input-group align-middle text-center">
                            <button onClick={this.loadData} className="btn btn-success" id="loadBtn" type="button"><strong><i className="mdi mdi-reload text-light"></i></strong>   LOAD</button>
                        </div>
                        {/* <div className="col-md-2 input-group align-middle text-center">
                            <button className="btn btn-success" id="downloadBtn" type="button"><strong><i className="mdi mdi-download text-light"></i></strong>   DOWNLOAD</button>
                        </div> */}
                    </div>
                    <br></br>
                    <Row>
                        <Col className="col-4">
                        <table className="table table-secondary align-middle text-center table-sm text-secondary">
                            <thead>
                                <tr><th><strong>Top {this.state.topRangeToShow} Customers</strong></th></tr>
                                <tr>
                                    <th scope="col" className=""><strong>Row Labels</strong></th>
                                    <th scope="col" colspan="1">Total CCA's</th>
                                    <th scope="col" colspan="1">CCA %</th>
                                    <th scope="col" colspan="1">Total AWB's</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.customerData.map((customer) => ( 
                                    <tr>
                                        <th scope="row" rowspan="1" className="">{customer[0]}</th>
                                        <th scope="row" rowspan="1" className="">{customer[1]}</th>
                                        <th scope="row" rowspan="1" className="">{customer[2]}</th>
                                        <th scope="row" rowspan="1" className="">{customer[3]}</th>
                                    </tr>
                               ))}
                            </tbody>
                        </table>
                    </Col>
                    <Col className="col-4">
                    <table className="table table-secondary align-middle text-center table-sm col-4 text-secondary">
                            <thead>
                                <tr><th><strong>Top {this.state.topRangeToShow} Reasons</strong></th></tr>
                                <tr>
                                <th scope="col" className=""><strong>Row Labels</strong></th>
                                <th scope="col" colspan="1">Total CCA's</th>
                                <th scope="col" colspan="1">CCA %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.reasonData.map((reason) => ( 
                                    <tr>
                                        <th scope="row" rowspan="1" className="">{reason[0]}</th>
                                        <th scope="row" rowspan="1" className="">{reason[1]}</th>
                                        <th scope="row" rowspan="1" className="">{reason[2]}</th>
                                        <th scope="row" rowspan="1" className="">{reason[3]}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                    {/* <Col lg={4}>
                        <Awblist data={this.state.awbInfos} MainStore={this.props.MainStore} listSize={6}/>
                    </Col> */}
                    
                </Row>
            </div>
            }</Observer>
        )
    }
}
