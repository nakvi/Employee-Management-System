import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Input,
  Label,
  Form,
  CardHeader,
} from "reactstrap";
import { Link } from "react-router-dom";

const RenderTable = ({ selectedOption }) => {
  // Define table fields based on the selected option
  const getTableFields = () => {
    switch (selectedOption) {
      case "Unposted":
        return (
          <>
            <thead className="table-light">
              <tr>
                <th>Sr No</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody className="list form-check-all">
              <tr>
                <td>1</td>
                <td>001:Sir Amir:Hr</td>
                <td>IT</td>
                <td>Developer</td>
                <td>5:01</td>
                <td>10:00</td>
                <td>Ok</td>
              </tr>
            </tbody>
          </>
        );
      case "Posted":
        return (
          <>
            <thead className="table-light">
              <tr>
                <th>Sr No</th>
                <th>Employee</th>
                <th>Date</th>
                <th>Late Time</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="list form-check-all">
              <tr>
                <td>1</td>
                <td>001:Sir Amir:Hr</td>
                <td>02/02/2025</td>
                <td>5000</td>
                <td>1200</td>
                <td>ok</td>
              </tr>
            </tbody>
          </>
        );
      // Add more cases for other options
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <Col lg={12}>
        <Card>
          <CardBody>
            <div className="Location-table" id="customerList">
              <Row className="g-4 mb-3">
                <Col className="col-sm">
                  <div className="d-flex justify-content-sm-end">
                    <div className="search-box ms-2">
                      <input type="text" className="form-control-sm search" />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="table-responsive table-card mt-3 mb-1">
                <table
                  className="table align-middle table-nowrap table-sm"
                  id="customerTable"
                >
                  {getTableFields()}
                </table>
                <div className="noresult" style={{ display: "none" }}>
                  <div className="text-center">
                    <lord-icon
                      src="https://cdn.lordicon.com/msoeawqm.json"
                      trigger="loop"
                      colors="primary:#121331,secondary:#08a88a"
                      style={{ width: "75px", height: "75px" }}
                    ></lord-icon>
                    <h5 className="mt-2">Sorry! No Result Found</h5>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <div className="pagination-wrap hstack gap-2">
                  <Link className="page-item pagination-prev disabled" to="#">
                    Previous
                  </Link>
                  <ul className="pagination Location-pagination mb-0"></ul>
                  <Link className="page-item pagination-next" to="#">
                    Next
                  </Link>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default RenderTable;
