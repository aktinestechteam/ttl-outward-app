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
//props will have 
// data:awb_infos list
//MainStore

export default class Awblist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data,
            awb_no: "",
            isAWBKundaliModalShow: false,
            selectedPage: 1,
            listSize: props.listSize

        }
        

    }
    onClickAWBNoAction = (event,data) =>{
		this.setState ({
			isAWBKundaliModalShow: true
		});
		this.setState({awb_no:data})
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
    onPageClicked = (i) =>{
		this.setState ({
			selectedPage: parseInt(i)
		});
	}
    nextPage = () =>{
        this.setState ({
			selectedPage: this.state.selectedPage+1
		});
    }
    prevPage = () =>{
        this.setState ({
			selectedPage: this.state.selectedPage-1
		});
    }
    
    componentWillReceiveProps(newProps) {
        this.setState({data: newProps.data, selectedPage: 1, listSize: newProps.listSize})
    }
    componentWillMount(){
		

	}
    componentDidMount(){
		

	}

    render() {
        let noOfPages=1
        let pages=[]
        if(this.state.data && this.state.data.length>0 && this.props.listSize>0 && 
            this.state.data.length > this.props.listSize){
            if(this.state.data.length%this.props.listSize==0){
                noOfPages=parseInt(this.state.data.length / this.props.listSize);
            }
            else {
                noOfPages=(parseInt(this.state.data.length / this.props.listSize))+1;
            }
        }
        if(this.state.selectedPage<=6){
            for(let i=1;i<=noOfPages;i++){
                if(i<=6){
                    pages.push(i);
                }
                else break;
            }
        }
        else if(this.state.selectedPage>6){
            if(this.state.selectedPage%6==0){
                for(let i=this.state.selectedPage-5;i<=this.state.selectedPage;i++){
                    pages.push(i);
                }
            }
            else{
                for(let i=this.state.selectedPage-((this.state.selectedPage%6)-1);i<=(this.state.selectedPage-((this.state.selectedPage%6)-1))+5;i++){
                    if(this.props.data.length >= (this.props.listSize * (i - 1) )) {
                        pages.push(i);
                    }
                }
            }
        }
        
        let startRange=(this.state.selectedPage-1)*this.props.listSize;
        let endRange=(startRange+(this.props.listSize))
        let pageData=[];
        if(this.state.data)
        pageData = this.state.data.slice(startRange,endRange);
        
        return (
            <Observer>{()=>
            <div>
                <Modal className='none-border'  style={{display: "block"}} size="xl" aria-labelledby="awbKundaliModalEditTitle"  show={this.state.isAWBKundaliModalShow} onHide={this.closeAWBKundaliModal}>
					<AWBKundaliModal closeAWBKundaliModal={this.closeAWBKundaliModal} awbNo={this.state.awb_no} MainStore={this.props.MainStore} tabid={custom.custom.tab_name.offloaded}/>
				</Modal>
                <div className="text-center bg-dark p-1">
                    <label className="my-auto text-white">Airway Bills ({this.state.data.length})</label>
                </div>
                {pageData.length<=0 && <div className="text-center"><label>No AWB Data Found</label></div>}
                {pageData.length>0 && pageData.map((awbInfo, index) => ( 
                <div id={awbInfo.awb_no} onClick={((e) => this.onClickAWBNoAction(e, awbInfo.awb_no))} className={"border border-secondary alert alert-secondary" + " m-0 p-1"}>
                    <span>{((this.state.selectedPage - 1) * this.props.listSize) + index + 1}</span>
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
                <br></br>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item"><a class="page-link">Prev</a></li>
                        {this.state.selectedPage>1 && <li className="page-item" onClick={this.prevPage}><a class="page-link">Prev</a></li>}
                        {
                            pageData.length>0 && pages.map((i)=>(
                                <li className={this.state.selectedPage==i? "page-item active" : "page-item"} onClick={((e)=>this.onPageClicked(i))}><a class="page-link">{i}</a></li>
                            ))
                        }
                        {this.state.selectedPage<noOfPages && 
                            <li className="page-item" onClick={this.nextPage}><a class="page-link">Next</a></li>
                        }
                        <li class="page-item"><a class="page-link">Next</a></li>
                    </ul>
                </nav>
            </div>
            }</Observer>
        )
    }
}
