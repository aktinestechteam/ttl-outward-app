import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

const AddNewStation = (props) => {
  return (
    <Modal {...props} size="md" style={{ marginTop: "2%" }}>
      <Modal.Header closeButton>
        <Modal.Title>
          {" "}
          <h4>
            <i
              className="mdi mdi-airplane"
              id="outwardcargo_airport_list_add_new_city_modal_title"
            ></i>
            &nbsp; Add New Station
          </h4>
          <Button
            className="close"
            type="button"
            onClick={() => props.onHide()}
          >
            ×
          </Button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <Form>
              <Form.Label className="control-label">IATA Code</Form.Label>
              <Form.Control
                className="form-control form-white"
                id="outwardcargo_airport_list_iata_code_input"
                placeholder="Enter IATA Code"
                type="text"
                name="outwardcargo_airport_list_iata_code_input"
                autoComplete="off"
                required=""
              />
            </Form>
          </Col>
          <Col md={6}>
            <Form>
              <Form.Label className="control-label">City Name</Form.Label>
              <Form.Control
                className="form-control form-white"
                id="outwardcargo_airport_list_city_name_input"
                placeholder="Enter City Name"
                type="text"
                name="outwardcargo_airport_list_city_name_input"
                autoComplete="off"
                required=""
              />
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form>
              <Form.Label className="control-label">Country Name</Form.Label>
              <Form.Control
                className="form-control form-white"
                id="outwardcargo_airport_list_country_input"
                placeholder="Enter Country Name"
                type="text"
                name="outwardcargo_airport_list_iata_code_input"
                autoComplete="off"
                required=""
              />
            </Form>
          </Col>
          <Col md={6}>
            <Form>
              <Form.Label className="control-label">Time Zone</Form.Label>
              <select
                className="select2 form-control custom-select"
                id="outwardcargo_airport_list_timezone_input_modal"
                placeholder="Select TimeZone"
                type="text"
                name="outwardcargo_airport_list_timezone_input_modal"
                autoComplete="off"
                required=""
              ></select>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col lg={4}></Col>
          <Form>
            <ul className="list-style-none">
              <li
                style={{
                  paddingTop: 16,
                  paddingRight: 16,
                  paddingLeft: 16,
                }}
              >
                <Form.Check type="checkbox" label="Is outward Destination" onChange={()=>{}} />

              </li>
            </ul>
          </Form>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn btn-info waves-effect waves-light save-category"
          type="button"
          onClick={() => props.onHide()}
        >
          <i class="fa fa-edit" aria-hidden="true"></i>&nbsp;&nbsp;Save
        </Button>
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
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewStation;
