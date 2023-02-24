import React, { useState } from 'react'
import OffloadMultiSelect from '../operations/OffloadMultiSelect'

function AWBKundaliCollapse(props) {
    const [openDiscardCom, setOpenDiscardCom] = useState(false)

    const onClickDiscardLeg = () => {
        let item = props.discard_id
        props.discardAWBLeg(item)
    }

    return (
        openDiscardCom ?
            (
                <div className="col-12 row">
                    <h5 className="col-md-4 m-2">To Discard This AWB Leg :  </h5>
                    <div className="col-md-6">
                        <input className="form-control form-white m-auto " name="inputReason" id={props.reason_text_id} placeholder="Enter Reason to Discard" type="text" name={props.reason_text_id} onChange={props.reasonToDiscard}></input>
                        {//this.state.errors.discard_reason_error &&
                            <label className='text-danger'>{props.errors_discard_reason_error}</label>
                        }
                        <label className="control-label" for="booklistRecordDiscardModalOffloadCodeSelect">Offload Code</label>
                        <OffloadMultiSelect offloadCallback={props.offloadCallback} />
                        {//this.state.errors.offload_error &&
                            <label className='text-danger'>{props.offload_error}</label>
                        }
                    </div>
                    <button className="col-md-2 btn btn-danger m-auto" id={props.discard_btn_id} type="button" onClick={onClickDiscardLeg}>Discard</button>
                </div>
            ) : (
                <button className="col-md-2 btn btn-danger m-auto" onClick={() => setOpenDiscardCom(true)}> Discard Booking </button>
            )
    )
}

export default AWBKundaliCollapse
