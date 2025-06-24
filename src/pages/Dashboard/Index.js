import React, { useState } from "react";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import Widget from "./Widgets";
import Flatpickr from "react-flatpickr";
import TileBoxs from "./TileBoxs";
import { Link } from "react-router-dom";
import TableHeader from "../../Components/Common/TableHeader";
import DepartmentChart from "./DepartmentChart";

const Dashboard = () => {
  document.title = "Dashboard | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="mb-3 pb-1">
            <Col xs={12}>
              <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                <div className="flex-grow-1">
                  <h4 className="fs-16 mb-1">Good Morning, Anna!</h4>
                  <p className="text-muted mb-0">
                    Here's what's happening with your store today.
                  </p>
                </div>
                <div className="mt-3 mt-lg-0">
                  <form action="#">
                    <Row className="g-3 mb-0 align-items-center">
                      <div className="col-sm-auto">
                        <div className="input-group">
                          <Flatpickr
                            className="form-control border-0 dash-filter-picker shadow"
                            options={{
                              mode: "range",
                              dateFormat: "d M, Y",
                              defaultDate: ["01 Jan 2022", "31 Jan 2022"],
                            }}
                          />
                          <div className="input-group-text bg-primary border-primary text-white">
                            <i className="ri-calendar-2-line"></i>
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <button type="button" className="btn btn-success ">
                          Apply Filter
                        </button>
                      </div>
                    </Row>
                  </form>
                </div>
              </div>
            </Col>
          </Row>
           <Row>
              <Col>
                <div className="h-100">
                  <Row>
                    <TileBoxs />
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <Card>
                        <TableHeader title="Department Strength-Month Wise"  />
                        <CardBody>
                          <div className="Location-table" id="customerList">
                            <div className="table-responsive table-card mb-1">
                              <table
                                className="table align-middle table-nowrap table-sm"
                                id="customerTable"
                              >
                                <thead className="table-light">
                                  <tr>
                                    <th>Employee</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Remarks</th>
                                  </tr>
                                </thead>
                                <tbody className="list form-check-all">
                                  <tr>
                                    <td>02/02/2025</td>
                                    <td>02/02/2025</td>
                                    <td>02/02/2025</td>
                                    <td>ok</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg={6}>
                      <Card>
                        <TableHeader title="Department Strength-Month Wise"  />
                        <CardBody>
                          <div className="Location-table" id="customerList">
                            <div className="table-responsive table-card mb-1">
                              <table
                                className="table align-middle table-nowrap table-sm"
                                id="customerTable"
                              >
                                <thead className="table-light">
                                  <tr>
                                    <th>Employee</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Remarks</th>
                                  </tr>
                                </thead>
                                <tbody className="list form-check-all">
                                  <tr>
                                    <td>02/02/2025</td>
                                    <td>02/02/2025</td>
                                    <td>02/02/2025</td>
                                    <td>ok</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <Card>
                        <TableHeader title="Department Strength-Month Wise"  />
                        <CardBody>
                          <div className="Location-table" id="customerList">
                            <div className="table-responsive table-card mb-1">
                              <table
                                className="table align-middle table-nowrap table-sm"
                                id="customerTable"
                              >
                                <thead className="table-light">
                                  <tr>
                                    <th>Employee</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Remarks</th>
                                  </tr>
                                </thead>
                                <tbody className="list form-check-all">
                                  <tr>
                                    <td>02/02/2025</td>
                                    <td>02/02/2025</td>
                                    <td>02/02/2025</td>
                                    <td>ok</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                   <Row>
                  <Col lg={12} >
                    <Card>
                      <TableHeader title="Department Strength-Month Wise" />
                      <CardBody >
                        <DepartmentChart />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                </div>
              </Col>
            </Row>
          {/* <Row>
            <Col>
              <div className="h-100">
                <Row>
                  <TileBoxs />
                </Row>
                
                <Row>
                  <Col lg={12} >
                    <Card>
                      <TableHeader title="Department Strength-Month Wise" />
                      <CardBody >
                        <DepartmentChart />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                
              </div>
            </Col>
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;