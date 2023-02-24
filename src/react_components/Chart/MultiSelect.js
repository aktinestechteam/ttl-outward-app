import React, { Component } from 'react'
import { Observer } from "mobx-react"
import Select from "react-select";

export default class Multiselect extends Component {
    constructor(props) {
        super(props)
        /*let selectedOptions = props.data.map( v => {
            return {label: v, value: v}
        });*/
        this.state = {
            dataToSelect: props.data,
            dataSelected: /*props.selectAll ? selectedOptions :*/ []
        }
        //props.getList(selectedOptions);
    }
    returnSelectedList=(updatedList)=>{
        this.setState({dataSelected: updatedList});
        this.props.getList(updatedList);
    }
    
    componentWillReceiveProps(newProps) {

    }

    componentWillMount(){
		

	}
    
    componentDidMount(){
        
	}

    render() {
        return (
            <Observer>{()=>
            <div>
               <Select style={{position:""}}
                    options={this.state.dataToSelect.map(datum => {return {"value": datum,"label": datum}})}
                    defaultValue={this.state.dataSelected}
                    isMulti
                    styles={{
                        multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#aaaa00",
                        color: "white",
                        }),
                    }}
                    onChange={this.returnSelectedList}
                />
            </div>
            }</Observer>
        )
    }
}
