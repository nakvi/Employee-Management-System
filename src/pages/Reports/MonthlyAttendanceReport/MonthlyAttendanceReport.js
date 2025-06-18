import React, { useState, useEffect } from "react";
import {
  Card, CardBody, Col, Container, Row, Input, Label, Form
} from "reactstrap";
import PreviewCardHeaderReport from "../../../Components/Common/PreviewCardHeaderReport";
import MonthlyAttCardPreview from "../../../Components/pdfsPreviews/MonthlyAttCardPreview";
import MonthlyAttSheetPreview from "../../../Components/pdfsPreviews/MonthlyAttSheetPreview";
import MonthlyAttSummaryPreview from "../../../Components/pdfsPreviews/MonthlyAttSummaryPreview";
import MonthlyAttLeaveListPreview from "../../../Components/pdfsPreviews/MonthlyAttLeaveListPreview";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import config from "../../../config"; 
import { useFormik } from "formik";
const MonthlyAttendanceReport = () => {
  const dispatch = useDispatch();
  const { location = [] } = useSelector((state) => state.Location || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { designation = [] } = useSelector((state) => state.Designation || {});
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { employee = [] } = useSelector((state) => state.Employee || {});
  const [showFilters, setShowFilters] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getDesignation());
    dispatch(getLocation());
  }, [dispatch]);

  const getMonthStart = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
};
const getMonthEnd = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, "0")}`;
};
// Formik onSubmit
const formik = useFormik({
  initialValues: {
    EType: "",
    EmployeeID: "",
    HODID: "",
    LocationID: "",
    DeptID: [],
    DesgID: "",
    DateFrom: getMonthStart(),
    DateTo: getMonthEnd(),
    SalaryFrom: "",
    SalaryTo: "",
    SalaryPercentage: "",
    ReportHeading: "",
    WithOverTime: false,
    IsManager: false,
    ShiftEmployee: false,
    VType: "rptAttMonthStatus",
    ExportType: "",
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
    fetchAttendanceData(selectedFilters);
  },
});
  const generateQueryString = (filters) => {
    // EmployeeIDList
    let empListArr = [];
    if (filters.EType) empListArr.push(`AND E."ETypeID" = ${filters.EType}`);
    if (filters.EmployeeID) empListArr.push(`AND E."EmpID" = ${filters.EmployeeID}`);
    if (filters.HODID) empListArr.push(`AND E."HODID" = ${filters.HODID}`);
    if (filters.LocationID) empListArr.push(`AND E."LocationID" = ${filters.LocationID}`);
    if (filters.DeptID && filters.DeptID.length > 0) {
      // DeptID is array from react-select
      const deptIds = filters.DeptID.map(d => d.value).join(",");
      empListArr.push(`AND E."DeptID" IN (${deptIds})`);
    }
    if (filters.DesgID) empListArr.push(`AND E."DesgID" = ${filters.DesgID}`);
    let employeeIDList = empListArr.join(" ");

    // cWhere
    let cWhereArr = [];
    if (filters.DateFrom && filters.DateTo) {
      cWhereArr.push(`AND A."VDate" BETWEEN '${filters.DateFrom}' AND '${filters.DateTo}'`);
    }
    if (filters.SalaryFrom || filters.SalaryTo) {
      const from = filters.SalaryFrom || 0;
      const to = filters.SalaryTo || 9999999;
      cWhereArr.push(`AND A."BasicSalary" BETWEEN ${from} AND ${to}`);
    }
    if (filters.SalaryPercentage) cWhereArr.push(`AND E."SalaryPercentage" = ${filters.SalaryPercentage}`);
    let cWhere = cWhereArr.join(" ");

      return { employeeIDList, cWhere };
    };

  const fetchAttendanceData = async (filters) => {
    const { employeeIDList, cWhere } = generateQueryString(filters);

    // DeptIDs for API param (comma separated)
    let deptIDs = "";
    if (filters.DeptID && filters.DeptID.length > 0) {
      deptIDs = filters.DeptID.map(d => d.value).join(",");
    }

    const params = [
      `Orgini=LTT`,
      `DateFrom=${filters.DateFrom || ""}`,
      `DateTo=${filters.DateTo || ""}`,
      `DeptIDs=${deptIDs}`,
      `EmployeeIDList=${employeeIDList}`,
      `cWhere=${cWhere}`,
      `CompanyID=${filters.LoginComapnyID || 1}`,
      `LocationID=${filters.LocationID || 0}`,
      `ETypeID=${filters.EType || 0}`,
      `EmpID=${filters.EmployeeID || 0}`,
      `IsAu=0`,
      `IsExport=0`,
      `UID=${filters.UserID || 0}`,
    ].join("&");

      let apiUrl = "";
    switch (filters.VType) {
      case "rptAttMonthStatus":
        apiUrl = `${config.api.API_URL}rptAttMonthStatus?${params}`;
        break;
      case "rptATTMonthAttendance":
        apiUrl = `${config.api.API_URL}rptATTMonthAttendance?${params}`;
        break;
      case "rptATTMonthSummary":
        apiUrl = `${config.api.API_URL}rptATTMonthSummary?${params}`;
        break;
      case "rptATTMonthLeave":
        apiUrl = `${config.api.API_URL}rptATTMonthLeave?${params}`;
        break;
      default:
        setTableData([]);
        return; 
    }

    // const apiUrl = `${config.api.API_URL}rptAttMonthStatus?${params}`;
    console.log("API URL:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("API Response:", data);
      setTableData(data);
    } catch (error) {
      setTableData([]);
      console.error("API Error:", error);
    }
  };

function groupByEmployee(data) {
  const grouped = {};
  data.forEach(row => {
    const key = row.EmpID;
    if (!grouped[key]) {
      grouped[key] = {
        EmpID: row.EmpID,
        EmpCode: row.EmpCode,
        EName: row.EName,
        Department: row.Department,
        Designation: row.Designation,
        DOJ: row.DOJ,
        Attendance: [],
        // Add more fields if needed
      };
    }
    grouped[key].Attendance.push(row);
  });
  return Object.values(grouped);
}
const employeeCards = groupByEmployee(tableData);
  document.title = "Monthly Attendance Report | EMS";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeaderReport
                    title="Monthly Attendance Report"
                    onFetch={formik.handleSubmit}
                    onGeneratePDF={() => { }}
                    onCancel={formik.handleReset}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        {/* E-Type */}
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
                              <option value="">---Select--- </option>
                              {employeeType.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        {/* Employee */}
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
                              <option value="">---Select--- </option>
                              {employee.map((item) => (
                                <option key={item.EmpID} value={item.EmpID}>
                                  {item.EName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        {/* HOD */}
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
                              <option value="">---Select--- </option>
                              <option value="1">IT</option>
                              <option value="2">Software</option>
                            </select>
                          </div>
                        </Col>
                        {/* Location */}
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
                              <option value="">---Select--- </option>
                              {location.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        {/* Department (Multi-select) */}
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label className="form-label">Department</Label>
                            <Select
                              value={formik.values.DeptID}
                              isMulti={true}
                              name="DeptID"
                              onChange={selected =>
                                formik.setFieldValue("DeptID", selected)
                              }
                              options={departmentList.map((item) => ({
                                value: item.VID,
                                label: item.VName,
                              }))}
                            />
                          </div>
                        </Col>
                        {/* Designation */}
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
                              <option value="">---Select--- </option>
                              {designation.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        {/* Date From */}
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Date From
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                              name="DateFrom"
                              value={formik.values.DateFrom}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </Col>
                        {/* Date To */}
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="DateTo" className="form-label">
                              Date To
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateTo"
                              name="DateTo"
                              value={formik.values.DateTo}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </Col>
                        {/* Salary Range From */}
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="SalaryFrom" className="form-label">
                              Salary Range From
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="SalaryFrom"
                              name="SalaryFrom"
                              placeholder="Salary Range From"
                              value={formik.values.SalaryFrom}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </Col>
                        {/* Salary Range To */}
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="SalaryTo" className="form-label">
                              Salary Range To
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="SalaryTo"
                              name="SalaryTo"
                              placeholder="Salary Range To"
                              value={formik.values.SalaryTo}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </Col>
                        {/* Salary Percentage */}
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="SalaryPercentage" className="form-label">
                              Salary Percentage
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="SalaryPercentage"
                              name="SalaryPercentage"
                              placeholder="Salary Percentage"
                              value={formik.values.SalaryPercentage}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </Col>
                        {/* Report Heading */}
                        <Col xxl={2} md={9}>
                          <div className="mb-3 mt-2">
                            <Label className="form-label">Report Heading</Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="ReportHeading"
                              name="ReportHeading"
                              placeholder="Report Heading"
                              value={formik.values.ReportHeading}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </Col>
                      </Row>
                      {/* Checkbox grid */}
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
                      {/* Radio grid */}
                      <Row>
                        {[
                          { id: "rptAttMonthStatus", label: "Attendance Card" },
                          { id: "rptATTMonthAttendanceCardSalary", label: "Attendance Card Salary" },
                          { id: "rptATTMonthAttendance", label: "Attendance Sheet" },
                          { id: "rptATTMonthSummary", label: "Attendance Summary" },
                          { id: "Latecomers", label: "Latecomers" },
                          { id: "AbsenteeList", label: "Absentee List" },
                          { id: "OTList", label: "OT List" },
                          { id: "rptATTMonthLeave", label: "Leave List" },
                          { id: "LeaveBalance", label: "Leave Balance" },
                          { id: "LeavesOfEmployee", label: "Leaves of Employee" },
                          { id: "LeaveBalanceMonthWise", label: "Leave Balance Month Wise" },
                          { id: "MonthlyHrs", label: "Monthly Hrs" },
                          { id: "Roster", label: "Roster" },
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
                      <Row className="align-items-center mt-2 mb-2" style={{ borderTop: "1px dotted #ccc", paddingTop: "10px" }}>
                        <Col xs="auto">
                          <strong style={{ fontSize: "14px" }}>Export</strong>
                        </Col>
                        {[
                          { id: "AttendanceLog", label: "Attendance Log" },
                          { id: "Card", label: "Card" },
                          { id: "DuplicateLeaves", label: "Duplicate Leaves" },
                          { id: "AttWithABHDWO", label: "Att with AB/HD/WO" },
                        ].map((option) => (
                          <Col xs="auto" key={option.id}>
                            <div className="form-check form-check-inline">
                              <Input
                                className="form-check-input"
                                type="radio"
                                id={option.id}
                                name="ExportType"
                                value={option.id}
                                checked={formik.values.ExportType === option.id}
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
                    {showTable && filters.VType === "rptAttMonthStatus" && (
                      Array.isArray(tableData) && tableData.length > 0 ? (
                        groupByEmployee(tableData).map((emp, idx) => (
                          <MonthlyAttCardPreview
                            key={emp.EmpID || idx}
                            emp={emp}
                            allEmployees={employeeCards}
                            reportHeading={filters.ReportHeading}
                            dateFrom={filters.DateFrom}
                            dateTo={filters.DateTo}
                          />
                        ))
                      ) : (
                        <div className="text-center text-muted">No data found.</div>
                      )
                      )}

                      {showTable && filters.VType === "rptATTMonthAttendance" && (
                        Array.isArray(tableData) && tableData.length > 0 ? (
                          <MonthlyAttSheetPreview
                            allEmployees={tableData}
                            reportHeading={filters.ReportHeading}
                            dateFrom={filters.DateFrom}
                            dateTo={filters.DateTo}
                          />
                        ) : (
                          <div className="text-center text-muted">No data found.</div>
                        )
                      )}
                      {showTable && filters.VType === "rptATTMonthSummary" && (
                        Array.isArray(tableData) && tableData.length > 0 ? (
                          <MonthlyAttSummaryPreview
                            allEmployees={tableData}
                            reportHeading={filters.ReportHeading}
                            dateFrom={filters.DateFrom}
                            dateTo={filters.DateTo}
                          />
                        ) : (
                          <div className="text-center text-muted">No data found.</div>
                        )
                      )}
                    {showTable && filters.VType === "rptATTMonthLeave" && (
                        Array.isArray(tableData) && tableData.length > 0 ? (
                          <MonthlyAttLeaveListPreview
                            allEmployees={tableData}
                            reportHeading={filters.ReportHeading}
                            dateFrom={filters.DateFrom}
                            dateTo={filters.DateTo}
                          />
                        ) : (
                          <div className="text-center text-muted">No data found.</div>
                        )
                      )}
                    </Col>
                  )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MonthlyAttendanceReport;