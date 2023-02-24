import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

const AddNewSHC = (props) => {

  return (
	<Modal {...props} size="md">
	  <Modal.Header closeButton>
		<Modal.Title>
		  {" "}
		  <h4 className="modal-title">
			<i className="mdi mdi-tag-plus">&nbsp; Add SHC Code</i>
		  </h4>
		</Modal.Title>
	  </Modal.Header>
	  <Modal.Body>
		<Row>
		  <Col md={6}>
			<Form>
			  <Form.Label class="control-label">SHC Code</Form.Label>
			  <Form.Control
				class="form-control form-white"
				placeholder="Enter SHC Code"
				type="text"
				autocomplete="off"
				required=""
			  />
			</Form>
		  </Col>
		  <Col md={6}>
			<Form>
			  <Form.Label class="control-label">Explanation</Form.Label>
			  <Form.Control
				class="form-control form-white"
				placeholder="Enter City Name"
				type="text"
				autocomplete="off"
				required=""
			  />
			</Form>
		  </Col>
		</Row>
	  </Modal.Body>
	  <Modal.Footer>
		<div class="modal-footer">
		  <button
			class="btn btn-info waves-effect waves-light save-category"
			id="outwardcargo_shc_list_id_save"
			type="button"
			name="outwardcargo_shc_list_id_save"
			onClick={() => props.onHide()}
		  >
			<i class="fa fa-edit" aria-hidden="true"></i>&nbsp;&nbsp;Save
		  </button>
		  <button
			class="btn btn-secondary waves-effect"
			type="button"
			onClick={() => props.onHide()}
		  >
			<i class="fa fa-times-circle" aria-hidden="true"></i>
			&nbsp;&nbsp;Close
		  </button>
		  <button
			class="btn btn-danger waves-effect waves-light save-category"
			id="outwardcargo_shc_list_shc_delete"
			type="button"
			name="outwardcargo_shc_list_shc_delete"
			onClick={() => props.onHide()}
		  >
			<i class="fa fa-trash" aria-hidden="true"></i>&nbsp;&nbsp;Delete
		  </button>
		</div>
	  </Modal.Footer>
	</Modal>
  );
};

export default AddNewSHC;
