import React from 'react'

function Ba80com() {
	return (
		<div>
			<div className="col-md-12 my-2 row">
				<div className="col-md-6">
					<label for="capAPendingModalReasonTextarea">Reason</label>
					<textarea className="form-control rounded-0" id="capAPendingModalReasonTextarea" rows="3" onChange={this.reason}></textarea>
				</div>
				<div className="col-md-6">
					<label for="capAPendingModalba80_notesTextarea">BA80 Notes</label>
					<textarea className="form-control rounded-0" id="capAPendingModalba80_notesTextarea" rows="3" onChange={this.ba80_notes}></textarea>
				</div>
			</div>
		</div>
	)
}

export default Ba80com
