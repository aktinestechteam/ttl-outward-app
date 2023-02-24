import React from "react";
import custom from '../../config/custom.js';

export default class AWBKundaliGraph extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			origin: props.origin,
			destination: props.destination,
			pieces: props.pieces,
			weight: props.weight,
			awb_legs: props.awb_legs,
			svg_graph: undefined,
			bindFunctions: undefined,
		};
	}

	componentDidMount() {
		this.mermaid_init();
		window.mermaid.render('dummyid', this.getGraphDefinition(), this.mermaid_cli_cb, window.$('#flight_plan')[0]);
	}

	componentDidUpdate = (prevProps) => {
		//this.state.bindFunctions($('#flight_plan')[0]);
		this.mermaid_init();

	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log(JSON.stringify(nextProps))
		console.log(JSON.stringify(nextState))

		// alert(JSON.stringify(nextProps.awb_legs))
		if (nextProps.awb_legs !== nextState.awb_legs) {
			nextState.awb_legs = nextProps.awb_legs;
			this.mermaid_init();
			window.mermaid.render('dummyid', this.getGraphDefinition(), this.mermaid_cli_cb, window.$('#flight_plan')[0]);

			return true
		}
		if (nextProps.origin !== nextState.origin) {
			nextState.origin = nextProps.origin;
			this.mermaid_init();
			window.mermaid.render('dummyid', this.getGraphDefinition(), this.mermaid_cli_cb, window.$('#flight_plan')[0]);

			return true
		}
		// if (nextProps.destination !== nextState.destination) {
		// 	nextState.destination = nextProps.destination;
		// 	this.mermaid_init();
		// 		window.mermaid.render('dummyid', this.getGraphDefinition(), this.mermaid_cli_cb, window.$('#flight_plan')[0]);

		// 	return true
		// } 
		//  if (nextProps.weight !== nextState.weight) {
		// 		nextState.weight = nextProps.weight;
		// 		this.mermaid_init();
		// 		window.mermaid.render('dummyid', this.getGraphDefinition(), this.mermaid_cli_cb, window.$('#flight_plan')[0]);

		// 		return true
		// 	}
		// if (nextProps.origin !== nextState.origin) {
		// 	nextState.origin = nextProps.origin;
		// } else if (nextProps.destination !== nextState.destination) {
		// 	nextState.destination = nextProps.destination;
		// } else if (nextProps.pieces !== nextState.pieces) {
		// 	nextState.pieces = nextProps.pieces;
		// } else if (nextProps.weight !== nextState.weight) {
		// 	nextState.weight = nextProps.weight;
		// this.mermaid_init();
		// window.mermaid.render('dummyid', this.getGraphDefinition(), this.mermaid_cli_cb, window.$('#flight_plan')[0]);

		// 	return true;
		// }

		else {
			// this.mermaid_init();
			// window.mermaid.render('dummyid', this.getGraphDefinition(), this.mermaid_cli_cb, window.$('#flight_plan')[0]);
			// window.swal_info("Wait we are finding the path");
			return true;
		}
		// window.swal_info("Connection Break!!!"+'\n'+"Wait we are trying to reconnect your server");
	}

	mermaid_init = () => {
		window.mermaid.initialize({
			securityLevel: 'loose',
			theme: 'forest',
			arrowMarkerAbsolute: false,
			startOnLoad: false,
			flowchart: {
				htmlLabels: true,
				curve: 'linear'	//	linear, basis, cardinal
			},
			sequence: {
				useMaxWidth: true,
			},
		});
	}

	mermaid_cli_cb = (svgGraph, bindFunctions) => {
		this.setState({ svg_graph: svgGraph, bindFunctions: bindFunctions });
	};

	stationClicked = (clicked_station) => {
		// let next_station = prompt('Where do you want the cargo to fly from ' + clicked_station, '');
	}

	getGraphDefinition = () => {
		let graphDefinition = 'graph LR;';

		for (let i = 0; i < this.state.awb_legs.length; i++) {
			graphDefinition += this.getGraphPath(this.state.awb_legs[i])
		}

		return graphDefinition;
	}

	getGraphPath = (awb_leg) => {
		switch (awb_leg.status) {
			case custom.custom.database_model_enums.awb_leg_status.pending: {
				if (awb_leg.pieces > 0)
					return '\n' + awb_leg.from +
						'--' + awb_leg.flight_no + ', ' + window.moment(awb_leg.planned_departure).format("DD/MM/YYYY HH:mm") + ', ' + awb_leg.pieces + 'px, ' + awb_leg.weight + 'kg' + '-->' +
						awb_leg.to + ';' + '\n' + "style " + awb_leg.from + " fill:yellow"+'\n' + "style " + this.state.destination + " fill:white";
				else
					return '\n' + awb_leg.from + '-.' + Math.abs(awb_leg.pieces) + 'px PENDING - ' + awb_leg.from + '.->' + this.state.destination + ';' + '\n' + "style " + awb_leg.from + " fill:red" + '\n' + "style " + this.state.destination + " fill:white";
			}
				break;
			case custom.custom.database_model_enums.awb_leg_status.completed: {
				if (awb_leg.pieces > 0){
					var available = awb_leg.awbLegOps.find(ava=>ava.closing_status ==="RCF_DONE")
					
					if(available == undefined)
					{
						return '\n' + awb_leg.from +
						'--' + awb_leg.flight_no + ', ' + window.moment(awb_leg.planned_departure).format("DD/MM/YYYY HH:mm") + ', ' + awb_leg.pieces + 'px, ' + awb_leg.weight + 'kg' + '-->' +
						awb_leg.to + ';' + '\n' + "style " + awb_leg.from + " fill:#7CFC00"+'\n' + "style " + this.state.destination + " fill:white";
					}
					return '\n' + awb_leg.from +
						'--' + awb_leg.flight_no + ', ' + window.moment(awb_leg.planned_departure).format("DD/MM/YYYY HH:mm") + ', ' + awb_leg.pieces + 'px, ' + awb_leg.weight + 'kg' + '-->' +
						awb_leg.to + ';' + '\n' + "style " + awb_leg.from + " fill:#7CFC00" +'\n' + "style " + this.state.destination + " fill:#7CFC00" ;
				}
				else
					return '\n' + awb_leg.from + '-.' + Math.abs(awb_leg.pieces) + 'px PENDING - ' + awb_leg.from + '.->' + this.state.destination + ';' + '\n' + "style " + awb_leg.from + " fill:red" + '\n' + "style " + this.state.destination + " fill:red";;
			}
				break;
			case custom.custom.database_model_enums.awb_leg_status.discarded:
				return '';
				break;
		}
	}

	render() {
		if (this.state.svg_graph) {
			return (
				<div className='mermaid text-center py-5' id='flight_plan' dangerouslySetInnerHTML={{ __html: this.state.svg_graph }}>
				</div>
			)
		} else {
			return (null);
		}
	}
}