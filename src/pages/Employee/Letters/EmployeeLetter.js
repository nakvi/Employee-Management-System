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
import PreviewCardHeader4 from "../../../Components/Common/PreviewCardHeader4";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";


const EmployeeLetter = () => {
  document.title = "Employee Letter | EMS";
  const dispatch = useDispatch();

  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { location = [] } = useSelector((state) => state.Location || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];

  useEffect(() => {
    dispatch(getLocation());
    dispatch(getDepartment());
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
                  <PreviewCardHeader4 title="Employee Letter" />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={3}>
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
                            </select>
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Location
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
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
                              {departmentList.length > 0 ? (
                                departmentList.map((dept) => (
                                  <option key={dept.VID} value={dept.VID}>
                                    {dept.VName || dept.DepartmentName || dept.title}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No departments available</option>
                              )}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Print Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VName"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={6}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Letter Text
                            </Label>
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea5"
                              rows="2"
                              spellcheck="false"
                            ></textarea>
                          </div>
                        </Col>
                      </Row>
                      {/* Optional grid */}
                      <Row >
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                              checked
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                              Appointment
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                              Confirmation
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                              Promotion
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                              Probationary Term & condition
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                              Experience
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                              Increment
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                              Clearence certificate
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                              Employee Agreement
                            </Label>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EmployeeLetter;
