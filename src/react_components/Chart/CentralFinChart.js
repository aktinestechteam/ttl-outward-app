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
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const data = [['attribute', 'attribute2'], [30, 40]];

export default class CentralFinChart extends Component {
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
            ccaInfos: [],
            stations: ["BOM","BLR", "DEL", "HYD", "MAA"],
            selectedStations: [],
            stationsToShowInTable:[],
            cca: [],
            awb_no:"",
            isAWBKundaliModalShow:false,

            top5CustomerData: [["KUEHNE AND NAGEL PVT LTD",85,"25.15%"],
            ["EXPEDITORS INTERNATIONAL INDIA PVT",74,"21.89%"],
            ["PANALPINA WORLD TRANSPORT INDIA PVT",43,"12.72%"],
            ["TRANSLINE AIR CARGO SERVICES PVT",24,"7.10%"],
            ["DSV AIR AND SEA PVT LTD.",17,"5.03%"]],

            top5ReasonData: [["INCORRECT DUE CARRIER CHARGES",41,"9.56%"],
            ["INCORRECT PUB RATE",40,"9.32%"],
            ["INCORRECT XRAY",19,"4.43%"],
            ["Incorrect due carrier charges and incorrect Pub rate",17,"3.96%"],
            ["INCORRECT WEIGHT AND DUE CARRIER CHARGES",16,"3.73%"]],
            

        }
    }
    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPostion: "Right"

    }
    
    resetTable  = (callback)=>{
        let centralFinData = {
            BOM: ['-','-','-','-','-','-','-'],
                HYD: ['-','-','-','-','-','-','-'],
                DEL: ['-','-','-','-','-','-','-'],
                MAA: ['-','-','-','-','-','-','-'],
                BLR: ['-','-','-','-','-','-','-'],
                total: ['-','-','-','-','-','-','-']
        }
        this.setState({centralFinData: centralFinData});
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
        let csvData = this.state.ccaInfos;
        if(csvData.length>0){

            csvData.map((cca)=>{
                let keys = Object. keys(cca); 
                keys.map((key)=>{
                    if(cca[key]===true){
                        cca[key]="YES"
                    }
                    else if(cca[key]===false){
                        cca[key]="NO"
                    }
               });
            });
            
            let fileName = "Central Finance"+`${Date.now()}.xls`;
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
        let stationsToDisplay = this.state.selectedStations.length == 0 ? this.state.stations : this.state.selectedStations;
        req.startDate=this.state.startDate;
        req.endDate=this.state.endDate;
        req.station=stationsToDisplay;
        req.cca=this.state.cca.length == 0 ? window.ccareasons.map(cca => cca.main_reason) : this.state.cca
        
        APIService.post('/getCentralFinCCAData', req,(res) => {
            console.log(res);
            this.setState({stationsToShowInTable: stationsToDisplay});
            this.setState({
                awbInfos: res.awbInfos,
                ccaInfos: res.ccaInfos
            });
            if(res.chartData){
                this.resetTable(()=>{

                    if(res.chartData['BOM']){
                        this.state.centralFinData['BOM']=res.chartData['BOM'];
                    }
                    if(res.chartData['BLR']){
                        this.state.centralFinData['BLR']=res.chartData['BLR'];
                    }
                    if(res.chartData['DEL']){
                        this.state.centralFinData['DEL']=res.chartData['DEL'];
                    }
                    if(res.chartData['HYD']){
                        this.state.centralFinData['HYD']=res.chartData['HYD'];
                    }
                    if(res.chartData['MAA']){
                        this.state.centralFinData['MAA']=res.chartData['MAA'];
                    }
                    for(let i=0;i<7;i++){
                        let total=0
                        if(this.state.centralFinData['BOM'][i]!=undefined && 
                                this.state.centralFinData['BOM'][i]!='-' &&
                                this.state.centralFinData['BOM'][i]!="NaN"){
                            
                            total=total+Number(this.state.centralFinData['BOM'][i])
                        }
                        if(this.state.centralFinData['BLR'][i]!=undefined && 
                                this.state.centralFinData['BLR'][i]!='-' &&
                                this.state.centralFinData['BLR'][i]!="NaN"){
                            
                            total=total+Number(this.state.centralFinData['BLR'][i])
                        }
                        if(this.state.centralFinData['HYD'][i]!=undefined && 
                                this.state.centralFinData['HYD'][i]!='-' &&
                                this.state.centralFinData['HYD'][i]!="NaN"){
                            
                            total=total+Number(this.state.centralFinData['HYD'][i])
                        }
                        if(this.state.centralFinData['DEL'][i]!=undefined && 
                                this.state.centralFinData['DEL'][i]!='-' &&
                                this.state.centralFinData['DEL'][i]!="NaN"){
                            
                            total=total+Number(this.state.centralFinData['DEL'][i])
                        }
                        if(this.state.centralFinData['MAA'][i]!=undefined && 
                                this.state.centralFinData['MAA'][i]!='-' &&
                                this.state.centralFinData['MAA'][i]!="NaN"){
                            
                            total=total+Number(this.state.centralFinData['MAA'][i])
                        }

                        this.state.centralFinData.total[i]=total;
                    }
                    this.state.centralFinData.total[1]=((this.state.centralFinData.total[0]/this.state.centralFinData.total[6])*100).toFixed(2);
                    if(this.state.centralFinData.total[1]=="NaN"){
                        this.state.centralFinData.total[1]='0';
                    }

                    this.setState({centralFinData: this.state.centralFinData});
                    window.swal_close();
                });
            }
            else{
                window.swal_close();
            }
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
                        <div className="col-md-12 input-group">
                            <div className="input-group-prepend input-group-text text-white bg-danger">
                                CCA Reason
                            </div>
                            <CCAMultiSelect ccaCallback={this.callbackCCA} />
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-md-2 input-group align-middle text-center">
                            <button onClick={this.loadData} className="btn btn-success" id="loadBtn" type="button"><strong><i className="mdi mdi-reload text-light"></i></strong>   LOAD</button>
                        </div>
                        <div className="col-md-2 input-group align-middle text-center">
                            <button onClick={this.downloadData} className="btn btn-success" id="downloadBtn" type="button"><strong><i className="mdi mdi-download text-light"></i></strong>   DOWNLOAD</button>
                        </div>
                    </div>
                    <br></br>
                    <Row>
                        <Col>
                            <table className="table table-secondary align-middle text-center table-sm text-secondary">
                                <thead>
                                    <tr>
                                    <th scope="col" className=""><strong>USER STATIONS</strong></th>
                                    <th scope="col" colspan="1">Total CCA's</th>
                                    <th scope="col" colspan="1">CCA %</th>
                                    <th scope="col" colspan="1" className="">Total CCA fee earned</th>
                                    <th scope="col" colspan="1"> Original Revenue</th>
                                    <th scope="col" colspan="1"className=""> Revised revenue</th>
                                    <th scope="col" colspan="1"className="">Total Corrected Value</th>
                                    <th scope="col" colspan="1"className="">Total AWB's</th>
                                    
                                    </tr>
                                    
                                </thead>
                                <tbody>
                                    {
                                        this.state.stationsToShowInTable.length==0 &&
                                        <th colspan="9" scope="row" className="text-center text-dark">No Information Available</th>
                                    }
                                    {this.state.stationsToShowInTable.map((station) => ( 
                                        <tr>
                                            <th scope="row" rowspan="1" className="">{station}</th>
                                            {
                                                this.state.centralFinData[station].map((value, index)=> {
                                                    let prefix = "";
                                                    switch(index) {
                                                        case 2: case 3: case 4: case 5: prefix = "₹"; break;
                                                    }
                                                    return (
                                                        <td className="">{prefix} { (value==undefined || value=="NaN") ? '-' : Math.round(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                                    )
                                                })
                                            }
                                    </tr>
                                    ))} 
                                    {this.state.stationsToShowInTable.length>0 &&
                                    <tr>
                                        <th scope="row" rowspan="1" className="">Total Result</th>
                                        {this.state.centralFinData.total.map((value, index)=> {
                                            let prefix = "";
                                            switch(index) {
                                                case 2: case 3: case 4: case 5: prefix = "₹"; break;
                                            }
                                            console.log('---', index, value)
                                            return (
                                                <td className="">{prefix} { (value==undefined || value=="NaN") ? '-' : Math.round(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                                )
                                        })}
                                    </tr>
                                    }
                                </tbody>
                            </table>
                        </Col>
                        <Col lg={4}>
                            <Awblist data={this.state.awbInfos} MainStore={this.props.MainStore} listSize={6}/>
                            
                        </Col>
                    </Row>
                    <br></br>
            </div>
            }</Observer>
        )
    }
}
