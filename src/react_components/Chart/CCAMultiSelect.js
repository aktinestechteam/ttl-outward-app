import React, { Component } from "react";
import { Multiselect } from 'multiselect-react-dropdown';
import { Observer } from "mobx-react"
import custom from "../../config/custom";
import Select from "react-select";

class CCAMultiSelect extends Component {
	constructor(props) {
		//let selectedCCA = window.ccareasons.map(cca => {return {"value": cca.main_reason, "label": cca.main_reason}})
		super(props);
		this.state = {
			selectedCCA: []//selectedCCA
		}
		//props.ccaCallback(selectedCCA.map(item => item.value));
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
		//alert(JSON.stringify(selectedList));
		this.setState({selectedCCA: selectedList});
		this.props.ccaCallback(selectedList.map(item => item.value));
	}

	render() {
		console.log(window.ccareasons.map(cca => cca.main_reason));
		return (
			<Observer>{()=>
			
			<div>
					{/* <Multiselect
						placeholder="Select CCA"
						options={window.reason_records.filter(reason => reason.category === custom.custom.reason_category.cca)} // Options to display in the dropdown
						// selectedValues={this.state.selectedCCA} // Preselected value to persist in dropdown
						onSelect={this.onCCAAdd} // Function will trigger on select event
						onRemove={this.onCCARemove} // Function will trigger on remove event
						displayValue="code" // Property name to display in the dropdown options
					/> */}
					<Select 
						options={window.ccareasons.map(cca => {return {"value": cca.main_reason, "label": cca.main_reason}})}
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

