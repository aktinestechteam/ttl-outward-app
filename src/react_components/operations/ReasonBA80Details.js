import React from 'react'
function ReasonBA80Details(props) {
    // const {onChange,name,error} =props
    const onreasonChange = (e) => {
        let errors = props.errors;
        let rules = [{ tagid: 'address', text: e.target.value, regex_name: 'free_text', errmsg: 'reason is too large', min: 1 },
        { tagid: 'address', text: e.target.value, regex_name: 'free_text', errmsg: 'reason is too small', max: 50 }];
        let isValidatedReason = window.validate(rules);
                if (isValidatedReason.errmsg) {
            props.errors.closing_reason_error = isValidatedReason.errmsg;
            props.setStateReason(errors);
        } else {
            errors.closing_reason_error = '';
            props.setStateReason(errors);
            props.reason(e.target.value);
        }
    }
    const onBa80Change = (e) => {
        let errors = props.errors;
        let rules = [{ tagid: 'address', text: e.target.value, regex_name: 'free_text', errmsg: 'BA80 is too large', min: 1 },
        { tagid: 'address', text: e.target.value, regex_name: 'free_text', errmsg: 'BA80 is too small', max: 50 }];
        let isValidatedBA80 = window.validate(rules);
        console.log('isValidatedBA80 ' + JSON.stringify(isValidatedBA80));
        if (isValidatedBA80.errmsg) {
            props.errors.closing_ba80_notes_error = isValidatedBA80.errmsg;
            props.setStateBA80(errors);
        } else {
            props.errors.closing_ba80_notes_error = ' ';
            props.setStateBA80(errors);
            props.ba80_notes(e.target.value);
        }
    }

    return (
        <div className="col-md-12 my-2 row">
            <div className="col-md-6">
                <label for="capAPendingModalReasonTextarea">Reason</label>
                <textarea className="form-control rounded-0 alert-info" id="capAPendingModalReasonTextarea" rows="3"
                    onChange={onreasonChange} ></textarea>
                <label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
                    {props.closing_reason_error ? props.closing_reason_error : ""}
                </label>
            </div>
            <div className="col-md-6">
                <label for="capAPendingModalba80_notesTextarea">BA80 Notes</label>
                <textarea className="form-control rounded-0 alert-info" id="capAPendingModalba80_notesTextarea" rows="3"
                    onChange={onBa80Change} ></textarea>
                <label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
                    {props.closing_ba80_notes_error ? props.closing_ba80_notes_error : ""}
                </label>
            </div>
        </div>
    )
}
export default ReasonBA80Details


