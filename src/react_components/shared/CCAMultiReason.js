import React, { Component } from "react";
import { Multiselect } from 'multiselect-react-dropdown';
import { Observer } from "mobx-react"
import custom from "../../config/custom";
import Select from "react-select";
import MultiSelect from "../Chart/MultiSelect";

class CCAMultiReason extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rowIds:[],
			nextRowid:0,
			selectedCCA:[],
		}
	}

	componentDidMount() {
		
	}
	callback(){
		let selectedCCA=[];
		this.state.selectedCCA.map((reason)=>{
			// reason={main_reason:reason.main_reason, sub_reason1: reason.sub_reason1,
			// sub_reason2: reason.sub_reason2, sub_reason3: reason.sub_reason3};
			reason={main_reason:reason.main_reason, sub_reason1: reason.sub_reason1,sub_reason2: reason.sub_reason2, sub_reason3: reason.sub_reason3}
			selectedCCA.push(reason);
		});
		this.props.ccaCallback(selectedCCA);
	}
	handleRemoveCCAReason = (rowId) =>{
		//remove from selected cca
		for(let i=0;i<this.state.selectedCCA.length;i++){
			if(this.state.selectedCCA[i].id==rowId){
				this.state.selectedCCA.splice(i,1);
				this.setState({selectedCCA: this.state.selectedCCA});
				break;
			}
		}
		//remove from rowIds
		this.state.rowIds.splice(this.state.rowIds.indexOf(rowId),1);
		this.setState({rowIds: this.state.rowIds});
		this.callback();
	}

	handleSelectCCAMainReason = (main_reason, rowId) => {
		this.state.selectedCCA.map((reason)=>{
			if(reason.id==rowId){
				reason.main_reason=main_reason;
				window.ccareasons.map((ccareason)=>{
					if(ccareason.main_reason==main_reason){
						reason.sub_reason1=ccareason.sub_reason1[0];
						reason.sub_reason2=ccareason.sub_reason2[0];
					}	
				})
			}
		});
		this.setState({selectedCCA:this.state.selectedCCA});
		this.callback();
	}
	handleSelectSubreason1 = (sub1, rowId) =>{
		this.state.selectedCCA.map((reason)=>{
			if(reason.id==rowId){
				reason.sub_reason1=sub1;
			}
		});
		this.setState({selectedCCA:this.state.selectedCCA});
		this.callback();
	}
	handleSelectSubreason2 = (sub2, rowId) =>{
		this.state.selectedCCA.map((reason)=>{
			if(reason.id==rowId){
				reason.sub_reason2=sub2;
			}
		});
		this.setState({selectedCCA:this.state.selectedCCA});
		this.callback();
	}
	handleSelectSubreason3 = (sub3, rowId) =>{
		this.state.selectedCCA.map((reason)=>{
			if(reason.id==rowId){
				let sub3List=[]
				for(let i=0;i<sub3.length;i++){
					sub3List.push(sub3[i].value);
				}
				reason.sub_reason3=sub3List;
			}
		});
		this.setState({selectedCCA:this.state.selectedCCA});
		this.callback();
	}
	handleRailCardCLick = ()=>{
		this.state.rowIds.push(this.state.nextRowid);
		this.state.selectedCCA.push({id: this.state.nextRowid, main_reason:window.ccareasons[0].main_reason, sub_reason1: window.ccareasons[0].sub_reason1[0],sub_reason2: window.ccareasons[0].sub_reason2[0], sub_reason3: []})
		this.state.nextRowid++;
		this.setState({rowIds: this.state.rowIds, nextRowid: this.state.nextRowid,
			 selectedCCA: this.state.selectedCCA});
		this.callback();

	}

	render() {
		return (
			<Observer>{()=>
			
				<div>
				<label className="col-md-12">Select CCA Reason</label>
				
					<table className="table-sm w-100">
						<thead>
							<th>#</th>
							<th>Reason</th>
							<th>Sub Reason 1</th>
							<th>Sub Reason 2</th>
							<th>Sub Reason 3</th>
						</thead>
	
						{this.state.selectedCCA.map((row) => (
							<tr key={row.id}>
								<td>
									<button type="button" className="btn" onClick={() => this.handleRemoveCCAReason(row.id)}><i class="far fa-trash-alt"></i></button>
								</td>
								<td>
									<select  className="form-control "style={{width:"150px"}} data-index={row.id} onChange={(e)=>this.handleSelectCCAMainReason(e.target.value, row.id)}>
										{window.ccareasons.map((reason) => (
											<option key={reason.main_reason} value={reason.main_reason}>
												{reason.main_reason}
											</option>
										))}
									</select>
								</td>
								<td>
								{window.ccareasons.map((reason) => (reason.main_reason==row.main_reason && reason.sub_reason1.length>0 &&
	
									<select  className="form-control" style={{width:"150px"}} data-index={row.id} onChange={(e)=>this.handleSelectSubreason1(e.target.value,row.id)} >
										{reason.sub_reason1.map((sub1) => (
											<option key={sub1} value={sub1}>
												{sub1}
											</option>
										))}
									</select>
								))}
								</td>
								<td>
	
									{window.ccareasons.map((reason) => (reason.main_reason==row.main_reason && reason.sub_reason2.length>0 &&
	
										<select  className="form-control" style={{width:"150px"}} data-index={row.id}  onChange={(e)=>this.handleSelectSubreason2(e.target.value,row.id)} >
											{reason.sub_reason2.map((sub2) => (
												<option key={sub2} value={sub2}>
													{sub2}
												</option> ))}
										</select>
									))}
								</td>
								<td>
								{window.ccareasons.map((reason) => (reason.main_reason==row.main_reason && reason.sub_reason3.length>0 &&
	
									// <select  className="form-control" style={{width:"150px"}} data-index={row.id}  onChange={(e)=>this.handleSelectSubreason3(e.target.value,row.id)} >
									// 	{reason.sub_reason3.map((sub3) => (
									// 		<option key={sub3} value={sub3}>
									// 			{sub3}
									// 		</option> ))}
									// </select>
									<MultiSelect data={reason.sub_reason3} getList={(newList)=>this.handleSelectSubreason3(newList,row.id)}/>
								))}
								</td>
							</tr>))}  
							<tr>
								<td>
									<button type="button" className="btn" onClick={this.handleRailCardCLick} >
										<i class="fas fa-plus"></i>
									</button>
								</td>
							</tr>
					</table>
					<br />
			</div>
			}</Observer>
				
		);
	}
}
export default CCAMultiReason;