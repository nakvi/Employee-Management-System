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
} from "reactstrap";
import { Link } from "react-router-dom";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";


const SpecialLeaveEntry = () => {
  document.title = "Special Leave Entry | EMS";
  const dispatch = useDispatch();
    const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
     const { employee = {} } = useSelector((state) => state.Employee || {});
    useEffect(() => {
        dispatch(getEmployeeType());
        dispatch(getEmployee());
      }, [dispatch]);
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
                  <PreviewCardHeader
                    title="Special Leave Entry"
                    // onCancel={formik.resetForm}
                  />
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
                              {employeeType.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Employee
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              {employee.map((item) => (
                                <option key={item.EmpID} value={item.EmpID}>
                                  {item.EName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                      
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Application No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Application No"
                            />
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="Date"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Leave Type
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="0">Absent</option>
                              <option value="1" selected>Present</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={6}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Remarks
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Remarks"
                            />
                          </div>
                        </Col>
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
                    <Row className="g-4 mb-3">
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
                    </Row>

                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap table-sm"
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th>Employee</th>
                            <th>Application No</th>
                            <th>Date</th>
                            <th>Leave Type</th>
                            <th>Remarks</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          <tr>
                            <td>001:Sir Amir:Hr</td>
                            <td>2462</td>
                            <td>02/02/2025</td>
                            <td>33</td>                            
                            <td>Ok</td>
                            <td>
                              <div className="d-flex gap-2">
                                <div className="edit ">
                                  <Button className="btn btn-soft-info">
                                    <i className="bx bx-edit"></i>
                                  </Button>
                                </div>
                                <div className="delete">
                                  <Button className="btn btn-soft-danger">
                                    <i className="ri-delete-bin-2-line"></i>
                                  </Button>
                                </div>
                              </div>
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

                    <div className="d-flex justify-content-end">
                      <div className="pagination-wrap hstack gap-2">
                        <Link
                          className="page-item pagination-prev disabled"
                          to="#"
                        >
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
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SpecialLeaveEntry;
