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
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";

const SalaryPosting = () => {
  document.title = "Salary Posting | EMS";

  const dispatch = useDispatch();
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { location = [] } = useSelector((state) => state.Location || {});

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getLocation());
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
                  {/* <PreviewCardHeader2 title="Salary Posting " /> */}
                  {/* <CardHeader className="align-items-center d-flex py-2">
                    <h4 className="card-title mb-0 flex-grow-1">Salary Posting</h4>
                    <div className="d-flex flex-wrap">
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                        id="create-btn"
                      >
                        <i className="align-bottom me-1"></i>Posting
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i>To Final
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i>To Salary
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i>Update Salary
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i>Update Old Salary
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"

                      >
                        <i className="align-bottom me-1"></i>Year Posting
                      </Button>
                      <Button
                        type="submit"
                        color="danger"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i>Delete Salary
                      </Button>
                      <Button color="dark" className="add-btn me-1 py-1">
                        <i className="align-bottom me-1"></i> Cancel
                      </Button>
                    </div>
                  </CardHeader> */}
                  <CardHeader className="py-2">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="card-title mb-0">Salary Posting</h4>
                      <div className="d-flex">
                        <Button
                          type="submit"
                          color="success"
                          className="add-btn me-1 py-1"
                          id="create-btn"
                        >
                          <i className="align-bottom me-1"></i>Posting
                        </Button>
                        <Button color="dark" className="add-btn me-1 py-1">
                          <i className="align-bottom me-1"></i>Cancel
                        </Button>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap justify-content-end">
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i>To Final
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i>To Salary
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i>Update Salary
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i>Update Old Salary
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i>Year Posting
                      </Button>
                      <Button
                        type="submit"
                        color="danger"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i>Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4 ">
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
                        <Col xxl={2} md={3}>
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
                              {/* <option value="Choices1">Staf</option>
                              <option value="Choices2">Worker</option> */}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="locationInput" className="form-label">
                              Location
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="location"
                              id="locationInput"
                            // value={formData.location}
                            // onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
                              {location.length > 0 ? (
                                location.map((loc) => (
                                  <option key={loc.VID} value={loc.VID}>
                                    {loc.VName || loc.LocationName || loc.title}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No locations available</option>
                              )}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Month
                            </Label>
                            <Input
                              type="month"
                              className="form-control-sm"
                              id="VName"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2} className="mt-4">
                          <div className="form-check mb-2 mt-3 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              Retain Old Salary
                            </Label>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>
            {/* <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="Location-table" id="customerList">
                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap table-sm"
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th>Sr #</th>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>
                              <Input
                                className="form-check-input me-1"
                                type="checkbox"
                              />
                              Select ALL
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          <tr>
                            <td>1</td>
                            <td>001:Sir Amir:Hr</td>
                            <td>	zeta solutions  </td>

                            <td>SOftware Developer</td>
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
            </Col> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SalaryPosting;
