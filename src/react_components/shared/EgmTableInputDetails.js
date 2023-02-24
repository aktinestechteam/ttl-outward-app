import React, { useState } from 'react'

function EgmTableInputDetails(props) {

  const [egmFileRecordsvalue, setEgmFileRecordsValue] = useState(props.newEgmData);
  const [displaystrip,setDisplayStrip]=useState(false)
  const [errors, setErrors] = useState({ closing_house_pieces_error: '', closing_house_weight_error: '' })
  
  const handleChange = (e, id) => {

    if (e.target.name == "weight") {
      let validationRulesdetailed_comments = [{ text: e.target.value, regex_name: 'any_number', errmsg: ' enter valid weight', min: 0 },
      { tagid: 'address', text: e.target.value, regex_name: 'min_number', errmsg: 'weight should be 0 or more than 0', min: 0 }];

      let isValidateddetailedcomments = window.validate(validationRulesdetailed_comments);
      if (isValidateddetailedcomments.errmsg) {
        window.swal_error("Enter Number for Weight")
      } else {
        errors.closing_house_weight_error = '';
        setErrors(errors)
        const values = [...egmFileRecordsvalue];
        const { name, value } = e.target;
        values[id][name] = value;
        setEgmFileRecordsValue(values);
        props.setChangedDataofPiecesWeight(values)
      }
    }

    if (e.target.name == "pieces") {
      let validationRulesdetailed_comments = [{ text: e.target.value, regex_name: 'any_number', errmsg: ' Enter valid pieces', min: 0 },
      { tagid: 'address', text: e.target.value, regex_name: 'min_number', errmsg: 'pieces should be more than 0', min: 0 }];

      let isValidateddetailedcomments = window.validate(validationRulesdetailed_comments);
      if (isValidateddetailedcomments.errmsg) {
        window.swal_error("Enter Number for Pieces")
      } else {
        const values = [...egmFileRecordsvalue];
        const { name, value } = e.target;
        values[id][name] = value;
        setEgmFileRecordsValue(values);
        props.setChangedDataofPiecesWeight(values)
      }
    }
  }

  console.log(egmFileRecordsvalue)
  return (
    <>
      {
        props.booklistTableRecords.map((booklistTableRecord, index) => (

          <tr key={props.index}>
            <td>{index + 1}</td>
            <td value={booklistTableRecord.awb_no}>{booklistTableRecord.awb_no}</td>
            <td>{booklistTableRecord.pieces}</td>
            <td>{booklistTableRecord.weight}</td>
            <td>{booklistTableRecord.awb_no}</td>
            {egmFileRecordsvalue.map((item, id) => (
              (item.awb_no == booklistTableRecord.awb_no) ?
                <>
                  <td><input key={id} style={{ width: "50px" }} type="text" name="pieces" value={item.pieces} onChange={(e) => handleChange(e, id)} /></td>
                  <td><input type="text" key={id} style={{ width: "50px" }} name="weight" value={item.weight} onChange={(e) => handleChange(e, id)}></input></td>
                </> : ""
            ))}
            <td><i className={booklistTableRecord.awb_info.rate_check ? "fas fa-check text-success" : "fas fa-times text-danger"}></i></td>
            <td><i className={booklistTableRecord.awb_info.fdc ? "fas fa-check text-success" : "fas fa-times text-danger"}></i></td>
          </tr>
        ))
      }

    </>
  )
}

export default EgmTableInputDetails
