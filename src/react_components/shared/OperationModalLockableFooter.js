import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import ModalFooter from 'react-bootstrap/ModalFooter'
import axios from 'axios';
import { API_BASE_PATH } from './../../env';
import APIService from "../APIService";
import { Observer } from "mobx-react";

//  Initial state = unlocked and close visible
//  When locked = unlock visible
//  when unlocked = initial state
class OperationModalLockableFooter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            locked: false
        }
    }
    // componentWillReceiveProps(newProps) {
	// 	this.setState({locked: newProps.locked});
	// }

    componentWillReceiveProps(newProps) {
		let found=false;
        let index=-1;
		for(let i=0;i<newProps.lockedOpsData.length;i++){
			if(newProps.lockedOpsData[i].operationId == newProps.awbLegOp.id){
				found=true;
                index=i;
				break;
			}
		}
		if(found && index != -1 && newProps.MainStore.user.username == newProps.lockedOpsData[index].username) {
			this.setState({locked: true});
        }/* else {
            this.setState({locked: false});
            if(found && index!=-1) {
                window.swal_error("The operation is locked by "+ newProps.lockedOpsData[index].username);
            }
		}*/
	}
	componentDidMount() {
		let found=false;
        let index=-1
		for(let i=0;i<this.props.lockedOpsData.length;i++){
			if(this.props.lockedOpsData[i].operationId==this.props.awbLegOp.id){
				found=true;
                index=i;
				break;
			}
		}
		if(found && index!=-1 && this.props.MainStore.user.username==this.props.lockedOpsData[index].username){
			this.setState({locked: true});
		}
		else{
			this.setState({locked: false});
		}
	}

    lock = () => {
        let self = this;
        APIService.post('/lockAwbLegOp', {
            operationId: this.props.awbLegOp.id
        },
        function (response) {
            // let data = response.data;
            if(response && response.errormsg) {
                window.swal_error(response.errormsg);
            } else {
                self.setState({locked: true})
                    window.swal_success("The AWB Leg Operation is locked");
            }
        }).catch(function (error) {
            window.swal_error(error);
        });
    }

    unlock = () => {
        let self = this;
        APIService.post('/unlockAwbLegOp', {
            operationId: this.props.awbLegOp.id
        },function (response) {
            // let data = response.data;
            if(response && response.errormsg) {
                window.swal_error(response.errormsg);
            } else {
                self.setState({locked: false});
                window.swal_success("The AWB Leg Operation is unlocked");
            }
        }).catch(function (error) {
            window.swal_error(error);
        });
        
    }

    save = () => {
        let self = this;
        APIService.post('/unlockAwbLegOp', {
            operationId: this.props.awbLegOp.id
        })
        .then(function (response) {
            // let data = response.data;
            if(response && response.errormsg) {
                window.swal_error(response.errormsg);
            } else {
                self.setState({locked: false});
                window.swal_success("The AWB Leg Operation is unlocked");
            }
            self.props.onClickHandler();
        }).catch(function (error) {
            window.swal_error(error);
        });
        
    }
    

    render() {
        return (
            <Observer>{
                () => <ModalFooter>
                        <Col lg={6}>
                            {this.state.locked &&
                                <button className="btn btn-light float-left text-danger" type="button" onClick={this.unlock}>
                                    <i className="fas fa-lock mr-2" /><span>Click to Unlock &amp; Release</span>
                                </button>
                            }
                            {!this.state.locked &&
                                <button className="btn btn-light float-left text-success" type="button" onClick={this.lock}>
                                    <i className="fas fa-unlock mr-2" /><span>Click to Lock &amp; Work</span>
                                </button>
                            }
                        </Col>

                        <Col lg={6}>
                            {this.state.locked &&
                                <button className="btn btn-danger waves-effect waves-light save-category float-right" id={this.props.name} type="button" name={this.props.name} onClick={this.save}>
                                    <i className="fas fa-save mr-2" aria-hidden="true"></i>{this.props.text}
                                </button>
                            }
                            {!this.state.locked &&
                                <button className="btn btn-light float-right text-info" type="button" onClick={this.props.onCloseModal}>
                                    <i className="fas fa-times mr-2" /><span>Close</span>
                                </button>
                            }
                        </Col>
                </ModalFooter>
            }</Observer>
        )
    }
}

export default OperationModalLockableFooter;
