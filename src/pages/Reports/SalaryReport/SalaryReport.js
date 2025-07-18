import React, { useEffect, useState } from "react";
import {
  Card, CardBody, Col, Container, Row, Input, Label, Form,
} from "reactstrap";
import PreviewCardHeaderReport from "../../../Components/Common/PreviewCardHeaderReport";
import MonthlyAttSalarySheetPreview from "../../../Components/pdfsPreviews/MonthlyAttRpts/MonthlyAttSalarySheetPreview";
import SalaryReportPreview from "../../../Components/pdfsPreviews/SalaryRpts/SalaryReportPreview";
import SalaryHistoryPreview from "../../../Components/pdfsPreviews/SalaryRpts/SalaryHistoryPreview";
import SalaryReportTwoPreview from "../../../Components/pdfsPreviews/SalaryRpts/SalaryReportTwoPreview";
import SalarySummaryReportPreview from "../../../Components/pdfsPreviews/SalaryRpts/SalarySummaryReportPreview";
import SalarySlipPreview from "../../../Components/pdfsPreviews/SalaryRpts/SalarySlipPreview";
import SalaryOverTimeSheetPreview from "../../../Components/pdfsPreviews/SalaryRpts/SalaryOverTimeSheetPreview";
import SalaryOverTimeSummaryReportPreview from "../../../Components/pdfsPreviews/SalaryRpts/SalaryOverTimeSummaryReportPreview";
import SalaryFinalSettlementPreview from "../../../Components/pdfsPreviews/SalaryRpts/SalaryFinalSettlementPreview";
import SalaryAllwDedPreview from "../../../Components/pdfsPreviews/SalaryRpts/SalaryAllwDedPreview";

import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getSalaryBank } from "../../../slices/setup/salaryBank/thunk";
import { useFormik } from "formik";
import config from "../../../config";

const SalaryReport = () => {
  document.title = "Salary Report | EMS";

  const dispatch = useDispatch();
  const { location = [] } = useSelector((state) => state.Location || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { designation = [] } = useSelector((state) => state.Designation || {});
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { employee = [] } = useSelector((state) => state.Employee || {});
  const { salaryBank = [] } = useSelector((state) => state.SalaryBank || {});

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getDesignation());
    dispatch(getLocation());
    dispatch(getSalaryBank());
  }, [dispatch]);

  // Function to get the last day of the month from a date string
function getLastDayOfMonth(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-based
  const lastDay = new Date(year, month, 0); // 0th day of next month = last day of current month
  // Format as yyyy-MM-dd (local)
  return `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;
}
  // Function to get the first day of the current month
  const getCurrentMonthFirstDay = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      EType: "",
      EmployeeID: "",
      HODID: "",
      LocationID: "",
      DeptID: "",
      DesgID: "",
      SalaryBankID: "",
      DateFrom: getCurrentMonthFirstDay(),
      DateTo: "",
      ReportHeading: "",
      WithOverTime: false,
      IsManager: false,
      ShiftEmployee: false,
      VType: "SalarySheet",
    },
    validate: (values) => {
      const errors = {};
      if (values.DateFrom && values.DateTo) {
        const from = new Date(values.DateFrom);
        const to = new Date(values.DateTo);

        if (values.VType === "SalaryHistory1") {
          if (from > to) {
            errors.DateTo = "DateFrom must not be after DateTo.";
          }
        } else {
          if (
            from.getFullYear() !== to.getFullYear() ||
            from.getMonth() !== to.getMonth() ||
            to < from
          ) {
            errors.DateTo = "DateTo must be in the same month as DateFrom.";
          }
        }
      }
      return errors;
    },
    onSubmit: async (values) => {
      //  console.log("Formik Submit Values:", values);
      const selectedFilters = {
        UserID: 1,
        LoginComapnyID: 1,
        LoginLocationID: 1,
        ...values,
      };
      setFilters(selectedFilters);
      setShowFilters(true);
      setShowTable(true);
      fetchSalaryReport(selectedFilters);
    },
  });
useEffect(() => {
  if (
    formik.values.VType !== "SalaryHistory1" &&
    formik.values.DateFrom
  ) {
    const lastDay = getLastDayOfMonth(formik.values.DateFrom);
    if (
      !formik.values.DateTo ||
      formik.values.DateTo.slice(0, 7) !== formik.values.DateFrom.slice(0, 7)
    ) {
      formik.setFieldValue("DateTo", lastDay);
    }
  }
  // eslint-disable-next-line
}, [formik.values.DateFrom, formik.values.VType]);
 
// console.log("Formik Values:", formik.values);
  // Params builder
  const generateQueryString = (filters) => {
    // EmployeeIDList
    let empListArr = [];
    if (filters.EType) empListArr.push(`AND E."ETypeID" = ${filters.EType}`);
    if (filters.EmployeeID) empListArr.push(`AND E."EmpID" = ${filters.EmployeeID}`);
    if (filters.HODID) empListArr.push(`AND E."HODID" = ${filters.HODID}`);
    if (filters.LocationID) empListArr.push(`AND E."LocationID" = ${filters.LocationID}`);
    if (filters.DeptID) empListArr.push(`AND E."DeptID" = ${filters.DeptID}`);
    if (filters.DesgID) empListArr.push(`AND E."DesgID" = ${filters.DesgID}`);
    if (filters.ShiftEmployee) empListArr.push(`AND E."ShiftEmployee" = ${filters.ShiftEmployee} ? 1 : 0`);
    let employeeIDList = empListArr.join(" ");

    // cWhere
    let cWhereArr = [];
    if (filters.DateFrom && filters.DateTo) {
      cWhereArr.push(`AND A."VDate" BETWEEN '${filters.DateFrom}' AND '${filters.DateTo}'`);
    }
    if (filters.SalaryBankID) cWhereArr.push(`AND A."CompanyBankID" = ${filters.SalaryBankID}`);
    if (filters.WithOverTime) cWhereArr.push(`AND A."HaveOT" = 1`);
    if (filters.IsManager) cWhereArr.push(`AND A."IsManager" = 1`);
    // if (filters.VType === "SalarySheet") {
    //   cWhereArr.push(`AND A."isStopsalary" = 0 AND A."isActive" = 1`);
    // }
    // if (filters.VType === "FinalSettlement") {
    //   cWhereArr.push(`AND A.isstopsalary=0 AND A.isactive=0 AND A.dol BETWEEN '${filters.DateFrom}' AND '${filters.DateTo}'`);
    // }
    //  if (filters.VType === "StopSalary") {
    //   cWhereArr.push(`AND A."isStopsalary" = 1`);
    // }
    //  if (filters.VType === "SalaryAll") {
    //   cWhereArr.push(`AND A."isStopsalary" = 0`);
    // }

    let cWhere = cWhereArr.join(" ");

    return { employeeIDList, cWhere };
  };

  const fetchSalaryReport = async (filters) => {
    const { employeeIDList, cWhere } = generateQueryString(filters);

    const params = [
      `Orgini=LTT`,
      `DateFrom=${filters.DateFrom || ""}`,
      `DateTo=${filters.DateTo || ""}`,
      `DeptIDs=${filters.DeptID || ""}`,
      // `EmployeeIDList=${encodeURIComponent(employeeIDList)}`,
      // `cWhere=${encodeURIComponent(cWhere)}`,
      `EmployeeIDList=${employeeIDList}`,
      `cWhere=${cWhere}`,
      `CompanyID=${filters.LoginComapnyID || 1}`,
      `LocationID=${filters.LocationID || 0}`,
      `ETypeID=${filters.EType || 0}`,
      `EmpID=${filters.EmployeeID || 0}`,
      `IsAu=0`,
      `IsExport=0`,
      `UID=${filters.UserID || 0}`,
      `ShowPer=0`,
      `ReportHeading=${encodeURIComponent(filters.ReportHeading || "")}`,
    ].join("&");

    let apiUrl = "";
    switch (filters.VType) {
      case "SalarySheet":
      case "FinalSettlement":
      case "StopSalary":
      case "SalaryAll":
        apiUrl = `${config.api.API_URL}rptMonthSalarySheet?${params}`;
        break;
      case "SummarySheet":
        apiUrl = `${config.api.API_URL}rptMonthSalarySummary?${params}`;
        break;
       case "PaymentSlipEnglish":
        apiUrl = `${config.api.API_URL}rptMonthSalarySheet?${params}`;
        break;
      case "SalaryHistory1":
        apiUrl = `${config.api.API_URL}RptSalaryEmployee?${params}`;
        break;
      case "OTSheet":
        apiUrl = `${config.api.API_URL}rptOverTimeSheet?${params}`;
        break;
      case "OTSummary":
        apiUrl = `${config.api.API_URL}rptOverTimeSheetSummary?${params}`;
        break;
      case "EmpFinalSettlement":
        apiUrl = `${config.api.API_URL}rptFinalSettlement?${params}`;
        break;
      case "AllowsDeductionList":
        apiUrl = `${config.api.API_URL}rptMonthSalarySummary?${params}`;
        break;
      default:
          console.log("Unknown VType:", filters.VType); // <-- Add this
        setTableData([]);
        return;
    }
    console.log("API URL:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      // console.log("API Response:", data);
      if (filters.VType === "SummarySheet" && data && data.length > 0 && data[0].Attendance) {
        // If it's the "SummarySheet" report AND the data is wrapped inside 'Attendance'
        setTableData(data[0].Attendance); // Take ONLY the list from inside 'Attendance'
      } else {
        // For ALL other reports (like "SalarySheet"), use the data as is
        setTableData(data);
      }
    } catch (error) {
      setTableData([]);
    }
  };
function groupByEmployee(data) {
  if (!Array.isArray(data)) return [];
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
      };
    }
    grouped[key].Attendance.push(row);
  });
  return Object.values(grouped);
}
const employeeCards = groupByEmployee(tableData);
// console.log("Grouped Employee Cards:", employeeCards);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>} */}
            {formik.errors.DateTo && (
              <div style={{ color: "red" }}>{formik.errors.DateTo}</div>
            )}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeaderReport
                    title="Salary Report"
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
                        {/* Department */}
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
                              <option value="">---Select--- </option>
                              {departmentList.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
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
                        {/* Salary Bank */}
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label className="form-label">Salary Bank</Label>
                            <select
                              className="form-select form-select-sm"
                              name="SalaryBankID"
                              id="SalaryBankID"
                              value={formik.values.SalaryBankID}
                              onChange={formik.handleChange}
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
                        {/* Month From */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Month From
                            </Label>
                           <Input
                              type="month"
                              className="form-control-sm"
                              id="DateFrom"
                              name="DateFrom"
                              value={formik.values.DateFrom.slice(0, 7)} // MM/YYYY format
                              onChange={e => {
                                // Formik ko yyyy-MM-dd format chahiye, to first day set karen
                                const val = e.target.value;
                                formik.setFieldValue("DateFrom", val + "-01");
                              }}
                            />
                          </div>
                        </Col>
                        {/* Month To */}
                        <Col xxl={2} md={2}>
                        <div>
                          <Label htmlFor="DateTo" className="form-label">
                            Month To
                          </Label>
                         <Input
                          type="month"
                          className="form-control-sm"
                          id="DateTo"
                          name="DateTo"
                          value={formik.values.DateTo.slice(0, 7)}
                          onChange={e => {
                            // Formik ko yyyy-MM-dd format chahiye, to last day set karen
                            const val = e.target.value;
                            formik.setFieldValue("DateTo", getLastDayOfMonth(val + "-01"));
                          }}
                          readOnly={formik.values.VType !== "SalaryHistory1"}
                        />
                        </div>
                      </Col>
                        {/* Report Heading */}
                        <Col xxl={4} md={9}>
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
                      <Row>
                        <Row>
                          <Col xxl={2} md={2}>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="SalarySheet"
                                name="VType"
                                value="SalarySheet"
                                checked={formik.values.VType === "SalarySheet"}
                                onChange={formik.handleChange}
                              />
                              <Label className="form-check-label" htmlFor="SalarySheet">
                                Salary Sheet
                              </Label>
                            </div>
                          </Col>
                          <Col xxl={2} md={2}>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="FinalSettlement"
                                name="VType"
                                value="FinalSettlement"
                                checked={formik.values.VType === "FinalSettlement"}
                                onChange={formik.handleChange}
                              />
                              <Label className="form-check-label" htmlFor="FinalSettlement">
                                Final Settlement
                              </Label>
                            </div>
                          </Col>
                          <Col xxl={2} md={2}>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="StopSalary"
                                name="VType"
                                value="StopSalary"
                                checked={formik.values.VType === "StopSalary"}
                                onChange={formik.handleChange}
                              />
                              <Label className="form-check-label" htmlFor="StopSalary">
                                Stop Salary
                              </Label>
                            </div>
                          </Col>
                          <Col xxl={2} md={2}>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="SalaryAll"
                                name="VType"
                                value="SalaryAll"
                                checked={formik.values.VType === "SalaryAll"}
                                onChange={formik.handleChange}
                              />
                              <Label className="form-check-label" htmlFor="SalaryAll">
                                Salary All
                              </Label>
                            </div>
                          </Col>
                          <Col xxl={2} md={2}>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="SummarySheet"
                                name="VType"
                                value="SummarySheet"
                                checked={formik.values.VType === "SummarySheet"}
                                onChange={formik.handleChange}
                              />
                              <Label className="form-check-label" htmlFor="SummarySheet">
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
                              id="FinalSettlementSummary"
                              name="VType"
                              value="FinalSettlementSummary"
                              checked={formik.values.VType === "FinalSettlementSummary"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="FinalSettlementSummary">
                              Final Settlement Summary
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="StopSalarySummary"
                              name="VType"
                              value="StopSalarySummary"
                              checked={formik.values.VType === "StopSalarySummary"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="StopSalarySummary">
                              Stop Salary Summary
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="SalaryAllSummary"
                              name="VType"
                              value="SalaryAllSummary"
                              checked={formik.values.VType === "SalaryAllSummary"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="SalaryAllSummary">
                              Salary All Summary
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="PaymentSlipEnglish"
                              name="VType"
                              value="PaymentSlipEnglish"
                              checked={formik.values.VType === "PaymentSlipEnglish"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="PaymentSlipEnglish">
                              Payment Slip English
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="PaymentSlipUrdu"
                              name="VType"
                              value="PaymentSlipUrdu"
                              checked={formik.values.VType === "PaymentSlipUrdu"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="PaymentSlipUrdu">
                              Payment Slip Urdu
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="SalaryHistory1"
                              name="VType"
                              value="SalaryHistory1"
                              checked={formik.values.VType === "SalaryHistory1"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="SalaryHistory1">
                              Salary History 1
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OTSheet"
                              name="VType"
                              value="OTSheet"
                              checked={formik.values.VType === "OTSheet"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="OTSheet">
                              OT Sheet
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OTSheetOFF"
                              name="VType"
                              value="OTSheetOFF"
                              checked={formik.values.VType === "OTSheetOFF"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="OTSheetOFF">
                              OT Sheet OFF
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OTSheetAL"
                              name="VType"
                              value="OTSheetAL"
                              checked={formik.values.VType === "OTSheetAL"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="OTSheetAL">
                              OT Sheet ALL
                            </Label>
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OTSummary"
                              name="VType"
                              value="OTSummary"
                              checked={formik.values.VType === "OTSummary"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="OTSummary">
                              OT Summary
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OTSummaryOFF"
                              name="VType"
                              value="OTSummaryOFF"
                              checked={formik.values.VType === "OTSummaryOFF"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="OTSummaryOFF">
                              OT Summary OFF
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OTSummaryALL"
                              name="VType"
                              value="OTSummaryALL"
                              checked={formik.values.VType === "OTSummaryALL"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="OTSummaryALL">
                              OT Summary ALL
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="EmpFinalSettlement"
                              name="VType"
                              value="EmpFinalSettlement"
                              checked={formik.values.VType === "EmpFinalSettlement"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="EmpFinalSettlement">
                              Emp Final Settlement
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="FinalSettlementFormat"
                              name="VType"
                              value="FinalSettlementFormat"
                              checked={formik.values.VType === "FinalSettlementFormat"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="FinalSettlementFormat">
                              Final Settlement Format
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="AttendanceAllowance"
                              name="VType"
                              value="AttendanceAllowance"
                              checked={formik.values.VType === "AttendanceAllowance"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="AttendanceAllowance">
                              Attendance Allowance
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="BonusSheet"
                              name="VType"
                              value="BonusSheet"
                              checked={formik.values.VType === "BonusSheet"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="BonusSheet">
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
                              id="ArrearsSheet"
                              name="VType"
                              value="ArrearsSheet"
                              checked={formik.values.VType === "ArrearsSheet"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="ArrearsSheet">
                              Arrears Sheet
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="IncrementList"
                              name="VType"
                              value="IncrementList"
                              checked={formik.values.VType === "IncrementList"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="IncrementList">
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
                                id="AllowsDeductionList"
                                name="VType"
                                value="AllowsDeductionList"
                                checked={formik.values.VType === "AllowsDeductionList"}
                                onChange={formik.handleChange}
                              />
                              <Label className="form-check-label" htmlFor="AllowsDeductionList">
                                Allows / Deduction list
                              </Label>
                            </div>
                          </Col>
                          <Col xxl={2} md={2}>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="AllowsDeductionSummary"
                                name="VType"
                                value="AllowsDeductionSummary"
                                checked={formik.values.VType === "AllowsDeductionSummary"}
                                onChange={formik.handleChange}
                              />
                              <Label className="form-check-label" htmlFor="AllowsDeductionSummary">
                                Allows / Deduction Summary
                              </Label>
                            </div>
                          </Col>
                          <Col xxl={2} md={2}>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="GratuityDetails"
                                name="VType"
                                value="GratuityDetails"
                                checked={formik.values.VType === "GratuityDetails"}
                                onChange={formik.handleChange}
                              />
                              <Label className="form-check-label" htmlFor="GratuityDetails">
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
                              id="HygieneCardFormat"
                              name="VType"
                              value="HygieneCardFormat"
                              checked={formik.values.VType === "HygieneCardFormat"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="HygieneCardFormat">
                              Hygiene Card Format
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="EOBIContribution"
                              name="VType"
                              value="EOBIContribution"
                              checked={formik.values.VType === "EOBIContribution"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="EOBIContribution">
                              EOBI Contribution
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="SSContribution"
                              name="VType"
                              value="SSContribution"
                              checked={formik.values.VType === "SSContribution"}
                              onChange={formik.handleChange}
                            />
                            <Label className="form-check-label" htmlFor="SSContribution">
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
         <Row>
          {showFilters && (
             <Col lg={12}>
                {showTable && (filters.VType === "SalarySheet" || filters.VType === "FinalSettlement" || filters.VType === "StopSalary" || filters.VType === "SalaryAll") && (
                    Array.isArray(tableData) && tableData.length > 0 ? (
                        // <SalaryReportTwoPreview
                        <SalaryReportPreview
                            // We don't need `emp` anymore if SalaryReportPreview always shows the full report
                            // key="full-salary-report" // A static key since it's a single instance
                            allEmployees={employeeCards} // Pass the grouped data here
                            reportHeading={filters.ReportHeading}
                            dateFrom={filters.DateFrom}
                            dateTo={filters.DateTo}
                        />
                    ) : (
                        <div className="text-center text-muted">No data found.</div>
                    )
                )}
                 {showTable && filters.VType === "SummarySheet" && (
                    Array.isArray(tableData) && tableData.length > 0 ? (
                        <SalarySummaryReportPreview
                            summaryData={tableData} 
                            reportHeading={filters.ReportHeading}
                            dateFrom={filters.DateFrom}
                            dateTo={filters.DateTo}
                        />
                    ) : (
                        <div className="text-center text-muted">No data found.</div>
                    )
                )}
                 {showTable && filters.VType === "PaymentSlipEnglish" && (
                    Array.isArray(tableData) && tableData.length > 0 ? (
                        <SalarySlipPreview
                            employeesData={employeeCards}  
                            reportHeading={filters.ReportHeading}
                            dateFrom={filters.DateFrom}
                            dateTo={filters.DateTo}
                        />
                    ) : (
                        <div className="text-center text-muted">No data found.</div>
                    )
                )}
                {showTable && filters.VType === "SalaryHistory1" && (
                  Array.isArray(tableData) && tableData.length > 0 ? (
                    <SalaryHistoryPreview
                      data={employeeCards}
                      reportHeading={filters.ReportHeading}
                      dateFrom={filters.DateFrom}
                      dateTo={filters.DateTo}
                    />
                  ) : (
                    <div className="text-center text-muted">No data found.</div>
                  )
                )}
                 {showTable && filters.VType === "OTSheet" && (
                        Array.isArray(tableData) && tableData.length > 0 ? (
                          <SalaryOverTimeSheetPreview
                            allEmployees={tableData}
                            reportHeading={filters.ReportHeading}
                            dateFrom={filters.DateFrom}
                            dateTo={filters.DateTo}
                          />
                        ) : (
                          <div className="text-center text-muted">No data found.</div>
                        )
                )}
              {showTable && filters.VType === "OTSummary" && (
                    Array.isArray(tableData) && tableData.length > 0 ? (
                        <SalaryOverTimeSummaryReportPreview
                            summaryData={tableData} 
                            reportHeading={filters.ReportHeading}
                            dateFrom={filters.DateFrom}
                            dateTo={filters.DateTo}
                        />
                    ) : (
                        <div className="text-center text-muted">No data found.</div>
                    )
                )}
               {showTable && filters.VType === "EmpFinalSettlement" && (
                    Array.isArray(tableData) && tableData.length > 0 ? (
                        <SalaryFinalSettlementPreview
                            allEmployees={tableData} 
                            reportHeading={filters.ReportHeading}
                            dateFrom={filters.DateFrom}
                            dateTo={filters.DateTo}
                        />
                    ) : (
                        <div className="text-center text-muted">No data found.</div>
                    )
                )}
                {showTable && filters.VType === "AllowsDeductionList" && (
                    Array.isArray(tableData) && tableData.length > 0 ? (
                        <SalaryAllwDedPreview
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
            // <Col lg={12}>
            //   {showTable && filters.VType === "SalarySheet" && (
            //     Array.isArray(tableData) && tableData.length > 0 ? (
            //             groupByEmployee(tableData).map((emp, idx) => (
            //               <SalaryReportPreview
            //                 key={emp.EmpID || idx}
            //                 emp={emp}
            //                 allEmployees={employeeCards}
            //                 reportHeading={filters.ReportHeading}
            //                 dateFrom={filters.DateFrom}
            //                 dateTo={filters.DateTo}
            //               />
            //             ))
            //           ) : (
            //             <div className="text-center text-muted">No data found.</div>
            //           )
            //   )}
            // </Col>
          )}
        </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SalaryReport;
