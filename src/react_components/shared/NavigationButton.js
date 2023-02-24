import React, { useState } from 'react'
import { custom } from '../../config/custom';

function NavigationButton(props) {
    const onClickAWBNoAction = () => {
        // if tab id is not given then by default all 
        if(props.tabid === undefined)
        {
            props.MainStore.setAwbNoToShowDetails({awb_no: props.awb_no, tabid:custom.tab_name.all}); 
        }else{
            props.MainStore.setAwbNoToShowDetails({awb_no: props.awb_no, tabid: props.tabid});
        }
        
    }
   
    return (
        <>
            <span >
                <button onClick={() => { onClickAWBNoAction() }} style={{ border: "none", backgroundColor: "white" }}>{props.awb_no}</button>
            </span>
        </>
    )
}

export default NavigationButton
