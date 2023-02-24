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

export default class AirportOpsChart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            centralOpsData: [["BOM",10,10,10,10,10,10,10,10,10,10,10,10],
            ["HYD",10,10,10,10,10,10,10,10,10,10,10,10],
            ["DEL",10,10,10,10,10,10,10,10,10,10,10,10],
            ["MAA",10,10,10,10,10,10,10,10,10,10,10,10],
            ["BLR",10,10,10,10,10,10,10,10,10,10,10,10],
            ["TOTAL",50,50,50,50,50,50,50,50,50,50,50,50]],
            startDate: new Date(),
            endDate: new Date(),
            checked: [false,false,false,false,false,false,false,false,false,false,],
            setChecked: false,
            showSelector: true,
            showYear: false,
            showMonth: false,
            showWeek: false,
            selectedView: "TODAY",
            awbInfos:[],
            stations: ["BOM","BLR", "DEL", "HYD", "MAA"],
            tdActive:"",
            week:[1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27,27,28,29,30,
            31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],
            Chartdata: {
                labels: ["Y COUNT", "N COUNT"],
                datasets: [
                    {
                        label: "Customer Update",
                        data: [
                            30, 70,
                        ],
                        backgroundColor: [
                            'green',
                            'red'
                        ]
                    }
                ],
            },
            awb_no:"",
            isAWBKundaliModalShow:false

        }
    }
    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPostion: "Right"

    }
    
    componentWillMount(){
		APIService.get('/getAwbsforRecoveryDashboard', {}, function (res) {
           console.log(res);
           this.setState({awbInfos: res});
        }.bind(this));

	}
    componentDidMount(){
		APIService.get('/getAwbsforRecoveryDashboard', {}, function (res) {
           console.log(res);
           this.setState({awbInfos: res});
        }.bind(this));

	}
    openYear=()=>{
        // this.state.showSelector=true;
        this.setState({showSelector: true});
        this.setState({showYear: true});
        this.setState({showMonth: false});
        this.setState({showWeek: false});
        this.setState({selectedView: "YEAR"});
        // this.state.showMonth=false;
        // this.state.showWeek=false;
    }
    openMonth = ()=>{
        // this.state.showSelector=true;
        // this.state.showYear=false;
        // this.state.showMonth=true;
        // this.state.showWeek=false;

        this.setState({showSelector: true});
        this.setState({showYear: true});
        this.setState({showMonth: true});
        this.setState({showWeek: false});
        this.setState({selectedView: "MONTH"});
    }
    openWeek = ()=>{
        // this.state.showSelector=true;
        // this.state.showYear=false;
        // this.state.showMonth=false;
        // this.state.showWeek=true;

        this.setState({showSelector: true});
        this.setState({showYear: true});
        this.setState({showMonth: false});
        this.setState({showWeek: true});
        this.setState({selectedView: "WEEK"});
    }
    closeSelector = ()=>{
        // this.state.showSelector=false;
        // this.state.showYear=false;
        // this.state.showMonth=false;
        // this.state.showWeek=false;
        this.setState({showSelector: false});
        this.setState({showYear: false});
        this.setState({showMonth: false});
        this.setState({showWeek: false});
    }
    openAwbs = ()=>{
        // console.log("hello");
    }
    toggleCheck = (event)=>{
        let box=parseInt(event.target.value);
        box=box-1;
        if(this.state.checked[box]){
            this.state.checked[box]=false;
        }
        else{
            this.state.checked[box]=true;
        }
        this.setState({checked:  this.state.checked})
    }
    toggleActive(id) {
        this.setState({
           tdActive: id,
        });
      }
    changeStartDate = (date)=>{
        console.log(this.state.startDate);
        this.setState({startDate: date})
    }
    changeEndDate = (date)=>{
        this.setState({endDate: date})
    }
    closeAWBKundaliModal = () =>{
		this.setState ({
			isAWBKundaliModalShow: false,
		});
        this.setState({awb_no:''})
	}

	onClickAWBNoAction = (event,data) =>{
		this.setState ({
			isAWBKundaliModalShow: true
		});
		this.setState({awb_no:data})
	}
    // onClickAWBNoAction = (event,data) => {
    //     console.log(data);
    //     // if tab id is not given then by default all 
    //     // if(props.tabid === undefined)
    //     // {
    //         this.props.MainStore.setAwbNoToShowDetails({awb_no: data, tabid:custom.custom.tab_name.all}); 
    //     // }else{
    //     //     props.MainStore.setAwbNoToShowDetails({awb_no: props.awb_no, tabid: props.tabid});
    //     // }
        
    // }

    render() {
        return (
            <Observer>{()=>
            <div className = "page-wrapper">
                <Modal className='none-border'  style={{display: "block"}} size="xl" aria-labelledby="awbKundaliModalEditTitle"  show={this.state.isAWBKundaliModalShow} onHide={this.closeAWBKundaliModal}>
					<AWBKundaliModal closeAWBKundaliModal={this.closeAWBKundaliModal} awbNo={this.state.awb_no} MainStore={this.props.MainStore}/>
				</Modal>	
				<div className = "container-fluid">
                    
                    <div className="row">
                        <div className="col-md-3 input-group">
                            <div className="input-group-prepend input-group-text text-white bg-danger">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="mdi mdi-clock text-light"></i>
                                </span> */}
                                Start Date
                            </div>
                            <DatePicker selected={this.state.startDate} onChange={this.changeStartDate} />
                        </div>
                        <div className="col-md-3 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                End Date   
                            </div>
                            <DatePicker selected={this.state.endDate}  onChange={this.changeEndDate}  />
                        </div>
                        <button className="btn btn-success" id="egmUploadBtn" type="button">LOAD</button>
                              
                    </div>
                   
                    <br></br>
                    <Row>
                        <table className="table table-secondary align-middle text-center table-sm col-8 text-secondary">
                            <thead>
                                <tr>
                                <th scope="col" className=""><strong>USER STATIONS</strong></th>
                                <th scope="col" colspan="2">Queue (Rate Cheks) within target time</th>
                                <th scope="col" colspan="2" className="">FDC Done within taget time</th>
                                <th scope="col" colspan="2">Pre-Alerts %</th>
                                <th scope="col" colspan="2"className="">EUICS handled %</th>
                                <th scope="col" colspan="2"className="">CAP-A %</th>
                                <th scope="col" colspan="2"className="">RMS Template %</th>
                                
                                </tr>
                                <tr>
                                <th scope="col" className="">SLA</th>
                                
                                <th scope="col" className="">MET</th>
                                <th scope="col" className="">NOT  MET</th>
                                <th scope="col" className="">MET</th>
                                <th scope="col" className="">NOT  MET</th>
                                <th scope="col" className="">MET</th>
                                <th scope="col" className="">NOT  MET</th>
                                <th scope="col" className="">MET</th>
                                <th scope="col" className="">NOT  MET</th>
                                <th scope="col" className="">MET</th>
                                <th scope="col" className="">NOT  MET</th>
                                <th scope="col" className="">MET</th>
                                <th scope="col" className="">NOT  MET</th>
                                </tr>
                            </thead>
                            {this.state.centralOpsData.map((row) => (  
                            <tbody>
                                <tr>
                                    <th scope="row" rowspan="1" className="">{row[0]}</th>
                                    
                                    <td className="">{row[1]}</td>
                                    <td className="">{row[2]}</td>
                                    <td className="">{row[3]}</td>
                                    <td className="">{row[4]}</td>
                                    <td className="">{row[5]}</td>
                                    <td className="">{row[6]}</td>
                                    <td className="">{row[7]}</td>
                                    <td className="">{row[8]}</td>
                                    <td className="">{row[9]}</td>
                                    <td className="">{row[10]}</td>
                                    <td className="">{row[11]}</td>
                                    <td className="">{row[12]}</td>
                               </tr>
                                
                            </tbody>
                            ))} 
                    </table>
                    <Col lg={4}>
                        <div className="text-center bg-dark p-1">
							<label className="my-auto text-white">Airway Bills</label>
						</div>
                        {this.state.awbInfos.map((awbInfo) => ( 
                        <div id={awbInfo.awb_no} onClick={((e) => this.onClickAWBNoAction(e, awbInfo.awb_no))} className={"border border-secondary alert alert-secondary" + " m-0 p-1"}>
                            <span>
                                <i className={"fas fa-box-open" + "text-secondary" + " mx-2"}>
                                </i>
                            </span>
                            {awbInfo.priority_class=='M_CLASS'&&
                            <span className={"badge-light border border-info" + "badge-xs mx-1 p-1 my-auto"}>M</span>
                            }
                            {awbInfo.priority_class=='F_CLASS'&&
                            <span className={"badge-info border border-info" + "badge-xs mx-1 p-1 my-auto"}>F</span>
                            }
                            <span>{awbInfo.awb_no+" - "+awbInfo.station}</span>
                             
                        </div>
                        ))}
                    </Col>
                    </Row>

                    
                {/* </div>
                <div className = "container-fluid row">  */}
                
                
                </div>
            </div>
            }</Observer>
        )
    }
}
