import React from 'react'

function PiecesWeightDetails(props) {
    const handlePiecesChange =(e)=>{
        let errors = props.errors;
        let validationRules = [{ text: e.target.value, regex_name: 'min_number', errmsg:'Please enter minimum 1 Piece', min: 1, required: true },
        { text: e.target.value, regex_name: 'max_number', errmsg: `Please enter maximum ${props.awb_leg_pieces} Piece`, max: `${props.awb_leg_pieces}`, required: true }];
		
        let isValidatedPieces = window.validate(validationRules);
        if (isValidatedPieces.errmsg) {
			props.errors.pieces_error = isValidatedPieces.errmsg;
            props.setStateReason(errors);
		} else {
			props.errors.pieces_error = '';
            props.setStateReason(errors);
            props.pieces(e.target.value);
		}
    }
        const handleWeightChange = (e)=>{
            let errors = props.errors;
            let validationRules = [{ text: e.target.value, regex_name: 'min_number', errmsg: 'Please enter weight more than 0.1Kg.', min: 0.1, required: true },
            // { text: e.target.value, regex_name: 'max_number', errmsg: `Please enter maximum ${props.awb_leg_pieces} Piece`, max: `${props.awb_leg_pieces}`, required: true }
        ];
            
            let isValidatedWeight = window.validate(validationRules);
            if (isValidatedWeight.errmsg) {
                props.errors.weight_error = isValidatedWeight.errmsg;
                props.setStateReason(errors);
            } else {
                props.errors.weight_error = '';
                props.setStateReason(errors);
                props.weight(e.target.value);
            }
        }

  
    return (
        <div>
           
            <div className="row">
                <div className="col-md-6" id="rcfPendingModalPieces">
                    <label className="control-label">Pieces</label>
                    <input className="form-control form-white" id="rcfPendingModalPiecesInput" placeholder="Enter Total Pieces Received" type="text" name="rcfPendingModalPiecesInput" autocomplete="off" required="" 
                    onChange={handlePiecesChange}
                     />
                </div>
                <div className="col-md-6" id="rcfPendingModalWeight">
                    <label className="control-label">Weight</label>
                    <input className="form-control form-white" id="rcfPendingModalWeightInput" placeholder="Enter Total Weight Received" type="text" name="rcfPendingModalWeightInput" autocomplete="off" required=""
                   
                     onChange={handleWeightChange}
                      />
                </div>
            </div>
            <div className="row">
                <label className="col-md-6 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
                    {props.pieces_error ? props.pieces_error : ""}
                </label>
                <label className="col-md-6 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
                    {props.weight_error ? props.weight_error : ""}
                </label>
            </div>


        </div>
    )
}


export default PiecesWeightDetails
