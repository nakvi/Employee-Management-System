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
import PreviewCardHeaderReport from "../../../Components/Common/PreviewCardHeaderReport";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getSalaryBank } from "../../../slices/setup/salaryBank/thunk";


const SalaryReport = () => {
  const handleFetch = () => {
    console.log("Fetching Report...");
  };

  const handleGeneratePDF = () => {
    console.log("Generating PDF...");
  };

  const handleCancel = () => {
    console.log("Cancelling...");
  };

  document.title = "Salary Report | EMS";

  const dispatch = useDispatch();
  const { location = [] } = useSelector((state) => state.Location || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { designation = [] } = useSelector((state) => state.Designation || {});
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});

  const { employee = [] } = useSelector((state) => state.Employee || {});
  // const { salaryBank = [] } = useSelector((state) => state.salaryBank || {});
  const { loading, error, salaryBank } = useSelector(
    (state) => state.SalaryBank
  );
  // console.log("Salary Bank Data:", salaryBank);

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getDesignation());
    dispatch(getLocation());
    dispatch(getSalaryBank());
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
                  <PreviewCardHeaderReport title="Salary Report"
                    onFetch={handleFetch}
                    onGeneratePDF={handleGeneratePDF}
                    onCancel={handleCancel}
                  />

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
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              HOD
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
                        <Col xxl={2} md={3}>
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
                              {location.map((item) => (
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
                              Department
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              {departmentList.map((item) => (
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
                              Designation
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              {designation.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
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
                              Salary Bank
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              {salaryBank.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Month From
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VName"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Month To
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VName"
                            />
                          </div>
                        </Col>
                        <Col xxl={4} md={9}>
                          <div className="mb-3 mt-2">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Report Heading
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Report Heading"
                            />
                          </div>
                        </Col>
                      </Row>
                      {/* Heading */}

                      {/* checkbox grid */}
                      <Row style={{ border: "1px dotted lightgray" }}>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              WithOverTime
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              IsManager
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              ShiftEmployee
                            </Label>
                          </div>
                        </Col>
                      </Row>
                      {/* Optional grid */}
                      <Row>
                        <Row>
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
                              Salary Sheet
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
                              Final Settlement
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
                              Stop Salary
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
                              Salary All
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
                              Summary Sheet
                            </Label>
                          </div>
                        </Col>
                      </Row>
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
                              Final Settlement Summary
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
                              Stop Salary Summary
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
                              Salary All Summary
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
                              Payment Slip English
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
                              Payment Slip Urdu
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
                              Salary History
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
                              OT Sheet
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
                              OT Sheet OFF
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
                              OT Sheet AL
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
                              OT Summary
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
                              OT Summary OFF
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
                              OT Summary ALL
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
                              Emp Final Settlement
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
                              Final Settlement Format
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
                              Attendance Allowance
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
                              Bonus Sheet
                            </Label>
                          </div>
                        </Col>
                      {/* </Row> */}
                      {/* Second Grid */}
                      {/* <Row> */}
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
                              Arrears Sheet
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
                              Increment List
                            </Label>
                          </div>
                        </Col>
                        <Row> 
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
                                Allows / Deduction list
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
                                Allows / Deduction Summary
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
                                Gratuity Details
                              </Label>
                            </div>
                          </Col>
                        </Row>
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
                              Hygiene Card Format
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
                              EOBI Contribution
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
                              SS Contribution
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

export default SalaryReport;
