import React, {Component} from "react";

class RadioOptions extends Component {

	constructor(props) {
		super(props);
		this.state = {selected_option: undefined};
	}

	optionSelected = (event) => {
		this.setState({selected_option: event.target.value});
		this.props.optionSelected(event.target.value);
	}

	render() {
		let name = Date.now();
		
		return  (
			<div onChange={this.optionSelected.bind(this)}>
			{	this.props.options.map((option, index) => {
				let text = option;
				if (option == 'RECOVERED'){
					text = 'DEPART';
				}
				return (
					<div className="custom-control custom-radio m-auto custom-control-inline">
						<input hidden="true" className="" id={option+index} type="radio" name={name} required="" value={option}/>
						<label className={"border border-dark custom-control-label alert " + (this.state.selected_option === option ? "bg-info text-white" : "alert-secondary")} for={option+index}>{text}</label>
					</div>
				);
			})
			}
			</div>
		)
		
	}
}

export default RadioOptions;