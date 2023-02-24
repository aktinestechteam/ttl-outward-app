import React from 'react'
import ReactTooltip from 'react-tooltip'

function SHCButton(props) {
    let text_color = "";
	
    let awb_no_tag = props.bold ? (<strong className={text_color}>{props.shc}</strong>) : (<span className={text_color}>{props.shc}</span>)
	console.log(props);
	let SHCCodeExplanation = window.shc_records.find(data => data.code === props.shc) ?? "Ask ADMIN to add this SHC to master"
	let temp = (
				"<h4> "+SHCCodeExplanation.explanation +"</h4>");
  return (
    <>
         {temp
				? <button data-tip={temp} data-html={true} className="btn btn-xs btn-outline-info" id="ts-info" type="button" key={props.index}>{awb_no_tag}</button>
				: <button>{awb_no_tag}</button>
			}
			<ReactTooltip html={true} delayShow={0}/>
    </>
  )
}

export default SHCButton
