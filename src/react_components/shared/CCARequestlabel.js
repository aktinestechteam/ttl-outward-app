import React from 'react'
import custom from '../../config/custom.js';

function CCARequestlabel(props) {
  
  let url = process.env.REACT_APP_API_BASE_PATH + "/viewccaform/" + props.ccaRequestDetailsRecords.id;

  let allowToPrint = (props.ccaRequestDetailsRecords.status != custom.custom.cca_approval_status.rejected)

  return (
    <div>
      <label className="control-label">Existing CCA Records is {props.ccaRequestDetailsRecords.status}</label>
      {allowToPrint && 
        <a href={url} target="_blank"><button className="m-2 btn btn-primary btn-sm">Print</button></a>
      }
    </div>
  )
}

export default CCARequestlabel

