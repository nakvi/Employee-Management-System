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
import ReportsPreview from "../../../Components/pdfsPreviews/reports"; 
import UnpostedPreview from "../../../Components/pdfsPreviews/UnpostedPreview";
import PostedPreview from "../../../Components/pdfsPreviews/PostedPreview";
import LatecomerPreview from "../../../Components/pdfsPreviews/LatecomerPreview";
import AbsenteesPreview from "../../../Components/pdfsPreviews/AbsenteesPreview";
import RenderTable from "./RenderTable";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import config from "../../../config"; 
import { useFormik } from "formik";

const DailyAttendanceReport = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [queryString, setQueryString] = useState("");
  const [filters, setFilters] = useState({});

  // Redux
  const dispatch = useDispatch();
  const { location = [] } = useSelector((state) => state.Location || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { designation = [] } = useSelector((state) => state.Designation || {});
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { employee = [] } = useSelector((state) => state.Employee || {});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getDesignation());
    dispatch(getLocation());
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, [dispatch]);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      EType: "-1",
      EmployeeID: "-1",
      HODID: "-1",
      LocationID: "-1",
      DeptID: "-1",
      DesgID: "-1",
      Date: new Date().toISOString().split("T")[0],
      ReportHeading: "",
      WithOverTime: false,
      IsManager: false,
      ShiftEmployee: false,
      VType: "Unposted",
    },
    onSubmit: (values) => {
      const selectedFilters = {
        UserID: 1,
        LoginComapnyID: 1,
        LoginLocationID: 1,
        ...values,
      };
      setFilters(selectedFilters);
      setShowFilters(true);
      setShowTable(true);
      const query = generateQueryString(selectedFilters);
      setQueryString(query);
      // Call the main fetch function
      fetchAttendanceData(selectedFilters);
    },
  });

const generateQueryString = (filters) => {
  // EmployeeIDList
  let empListArr = [];
  if (filters.EType && Number(filters.EType) > 0) empListArr.push(`AND E."ETypeID" = ${filters.EType}`);
  if (filters.EmployeeID && Number(filters.EmployeeID) > 0) empListArr.push(`AND E."EmpID" = ${filters.EmployeeID}`);
  if (filters.HODID && Number(filters.HODID) > 0) empListArr.push(`AND E."HODID" = ${filters.HODID}`);
  if (filters.LocationID && Number(filters.LocationID) > 0) empListArr.push(`AND E."LocationID" = ${filters.LocationID}`);
  if (filters.DeptID && Number(filters.DeptID) > 0) empListArr.push(`AND E."DeptID" = ${filters.DeptID}`);
  if (filters.DesgID && Number(filters.DesgID) > 0) empListArr.push(`AND E."DesgID" = ${filters.DesgID}`);
  let employeeIDList = empListArr.join(" ");

  // cWhere
  let cWhere = "";
  if (filters.Date) cWhere = `AND A."DateIn" = '${filters.Date}'`;

  // Final string
  return `EmployeeIDList = ${employeeIDList}\ncWhere = ${cWhere}`;
};

const fetchAttendanceData = async (filters) => {
  // Build EmployeeIDList
  let empListArr = [];
  if (filters.EType && Number(filters.EType) > 0) empListArr.push(`AND E."ETypeID" = ${filters.EType}`);
  if (filters.EmployeeID && Number(filters.EmployeeID) > 0) empListArr.push(`AND E."EmpID" = ${filters.EmployeeID}`);
  if (filters.HODID && Number(filters.HODID) > 0) empListArr.push(`AND E."HODID" = ${filters.HODID}`);
  if (filters.LocationID && Number(filters.LocationID) > 0) empListArr.push(`AND E."LocationID" = ${filters.LocationID}`);
  if (filters.DeptID && Number(filters.DeptID) > 0) empListArr.push(`AND E."DeptID" = ${filters.DeptID}`);
  if (filters.DesgID && Number(filters.DesgID) > 0) empListArr.push(`AND E."DesgID" = ${filters.DesgID}`);
  let employeeIDList = empListArr.join(" ");

  // cWhere
  let cWhere = "";
  if (filters.Date) cWhere = `AND A."DateIn" = ${filters.Date}`;

  // Build params (NO encodeURIComponent)
  const params = [
    `Orgini=LTT`,
    `CompanyID=${filters.LoginComapnyID || 1}`,
    `LocationID=${filters.LoginLocationID || 1}`,
    `VDate=${filters.Date || "2025-06-02"}`,
    `EmployeeIDList=${employeeIDList}`,
    `cWhere=${cWhere}`,
    `IsAu=0`,
    `IsExport=0`,
    `UID=${filters.UserID || 1}`,
  ].join("&");

  let apiUrl = "";
  switch (filters.VType) {
    case "Unposted":
      apiUrl = `${config.api.API_URL}rptAttDailyUnposted?${params}`;
      break;
    case "Posted":
      apiUrl = `${config.api.API_URL}rptAttDailyPosted?${params}`;
      break;
    case "Latecomer":
      apiUrl = `${config.api.API_URL}rptAttDailyLate?${params}`;
      break;
    case "Absentees":
      apiUrl = `${config.api.API_URL}rptAttDailyAB?${params}`;
      break;
    default:
      setTableData([]);
      return;
  }
  // Fetch data from the API
  console.log("API URL:", apiUrl); // Debugging line
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("API Response:", data); // Debugging line
    setTableData(data);
  } catch (error) {
    setTableData([]);
    console.error("API Error:", error);
  }
};
function groupByDepartment(data) {
  const grouped = {};
  data.forEach(row => {
    const section = row.Department || "Other";
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push(row); // Ab row ko as-is push karo
  });
  return Object.entries(grouped).map(([section, rows]) => ({ section, rows }));
}
  // Generate query string (same as your code)
  // const generateQueryString = (filters) => {
  //   let query = "cWhere = Where UserID = 1 AND LoginCompanyID = 1 AND LoginLocationID = 1 ";
  //   if (filters.EType && Number(filters.EType) > 0) {
  //     query += ` AND EType = '${filters.EType}'`;
  //   }
  //   if (filters.EmployeeID && Number(filters.EmployeeID) > 0) {
  //     query += ` AND EmployeeID = '${filters.EmployeeID}'`;
  //   }
  //   if (filters.HODID && Number(filters.HODID) > 0) {
  //     query += ` AND HODID = '${filters.HODID}'`;
  //   }
  //   if (filters.LocationID && Number(filters.LocationID) > 0) {
  //     query += ` AND LocationID = '${filters.LocationID}'`;
  //   }
  //   if (filters.DeptID && Number(filters.DeptID) > 0) {
  //     query += ` AND DepartmentID = '${filters.DeptID}'`;
  //   }
  //   if (filters.DesgID && Number(filters.DesgID) > 0) {
  //     query += ` AND DesignationID = '${filters.DesgID}'`;
  //   }
  //   query += ` AND AttendanceDate = '${filters.Date}'`;
  //   if (filters.WithOverTime) query += ` AND OverTime = 1`;
  //   else query += ` AND OverTime = 0`;
  //   if (filters.IsManager) query += ` AND IsManager = 1`;
  //   else query += ` AND IsManager = 0`;
  //   if (filters.ShiftEmployee) query += ` AND IsShiftEmployee = 1`;
  //   else query += ` AND IsShiftEmployee = 0`;
  //   return query;
  // };


  // Cancel button handler
  const handleCancel = () => {
    formik.resetForm();
    setShowFilters(false);
    setShowTable(false);
    setQueryString("");
    setFilters({});
  };

  document.title = "Daily Attendance Report | EMS";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeaderReport
                    title="Daily Attendance Report"
                    onFetch={formik.handleSubmit}
                    onGeneratePDF={() => { }}
                    onCancel={handleCancel}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label className="form-label">E-Type</Label>
                            <select
                              className="form-select form-select-sm"
                              name="EType"
                              id="EType"
                              value={formik.values.EType}
                              onChange={formik.handleChange}
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
                            <Label className="form-label">Employee</Label>
                            <select
                              className="form-select form-select-sm"
                              name="EmployeeID"
                              id="EmployeeID"
                              value={formik.values.EmployeeID}
                              onChange={formik.handleChange}
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
                            <Label className="form-label">HOD</Label>
                            <select
                              className="form-select form-select-sm"
                              name="HODID"
                              id="HODID"
                              value={formik.values.HODID}
                              onChange={formik.handleChange}
                            >
                              <option value="-1">---Select--- </option>
                              <option value="1">IT</option>
                              <option value="2">Software</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label className="form-label">Location</Label>
                            <select
                              className="form-select form-select-sm"
                              name="LocationID"
                              id="LocationID"
                              value={formik.values.LocationID}
                              onChange={formik.handleChange}
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
                            <Label className="form-label">Department</Label>
                            <select
                              className="form-select form-select-sm"
                              name="DeptID"
                              id="DeptID"
                              value={formik.values.DeptID}
                              onChange={formik.handleChange}
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
                            <Label className="form-label">Designation</Label>
                            <select
                              className="form-select form-select-sm"
                              name="DesgID"
                              id="DesgID"
                              value={formik.values.DesgID}
                              onChange={formik.handleChange}
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
                            <Label htmlFor="date" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="date"
                              name="Date"
                              // min={getMinDate()}
                              value={formik.values.Date}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </Col>
                        <Col xxl={4} md={9}>
                          <div className="mb-3">
                            <Label className="form-label">Report Heading</Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              name="ReportHeading"
                              placeholder="Report Heading"
                              value={formik.values.ReportHeading}
                              onChange={formik.handleChange}
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
                              name="WithOverTime"
                              checked={formik.values.WithOverTime}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="WithOverTime">
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
                              name="IsManager"
                              checked={formik.values.IsManager}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="IsManager">
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
                              name="ShiftEmployee"
                              checked={formik.values.ShiftEmployee}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="ShiftEmployee">
                              ShiftEmployee
                            </Label>
                          </div>
                        </Col>
                      </Row>
                      {/* radio grid */}
                      <Row>
                        {[
                          { id: "Unposted", label: "Unposted Attendance" },
                          { id: "Posted", label: "Posted Attendance" },
                          { id: "Latecomer", label: "Latecomers" },
                          { id: "Absentees", label: "Absentees" },
                          { id: "PendingForOut", label: "Pending For Out" },
                          { id: "ManualOverTime", label: "OT List" },
                          { id: "OverTime", label: "OT Sheet" },
                          { id: "OverTimeList", label: "Summary-1" },
                          { id: "OverTimeSheet", label: "Summary-2" },
                          { id: "ExportLog", label: "Log File" },
                        ].map((option) => (
                          <Col xxl={2} md={2} key={option.id}>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id={option.id}
                                name="VType"
                                value={option.id}
                                checked={formik.values.VType === option.id}
                                onChange={formik.handleChange}
                              />
                              <Label className="form-check-label" htmlFor={option.id}>
                                {option.label}
                              </Label>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>
            {showFilters && (
              <Col lg={12}>
                {showTable && (
                <>
                  {filters.VType === "Unposted" && <UnpostedPreview groupedData={groupByDepartment(tableData)} />}
                  {filters.VType === "Posted" && <PostedPreview groupedData={groupByDepartment(tableData)} />}
                  {filters.VType === "Latecomer" && <LatecomerPreview groupedData={groupByDepartment(tableData)} />}
                  {filters.VType === "Absentees" && <AbsenteesPreview groupedData={groupByDepartment(tableData)} />}
                </>
              )}
                {/* <Card className="mt-3">
                  <CardBody>
                    <h5>Selected Filters:</h5>
                    <p>
                      <strong>UserID:</strong> 1 <br />
                      <strong>LoginComapnyID:</strong> 1 <br />
                      <strong>LoginLocationID:</strong> 1 <br />
                      <strong>E-Type:</strong> {filters.EType || " "} <br />
                      <strong>Employee:</strong> {filters.EmployeeID || " "} <br />
                      <strong>HOD:</strong> {filters.HODID || " "} <br />
                      <strong>Location:</strong> {filters.LocationID || " "} <br />
                      <strong>Department:</strong> {filters.DeptID || " "} <br />
                      <strong>Designation:</strong> {filters.DesgID || " "} <br />
                      <strong>Date:</strong> {filters.Date} <br />
                      <strong>Report Heading:</strong> {filters.ReportHeading || " "} <br />
                      <strong>With OverTime:</strong> {filters.WithOverTime ? "1" : "0"} <br />
                      <strong>Is Manager:</strong> {filters.IsManager ? "1" : "0"} <br />
                      <strong>Shift Employee:</strong> {filters.ShiftEmployee ? "1" : "0"} <br />
                      <strong>Report Type:</strong> {filters.VType}
                    </p>
                    <h5>Generated Query:</h5>
                    <pre>{queryString}</pre>
                  </CardBody>
                </Card> */}
              </Col>
            )}
            {/* {showTable && <RenderTable selectedOption={filters.VType} />} */}
           
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DailyAttendanceReport;