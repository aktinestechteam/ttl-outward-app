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
import Awblist from "./Awblist";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { keys } from 'lodash';

export default class CentralOpsChart extends Component {
    constructor(props) {
        super(props)

        this.state = {

            centralOpsData: {
                BOM: ['-','-','-','-','-'],
                HYD: ['-','-','-','-','-'],
                DEL: ['-','-','-','-','-'],
                MAA: ['-','-','-','-','-'],
                BLR: ['-','-','-','-','-'],
                total: ['-','-','-','-','-']
            }
            ,
            startDate: new Date(),
            endDate: new Date(),
            awbInfos:[],
            stations: ["BOM","BLR", "DEL", "HYD", "MAA"],
            selectedStations: [],
            stationsToShowInTable:[],
            awb_no:"",
            isAWBKundaliModalShow:false

        }
    }
    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPostion: "Right"

    }

    resetTable  = (callback)=>{
        let centralOpsData = {
            BOM: ['-','-','-','-','-'],
            HYD: ['-','-','-','-','-'],
            DEL: ['-','-','-','-','-'],
            MAA: ['-','-','-','-','-'],
            BLR: ['-','-','-','-','-'],
            total: ['-','-','-','-','-']
        }
        this.setState({centralOpsData: centralOpsData});
        callback();
    }
    
    componentWillMount(){
	}

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
    
    
    getSelectedStations = (list) =>{
		let newList=[]
        for(let i=0;i<list.length;i++){
            newList.push(list[i].value);
        }
		this.setState ({
			selectedStations: newList
		});
	}
    downloadData = () =>{
        let csvData = this.state.awbInfos;
        if(csvData.length>0){

            csvData.map((awbInfo)=>{
                let keys = Object. keys(awbInfo); 
                keys.map((key)=>{
                    if(awbInfo[key]===true){
                        awbInfo[key]="YES"
                    }
                    else if(awbInfo[key]===false){
                        awbInfo[key]="NO"
                    }
               });
            });
            
            let fileName = "Total Queues Handled"+`${Date.now()}.xls`;
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.xlsx';
            const ws = XLSX.utils.json_to_sheet(csvData);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], {type: fileType});
            FileSaver.saveAs(data, fileName + fileExtension);
            
            window.swal_success("Data Downloaded");
        }
        else{
            window.swal_error("No Data available to download");
        }
    }
    loadData = () =>{
        window.swal_info("Loading data...")
		let req={}
        let stationsToDisplay = this.state.selectedStations.length ? this.state.selectedStations : this.state.stations;
        req.startDate=this.state.startDate;
        req.endDate=this.state.endDate;
        req.station=stationsToDisplay;
        console.log(req);
        APIService.post('/getCentralOpsRateCheckData', req,(res) => {
            this.setState({stationsToShowInTable: stationsToDisplay});

            this.setState({awbInfos: res.awbInfos});
            if(res.chartData.length>0){
                this.resetTable(()=>{
                    let stationData={}
                    let selectedStation = stationsToDisplay;
                    let dTotal=0;
                    let d60Total=0;
                    let d90Total=0;
                    let d120Total=0;
                    let d150Total=0;
                    let d180Total=0;
                    
                    for(let i=0;i<selectedStation.length;i++){
                        stationData[selectedStation[i]]=res.chartData.filter(legOp=> {
                            if(legOp.station!=selectedStation[i]) {
                                console.log('---- ', legOp.station)
                            }
                            return legOp.station==selectedStation[i]
                        });
                    }
                    for(let i=0;i<selectedStation.length;i++){
                        let data=stationData[selectedStation[i]];
                        this.state.centralOpsData[selectedStation[i]][0] = data.length;
                        dTotal += data.length;
                        let colData=[];
                        colData = 
                            data.filter(
                                legOp=> 
                                legOp.trigger_time > (legOp.awb_leg.planned_departure - (60000*60)));
                        console.log(this.state.centralOpsData[selectedStation[i]][5]);
                        this.state.centralOpsData[selectedStation[i]][5] = colData.length;
                        d60Total=d60Total+colData.length;
                        for(let i=0;i<colData.length;i++){
                            for(let j=0;j<data.length;j++){
                                if(data[j].id==colData[i].id){
                                    data.splice(j,1);
                                    break;
                                }
                            }
                            
                        }

                        colData = 
                            data.filter(
                                legOp=> 
                                legOp.trigger_time > (legOp.awb_leg.planned_departure - (60000*90)));
                        console.log(this.state.centralOpsData[selectedStation[i]][4]);
                        this.state.centralOpsData[selectedStation[i]][4] = colData.length;
                        d90Total=d90Total+colData.length;
                        for(let i=0;i<colData.length;i++){
                            for(let j=0;j<data.length;j++){
                                if(data[j].id==colData[i].id){
                                    data.splice(j,1);
                                    break;
                                }
                            }
                            
                        }
                        
                        colData = 
                            data.filter(
                                legOp=> 
                                legOp.trigger_time > (legOp.awb_leg.planned_departure - (60000*120)));
                        console.log(this.state.centralOpsData[selectedStation[i]][3]);
                        this.state.centralOpsData[selectedStation[i]][3] = colData.length;
                        d120Total=d120Total+colData.length;
                        for(let i=0;i<colData.length;i++){
                            for(let j=0;j<data.length;j++){
                                if(data[j].id==colData[i].id){
                                    data.splice(j,1);
                                    break;
                                }
                            }
                            
                        }
                        
                        colData = 
                            data.filter(
                                legOp=> 
                                legOp.trigger_time > (legOp.awb_leg.planned_departure - (60000*150)));
                        console.log(this.state.centralOpsData[selectedStation[i]][2]);
                        this.state.centralOpsData[selectedStation[i]][2] = colData.length;
                        d150Total=d150Total+colData.length;
                        for(let i=0;i<colData.length;i++){
                            for(let j=0;j<data.length;j++){
                                if(data[j].id==colData[i].id){
                                    data.splice(j,1);
                                    break;
                                }
                            }
                            
                        }
                        
                        colData = 
                            data.filter(
                                legOp=> 
                                legOp.trigger_time > (legOp.awb_leg.planned_departure - (60000*180)));
                        console.log(this.state.centralOpsData[selectedStation[i]][1]);
                        this.state.centralOpsData[selectedStation[i]][1] = colData.length;
                        d180Total=d180Total+colData.length;
                        for(let i=0;i<colData.length;i++){
                            for(let j=0;j<data.length;j++){
                                if(data[j].id==colData[i].id){
                                    data.splice(j,1);
                                    break;
                                }
                            }
                        }
                        console.log("data.length", data.length);
                    }
                    
                    this.state.centralOpsData.total[0]=dTotal;
                    this.state.centralOpsData.total[1]=d180Total;
                    this.state.centralOpsData.total[2]=d150Total;
                    this.state.centralOpsData.total[3]=d120Total;
                    this.state.centralOpsData.total[4]=d90Total;
                    this.state.centralOpsData.total[5]=d60Total;
                    this.setState({centralOpsData: this.state.centralOpsData});
                    window.swal_close();
                });
            }
            else{
                window.swal_close();
            }
            
        });
	}

    render() {
        return (
            <Observer>{()=>
            <div>	
			 	{/* <div className = "container-fluid"> */}
                    
                    <div className="row">
                        <div className="col input-group">
                            <div className="input-group-prepend input-group-text text-white bg-danger">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="mdi mdi-clock text-light"></i>
                                </span> */}
                                Start Date
                            </div>
                            <DatePicker className="input-group-text bg-white" selected={this.state.startDate} onChange={this.changeStartDate} />
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                End Date   
                            </div>
                            <DatePicker className="input-group-text bg-white" selected={this.state.endDate}  onChange={this.changeEndDate}  />
                        </div>
                        <div className="col input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                Station   
                            </div>
                            <MultiSelect data={this.state.stations} getList={this.getSelectedStations} selectAll={true} />
                            <span className="px-2"></span>
                            <button onClick={this.loadData} className="btn btn-success" id="loadBtn" type="button"><strong><i className="mdi mdi-reload text-light"></i></strong>LOAD</button>
                            <span className="px-2"></span>
                            <button onClick={this.downloadData} className="btn btn-success" id="loadBtn" type="button"><strong><i className="mdi mdi-download text-light"></i></strong>DOWNLOAD</button>
                        </div>
                    </div>
                    <br></br>
                    <Row>
                        <Col lg={8}>
                            <table className="table table-secondary align-middle text-center table-sm text-secondary">
                                <thead>
                                    <tr>
                                    <th scope="col" colspan="6" className=""><strong>Total Queues Handled</strong></th>
                                    
                                    </tr>
                                    <tr>
                                    <th scope="col" rowspan="2" className=""><strong>RateChecks</strong></th>
                                    <th scope="col" className=""><strong>Total Queues</strong></th>
                                    <th scope="col" className=""><strong>D-180</strong></th>
                                    <th scope="col" className=""><strong>D-150</strong></th>
                                    <th scope="col" className=""><strong>D-120</strong></th>
                                    <th scope="col" className=""><strong>D-90</strong></th>
                                    <th scope="col" className=""><strong>D-60</strong></th>
                                    
                                    </tr>
                                </thead>
                                
                                <tbody>
                                {
                                    this.state.stationsToShowInTable.length==0 &&
                                    <th colspan="6" scope="row" className="text-center text-dark">No Information Available</th>
                                }
                                {this.state.stationsToShowInTable.map((station) => ( 
                                    <tr>
                                        <th scope="row" rowspan="1" className="">{station}</th>
                                        {this.state.centralOpsData[station].map((value)=>(
                                        <td className="">{value}</td>
                                        ))}
                                </tr>
                                ))} 
                                {this.state.stationsToShowInTable.length>0 &&
                                <tr>
                                    <th scope="row" rowspan="1" className="">Total</th>
                                    {this.state.centralOpsData.total.map((value)=>(
                                    <td className="">{value}</td>
                                    ))}
                                </tr>
                                }
                                </tbody>
                                
                            </table>
                        </Col>
                        <Col lg={4}>
                            <Awblist displaySize={5} data={this.state.awbInfos} MainStore={this.props.MainStore} listSize={6}/>
                        </Col>
                    </Row>
                 {/* </div> */}
            </div>
            }</Observer>
        )
    }
}
