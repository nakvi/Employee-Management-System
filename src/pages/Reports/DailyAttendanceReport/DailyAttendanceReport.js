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
import PreviewCardHeaderReport from "../../../Components/Common/PreviewCardHeaderReport";
import RenderTable from "./RenderTable";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";


const DailyAttendanceReport = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Unposted");
  const [reportType, setReportType] = useState(""); // Stores the selected report type for fetching
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [queryString, setQueryString] = useState("");

  // Handle option change
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    // setShowTable(false); // Reset the table when option changes
  };
  const generateQueryString = (filters) => {
    let query = "cWhere = Where UserID = 1 AND LoginCompanyID = 1 AND LoginLocationID = 1 ";
    if (filters.EType && Number(filters.EType) > 0) {
      query += ` AND EType = '${filters.EType ? filters.EType : 0}'`;
    }
    if (filters.EmployeeID && Number(filters.EmployeeID) > 0) {
      query += ` AND EmployeeID = '${filters.EmployeeID ? filters.EmployeeID : 0
        }'`;
    }
    if (filters.HODID && Number(filters.HODID) > 0) {
      query += ` AND HODID = '${filters.HODID ? filters.HODID : 0}'`;
    }
    if (filters.LocationID && Number(filters.LocationID) > 0) {
      query += ` AND LocationID = '${filters.LocationID ? filters.LocationID : 0
        }'`;
    }
    if (filters.DeptID && Number(filters.DeptID) > 0) {
      query += ` AND DepartmentID = '${filters.DeptID ? filters.DeptID : 0}'`;
    }
    if (filters.DesgID && Number(filters.DesgID) > 0) {
      query += ` AND DesignationID = '${filters.DesgID ? filters.DesgID : 0}'`;
    }
    query += ` AND AttendanceDate = '${filters.Date}'`;

    // Handle OverTime explicitly as true or false
    if (filters.WithOverTime && filters.WithOverTime === true) {
      query += ` AND OverTime = 1`;
    } else if (filters.WithOverTime && filters.WithOverTime === false) {
      query += ` AND OverTime = 0`;
    }

    if (filters.IsManager && filters.IsManager === true) {
      query += ` AND IsManager = 1`;
    } else if (filters.IsManager && filters.IsManager === false) {
      query += ` AND IsManager = 0`;
    }

    if (filters.ShiftEmployee && filters.ShiftEmployee === true) {
      query += ` AND IsShiftEmployee = 1`;
    } else if (filters.ShiftEmployee && filters.ShiftEmployee === false) {
      query += ` AND IsShiftEmployee = 0`;
    }
    // query += ` AND VType = '${filters.VType}'`;
    return query;
  };

  const handleFetch = () => {
    const selectedFilters = {
      UserID: 1,
      LoginComapnyID: 1,
      LoginLocationID: 1,
      EType: Number(document.getElementById("EType").value) > 0 ? document.getElementById("EType").value : null,
      EmployeeID: Number(document.getElementById("EmployeeID").value) > 0 ? document.getElementById("EmployeeID").value : null,
      HODID: Number(document.getElementById("HODID").value) > 0 ? document.getElementById("HODID").value : null,
      LocationID: Number(document.getElementById("LocationID").value) > 0 ? document.getElementById("LocationID").value : null,
      DeptID: Number(document.getElementById("DeptID").value) > 0 ? document.getElementById("DeptID").value : null,
      DesgID: Number(document.getElementById("DesgID").value) > 0 ? document.getElementById("DesgID").value : null,
      Date: document.getElementById("date").value,
      ReportHeading: document.getElementById("VName").value,
      WithOverTime: document.getElementById("WithOverTime").checked,
      IsManager: document.getElementById("IsManager").checked,
      ShiftEmployee: document.getElementById("ShiftEmployee").checked,
      VType: document.querySelector('input[name="VType"]:checked')?.value || null, // Get selected radio button value
    };

    // const selectedFilters = {
    //   UserID :1,
    //   LoginComapnyID: 1,
    //   LoginLocationID: 1,

    //   EType: document.getElementById("EType").value,
    //   EmployeeID: document.getElementById("EmployeeID").value,
    //   HODID: document.getElementById("HODID").value,
    //   LocationID: document.getElementById("LocationID").value,
    //   DeptID: document.getElementById("DeptID").value,
    //   DesgID: document.getElementById("DesgID").value,
    //   Date: document.getElementById("date").value,
    //   ReportHeading: document.getElementById("VName").value,
    //   WithOverTime: document.getElementById("WithOverTime").checked,
    //   IsManager: document.getElementById("IsManager").checked,
    //   ShiftEmployee: document.getElementById("ShiftEmployee").checked,
    //   // ReportType: selectedOption,
    //   VType: selectedOption,
    // };

    setFilters(selectedFilters);
    setShowFilters(true);
    const query = generateQueryString(selectedFilters);
    setQueryString(query);
  };
  const handleGeneratePDF = () => {
    console.log("Generating PDF...");
  };

  const handleCancel = () => {
    console.log("Cancelling...");
    setShowTable(false);
  };
  // Today Date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  document.title = "Daily Attendance Report | EMS";
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
                    title="Daily Attendance Report"
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
                              name="EType"
                              id="EType"
                            >
                              <option value="-1">---Select--- </option>
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
                              name="EmployeeID"
                              id="EmployeeID"
                            >
                              <option value="-1">---Select--- </option>
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
                              name="HODID"
                              id="HODID"
                            >
                              <option value="-1">---Select--- </option>
                              <option value="1">IT</option>
                              <option value="2">Software</option>
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
                              name="LocationID"
                              id="LocationID"
                            >
                              <option value="-1">---Select--- </option>
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
                              name="DeptID"
                              id="DeptID"
                            >
                              <option value="-1">---Select--- </option>
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
                              name="DesgID"
                              id="DesgID"
                            >
                              <option value="-1">---Select--- </option>
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
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="date"
                              min={getMinDate()} // Prevent past dates
                              value={selectedDate}
                            />
                          </div>
                        </Col>
                        <Col xxl={4} md={9}>
                          <div className="mb-3">
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

                      {/* checkbox grid */}
                      <Row style={{ border: "1px dotted lightgray" }}>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="WithOverTime"
                            />
                            <Label
                              className="form-check-label"
                              for="WithOverTime"
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
                              id="IsManager"
                            />
                            <Label className="form-check-label" for="IsManager">
                              IsManager
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="ShiftEmployee"
                            />
                            <Label
                              className="form-check-label"
                              for="ShiftEmployee"
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
                              id="Unposted"
                              name="VType"
                              value="Unposted"
                              checked={selectedOption === "Unposted"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="Unposted"
                            >
                              Unposted Attendance
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="Posted"
                              name="VType"
                              value="Posted"
                              checked={selectedOption === "Posted"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="Posted"
                            >
                              Posted Attendance
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="UnpostedSummary"
                              name="VType"
                              value="UnpostedSummary"
                              checked={selectedOption === "UnpostedSummary"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="Unposted"
                            >
                              Latecomers
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="PostedSummary"
                              name="VType"
                              value="PostedSummary"
                              checked={selectedOption === "PostedSummary"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="PostedSummary"
                            >
                              Absentees
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="Latecomer"
                              name="VType"
                              value="Latecomer"
                              checked={selectedOption === "Latecomer"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="Latecomer"
                            >
                              Pending For Out
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="ManualOverTime"
                              name="VType"
                              value="ManualOverTime"
                              checked={selectedOption === "ManualOverTime"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="ManualOverTime"
                            >
                              OT List
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OverTime"
                              name="VType"
                              value="OverTime"
                              checked={selectedOption === "OverTime"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="OverTime"
                            >
                              OT Sheet
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OverTimeList"
                              name="VType"
                              value="OverTimeList"
                              checked={selectedOption === "OverTimeList"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="OverTimeList"
                            >
                              Summary-1
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OverTimeSheet"
                              name="VType"
                              value="OverTimeSheet"
                              checked={selectedOption === "OverTimeSheet"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="OverTimeSheet"
                            >
                              Summary-2
                            </Label>
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="ExportLog"
                              name="VType"
                              value="ExportLog"
                              checked={selectedOption === "ExportLog"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="ExportLog"
                            >
                              Log File
                            </Label>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>
            {showFilters && (
              <Col lg={12}>
                <Card className="mt-3">
                  <CardBody>
                    <h5>Selected Filters:</h5>
                    <p>
                      <strong>UserID:</strong> {filters.UserID || " "} <br />
                      <strong>LoginComapnyID:</strong> {filters.LoginComapnyID || " "} <br />
                      <strong>LoginLocationID:</strong> {filters.LoginLocationID || " "} <br />
                      <strong>E-Type:</strong> {filters.EType || " "} <br />
                      <strong>Employee:</strong> {filters.EmployeeID || " "}{" "}
                      <br />
                      <strong>HOD:</strong> {filters.HODID || " "} <br />
                      <strong>Location:</strong> {filters.LocationID || " "}{" "}
                      <br />
                      <strong>Department:</strong> {filters.DeptID || " "}{" "}
                      <br />
                      <strong>Designation:</strong> {filters.DesgID || " "}{" "}
                      <br />
                      <strong>Date:</strong> {filters.Date} <br />
                      <strong>Report Heading:</strong>{" "}
                      {filters.ReportHeading || " "} <br />
                      <strong>With OverTime:</strong>{" "}
                      {filters.WithOverTime ? "1" : "0"} <br />
                      <strong>Is Manager:</strong>{" "}
                      {filters.IsManager ? "1" : "0"} <br />
                      <strong>Shift Employee:</strong>{" "}
                      {filters.ShiftEmployee ? "1" : "0"} <br />
                      <strong>Report Type:</strong> {filters.VType}
                    </p>
                    <h5>Generated Query:</h5>
                    <pre>{queryString}</pre>
                  </CardBody>
                </Card>
              </Col>
            )}
            {/* Conditionally render the table */}
            {/* {showTable && <RenderTable selectedOption={reportType} />} */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DailyAttendanceReport;
