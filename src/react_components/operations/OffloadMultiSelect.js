import React, { Component } from "react";
// import { Multiselect } from 'multiselect-react-dropdown';
import { Observer } from "mobx-react"
import Select from 'react-select'

class OffloadMultiSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedOffload:[],
			offloadOptions: window.reason_records.map(reason => {return {"value": reason.code, "label": reason.code + " - " + reason.explanation}})
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		console.log(JSON.stringify(nextProps))
		console.log(JSON.stringify(nextState))
		console.log("shouldComponentUpdate" )
		if (nextProps.awb_legs !== nextState.awb_legs) {
			nextState.awb_legs = nextProps.awb_legs;
			
			return true;
			
		} else
			return false;
	}
	onOffloadReasonSelected = (selectedList) => {
		this.setState({selectedOffload: selectedList});
		this.props.offloadCallback([selectedList].map(item => item.value));
	}

	/*onOffloadAdd = (selectedList, selectedItem) =>{
		// console.log('selected item = '+selectedItem.code);
		let fresh_offload_to_add = this.state.selectedOffload.map((offload_code) => {
				return offload_code;
		});
		fresh_offload_to_add.push(selectedItem.code);
		this.setState({selectedOffload: fresh_offload_to_add});
		this.props.offloadCallback(fresh_offload_to_add);
		// console.log('after addding = '+ this.state.selectedOffload);
	}
	 
	onOffloadRemove = (selectedList, removedItem) => {
		// console.log('Removed item = '+removedItem.code);
		let offload_after_remove = this.state.selectedOffload.filter((offload_code) => {
				return (offload_code != removedItem.code) ;
			});
		this.setState({selectedOffload: offload_after_remove});
		this.props.offloadCallback(offload_after_remove);
		// console.log('after remove= '+ this.state.selectedOffload);
	}*/

	render() {
		/*let offload_reason = [];
		for (let i = 0; i < window.reason_records.length; i++){
			if(window.reason_records[i].category == 'Offload'){
				offload_reason.push(window.reason_records[i]);
			}
		}
		return (
			<Observer>{()=>
			<div className="m-top-3">
					<Multiselect
						placeholder="Select Offload Code"
						options={offload_reason} // Options to display in the dropdown
						// selectedValues={this.state.selectedCCA} // Preselected value to persist in dropdown
						onSelect={this.onOffloadAdd} // Function will trigger on select event
						onRemove={this.onOffloadRemove} // Function will trigger on remove event
						displayValue="code" // Property name to display in the dropdown options
					/>
				</div>
			}</Observer>
				
		);*/

		return (
			<Observer>{ () =>
				<div className="mt-3" style={{objectFit:"cover"}}>
						<label className="col-md-12">Select Offload Reason</label>
					<Select 
						options={this.state.offloadOptions}
						defaultValue={this.state.selectedOffload}
						//isMulti
						styles={{
							multiValue: (base) => ({
							  ...base,
							  backgroundColor: "#aaaa00",
							  color: "white",
							  zIndex: 9999,
							  
							}),
						}}
						onChange={this.onOffloadReasonSelected}
					/>
				</div>
			}</Observer>
		)
	}
}
export default OffloadMultiSelect;