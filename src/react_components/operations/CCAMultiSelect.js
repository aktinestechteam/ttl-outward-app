import React, { Component } from "react";
import { Multiselect } from 'multiselect-react-dropdown';
import { Observer } from "mobx-react"
import custom from "../../config/custom";
import Select from "react-select";

class CCAMultiSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedCCA:[]
		}
	}

	/*onCCAAdd = (selectedList, selectedItem) =>{
		console.log('selected item = '+selectedItem.code);
		let fresh_cca_to_add = this.state.selectedCCA.map((cca_code) => {
				return cca_code;
		});
		fresh_cca_to_add.push(selectedItem.code);
		this.setState({selectedCCA: fresh_cca_to_add});
		this.props.ccaCallback(fresh_cca_to_add);
		// console.log('after addding = '+ this.state.selectedCCA);
	}
	 
	onCCARemove = (selectedList, removedItem) => {
		console.log('Removed item = '+removedItem.code);
		let cca_after_remove = this.state.selectedCCA.filter((cca_code) => {
				return (cca_code !== removedItem.code) ;
			});
		this.setState({selectedCCA: cca_after_remove});
		this.props.ccaCallback(cca_after_remove);
		// console.log('after remove= '+ this.state.selectedCCA);
	}*/

	onCCASelected = (selectedList) => {
		this.setState({selectedCCA: selectedList});
		this.props.ccaCallback(selectedList.map(item => item.value));
	}

	render() {
		return (
			<Observer>{()=>
			
			<div className="my-3">
					{/* <Multiselect
						placeholder="Select CCA"
						options={window.reason_records.filter(reason => reason.category === custom.custom.reason_category.cca)} // Options to display in the dropdown
						// selectedValues={this.state.selectedCCA} // Preselected value to persist in dropdown
						onSelect={this.onCCAAdd} // Function will trigger on select event
						onRemove={this.onCCARemove} // Function will trigger on remove event
						displayValue="code" // Property name to display in the dropdown options
					/> */}
						<label className="col-md-12">Select CCA Reason</label>
					<Select 
						options={window.reason_records.filter(reason => reason.category === custom.custom.reason_category.cca).map(cca => {return {"value": cca.code, "label": cca.code + " - " + cca.explanation}})}
						defaultValue={this.state.selectedCCA}
						isMulti
						styles={{
							multiValue: (base) => ({
							  ...base,
							  backgroundColor: "#aaaa00",
							  color: "white",
							}),
						}}
						onChange={this.onCCASelected}
					/>
				</div>
			}</Observer>
				
		);
	}
}
export default CCAMultiSelect;