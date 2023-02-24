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

export default class Chart extends Component {
    constructor(props) {
        super(props)

        this.state = {
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
                    <Row>
                        <Col md={2} className="text-center">
                        Status<br></br>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked[0]?'primary':'secondary'}
                            checked={this.state.checked[0]}
                            value="1"
                            onChange={this.toggleCheck} >
                            Open
                            </ToggleButton>
                        </ButtonGroup>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked[1]?'primary':'secondary'}
                            checked={this.state.checked[1]}
                            value="2"
                            onChange={this.toggleCheck} >
                            Close
                            </ToggleButton>
                        </ButtonGroup>
                        </Col>
                        <Col md={2} className="text-center ">
                        Product<br></br>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked[2]?'primary':'secondary'}
                            checked={this.state.checked[2]}
                            value="3"
                            onChange={this.toggleCheck} >
                            M Class
                            </ToggleButton>
                        </ButtonGroup>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked[3]?'primary':'secondary'}
                            checked={this.state.checked[3]}
                            value="4"
                            onChange={this.toggleCheck} >
                            F Class
                            </ToggleButton>
                        </ButtonGroup>
                        </Col>
                        <Col md={2} className="text-center">
                        Customer Update<br></br>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked[4]?'primary':'secondary'}
                            checked={this.state.checked[4]}
                            value="5"
                            onChange={this.toggleCheck} >
                            Yes
                            </ToggleButton>
                        </ButtonGroup>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked[5]?'primary':'secondary'}
                            checked={this.state.checked[5]}
                            value="6"
                            onChange={this.toggleCheck} >
                            No
                            </ToggleButton>
                        </ButtonGroup>
                        </Col>
                        <Col md={2} className="text-center">
                        Loose / Intact<br></br>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked[6]?'primary':'secondary'}
                            checked={this.state.checked[6]}
                            value="7"
                            onChange={this.toggleCheck} >
                            Loose
                            </ToggleButton>
                        </ButtonGroup>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked[7]?'primary':'secondary'}
                            checked={this.state.checked[7]}
                            value="8"
                            onChange={this.toggleCheck} >
                            Intact
                            </ToggleButton>
                        </ButtonGroup>
                        </Col>
                        <Col md={2} className="text-center">
                        DAP / RAP<br></br>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked[8]?'primary':'secondary'}
                            checked={this.state.checked[8]}
                            value="9"
                            onChange={this.toggleCheck} >
                            DAP
                            </ToggleButton>
                        </ButtonGroup>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked[9]?'primary':'secondary'}
                            checked={this.state.checked[9]}
                            value="10"
                            onChange={this.toggleCheck} >
                            RAP
                            </ToggleButton>
                        </ButtonGroup>
                        </Col>
                        <Col md={2} className="text-center">
                        <button className="btn btn-success" id="egmUploadBtn" type="button">LOAD</button>
                         </Col>
                        
                    </Row>
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
                        
                        <div className="col-md-2 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                Origin 
                            </div>
                            <select className="p-0 select3 form-control custom-select browser-default" id="readyToRecoveryModalOnwardFlightMinuteChanged" type="text" >
                               <option>DEL</option>
                               <option>HYD</option>
                               <option>BLR</option>
                               <option>MAA</option>
                               <option>BOM</option>
                            </select>
                        </div>
                        <div className="col-md-2 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                Destination 
                            </div>
                            <select className="p-0 select3 form-control custom-select browser-default" id="readyToRecoveryModalOnwardFlightMinuteChanged" type="text" >
                               <option>JFK</option>
                               <option>LHR</option>
                               <option>BLR</option>
                               <option>MAA</option>
                               <option>BOM</option>
                            </select>
                        </div>
                        <div className="col-md-2 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                Delay 
                            </div>
                            <select className="p-0 select3 form-control custom-select browser-default" id="readyToRecoveryModalOnwardFlightMinuteChanged" type="text" >
                               <option>1 DAY</option>
                               <option>2 DAY</option>
                               <option>3 DAY</option>
                               <option>4 DAY</option>
                               <option>5 DAY</option>
                            </select>
                        </div>
                        <div className="col-md-2 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                Agents 
                            </div>
                            <select className="p-0 select3 form-control custom-select browser-default" id="readyToRecoveryModalOnwardFlightMinuteChanged" type="text" >
                               <option>TTL</option>
                               <option>AAA</option>
                               <option>BBB</option>
                               <option>CCC</option>
                               <option>DDD</option>
                            </select>
                        </div>
                              
                    </div>
                    <div className="row">
                    <div className="col-md-3 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                End Date   
                            </div>
                            <DatePicker selected={this.state.endDate}  onChange={this.changeEndDate}  />
                        </div>
                    </div>
                    <br></br>
                    <Row>
                        <table className="table table-secondary align-middle text-center table-sm col-8 text-secondary">
                            <thead>
                                <tr>
                                <th scope="col" rowspan="2" className="">ORIGIN</th>
                                <th scope="col" rowspan="2">PRODUCT</th>
                                <th scope="col" colspan="3" className="">Customer Update</th>
                                <th scope="col" colspan="3">Loose / Intact</th>
                                <th scope="col" colspan="3"className="">Open / Close</th>
                                <th scope="col" colspan="3">DAP / RAP</th>
                                </tr>
                                <tr>
                                <th scope="col" className="">Y</th>
                                <th scope="col" className="">N</th>
                                <th scope="col" className="">Total</th>
                                <th scope="col">
								{/* <i className={"text-secondary" + " fas fa-magnet mx-2"} ></i> */}
                                    Loose
                                    </th>
                                <th scope="col">
								{/* <i className={"text-primary" + " fas fa-magnet mx-2"}  ></i> */}
                                Intact
                                </th>
                                <th scope="col">Total</th>
                                <th scope="col"className="">Open</th>
                                <th scope="col" className="">Close</th>
                                <th scope="col" className="">Total</th>
                                <th scope="col">DAP</th>
                                <th scope="col">RAP</th>
                                <th scope="col">Total</th>
                                </tr>
                            </thead>
                            {this.state.stations.map((station) => (  
                            <tbody>
                                <tr>
                                    <th scope="row" rowspan="3" className="">{station}</th>
                                    <th scope="row">
                                    <span className={"badge-info border border-info" + "badge-xs mx-1 p-1 my-auto"}>F</span>
                                        
                                    </th>
                                    {/* F/Y */}
                                    <td className={this.state.tdActive == station+ "_" + "F/Y" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/Y")}>10</td>
                                    {/* F/N */}
                                    <td  className={this.state.tdActive == station+ "_" + "F/N" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/N")}>10</td>
                                    {/* F/Total */}
                                    <td className={this.state.tdActive == "CU"+station+ "_" + "F/total" ? '' : ''}
                                            onClick={() => this.toggleActive("CU"+station+ "_" + "F/total")}>20</td>

                                    {/* F/U */}
                                    <td className={this.state.tdActive == station+ "_" + "F/U" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/U")}>10</td>
                                    {/* F/L */}
                                    <td className={this.state.tdActive == station+ "_" + "F/L" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/L")}>10</td>
                                    {/* F/Total */}
                                    <td className={this.state.tdActive == "LI"+station+ "_" + "F/total" ? '' : ''}
                                            onClick={() => this.toggleActive("LI"+station+ "_" + "F/total")}>20</td>
                                    
                                    {/* F/Open */}
                                    <td className={this.state.tdActive == station+ "_" + "F/open" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/open")}>10</td>
                                    {/* F/Close */}
                                    <td className={this.state.tdActive == station+ "_" + "F/close" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/close")}>10</td>
                                    {/* F/Total */}
                                    <td className={this.state.tdActive == "OC"+station+ "_" + "F/total" ? '' : ''}
                                            onClick={() => this.toggleActive("OC"+station+ "_" + "F/total")}>20</td>

                                    {/* F/DAP */}
                                    <td className={this.state.tdActive == station+ "_" + "F/dap" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/dap")}>20</td>
                                    {/* F/RAP */}
                                    <td className={this.state.tdActive == station+ "_" + "F/rap" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/rap")}>20</td>
                                    {/* F/Total */}
                                    <td className={this.state.tdActive == "RD"+station+ "_" + "F/total" ? '' : ''}
                                            onClick={() => this.toggleActive("RD"+station+ "_" + "F/total")}><strong>40</strong></td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                    <span className={"badge-light border border-info" + "badge-xs mx-1 p-1 my-auto"}>M</span>
                                    </th>

                                    {/* M/Y */}
                                    <td className={this.state.tdActive == station+ "_" + "M/Y" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/Y")}>10</td>
                                    {/* M/N */}
                                    <td  className={this.state.tdActive == station+ "_" + "M/N" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/N")}>10</td>
                                    {/* M/Total */}
                                    <td className={this.state.tdActive == "CU"+station+ "_" + "M/total" ? '' : ''}
                                            onClick={() => this.toggleActive("CU"+station+ "_" + "M/total")}>20</td>

                                    {/* M/U */}
                                    <td className={this.state.tdActive == station+ "_" + "M/U" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/U")}>10</td>
                                    {/* M/L */}
                                    <td className={this.state.tdActive == station+ "_" + "M/L" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/L")}>10</td>
                                    {/* M/Total */}
                                    <td className={this.state.tdActive == "LI"+station+ "_" + "M/total" ? '' : ''}
                                            onClick={() => this.toggleActive("LI"+station+ "_" + "M/total")}>20</td>
                                    
                                    {/* M/Open */}
                                    <td className={this.state.tdActive == station+ "_" + "M/open" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/open")}>10</td>
                                    {/* M/Close */}
                                    <td className={this.state.tdActive == station+ "_" + "M/close" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/close")}>10</td>
                                    {/* M/Total */}
                                    <td className={this.state.tdActive == "OC"+station+ "_" + "M/total" ? '' : ''}
                                            onClick={() => this.toggleActive("OC"+station+ "_" + "M/total")}>20</td>

                                    {/* M/DAP */}
                                    <td className={this.state.tdActive == station+ "_" + "M/dap" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/dap")}>20</td>
                                    {/* M/RAP */}
                                    <td className={this.state.tdActive == station+ "_" + "M/rap" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/rap")}>20</td>
                                    {/* M/Total */}
                                    <td className={this.state.tdActive == "RD"+station+ "_" + "M/total" ? '' : ''}
                                            onClick={() => this.toggleActive("RD"+station+ "_" + "M/total")}><strong>40</strong></td>

                                </tr>
                                <tr>
                                <th scope="row">Total</th>
                                    {/* total/Y */}
                                    <td className={this.state.tdActive == station+ "_" + "total/Y" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/Y")}>20</td>
                                    {/* total/N */}
                                    <td  className={this.state.tdActive == station+ "_" + "total/N" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/N")}>20</td>
                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "CU"+station+ "_" + "total/total" ? '' : ''}
                                            onClick={() => this.toggleActive("CU"+station+ "_" + "total/total")}><strong className="text-dark">40</strong></td>

                                    {/* total/U */}
                                    <td className={this.state.tdActive == station+ "_" + "total/U" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/U")}>20</td>
                                    {/* total/L */}
                                    <td className={this.state.tdActive == station+ "_" + "total/L" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/L")}>20</td>
                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "LI"+station+ "_" + "total/total" ? '' : ''}
                                            onClick={() => this.toggleActive("LI"+station+ "_" + "total/total")}><strong className="text-dark">40</strong></td>
                                    
                                    {/* total/Open */}
                                    <td className={this.state.tdActive == station+ "_" + "total/open" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/open")}>20</td>
                                    {/* total/Close */}
                                    <td className={this.state.tdActive == station+ "_" + "total/close" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/close")}>20</td>
                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "OC"+station+ "_" + "total/total" ? '' : ''}
                                            onClick={() => this.toggleActive("OC"+station+ "_" + "total/total")}><strong className="text-dark">40</strong></td>

                                    {/* total/DAP */}
                                    <td className={this.state.tdActive == station+ "_" + "total/dap" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/dap")}>20</td>
                                    {/* total/RAP */}
                                    <td className={this.state.tdActive == station+ "_" + "total/rap" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/rap")}>20</td>
                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "RD"+station+ "_" + "total/total" ? '' : ''}
                                            onClick={() => this.toggleActive("RD"+station+ "_" + "total/total")}><strong className="text-dark">40</strong></td>

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
                            <span>{awbInfo.awb_no+" - "+awbInfo.station + " - " + awbInfo.issuer_name}</span>
                             
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
