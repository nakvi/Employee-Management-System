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
import PreviewCardHeader2 from "../../../Components/Common/PreviewCardHeader2";
const AttendanceEntry = () => {
  document.title = "Attendance Entry | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>} */}
          <Row>
            <Col lg={12}>
              <Card>
                <Form>
                  <PreviewCardHeader2 title="Attendance Entry" />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              E-Type
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">Staf</option>
                              <option value="Choices2">Worker</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Department
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">IT</option>
                              <option value="Choices2">Software</option>
                            </select>
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VName"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div className="d-flex gap-4 mt-3">
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                             For In
                            </Label>
                          </div>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                             For Out
                            </Label>
                          </div>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                            Both
                            </Label>
                          </div>
                          </div>
                        </Col>
                        {/* <Col xxl={2} md={1} className="mt-4">
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                             For In
                            </Label>
                          </div>
                        </Col>

                        <Col xxl={2} md={1} className="mt-4 ">
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VOUT"
                              name="VType"
                              value="VOUT"
                            />
                            <Label className="form-check-label" htmlFor="VOUT">
                             For Out
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={1} className="mt-4">
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="BOTH"
                              name="VType"
                              value="BOTH"
                            />
                            <Label className="form-check-label" htmlFor="BOTH">
                              Both
                            </Label>
                          </div>
                        </Col> */}
                      </Row>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="Location-table" id="customerList">
                    {/* <Row className="g-4 mb-3">
                      <Col className="col-sm">
                        <div className="d-flex justify-content-sm-end">
                          <div className="search-box ms-2">
                            <input
                              type="text"
                              className="form-control-sm search"
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>
                      </Col>
                    </Row> */}

                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap table-sm"
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th>Sr #</th>
                            <th>Employee</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Remarks</th>
                            <th>
                              <Input
                                className="form-check-input me-1"
                                type="checkbox"
                              />
                              Post
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          <tr>
                            <td>1</td>
                            <td>001:Sir Amir:Hr</td>
                            <td>
                              <Input
                                type="time"
                                className="form-control form-control-sm"
                                id="VIN"
                                name="VType"
                              />
                            </td>

                            <td>
                              {" "}
                              <Input
                                type="time"
                                className="form-control form-control-sm "
                                id="VIN"
                                name="VType"
                              />
                            </td>
                            <td>
                              <Input
                                className="form-control-sm w-75"
                                type="text"
                              />
                            </td>
                            <td>
                              <Input
                                className="form-check-input"
                                type="checkbox"
                              />
                            </td>
                          </tr>
                        </tbody>
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
                          <p className="text-muted mb-0">
                            We've searched more than 150+ Orders We did not find
                            any orders for you search.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AttendanceEntry;
