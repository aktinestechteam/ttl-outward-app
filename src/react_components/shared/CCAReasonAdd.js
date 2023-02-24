import React, { useState } from 'react'

function CCAReasonAdd() {
    const [ccaReasonAll, setCCAReasonAll] = useState([]);
    const [allCCAReferanceRecord, setAllCCAReferanceRecord] = useState([]);
    const handleRailCardCLick = () => {
        let id = Math.floor(Math.random() * 1000000);
        setCCAReasonAll([
            ...ccaReasonAll,
            {
                reason: window.ccareasons[0].reason,
                subreason1: window.ccareasons[0].subreason1[0],
                subreason2: window.ccareasons[0].subreason2[0],
                subreason3: window.ccareasons[0].subreason3[0],
                id
            }
        ]);
        setAllCCAReferanceRecord([
            ...allCCAReferanceRecord,
            {
                subreason1: window.ccareasons[0].subreason1,
                subreason2: window.ccareasons[0].subreason2,
                subreason3: window.ccareasons[0].subreason3,
                id
            }
        ]);
    };

    const handleSelectCCAReason= (event) => {
        const index = event.target.getAttribute("data-index");
        let value = event.target.value;

        let singleReason = window.ccareasons.filter(ccareason => {
            if (ccareason.reason === value) {
                return ccareason
            }
        })
        const updatedCCAReasonAll =
        allCCAReferanceRecord &&
        allCCAReferanceRecord.map((i) => {
                if (i.id === +index) {
                    i.subreason1 = singleReason[0].subreason1
                    i.subreason2 = singleReason[0].subreason2
                    i.subreason3 = singleReason[0].subreason3
                }
                return i;
            });
            setAllCCAReferanceRecord(updatedCCAReasonAll);

        const updatedRailCards =
        ccaReasonAll &&
        ccaReasonAll.map((i) => {
                if (i.id === +index) {
                    i.reason = value;
                    i.subreason1 = singleReason[0].subreason1[0];
                    i.subreason2 = singleReason[0].subreason2[0];
                    i.subreason3 = singleReason[0].subreason3[0]
                }
                return i;
            });
            setCCAReasonAll(updatedRailCards);
    };
    
    const handleSelectSubreason1 = (event) => {
        const index = event.target.getAttribute("data-index");
        const subreason1 = event.target.value;
        const updatedCCAReason =
        ccaReasonAll &&
        ccaReasonAll.map((i) => {
                if (i.id === +index) {
                    i.subreason1 = subreason1;
                }
                return i;
            });
            setCCAReasonAll(updatedCCAReason);
    };

    const handleCCAReasonSubreason2 = (event) => {
        const index = event.target.getAttribute("data-index");
        const subreason2 = event.target.value;
        const updatedCCAReason =
        ccaReasonAll &&
        ccaReasonAll.map((i) => {
                if (i.id === +index) {
                    i.subreason2 = subreason2;
                }
                return i;
            });
            setCCAReasonAll(updatedCCAReason);
    };

    const handleCCAReasonSubreason3 = (event) => {
        const index = event.target.getAttribute("data-index");
        const subreason3 = event.target.value;
        const updatedCCAReason =
        ccaReasonAll &&
        ccaReasonAll.map((i) => {
                if (i.id === +index) {
                    i.subreason3 = subreason3;
                }
                return i;
            });
            setCCAReasonAll(updatedCCAReason);
    };

    const handleRemoveCCAReason = (id) => {
        const updatedCCAReason = ccaReasonAll && ccaReasonAll.filter((r) => r.id !== id);
        setCCAReasonAll(updatedCCAReason);
        const updatedCCAReasonAll = allCCAReferanceRecord && allCCAReferanceRecord.filter((r) => r.id !== id);
        setAllCCAReferanceRecord(updatedCCAReasonAll);
    };
// alert(JSON.stringify(allCCAReferanceRecord))
    console.log("xx", ccaReasonAll);
    return (
        <div>
            <label className="col-md-12">Select CCA Reason</label>
            
                <table className="table-sm w-100">
                    <thead>
                        <th>#</th>
                        <th>Reason</th>
                        <th>Sub Reason 1</th>
                        <th>Sub Reason 2</th>
                        <th>Sub Reason 3</th>
                    </thead>

                    {ccaReasonAll &&
                        ccaReasonAll.map(({ id }) => (
                        <tr key={id}>
                            <td>
                                <button type="button" className="btn" onClick={() => handleRemoveCCAReason(id)}><i class="far fa-trash-alt"></i></button>
                            </td>
                            <td>
                                <select  className="form-control "style={{width:"150px"}} data-index={id} onChange={handleSelectCCAReason}>
                                    {window.ccareasons.map(({ value, reason }) => (
                                        <option key={value} defaultValue={value}>
                                            {reason}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                {(allCCAReferanceRecord.filter((item) => { return Number(item.id) === id }).map(({ subreason1 }) => subreason1.length > 0 ?

                                    <select  className="form-control" style={{width:"150px"}} data-index={id} onChange={handleSelectSubreason1} >
                                        {allCCAReferanceRecord.filter((item) => { return Number(item.id) === id }).map(({ value, subreason1 }) => (subreason1.map((item, index) => (
                                            <option key={item} defaultValue={item}>
                                                {item}
                                            </option>))))}
                                    </select>
                                    : ""))
                                }
                            </td>
                            <td>

                                {(allCCAReferanceRecord.filter((item) => { return Number(item.id) === id }).map(({ subreason2 }) => subreason2.length > 0 ?

                                    <select  className="form-control" style={{width:"150px"}} data-index={id}  onChange={handleCCAReasonSubreason2} >
                                        {allCCAReferanceRecord.filter((item) => { return Number(item.id) === id }).map(({ value, subreason2 }) => (subreason2.map((item, index) => (
                                            <option key={item} defaultValue={item}>
                                                {item}
                                            </option> ))))}
                                    </select>
                                    : ""))
                                }
                            </td>
                            <td>
                                {(allCCAReferanceRecord.filter((item) => { return Number(item.id) === id }).map(({ subreason3 }) => subreason3.length > 0 ?

                                     <select className="form-control w-20" data-index={id} onChange={handleCCAReasonSubreason3} >
                                        {allCCAReferanceRecord.filter((item) => { return Number(item.id) === id }).map(({ value, subreason3 }) => (subreason3.map((item, index) => (
                                            <option key={item} defaultValue={item}>
                                                {item}
                                            </option>))))}
                                    </select>
                                    : ""))
                                }
                            </td>
                        </tr>))}  
                        <tr>
                            <td>
                                <button type="button" className="btn" onClick={handleRailCardCLick} >
                                    <i class="fas fa-plus"></i>
                                </button>
                            </td>
                        </tr>
                </table>
                <br />
        </div>
    )
}

export default CCAReasonAdd
