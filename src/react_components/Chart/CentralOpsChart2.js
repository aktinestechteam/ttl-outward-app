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
import { FormLabel } from 'react-bootstrap';

export default class CentralOpsChart2 extends Component {
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
            },
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
    
    componentWillMount(){}

    componentDidMount(){
        this.changeStartDate(this.state.startDate);
        this.changeEndDate(this.state.endDate);
	}
    
    changeStartDate = (date)=>{
        console.log(this.state.startDate);
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
            
            let fileName = "Process completion Performance %"+`${Date.now()}.xls`;
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
        
        APIService.post('/getCentralOpsPerformanceData', req,(res) => {
            this.setState({stationsToShowInTable: stationsToDisplay});
            this.setState({awbInfos: res.awbInfos});
            if(res.percentageData){
                this.resetTable(()=>{
                    
                    if(res.percentageData['BOM']){
                        this.state.centralOpsData['BOM']=res.percentageData['BOM'];
                    }
                    if(res.percentageData['BLR']){
                        this.state.centralOpsData['BLR']=res.percentageData['BLR'];
                    }
                    if(res.percentageData['DEL']){
                        this.state.centralOpsData['DEL']=res.percentageData['DEL'];
                    }
                    if(res.percentageData['HYD']){
                        this.state.centralOpsData['HYD']=res.percentageData['HYD'];
                    }
                    if(res.percentageData['MAA']){
                        this.state.centralOpsData['MAA']=res.percentageData['MAA'];
                    }
                    if(res.percentageData['total']){
                        this.state.centralOpsData['total']=res.percentageData['total'];
                    }
                    
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
                <FormLabel className={"text-success"}>Displays % of AWBs for each of the AWB Checks that are completed in time</FormLabel>
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
                            <MultiSelect data={this.state.stations}  getList={this.getSelectedStations} selectAll={true} />
                            <span className='px-2'/>
                            <button onClick={this.loadData} className="btn btn-success" id="loadBtn" type="button"><strong><i className="mdi mdi-reload text-light"></i></strong>   LOAD</button>
                            <span className='px-2'/>
                            <button onClick={this.downloadData} className="btn btn-success" id="loadBtn" type="button"><strong><i className="mdi mdi-download text-light"></i></strong>   DOWNLOAD</button>
                        </div>
                    </div>
                    <br></br>
                    <Row>
                    <Col lg={8}>
                        <table className="table table-secondary align-middle text-center table-sm text-secondary">
                            <thead>
                            <tr>
                                <th scope="col" className="" colspan="6"><strong>PROCESS COMPLETION PERFORMANCE %</strong></th>
                               
                                
                             </tr>
                                <tr>
                                <th scope="col" className=""><strong>USER STATIONS</strong></th>
                                <th scope="col" colspan="1">EU - ICS awb handled %</th>
                                <th scope="col" colspan="1" className="">CAP - A %</th>
                                <th scope="col" colspan="1">RMS template %</th>
                                <th scope="col" colspan="1"className="">Pre-Alerts %</th>
                                <th scope="col" colspan="1"className="">EAWB %</th>
                                
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
                                        <td className="">{value==undefined || value=="NaN"?'-':value}</td>
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
                    <Awblist data={this.state.awbInfos} MainStore={this.props.MainStore} listSize={6}/>
                    </Col>
                    </Row>
                {/* </div> */}
            </div>
            }</Observer>
        )
    }
}
