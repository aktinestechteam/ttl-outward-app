import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip';

function AWBNumber(props) {
	let text_color = "";
	let awbNumber = props.awb_no;
	let validAWBNumber = awbNumber.substring(3);
	let divident = Number(validAWBNumber.slice(0,7));
	let reminder = (Number(validAWBNumber.slice(7)));
	let priorityClass = props.priority_class;
	let badge_text = "M";
	let badge_color = "";
	if(priorityClass == 'F_CLASS') {
		badge_text = "F";
		badge_color = " badge-info ";
	} else {
		badge_color = " badge-light border border-info ";
	}

	if((divident % 7) != reminder){
		console.log('right');
		text_color = "text-danger";
	}

	let awb_no_tag = props.bold ? (<strong className={text_color}>{props.awb_no}</strong>) : (<span className={text_color}>{props.awb_no}</span>)
	
	return(
		<>
			<span className={badge_color + "badge-xs mx-1 p-1 my-auto"}>{badge_text}</span>
			{props.tooltipData 
				? <span data-tip={props.tooltipData} data-html={true}>{awb_no_tag}</span>
				: <span>{awb_no_tag}</span>
			}
			<ReactTooltip html={true} delayShow={350}/>
		</>
	);
}

export default AWBNumber;