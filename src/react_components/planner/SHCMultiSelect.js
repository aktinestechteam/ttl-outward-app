import React, { Component } from "react";
import { Multiselect } from 'multiselect-react-dropdown';
import Select from 'react-select'

export default class SHCMultiSelect extends Component {

	constructor(props) {
		// alert("in shc ",window)
		super(props);
		this.state = {
			//selectedSHC: window.shc_records.filter(shc_record => props.selectedSHC.indexOf(shc_record.code) != -1),
			shcOptions: window.shc_records.map(shc => {return {"value": shc.code, "label": shc.code + " - " + shc.explanation}}),
			selectedShcOptions: window.shc_records.filter(shc_record => props.selectedSHC.indexOf(shc_record.code) != -1).map(shc => {return {"value": shc.code, "label": shc.code + " - " + shc.explanation}})
		}
	}

	onSHCSelected = (selectedList) => {
		this.setState({selectedShcOptions: selectedList});
		this.props.shcCallback(selectedList.map(item => item.value));
	}

	/*onSHCAdd = (selectedList, selectedItem) =>{
		this.setState({selectedSHC: selectedList});
		this.props.shcCallback(selectedList);
	}
	 
	onSHCRemove = (selectedList, removedItem) => {
		this.setState({selectedSHC: selectedList});
		this.props.shcCallback(selectedList);
	}*/

	render() {
		
		return (
				<div className="my-auto">
					{/* <Multiselect
						placeholder="Select SHC"
						options={window.shc_records} // Options to display in the dropdown
						selectedValues={this.state.selectedSHC} // Preselected value to persist in dropdown
						onSelect={this.onSHCAdd} // Function will trigger on select event
						onRemove={this.onSHCRemove} // Function will trigger on remove event
						displayValue={"code"} // Property name to display in the dropdown options
					/> */}
					<Select 
						options={this.state.shcOptions}
						defaultValue={this.state.selectedShcOptions}
						isMulti
						styles={{
							multiValue: (base) => ({
							  ...base,
							  backgroundColor: "#aaaa00",
							  color: "white",
							}),
						}}
						onChange={this.onSHCSelected}
					/>
				</div>
		);
	}
}