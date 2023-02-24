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
import Select from "react-select";
import MultiSelect from "./MultiSelect";
import Awblist from './Awblist';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export default class RecoveryProcessPerformance extends Component {
    constructor(props) {
        super(props)

        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            checkbox: [false,false,false,false,false,false,false,false,false,false,],
            checked: {
                open: false,
                close: false,
                mClass: false,
                fClass: false,
                customerUpdated: false,
                customerNotUpdated: false,
                loose: false,
                intact: false,
                dap: false,
                rap: false
            },
            awbInfos:[],
            stations: ["BOM","BLR", "DEL", "HYD", "MAA"],
            stationsToShowInTable: [],
            destinations: ["LHR", "JFK", "ITH", "ETH", "TRI"],
            delay: ["1 Day", "2 Days", "3 Days", "4 Days", "5 Days"],
            selectedStation: [],
            selectedDestinations: [],
            selectedDelay: [],
            tdActive:"",
            awb_no:"",
            isAWBKundaliModalShow:false,
            agents:["TTL","AAA","BBB","CCC","DDD"],
            selectedAgent:"",
            

        }
    }
    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPostion: "Right"

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
        this.setState({endDate: date})
    }
    // closeAWBKundaliModal = () =>{
	// 	this.setState ({
	// 		isAWBKundaliModalShow: false,
	// 	});
    //     this.setState({awb_no:''})
	// }

	// onClickAWBNoAction = (event,data) =>{
	// 	this.setState ({
	// 		isAWBKundaliModalShow: true
	// 	});
	// 	this.setState({awb_no:data})
	// }
    getSelectedStationsList = (list) =>{
        let newList=[]
        for(let i=0;i<list.length;i++){
            newList.push(list[i].value);
        }
		this.setState ({
			selectedStation: newList
		});
	}
    getSelectedDestinations = (list) =>{
        let newList=[]
        for(let i=0;i<list.length;i++){
            newList.push(list[i].value);
        }
		this.setState ({
			selectedDestinations: newList
		});
	}
    getSelectedDelay = (list) =>{
        let newList=[]
        for(let i=0;i<list.length;i++){
            newList.push(list[i].value);
        }
		this.setState ({
			selectedDelay: newList
		});
	}
    // downloadData =()=>{
    //     let csvData = this.state.awbInfos;
    //     if(csvData.length>0){
            
    //         let fileName = "recover dashboard "+`${Date.now()}.xls`;
    //         const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    //         const fileExtension = '.xlsx';
    //         const ws = XLSX.utils.json_to_sheet(csvData);
    //         const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    //         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //         const data = new Blob([excelBuffer], {type: fileType});
    //         FileSaver.saveAs(data, fileName + fileExtension);
            
    //         window.swal_success("Data Downloaded");
    //     }
    //     else{
    //         window.swal_error("No Data available to download");
    //     }
        
    // }
    downloadData = async()=>{
        window.swal_info("Loading data...")
        let req={}
        
        req.startDate=this.state.startDate;
        req.endDate=this.state.endDate;
        req.station=this.state.selectedStation.length == 0 ? this.state.stations : this.state.selectedStation;
        req.destination=this.state.selectedDestinations.length == 0 ? window.station_records.map((station,id) => station.iata) : this.state.selectedDestinations;
    
        APIService.post('/getRecoveryProcessPerformanceData', req,(res) => {
            this.setState({awbInfos: res});
            if(res.length>0){
                let csvData = res;
                if(csvData.length>0){
                    
                    let fileName = "Recovery process performmance "+`${Date.now()}.xls`;
                    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                    const fileExtension = '.xlsx';
                    const ws = XLSX.utils.json_to_sheet(csvData);
                    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                    const data = new Blob([excelBuffer], {type: fileType});
                    FileSaver.saveAs(data, fileName + fileExtension);
                    window.swal_close();
                    window.swal_success("Data Downloaded");
                }
                else{
                    window.swal_close();
                    window.swal_error("No Data available to download");
                }
                
            }
            else{
                window.swal_close();
                window.swal_error("No Data available to download");
            }
           
            
        })
    }

    render() {

        

        return (
            <Observer>{()=>
                <div className="card bg-light" style={{"padding": "inherit"}}>
                <div calssName="card-body">
                <h3 scope="col" className="card-title" colspan="9"><strong>Recovery Process Performance</strong></h3>
                     
                    <div className="row">
                        <div className="col-md-12 input-group">
                            <div className="input-group-prepend input-group-text text-white bg-danger">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="mdi mdi-clock text-light"></i>
                                </span> */}
                                Start Date
                            </div>
                            <DatePicker className="input-group-text bg-white" selected={this.state.startDate} onChange={this.changeStartDate} />
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-md-12 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                End Date   
                            </div>
                            <DatePicker className="input-group-text bg-white" selected={this.state.endDate}  onChange={this.changeEndDate}  />
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-md-12 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                Station 
                            </div>
                            
                            <MultiSelect data={this.state.stations} getList={this.getSelectedStationsList} selectAll={true}/>
                            
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        
                        <div className="col-md-12 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                Destination 
                            </div>
                            {/* <MultiSelect data={this.state.destinations} getList={this.getSelectedDestinations}/> */}
                            
                            <Select style={{position:""}}
                                options={window.station_records.map((station,id) => {return {"value": station.iata,"label": station.iata+" - "+station.name}})}
                                defaultValue={this.state.dataSelected}
                                isMulti
                                styles={{
                                    multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: "#aaaa00",
                                    color: "white",
                                    }),
                                }}
                                onChange={this.getSelectedDestinations}
                            />
                            
                            {/* <select className="p-0 select3 form-control custom-select browser-default" id="awbKundaliModalStationDestinationSelect" type="text" onChange={this.destinationChanged}>
                            {
                            window.station_records.map((station,id)=>{
                                    return <option value={station.iata} key={id}>{station.iata} - {station.name}</option>
                                })
                            } */}
						
					{/* </select> */}
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                       
                        {/* <div className="col-md-2 input-group align-middle text-center">
                            <button onClick={this.loadData} className="btn btn-success" id="loadBtn" type="button"><strong><i className="mdi mdi-reload text-light"></i></strong>   LOAD</button>
                        </div> */}
                        <div className="col-md-2 input-group align-middle text-center">
                            <button onClick={this.downloadData} className="btn btn-success" id="downloadBtn" type="button"><strong><i className="mdi mdi-download text-light"></i></strong>   DOWNLOAD</button>
                        </div>
                    </div>
                    <br></br>
                </div>
                </div>
            }</Observer>
        )
    }
}
