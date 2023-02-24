import React, { Component } from 'react'
import { Bar, Line, Bubble, Pie } from 'react-chartjs-2';
import { Observer } from "mobx-react"
import {withRouter} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import APIService from "../APIService";

export default class Chart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showSelector: true,
            showYear: false,
            showMonth: false,
            showWeek: false,
            selectedView: "TODAY",
            awbInfos:[],
            stations: ["BOM","BLR", "DELHI", "HYD", "MAA"],
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
            }

        }
    }
    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPostion: "Right"

    }
    componentWillMount(){
		APIService.get('/getAwbsforRecoveryDashboard', {}, function (res) {
           console.log("res", res);
	   if(res) {
          	 this.setState({awbInfos: res});
	   }
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
    toggleActive(id) {
        this.setState({
           tdActive: id,
        });
      }

    render() {
        return (
            <Observer>{()=>
            <div className = "page-wrapper">	
				<div className = "container-fluid">
                    <div className="input-group">
                        <div className="input-group-btn" data-toggle="buttons">
                            <Row>
                                <Col lg={10}>
                                <label className="btn btn-primary" onClick={this.openYear}>
                                    <input type="radio" name="options" id="option0" autocomplete="off"/>Year
                                </label>
                                <label className="btn btn-primary" onClick={this.openMonth}>
                                    <input type="radio" name="options" id="option1" autocomplete="off"/>Month
                                </label>
                                <label className="btn btn-primary" onClick={this.openWeek}>
                                    <input type="radio" name="options" id="option2" autocomplete="off"/>Week
                                </label>
                                <label className="btn btn-primary" onClick={this.closeSelector}>
                                    <input type="radio" name="options" id="option2" autocomplete="off"/>Yesterday
                                </label>
                                <label className="btn btn-primary active" onClick={this.closeSelector}>
                                    <input type="radio" name="options" id="option2" autocomplete="off" checked/>Today
                                </label>
                                </Col>
                                <Col lg={2}>
                                {/* <div className="input-group-append"> */}
                                <button className="btn btn-success" id="egmUploadBtn" type="button">LOAD</button>
                                {/* </div> */}
                                </Col>
                            </Row>
                            
                        </div>
                    </div>
                    {/* <div className="input-group" style={{marginTop: 1+'vh',marginBottom: 1+'vh'}}>
                        <div className="input-group-btn" data-toggle="buttons">
                            <div className="input-group-append">
                                <button className="btn btn-success" id="egmUploadBtn" type="button">LOAD</button>
                            </div>
                        </div>
                    </div> */}
                    
                    {this.state.showSelector?<Row className="input-group">
                    {this.state.showYear || this.state.showMonth?
                   
                        <Col lg={1} style={{ "padding-right": 0}}>
							<span className="input-group-text bg-danger" style={{ "color":"white" }}>
								YEAR
							</span> 
                        </Col>:null}
                        {this.state.showYear || this.state.showMonth || this.state.showWeek?
                        <Col lg={1} style={{ "padding-left": 0}}>      
                            <select className="select2 form-control custom-select browser-default" id="flightSelectorStationSourceSelect" type="text" onChange={this.sourceChanged}>
                                <option>2022</option>
                                <option>2021</option>
                                <option>2020</option>
                                <option>2019</option>
                                <option>2018</option>
                                <option>2017</option>
                                <option>2016</option>
                            </select>
                        </Col>:null}
					{this.state.showMonth?
                    
                        <Col lg={1} style={{ "padding-right": 0}}>
							<span className="input-group-text bg-danger" style={{ "color":"white" }}>
								MONTH
							</span>
                       </Col>: null}
                       {this.state.showMonth?
                       <Col lg={1} style={{ "padding-left": 0}}>
                            <select className="select2 form-control custom-select browser-default" id="flightSelectorStationSourceSelect" type="text" onChange={this.sourceChanged}>
                                <option>JAN</option>
                                <option>FEB</option>
                                <option>MAR</option>
                                <option>APR</option>
                                <option>MAY</option>
                                <option>JUN</option>
                                <option>JUL</option>
                                <option>AUG</option>
                                <option>SEP</option>
                                <option>OCT</option>
                                <option>NOV</option>
                                <option>DEC</option>
                            </select>
                        </Col>: null}
                        {this.state.showWeek?
                        <Col lg={1} style={{ "padding-right": 0}}>
							<span className="input-group-text bg-danger" style={{ "color":"white" }}>
								WEEK
							</span>
						</Col>: null}
                       {this.state.showWeek? 
                       <Col lg={1} style={{ "padding-left": 0}}>
                            <select className="select2 form-control custom-select browser-default" id="flightSelectorStationSourceSelect" type="text" onChange={this.sourceChanged}>
                            {this.state.week.map((i) => (  
                                <option>{i}</option>
                            ))}
                            </select>
                        </Col>: null}
					</Row>: null}
                    <br></br>
                    <Row>
                        <table className="table table-bordered table-hover table-warning align-middle text-center table-sm col-10">
                            <thead>
                                <tr>
                                <th scope="col" rowspan="2" className="bg-secondary text-white">ORIGIN</th>
                                <th scope="col" rowspan="2">PRODUCT</th>
                                <th scope="col" colspan="3" className="bg-primary text-white">Customer Update</th>
                                <th scope="col" colspan="3">Loose / Intact</th>
                                <th scope="col" colspan="3"className="bg-primary text-white">Open / Close</th>
                                <th scope="col" colspan="3">DAP / RAP</th>
                                </tr>
                                <tr>
                                <th scope="col" className="bg-success text-white">Y</th>
                                <th scope="col" className="bg-danger text-white">N</th>
                                <th scope="col" className="bg-primary text-white">Total</th>
                                <th scope="col">
								<i className={"text-secondary" + " fas fa-magnet mx-2"} ></i>
                                    
                                    </th>
                                <th scope="col">
								<i className={"text-primary" + " fas fa-magnet mx-2"}  ></i>
                                    
                                </th>
                                <th scope="col">Total</th>
                                <th scope="col"className="bg-danger text-white">Open</th>
                                <th scope="col" className="bg-info text-white">Close</th>
                                <th scope="col" className="bg-primary text-white">Total</th>
                                <th scope="col">DAP</th>
                                <th scope="col">RAP</th>
                                <th scope="col">Total</th>
                                </tr>
                            </thead>
                            {this.state.stations.map((station) => (  
                            <tbody>
                                <tr>
                                    <th scope="row" rowspan="3" className="bg-secondary text-white">{station}</th>
                                    <th scope="row">
                                    <span className={"badge-info border border-info" + "badge-xs mx-1 p-1 my-auto"}>F</span>
                                        
                                    </th>
                                    {/* F/Y */}
                                    <td className={this.state.tdActive == station+ "_" + "F/Y" ? 'bg-secondary text-warning' : 'bg-success text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "F/Y")}>10</td>
                                    {/* F/N */}
                                    <td  className={this.state.tdActive == station+ "_" + "F/N" ? 'bg-secondary text-warning' : 'bg-danger text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "F/N")}>10</td>
                                    {/* F/Total */}
                                    <td className={this.state.tdActive == "CU"+station+ "_" + "F/total" ? 'bg-secondary text-warning' : 'bg-primary text-white'}
                                            onClick={() => this.toggleActive("CU"+station+ "_" + "F/total")}><strong>20</strong></td>

                                    {/* F/U */}
                                    <td className={this.state.tdActive == station+ "_" + "F/U" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/U")}>10</td>
                                    {/* F/L */}
                                    <td className={this.state.tdActive == station+ "_" + "F/L" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/L")}>10</td>
                                    {/* F/Total */}
                                    <td className={this.state.tdActive == "LI"+station+ "_" + "F/total" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive("LI"+station+ "_" + "F/total")}><strong>20</strong></td>
                                    
                                    {/* F/Open */}
                                    <td className={this.state.tdActive == station+ "_" + "F/open" ? 'bg-secondary text-warning' : 'bg-danger text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "F/open")}>10</td>
                                    {/* F/Close */}
                                    <td className={this.state.tdActive == station+ "_" + "F/close" ? 'bg-secondary text-warning' : 'bg-info text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "F/close")}>10</td>
                                    {/* F/Total */}
                                    <td className={this.state.tdActive == "OC"+station+ "_" + "F/total" ? 'bg-secondary text-warning' : 'bg-primary text-white'}
                                            onClick={() => this.toggleActive("OC"+station+ "_" + "F/total")}><strong>20</strong></td>

                                    {/* F/DAP */}
                                    <td className={this.state.tdActive == station+ "_" + "F/dap" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/dap")}>20</td>
                                    {/* F/RAP */}
                                    <td className={this.state.tdActive == station+ "_" + "F/rap" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/rap")}>20</td>
                                    {/* F/Total */}
                                    <td className={this.state.tdActive == "RD"+station+ "_" + "F/total" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive("RD"+station+ "_" + "F/total")}><strong>40</strong></td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                    <span className={"badge-light border border-info" + "badge-xs mx-1 p-1 my-auto"}>M</span>
                                    </th>

                                    {/* M/Y */}
                                    <td className={this.state.tdActive == station+ "_" + "M/Y" ? 'bg-secondary text-warning' : 'bg-success text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "M/Y")}>10</td>
                                    {/* M/N */}
                                    <td  className={this.state.tdActive == station+ "_" + "M/N" ? 'bg-secondary text-warning' : 'bg-danger text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "M/N")}>10</td>
                                    {/* M/Total */}
                                    <td className={this.state.tdActive == "CU"+station+ "_" + "M/total" ? 'bg-secondary text-warning' : 'bg-primary text-white'}
                                            onClick={() => this.toggleActive("CU"+station+ "_" + "M/total")}><strong>20</strong></td>

                                    {/* M/U */}
                                    <td className={this.state.tdActive == station+ "_" + "M/U" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/U")}>10</td>
                                    {/* M/L */}
                                    <td className={this.state.tdActive == station+ "_" + "M/L" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/L")}>10</td>
                                    {/* M/Total */}
                                    <td className={this.state.tdActive == "LI"+station+ "_" + "M/total" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive("LI"+station+ "_" + "M/total")}><strong>20</strong></td>
                                    
                                    {/* M/Open */}
                                    <td className={this.state.tdActive == station+ "_" + "M/open" ? 'bg-secondary text-warning' : 'bg-danger text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "M/open")}>10</td>
                                    {/* M/Close */}
                                    <td className={this.state.tdActive == station+ "_" + "M/close" ? 'bg-secondary text-warning' : 'bg-info text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "M/close")}>10</td>
                                    {/* M/Total */}
                                    <td className={this.state.tdActive == "OC"+station+ "_" + "M/total" ? 'bg-secondary text-warning' : 'bg-primary text-white'}
                                            onClick={() => this.toggleActive("OC"+station+ "_" + "M/total")}><strong>20</strong></td>

                                    {/* M/DAP */}
                                    <td className={this.state.tdActive == station+ "_" + "M/dap" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/dap")}>20</td>
                                    {/* M/RAP */}
                                    <td className={this.state.tdActive == station+ "_" + "M/rap" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/rap")}>20</td>
                                    {/* M/Total */}
                                    <td className={this.state.tdActive == "RD"+station+ "_" + "M/total" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive("RD"+station+ "_" + "M/total")}><strong>40</strong></td>

                                </tr>
                                <tr>
                                <th scope="row">Total</th>
                                    {/* total/Y */}
                                    <td className={this.state.tdActive == station+ "_" + "total/Y" ? 'bg-secondary text-warning' : 'bg-success text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "total/Y")}><strong>20</strong></td>
                                    {/* total/N */}
                                    <td  className={this.state.tdActive == station+ "_" + "total/N" ? 'bg-secondary text-warning' : 'bg-danger text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "total/N")}><strong>20</strong></td>
                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "CU"+station+ "_" + "total/total" ? 'bg-secondary text-warning display-7' : 'bg-primary text-white display-7'}
                                            onClick={() => this.toggleActive("CU"+station+ "_" + "total/total")}>40</td>

                                    {/* total/U */}
                                    <td className={this.state.tdActive == station+ "_" + "total/U" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/U")}><strong>20</strong></td>
                                    {/* total/L */}
                                    <td className={this.state.tdActive == station+ "_" + "total/L" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/L")}><strong>20</strong></td>
                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "LI"+station+ "_" + "total/total" ? 'bg-secondary text-warning display-7' : 'display-7'}
                                            onClick={() => this.toggleActive("LI"+station+ "_" + "total/total")}>40</td>
                                    
                                    {/* total/Open */}
                                    <td className={this.state.tdActive == station+ "_" + "total/open" ? 'bg-secondary text-warning' : 'bg-danger text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "total/open")}><strong>20</strong></td>
                                    {/* total/Close */}
                                    <td className={this.state.tdActive == station+ "_" + "total/close" ? 'bg-secondary text-warning' : 'bg-info text-white'}
                                            onClick={() => this.toggleActive(station+ "_" + "total/close")}><strong>20</strong></td>
                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "OC"+station+ "_" + "total/total" ? 'bg-secondary text-warning display-7' : 'bg-primary text-white display-7'}
                                            onClick={() => this.toggleActive("OC"+station+ "_" + "total/total")}>40</td>

                                    {/* total/DAP */}
                                    <td className={this.state.tdActive == station+ "_" + "total/dap" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/dap")}><strong>20</strong></td>
                                    {/* total/RAP */}
                                    <td className={this.state.tdActive == station+ "_" + "total/rap" ? 'bg-secondary text-warning' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/rap")}><strong>20</strong></td>
                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "RD"+station+ "_" + "total/total" ? 'bg-secondary text-warning display-7' : ' display-7'}
                                            onClick={() => this.toggleActive("RD"+station+ "_" + "total/total")}>40</td>

                                </tr>
                            </tbody>
                            ))} 
                    </table>
                    <Col lg={2}>
                        <div className="text-center bg-dark p-1">
							<label className="my-auto text-white">Airway Bills</label>
						</div>
                        {this.state.awbInfos.map((awbInfo) => ( 
                        <div className={"border border-secondary alert alert-secondary" + " m-0 p-1"}>
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
                            <span>{awbInfo.awb_no}</span>
                             
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
