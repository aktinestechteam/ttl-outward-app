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

export default class CentralRecChart extends Component {
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
            weight: ['> 0', '<=300 KG', '<=500 KG', '500 KG and Above'],
            selectedWeight: 0,
            awbInfos:[],
            stations: ["BOM","BLR", "DEL", "HYD", "MAA"],
            stationsToShowInTable: [],
            destinations: ["LHR", "JFK", "ITH", "ETH", "TRI"],
            delay: [1,2,3,4,5],
            selectedStation: [],
            selectedDestinations: [],
            selectedDelay: [],
            tdActive:"",
            awb_no:"",
            isAWBKundaliModalShow:false,
            selected_agents: [],
            tableData:{
                BOM:{
                    f:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    },
                    m:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    },
                    total:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    }
                },
                BLR:{
                    f:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    },
                    m:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    },
                    total:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    }
                },
                DEL:{
                    f:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    },
                    m:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    },
                    total:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    }
                },
                HYD:{
                    f:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    },
                    m:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    },
                    total:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    }
                },
                MAA:{
                    f:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    },
                    m:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    },
                    total:{
                        cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                        total:{cu:'-',li:'-', oc:'-', rd:'-'}
                    }
                }
            }

        }
    }
    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPostion: "Right"

    }
    resetTable = (callback)=>{
        let tableData={
            BOM:{
                f:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                },
                m:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                },
                total:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                }
            },
            BLR:{
                f:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                },
                m:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                },
                total:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                }
            },
            DEL:{
                f:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                },
                m:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                },
                total:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                }
            },
            HYD:{
                f:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                },
                m:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                },
                total:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                }
            },
            MAA:{
                f:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                },
                m:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                },
                total:{
                    cu:['-','-'],li:['-','-'],oc:['-','-'],rd:['-','-'],
                    total:{cu:'-',li:'-', oc:'-', rd:'-'}
                }
            }
        }
        this.setState({tableData: tableData});
        callback();
    }

    componentWillMount(){}

    componentDidMount(){
		this.changeStartDate(this.state.startDate);
        this.changeEndDate(this.state.endDate);
	}

    toggleCheck = (event)=>{
        this.state.checked[event.target.value]=!this.state.checked[event.target.value]
        this.setState({checked: this.state.checked});
    }
    
    openAwbs = ()=>{
        // console.log("hello");
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

    getSelectedStationsList = (list) =>{
        let newStations = list.map(item => item.value)
		this.setState ({
			selectedStation: newStations,
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

    changeWeight = (event) =>{
        this.setState({selectedWeight: event.target.value});
    }

    downloadData =()=>{
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
            
            let fileName = "recovery dashboard "+`${Date.now()}.xls`;
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

    loadData = async()=>{
        // window.swal_info("Loading data...")
        let req={}
        let stationsToDisplay = this.state.selectedStation.length ? this.state.selectedStation : this.state.stations;
        req.checked=this.state.checked;
        req.startDate=this.state.startDate;
        req.endDate=this.state.endDate;
        req.station=stationsToDisplay;
        req.destination=(this.state.selectedDestinations.length == 0) ? (window.station_records.map(station => station.iata)) : (this.state.selectedDestinations);
        req.selected_agents=this.state.selected_agents;
        req.delay=this.state.selectedDelay.length == 0 ? this.state.delay : this.state.selectedDelay;
        req.weight=this.state.selectedWeight;
        
        window.swal_info('Fetching report for you, please wait !');
        APIService.post('/getRecoveryChartData', req,(res) => {
            this.setState({awbInfos: res, stationsToShowInTable: stationsToDisplay});
            if(res.length>0){
                this.resetTable(()=>{
                    let stationData={}
                    let selectedStation=stationsToDisplay;
                    for(let i=0;i<selectedStation.length;i++){
                        stationData[selectedStation[i]]=this.state.awbInfos.filter(info=> info.src==selectedStation[i]);
                    }
                    for(let i=0;i<selectedStation.length;i++){
                        let data=stationData[selectedStation[i]];
                        // if(data.length>0){
                            if(this.state.checked.fClass){
                                let fClassData = data.filter(info=> info.priority_class=="F_CLASS");
                                let total='-';
                                if(this.state.checked.loose){
                                    total=0;
                                    this.state.tableData[selectedStation[i]].f.li[0] = fClassData.filter(info=> info.unitized==false).length;
                                    total=total+this.state.tableData[selectedStation[i]].f.li[0];
                                }
                                if(this.state.checked.intact){
                                    if(total=='-'){total=0;}
                                    this.state.tableData[selectedStation[i]].f.li[1] = fClassData.filter(info=> info.unitized==true).length;
                                    total=total+this.state.tableData[selectedStation[i]].f.li[1];
                                }
                                this.state.tableData[selectedStation[i]].f.total.li=total;

                                //oc
                                total='-';
                                if(this.state.checked.open){
                                    total=0;
                                    this.state.tableData[selectedStation[i]].f.oc[0] = fClassData.filter(info=> info.rcf==false).length;
                                    total=total+this.state.tableData[selectedStation[i]].f.oc[0];
                                }
                                if(this.state.checked.close){
                                    if(total=='-'){total=0;}
                                    this.state.tableData[selectedStation[i]].f.oc[1] = fClassData.filter(info=> info.rcf==true).length;
                                    total=total+this.state.tableData[selectedStation[i]].f.oc[1];
                                }
                                this.state.tableData[selectedStation[i]].f.total.oc=total;

                                //rd
                                total='-';
                                if(this.state.checked.dap){
                                    total=0;
                                    this.state.tableData[selectedStation[i]].f.rd[0] = fClassData.filter(info=> info.delivery_status=="DAP").length;
                                    total=total+this.state.tableData[selectedStation[i]].f.rd[0];
                                }
                                if(this.state.checked.rap){
                                    if(total=='-'){total=0;}
                                    this.state.tableData[selectedStation[i]].f.rd[1] = fClassData.filter(info=> info.delivery_status=="RAP").length;
                                    total=total+this.state.tableData[selectedStation[i]].f.rd[1];
                                }
                                this.state.tableData[selectedStation[i]].f.total.rd=total;

                                //cu
                                total='-';
                                if(this.state.checked.customerUpdated){
                                    total=0;
                                    this.state.tableData[selectedStation[i]].f.cu[0] = fClassData.filter(info=> info.customer_update).length;
                                    total=total+this.state.tableData[selectedStation[i]].f.cu[0];
                                }
                                if(this.state.checked.customerNotUpdated){
                                    if(total=='-'){total=0;}
                                    this.state.tableData[selectedStation[i]].f.cu[1] = fClassData.filter(info=> !info.customer_update).length;
                                    total=total+this.state.tableData[selectedStation[i]].f.cu[1];
                                }
                                this.state.tableData[selectedStation[i]].f.total.cu=total;
                                
                            }
                            if(this.state.checked.mClass){
                                let mClassData = data.filter(info=> info.priority_class=="M_CLASS");
                                let total='-'
                                if(this.state.checked.loose){
                                    total=0;
                                    this.state.tableData[selectedStation[i]].m.li[0] = mClassData.filter(info=> info.unitized==false).length;
                                    total=total+this.state.tableData[selectedStation[i]].m.li[0];
                                }
                                if(this.state.checked.intact){
                                    if(total=='-'){total=0;}
                                    this.state.tableData[selectedStation[i]].m.li[1] = mClassData.filter(info=> info.unitized==true).length;
                                    total=total+this.state.tableData[selectedStation[i]].m.li[1];
                                }
                                this.state.tableData[selectedStation[i]].m.total.li=total;

                                //oc
                                total='-'
                                if(this.state.checked.open){
                                    total=0;
                                    this.state.tableData[selectedStation[i]].m.oc[0] = mClassData.filter(info=> info.rcf==false).length;
                                    total=total+this.state.tableData[selectedStation[i]].m.oc[0];
                                }
                                if(this.state.checked.close){
                                    if(total=='-'){total=0;}
                                    this.state.tableData[selectedStation[i]].m.oc[1] = mClassData.filter(info=> info.rcf==true).length;
                                    total=total+this.state.tableData[selectedStation[i]].m.oc[1];
                                }
                                this.state.tableData[selectedStation[i]].m.total.oc=total;

                                //rd
                                total='-'
                                if(this.state.checked.dap){
                                    total=0;
                                    this.state.tableData[selectedStation[i]].m.rd[0] = mClassData.filter(info=> info.delivery_status=="DAP").length;
                                    total=total+this.state.tableData[selectedStation[i]].m.rd[0];
                                }
                                if(this.state.checked.rap){
                                    if(total=='-'){total=0;}
                                    this.state.tableData[selectedStation[i]].m.rd[1] = mClassData.filter(info=> info.delivery_status=="RAP").length;
                                    total=total+this.state.tableData[selectedStation[i]].m.rd[1];
                                }
                                this.state.tableData[selectedStation[i]].m.total.rd=total;

                                //cu
                                total='-'
                                if(this.state.checked.customerUpdated){
                                    total=0;
                                    this.state.tableData[selectedStation[i]].m.cu[0] = mClassData.filter(info=> info.customer_update).length;
                                    total=total+this.state.tableData[selectedStation[i]].m.cu[0];
                                }
                                if(this.state.checked.customerNotUpdated){
                                    if(total=='-'){total=0;}
                                    this.state.tableData[selectedStation[i]].m.cu[1] = mClassData.filter(info=> !info.customer_update).length;
                                    total=total+this.state.tableData[selectedStation[i]].m.cu[1];
                                }
                                this.state.tableData[selectedStation[i]].m.total.cu=total;
                            }
                            // total for li
                            let total='-'
                            let sectionTotal='-';
                            if(this.state.tableData[selectedStation[i]].f.li[0]!='-'){
                                total=0;
                                total=total+this.state.tableData[selectedStation[i]].f.li[0]
                            }
                            if(this.state.tableData[selectedStation[i]].m.li[0]!='-'){
                                if(total=='-'){total=0;}
                                total=total+this.state.tableData[selectedStation[i]].m.li[0]
                            }
                            this.state.tableData[selectedStation[i]].total.li[0]=total;
                            if(total!='-'){sectionTotal=total;}
                            // i total
                            total='-'
                            if(this.state.tableData[selectedStation[i]].f.li[1]!='-'){
                                total=0;
                                total=total+this.state.tableData[selectedStation[i]].f.li[1]
                            }
                            if(this.state.tableData[selectedStation[i]].m.li[1]!='-'){
                                if(total=='-'){total=0;}
                                total=total+this.state.tableData[selectedStation[i]].m.li[1]
                            }
                            this.state.tableData[selectedStation[i]].total.li[1]=total;
                            if(total!='-'){if(sectionTotal=='-'){sectionTotal=0;} sectionTotal=sectionTotal+total}
                            this.state.tableData[selectedStation[i]].total.total.li=sectionTotal;

                            //oc totals
                            total='-'
                            sectionTotal='-';
                            if(this.state.tableData[selectedStation[i]].f.oc[0]!='-'){
                                total=0;
                                total=total+this.state.tableData[selectedStation[i]].f.oc[0]
                            }
                            if(this.state.tableData[selectedStation[i]].m.oc[0]!='-'){
                                if(total=='-'){total=0;}
                                total=total+this.state.tableData[selectedStation[i]].m.oc[0]
                            }
                            this.state.tableData[selectedStation[i]].total.oc[0]=total;
                            if(total!='-'){sectionTotal=total;}
                            // i total
                            total='-'
                            if(this.state.tableData[selectedStation[i]].f.oc[1]!='-'){
                                total=0;
                                total=total+this.state.tableData[selectedStation[i]].f.oc[1]
                            }
                            if(this.state.tableData[selectedStation[i]].m.oc[1]!='-'){
                                if(total=='-'){total=0;}
                                total=total+this.state.tableData[selectedStation[i]].m.oc[1]
                            }
                            this.state.tableData[selectedStation[i]].total.oc[1]=total;
                            if(total!='-'){if(sectionTotal=='-'){sectionTotal=0;} sectionTotal=sectionTotal+total}
                            this.state.tableData[selectedStation[i]].total.total.oc=sectionTotal;

                            //rd totals
                            total='-'
                            sectionTotal='-';
                            if(this.state.tableData[selectedStation[i]].f.rd[0]!='-'){
                                total=0;
                                total=total+this.state.tableData[selectedStation[i]].f.rd[0]
                            }
                            if(this.state.tableData[selectedStation[i]].m.rd[0]!='-'){
                                if(total=='-'){total=0;}
                                total=total+this.state.tableData[selectedStation[i]].m.rd[0]
                            }
                            this.state.tableData[selectedStation[i]].total.rd[0]=total;
                            if(total!='-'){sectionTotal=total;}
                            // i total
                            total='-'
                            if(this.state.tableData[selectedStation[i]].f.rd[1]!='-'){
                                total=0;
                                total=total+this.state.tableData[selectedStation[i]].f.rd[1]
                            }
                            if(this.state.tableData[selectedStation[i]].m.rd[1]!='-'){
                                if(total=='-'){total=0;}
                                total=total+this.state.tableData[selectedStation[i]].m.rd[1]
                            }
                            this.state.tableData[selectedStation[i]].total.rd[1]=total;
                            if(total!='-'){if(sectionTotal=='-'){sectionTotal=0;} sectionTotal=sectionTotal+total}
                            this.state.tableData[selectedStation[i]].total.total.rd=sectionTotal;

                            //cu totals
                            total='-'
                            sectionTotal='-';
                            if(this.state.tableData[selectedStation[i]].f.cu[0]!='-'){
                                total=0;
                                total=total+this.state.tableData[selectedStation[i]].f.cu[0]
                            }
                            if(this.state.tableData[selectedStation[i]].m.cu[0]!='-'){
                                if(total=='-'){total=0;}
                                total=total+this.state.tableData[selectedStation[i]].m.cu[0]
                            }
                            this.state.tableData[selectedStation[i]].total.cu[0]=total;
                            if(total!='-'){sectionTotal=total;}
                            // i total
                            total='-'
                            if(this.state.tableData[selectedStation[i]].f.cu[1]!='-'){
                                total=0;
                                total=total+this.state.tableData[selectedStation[i]].f.cu[1]
                            }
                            if(this.state.tableData[selectedStation[i]].m.cu[1]!='-'){
                                if(total=='-'){total=0;}
                                total=total+this.state.tableData[selectedStation[i]].m.cu[1]
                            }
                            this.state.tableData[selectedStation[i]].total.cu[1]=total;
                            if(total!='-'){if(sectionTotal=='-'){sectionTotal=0;} sectionTotal=sectionTotal+total}
                            this.state.tableData[selectedStation[i]].total.total.cu=sectionTotal;

                            window.swal_close();
                        // }
                    } 

                    this.setState({tableData: this.state.tableData});
                   
                });
            }
            else{
                window.swal_close();
            }
           
            
        })
    }

    changeAgent =(agents)=>{
        this.setState({selected_agents: agents.map(agent => agent.value)});
    }

    toggleActive =()=>{}

    render() {
        return (
            <Observer>{()=>
            <div className = "page-wrapper">
                {/* <Modal className='none-border'  style={{display: "block"}} size="xl" aria-labelledby="awbKundaliModalEditTitle"  show={this.state.isAWBKundaliModalShow} onHide={this.closeAWBKundaliModal}>
					<AWBKundaliModal closeAWBKundaliModal={this.closeAWBKundaliModal} awbNo={this.state.awb_no} MainStore={this.props.MainStore}/>
				</Modal>	 */}
				<div className = "container-fluid">
                    <Row>
                        <Col md={2} className="text-center">
                        Status<br></br>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked.open?'primary':'secondary'}
                            checked={this.state.checked.open}
                            value="open"
                            onChange={this.toggleCheck} >
                            Open
                            </ToggleButton>
                        </ButtonGroup>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked.close?'primary':'secondary'}
                            checked={this.state.checked.close}
                            value="close"
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
                            variant={this.state.checked.mClass?'primary':'secondary'}
                            checked={this.state.checked.mClass}
                            value="mClass"
                            onChange={this.toggleCheck} >
                            M Class
                            </ToggleButton>
                        </ButtonGroup>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked.fClass?'primary':'secondary'}
                            checked={this.state.checked.fClass}
                            value="fClass"
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
                            variant={this.state.checked.customerUpdated?'primary':'secondary'}
                            checked={this.state.checked.customerUpdated}
                            value="customerUpdated"
                            onChange={this.toggleCheck} >
                            Yes
                            </ToggleButton>
                        </ButtonGroup>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked.customerNotUpdated?'primary':'secondary'}
                            checked={this.state.checked.customerNotUpdated}
                            value="customerNotUpdated"
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
                            variant={this.state.checked.loose?'primary':'secondary'}
                            checked={this.state.checked.loose}
                            value="loose"
                            onChange={this.toggleCheck} >
                            Loose
                            </ToggleButton>
                        </ButtonGroup>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked.intact?'primary':'secondary'}
                            checked={this.state.checked.intact}
                            value="intact"
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
                            variant={this.state.checked.dap?'primary':'secondary'}
                            checked={this.state.checked.dap}
                            value="dap"
                            onChange={this.toggleCheck} >
                            DAP
                            </ToggleButton>
                        </ButtonGroup>
                        <ButtonGroup className="mb-2">
                            <ToggleButton
                            id="toggle-check"
                            type="checkbox"
                            variant={this.state.checked.rap?'primary':'secondary'}
                            checked={this.state.checked.rap}
                            value="rap"
                            onChange={this.toggleCheck} >
                            RAP
                            </ToggleButton>
                        </ButtonGroup>
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
                        <div className="col-md-3 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                Weight 
                            </div>
                            
                            <select className="p-0 select3 form-control custom-select browser-default" id="addAgent" type="text" onChange={this.changeWeight}>
                                <option value={0}>&gt; 0 KG</option>
                                <option value={300}>&lt; = 300 KG</option>
                                <option value={500}>&lt; = 500 KG</option>
                                <option value={501}>500 KG or above</option>
							</select>
                            
                        </div>
                        
                              
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col-md-6 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                Station 
                            </div>
                            
                            <MultiSelect data={this.state.stations} getList={this.getSelectedStationsList} selectAll={true}/>
                            
                        </div>
                        <div className="col-md-6 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                Destination 
                            </div>
                            <MultiSelect data={window.station_records.map(station => station.iata)} getList={this.getSelectedDestinations} />
                        </div>
                        <div className="col-md-12 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                {/* <span className="input-group-text bg-danger">
                                    <i className="fas fa-plane text-light"></i>
                                </span> */}
                                Agents Belonging To {this.state.selectedStation.length ? this.state.selectedStation.join(',') : "No Selected Station"}
                            </div>
                            
                            <Select className="w-50" 
                                options={window.agent_records.filter(agent => this.state.selectedStation.indexOf(agent.station) != -1).map((agent) => {
                                    return {
                                        label: `${agent.name} - ${agent.station}`,
                                        value: agent.billing_code
                                    }
                                })}
                                isMulti
                                defaultValue={this.state.selected_agents}
                                styles={{
                                    multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: "#aaaa00",
                                    color: "white",
                                    }),
                                }}
                                onChange={this.changeAgent}
                            />
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        
                        
                        <div className="col-md-9 input-group">
                            <div className="input-group-prepend input-group-text bg-danger text-white">
                                Delay Days
                            </div>
                            <MultiSelect data={this.state.delay} getList={this.getSelectedDelay} selectAll={true}/>
                            
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
                        <Col lg={8}>
                        <table className="table table-secondary align-middle text-center table-sm text-secondary">
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
                            {this.state.stationsToShowInTable.length==0 &&
                            <tbody>
                            <tr className="text-center">
                                <th scope="row" colspan="14" className="text-center text-dark"><strong>Please select a station</strong></th>
                                </tr></tbody>
                            }
                            {this.state.stationsToShowInTable.map((station) => (  
                            <tbody>
                                <tr>
                                    <th scope="row" rowspan="3" className="">{station}</th>
                                    <th scope="row">
                                    <span className={"badge-info border border-info" + "badge-xs mx-1 p-1 my-auto"}>F</span>
                                        
                                    </th>

                                    {this.state.tableData[station].f.cu.map((value) => ( 
                                    <td className={this.state.tdActive == station+ "_" + "F/Y" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/Y")}>{value}</td>
                                    ))}

                                     <td className={this.state.tdActive == "CU"+station+ "_" + "F/total" ? '' : ''}
                                            onClick={() => this.toggleActive("CU"+station+ "_" + "F/total")}>{this.state.tableData[station].f.total.cu}</td>

                                    {this.state.tableData[station].f.li.map((value) => (
                                    <td className={this.state.tdActive == station+ "_" + "F/U" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/U")}>{value}</td>
                                    ))}

                                    <td className={this.state.tdActive == "LI"+station+ "_" + "F/total" ? '' : ''}
                                            onClick={() => this.toggleActive("LI"+station+ "_" + "F/total")}>{this.state.tableData[station].f.total.li}</td>
                                    
                                    {this.state.tableData[station].f.oc.map((value) => (
                                    <td className={this.state.tdActive == station+ "_" + "F/open" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/open")}>{value}</td>
                                    ))}

                                    <td className={this.state.tdActive == "OC"+station+ "_" + "F/total" ? '' : ''}
                                            onClick={() => this.toggleActive("OC"+station+ "_" + "F/total")}>{this.state.tableData[station].f.total.oc}</td>

                                    {this.state.tableData[station].f.rd.map((value) => (
                                    <td className={this.state.tdActive == station+ "_" + "F/dap" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/dap")}>{value}</td>
                                    ))}

                                    <td className={this.state.tdActive == "RD"+station+ "_" + "F/total" ? '' : ''}
                                            onClick={() => this.toggleActive("RD"+station+ "_" + "F/total")}>{this.state.tableData[station].f.total.rd}</td> 
                                </tr>
                                <tr>
                                    <th scope="row">
                                    <span className={"badge-light border border-info" + "badge-xs mx-1 p-1 my-auto"}>M</span>
                                    </th>

                                    {this.state.tableData[station].m.cu.map((value) => ( 
                                    <td className={this.state.tdActive == station+ "_" + "M/Y" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/Y")}>{value}</td>
                                    ))}

                                    <td className={this.state.tdActive == "CU"+station+ "_" + "M/total" ? '' : ''}
                                            onClick={() => this.toggleActive("CU"+station+ "_" + "M/total")}>{this.state.tableData[station].m.total.cu}</td>

                                    {this.state.tableData[station].m.li.map((value) => (
                                    <td className={this.state.tdActive == station+ "_" + "M/U" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/U")}>{value}</td>
                                    ))}

                                    <td className={this.state.tdActive == "LI"+station+ "_" + "M/total" ? '' : ''}
                                            onClick={() => this.toggleActive("LI"+station+ "_" + "M/total")}>{this.state.tableData[station].m.total.li}</td>
                                    
                                    {this.state.tableData[station].m.oc.map((value) => (
                                    <td className={this.state.tdActive == station+ "_" + "M/open" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "M/open")}>{value}</td>
                                    ))}

                                    <td className={this.state.tdActive == "OC"+station+ "_" + "M/total" ? '' : ''}
                                            onClick={() => this.toggleActive("OC"+station+ "_" + "M/total")}>{this.state.tableData[station].m.total.oc}</td>

                                    {this.state.tableData[station].m.rd.map((value) => (
                                    <td className={this.state.tdActive == station+ "_" + "M/dap" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "F/dap")}>{value}</td>
                                    ))}

                                    <td className={this.state.tdActive == "RD"+station+ "_" + "M/total" ? '' : ''}
                                            onClick={() => this.toggleActive("RD"+station+ "_" + "M/total")}>{this.state.tableData[station].m.total.rd}</td>
                                </tr>
                                <tr>
                                <th scope="row">Total</th>
                                    {this.state.tableData[station].total.cu.map((value) => (
                                        <td className={this.state.tdActive == station+ "_" + "total/Y" ? '' : ''}
                                                onClick={() => this.toggleActive(station+ "_" + "total/Y")}>{value}</td>
                                    ))}
                            
                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "CU"+station+ "_" + "total/total" ? '' : ''}
                                            onClick={() => this.toggleActive("CU"+station+ "_" + "total/total")}><strong className="text-dark">{this.state.tableData[station].total.total.cu}</strong></td>

                                    {/* total/U */}
                                    {this.state.tableData[station].total.li.map((value) => (
                                        <td className={this.state.tdActive == station+ "_" + "total/U" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/U")}>{value}</td>
                                    ))}
                                    
                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "LI"+station+ "_" + "total/total" ? '' : ''}
                                            onClick={() => this.toggleActive("LI"+station+ "_" + "total/total")}><strong className="text-dark">{this.state.tableData[station].total.total.li}</strong></td>
                                    
                                    {this.state.tableData[station].total.oc.map((value) => (
                                    <td className={this.state.tdActive == station+ "_" + "total/open" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/open")}>{value}</td>
                                    ))}
                                    
                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "OC"+station+ "_" + "total/total" ? '' : ''}
                                            onClick={() => this.toggleActive("OC"+station+ "_" + "total/total")}><strong className="text-dark">{this.state.tableData[station].total.total.oc}</strong></td>

                                    {this.state.tableData[station].total.rd.map((value) => (
                                    <td className={this.state.tdActive == station+ "_" + "total/dap" ? '' : ''}
                                            onClick={() => this.toggleActive(station+ "_" + "total/dap")}>{value}</td>
                                    ))}

                                    {/* total/Total */}
                                    <td className={this.state.tdActive == "RD"+station+ "_" + "total/total" ? '' : ''}
                                            onClick={() => this.toggleActive("RD"+station+ "_" + "total/total")}><strong className="text-dark">{this.state.tableData[station].total.total.rd}</strong></td>
                                </tr>
                            </tbody>
                            ))} 
                        </table>
                    </Col>
                    <Col lg={4}>
                        <Awblist data={this.state.awbInfos} MainStore={this.props.MainStore} listSize={5}/>
                        
                    </Col>
                    </Row>
                
                </div>
            </div>
            }</Observer>
        )
    }
}
