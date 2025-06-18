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
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";

const MonthlyAttendanceReport = () => {
  const SingleOptions = [
    { value: "Choices 1", label: "Choices 1" },
    { value: "Choices 2", label: "Choices 2" },
    { value: "Choices 3", label: "Choices 3" },
    { value: "Choices 4", label: "Choices 4" },
  ];
  const [selectedMulti, setselectedMulti] = useState(null);
  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti);
  }


  const handleFetch = () => {
    console.log("Fetching Report...");
  };

  const handleGeneratePDF = () => {
    console.log("Generating PDF...");
  };

  const handleCancel = () => {
    console.log("Cancelling...");
  };

  document.title = "Monthly Attendance Report | EMS";

  const dispatch = useDispatch();
  const { location = [] } = useSelector((state) => state.Location || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { designation = [] } = useSelector((state) => state.Designation || {});
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});

  const { employee = [] } = useSelector((state) => state.Employee || {});

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getDesignation());
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
                  <PreviewCardHeaderReport
                    title="Monthly Attendance Report"
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
                            <Select
                              value={selectedMulti}
                              isMulti={true}
                              onChange={() => {
                                handleMulti();
                              }}
                              options={departmentList.map((item) => ({
                                value: item.VID,
                                label: item.VName,
                              }))}
                            />
                            {/* <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">IT</option>
                              <option value="Choices2">Software</option>
                            </select> */}
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

                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Date From
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VName"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Date To
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VName"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Salaray Range From
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Salary Range From"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Salaray Range To
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Salary Range To"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Salaray Percentage
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Salary Percentage"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={9}>
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
                              Attendance Card
                            </Label>
                          </div>
                        </Col>
                        {/* <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                              Attendance Card (PDF)
                            </Label>
                          </div>
                        </Col> */}
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
                              Attendance Card Salary
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
                              Attendance Sheet
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
                              Attendance Summary
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
                              Latecomers
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
                              Absentee List
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
                              OT List
                            </Label>
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3 " dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="VIN"
                              name="VType"
                              value="VIN"
                            />
                            <Label className="form-check-label" htmlFor="VIN">
                              Leave List
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
                              Leave Balance
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
                              Leaves of Employee
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
                              Leave Balance Month Wise
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
                              Monthly Hrs
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
                              Roster
                            </Label>
                          </div>
                        </Col>
                      </Row>
                      {/* checkbox grid */}
                      <Row className="align-items-center mt-2 mb-2" style={{ borderTop: "1px dotted #ccc", paddingTop: "10px" }}>
                        <Col xs="auto">
                          <strong style={{ fontSize: "14px" }}>Export</strong>
                        </Col>
                        
                        <Col xs="auto">
                          <div className="form-check form-check-inline">
                            <Input className="form-check-input" type="radio" id="exportAttendanceLog" />
                            <Label className="form-check-label" for="exportAttendanceLog">Attendance Log</Label>
                          </div>
                        </Col>
                        
                        <Col xs="auto">
                          <div className="form-check form-check-inline">
                            <Input className="form-check-input" type="radio" id="exportCard" />
                            <Label className="form-check-label" for="exportCard">Card</Label>
                          </div>
                        </Col>
                        
                        <Col xs="auto">
                          <div className="form-check form-check-inline">
                            <Input className="form-check-input" type="radio" id="exportDuplicateLeaves" />
                            <Label className="form-check-label" for="exportDuplicateLeaves">Duplicate Leaves</Label>
                          </div>
                        </Col>
                        
                        <Col xs="auto">
                          <div className="form-check form-check-inline">
                            <Input className="form-check-input" type="radio" id="exportABHDWO" />
                            <Label className="form-check-label" for="exportABHDWO">Att with AB/HD/WO</Label>
                          </div>
                        </Col>
                      </Row>

                      {/* <Row style={{ border: "1px dotted lightgray" }}>
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
                              Attendance Log
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
                              Card
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
                              Duplicate Leaves
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
                              Att with AB/HD/WO
                            </Label>
                          </div>
                        </Col>
                      </Row> */}
                      {/* Optional grid */}
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

export default MonthlyAttendanceReport;
