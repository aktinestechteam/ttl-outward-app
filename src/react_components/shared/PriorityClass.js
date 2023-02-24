import React from 'react'

function PriorityClass(props) {
	const { PriorityClass } = props
	let priorityClass = PriorityClass;
	let badge_text = "M";
	let badge_color = "";

	if (priorityClass == 'F_CLASS') {
		badge_text = "F";
		badge_color = " badge-info border border-info px-1 ";
	} else {
		badge_color = " badge-light border border-info ";
	}
	
	return (
		<span className={badge_color}>{badge_text}</span>
	)
}

export default PriorityClass
