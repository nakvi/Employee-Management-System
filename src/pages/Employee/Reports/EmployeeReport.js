import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Row,
  Input,
  Label,
  Form,
  Accordion,
  AccordionItem,
  Collapse,
} from "reactstrap";
import Invoice from "../../../Components/pdfsPreviews/invoice";
import ReportsPreview from "../../../Components/pdfsPreviews/reports";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver"; import DeleteModal from "../../../Components/Common/DeleteModal";
import config from "../../../config"; // ✅ correct
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";

import avatar1 from "../../../assets/images/users/avatar-11.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getEmployee,
  submitEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../../slices/employee/employee/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getReligion } from "../../../slices/employee/religion/thunk";
import { getGrade } from "../../../slices/setup/grade/thunk";
import { getGender } from "../../../slices/employee/gender/thunk";
import classnames from "classnames";
import { getShift } from "../../../slices/setup/shift/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Access location to get filter state
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [col, setCol] = useState(false);
  const [accordionDisabled, setAccordionDisabled] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(false);


  const t_col = () => {
    setCol(!col);
  };
  // Access Redux state
  const { loading, error, employee } = useSelector((state) => state.Employee);
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { location: locations } = useSelector((state) => state.Location);
  const { shift } = useSelector((state) => state.Shift);
  const { department } = useSelector((state) => state.Department);
  const { designation } = useSelector((state) => state.Designation);
  const { religion } = useSelector((state) => state.Religion);
  const { grade } = useSelector((state) => state.Grade);
  const { gender } = useSelector((state) => state.Gender);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [joinDateEnabled, setJoinDateEnabled] = useState(false);
  const [resignDateEnabled, setResignDateEnabled] = useState(false);
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getEmployee());
    dispatch(getLocation());
    dispatch(getDesignation());
    dispatch(getDepartment());
    dispatch(getReligion());
    dispatch(getGrade());
    dispatch(getGender());
    dispatch(getShift());
    dispatch(getEmployeeType());
  }, [dispatch]);
  // Restore filter state from location.state
  useEffect(() => {
    if (location.state?.filterValues) {
      console.log("Restoring filter values from state:", location.state.filterValues);
      formik.setValues(location.state.filterValues);
      setSearchText(location.state.filterValues.SearchFilter || "");
      handleFilterSubmit(location.state.filterValues);
      if (!location.state.filterValues.SearchFilter) {
        setCol(false);
        setAccordionDisabled(false);
        handleAccordionToggle(true);
      }
    }
  }, [location.state]);

  // Set default employee type if not already set
  useEffect(() => {
    if (employeeType.length > 0 && !formik.values.ETypeID) {
      formik.setFieldValue('ETypeID', employeeType[0].VID);
    }
  }, [employeeType]);

  useEffect(() => {
    if (employee) {
      console.log("Employee data loaded successfully!", employee);

      const filtered = employee.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, employee]); // 🔁 FIXED dependency

  function buildEmployeeFilterString(values) {
    let filters = [];

    filters.push(`E."CompanyID" = 1`);
    if (values.ETypeID && values.ETypeID !== "-1") filters.push(`E."ETypeID" = ${values.ETypeID}`);
    if (values.EmpID && values.EmpID !== "-1") filters.push(`E."EmpID" = ${values.EmpID}`);
    if (values.FName) filters.push(`E."FName" ILIKE '%' || '${values.FName}' || '%'`);
    if (values.DeptID && values.DeptID !== "-1") filters.push(`E."DeptID" = ${values.DeptID}`);
    if (values.DesgID && values.DesgID !== "-1") filters.push(`E."DesgID" = ${values.DesgID}`);
    if (values.HODID && values.HODID !== "-1") filters.push(`E."HODID" = ${values.HODID}`);
    if (values.NIC) filters.push(`E."NIC" ILIKE '%' || '${values.NIC}' || '%'`);
    if (values.LocationID && values.LocationID !== "-1") filters.push(`E."LocationID" = ${values.LocationID}`);
    if (values.ShiftID && values.ShiftID !== "-1") filters.push(`E."ShiftID" = ${values.ShiftID}`);
    if (values.GradeID && values.GradeID !== "-1") filters.push(`E."GradeID" = ${values.GradeID}`);
    if (values.leftStatusId && values.leftStatusId !== "-1") filters.push(`E."LeftStatus" = ${values.leftStatusId}`);
    if (values.BloodGroup) filters.push(`E."Bloodgroup" ILIKE '%' || '${values.BloodGroup}' || '%'`);
    if (values.SalaryFrom && values.SalaryTo) filters.push(`(E.basicsalary >= ${values.SalaryFrom} AND E.basicsalary <= ${values.SalaryTo})`);
    if (values.JoinDateFrom && values.JoinDateTo) filters.push(`(E.doj >= '${values.JoinDateFrom}' AND E.doj <= '${values.JoinDateTo}')`);
    if (values.ResignDateFrom && values.ResignDateTo) filters.push(`(E.dol >= '${values.ResignDateFrom}' AND E.dol <= '${values.ResignDateTo}')`);

    return filters.join(" AND ");
  }

  // Edit Click
  const handleEditClick = (row) => {
    navigate("/employee", { state: { employee: row, filterValues: formik.values } });
    // navigate("/employee", { state: { employee: row } });
    // window.open(`/employee?EmpID=${row.EmpID}`, '_blank', 'noopener,noreferrer');

  };
  // Add this state
  const [dynamicColumns, setDynamicColumns] = useState([]);

  // Update filteredData and columns after API call
  const handleFilterSubmit = async (values) => {

    // Convert SalaryFrom and SalaryTo to numbers if they exist
    const filterValues = {
      ...values,
      SalaryFrom: values.SalaryFrom ? parseInt(values.SalaryFrom, 10) : "",
      SalaryTo: values.SalaryTo ? parseInt(values.SalaryTo, 10) : "",
    };

    const apiUrl = `${config.api.API_URL}employeeReport?`;
    let filterString = buildEmployeeFilterString(filterValues);
    // console.log("ReportType sent:", filterValues.ReportType);
    let cWhere = filterString ? `WHERE ${filterString}` : "";
    const params = {
      Orgini: "LTT",
      cWhere: cWhere,
      VDate: "2020-06-05",
      IsAu: 0,
      EmpID: 9,
      IsExport: 0,
      Compcode: 0,
      UID: 1,
      ReportType: filterValues.ReportType || "EmpList", // Default to EmpList if not provided
    };
    const queryString = Object.entries(params)
      .map(([key, val]) =>
        key === "cWhere"
          ? `${key}=${val}`
          : `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
      )
      .join("&");
    const fullUrl = apiUrl + queryString;
    console.log("API URL:", fullUrl);
    try {
      const response = await fetch(fullUrl);
      const data = await response.json();
      setFilteredData(Array.isArray(data) ? data : []);
      setShowPreview(true);

      // Dynamically set columns from response
      if (Array.isArray(data) && data.length > 0) {
        const firstRow = data[0];
        const cols = Object.keys(firstRow).map(key => ({
          name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          selector: row => row[key],
          sortable: true,
          wrap: true,
        }));
        setDynamicColumns(cols);
      } else {
        setDynamicColumns([]);
      }
    } catch (err) {
      console.error("Error fetching employee data:", err);
      setShowPreview(false);
      setDynamicColumns([]);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteEmployee(deleteId));
    }
    setDeleteModal(false);
  };

  const customStyles = {
    table: {
      style: {
        border: "1px solid #dee2e6",
        tableLayout: "auto",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #dee2e6",
        fontWeight: "500",
      },
    },
    rows: {
      style: {
        minHeight: "45px",
        borderBottom: "1px solid #dee2e6",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        borderRight: "1px solid #dee2e6",
      },
    },
  };
  // Formik form setup
  const formik = useFormik({
    initialValues: {
      SearchFilter: '',
      ETypeID: '',
      EmpID: '',
      FName: '',
      DeptID: '',
      DesgID: '',
      HODID: '',
      NIC: '',
      LocationID: '',
      ShiftID: '',
      ReligionID: '',
      GradeID: '',
      PseudoName: '',
      BloodGroup: '',
      SalaryFrom: '',
      SalaryTo: '',
      JoinDateCheck: false,
      JoinDateFrom: "",
      JoinDateTo: "",
      ResignEmployeeCheck: false,
      ResignDateFrom: '',
      ResignDateTo: '',
      ReportType: 'EmpList',
      leftStatusId: ''
    },

    validationSchema: Yup.object({
      SearchFilter: Yup.string(),
      NIC: Yup.string()
        .matches(/^\d{5}-\d{7}-\d{1}$/, 'CNIC must be in format XXXXX-XXXXXXX-X'),
      SalaryFrom: Yup.number().typeError('Must be a number'),
      SalaryTo: Yup.number().typeError('Must be a number'),
    }),
    onSubmit: handleFilterSubmit,
    // onSubmit: (values) => {
    //   let payload = {};

    //   if (values.SearchFilter && values.SearchFilter.trim() !== '') {
    //     payload = { Search: values.SearchFilter.trim() };
    //   } else {
    //     // Create filtered payload without empty values
    //     Object.entries(values).forEach(([key, value]) => {
    //       if (key !== 'SearchFilter' && value !== '' && value !== null && value !== undefined) {
    //         payload[key] = value;
    //       }
    //     });
    //   }

    //   console.log("Form submitted with:", payload);
    //   // Apply your filters or dispatch actions here
    // },
  });

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue("SearchFilter", value);
    setAccordionDisabled(!!value.trim());
  };

  // Toggle accordion
  const handleAccordionToggle = () => {
    if (!accordionDisabled) {
      setCol(!col);
      setSearchDisabled(!searchDisabled);
      if (!col) {
        formik.setFieldValue("SearchFilter", "");
      }
    }
  };

  // set date format
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee List");
    XLSX.writeFile(workbook, "Employee-List.xlsx");
  };

  const exportToPDF = () => {
    // Use landscape orientation for more width
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Employee List", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() / 2, 22, { align: "center" });

    const headers = [[
      "Emp Code",
      "Employee Name",
      "Father Name",
      "Designation",
      "Birth Date",
      "Joining Date",
      "Probation Date",
      "CNIC No",
      "Mobile No",
      "Email",
      "Head Name",
      "Company Code",
      "Company Name",
      "Is Active",
      "Machine Card No",
      "Basic Salary"
    ]];

    const data = (employee || []).map(emp => [
      emp.EmpCode,
      emp.EName,
      emp.FName,
      emp.DesignationTitle,
      emp.DOB,
      emp.DOJ,
      emp.ProbitionDate,
      emp.NIC,
      emp.CellPhone,
      emp.Email,
      emp.HODName,
      emp.CompanyCode,
      emp.CompanyName,
      emp.IsActive,
      emp.MachineCardNo,
      emp.BasicSalary
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      tableWidth: "auto", // Use full width in landscape
      margin: { left: 14, right: 14, top: 30 },
      styles: { cellPadding: 2, fontSize: 8, valign: "middle", halign: "left", overflow: 'linebreak' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 9, fontStyle: "bold", halign: "center" },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Page ${data.pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }
    });

    doc.save(`Employee_List_${new Date().toISOString().slice(0, 10)}.pdf`);
  };


  // Export to Word
  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];

    // Define the columns you want to export
    const headers = [
      "Emp Code",
      "Employee Name",
      "Father Name",
      "Designation",
      "Birth Date",
      "Joining Date",
      "Probation Date",
      "CNIC No",
      "Mobile No",
      "Email",
      "Head Name",
      "Company Code",
      "Company Name",
      "Is Active",
      "Machine Card No",
      "Basic Salary"
    ];

    // Add header row
    const headerCells = headers.map(key =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: key,
                bold: true,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
      })
    );
    tableRows.push(new TableRow({ children: headerCells }));

    // Add data rows
    data.forEach(item => {
      const rowCells = [
        item.EmpCode,
        item.EName,
        item.FName,
        item.DesignationTitle,
        item.DOB,
        item.DOJ,
        item.ProbitionDate,
        item.NIC,
        item.CellPhone,
        item.Email,
        item.HODName,
        item.CompanyCode,
        item.CompanyName,
        item.IsActive,
        item.MachineCardNo,
        item.BasicSalary
      ].map(value =>
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: String(value ?? ""),
                  size: 18,
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
          ],
          width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
        })
      );
      tableRows.push(new TableRow({ children: rowCells }));
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Employee List",
              heading: "Heading1",
            }),
            new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "Employee-List.docx");
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  document.title = "Employee | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Form onSubmit={formik.handleSubmit}>
              <Col lg={12} className="bg-white p-1">
                {/* <PreviewCardHeader3 title="Employee Report" /> */}
                <CardHeader
                  className="align-items-center d-flex py-2"
                  style={{
                    color: "#495057",
                    marginLeft: "16px",
                    border: "none",
                  }}
                >
                  <h4 className="card-title mb-0 flex-grow-1">
                    Employee Report
                  </h4>
                  <div className="flex-shrink-0">

                    <Button
                      type="submit"
                      color="success"
                      className="add-btn me-1 py-1"
                      id="create-btn"
                    >
                      <i className="align-bottom me-1"></i>Preview
                    </Button>
                    <Button
                      color="dark"
                      className="add-btn me-1 py-1"
                      onClick={() => {
                        formik.resetForm();
                        setFilteredData([]);        // <-- Show empty table
                        setDynamicColumns([]);      // <-- Remove columns as well (optional)
                        setCol(false);
                        setAccordionDisabled(false);
                        setSearchDisabled(false);
                        setShowPreview(false); // Hide preview on cancel
                      }}
                    >
                      <i className="align-bottom me-1"></i> Cancel
                    </Button>
                  </div>
                </CardHeader>
              </Col>
              <Col lg={12}>
                <Card>
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="ETypeID" className="form-label">
                              E-Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="ETypeID"
                              id="ETypeID"
                              value={formik.values.ETypeID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {employeeType.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.ETypeID && formik.errors.ETypeID ? (
                              <div className="text-danger">
                                {formik.errors.ETypeID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="ETypeID"
                              className="form-label"
                            >
                              E-Type
                            </Label>
                            <select
                              name="ETypeID"
                              id="ETypeID"
                              className="form-select form-select-sm"
                              value={formik.values.ETypeID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="-1">---Select---</option>
                              {employeeType?.length > 0 ? (
                                employeeType.map((group) => (
                                  <option
                                    key={group.VID}
                                    value={group.VID}
                                  >
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No Employee Type available
                                </option>
                              )}
                            </select>
                            {formik.touched.ETypeID &&
                              formik.errors.ETypeID ? (
                              <div className="text-danger">
                                {formik.errors.ETypeID}
                              </div>
                            ) : null}
                          </div>
                        </Col> */}
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="EmpID" className="form-label">
                              Employee
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="EmpID"
                              id="EmpID"
                              value={formik.values.EmpID}
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                              disabled={!formik.values.ETypeID}
                            >
                              <option value="">---Select---</option>
                              {employee
                                .filter(
                                  (emp) =>
                                    emp.ETypeID ===
                                    parseInt(formik.values.ETypeID)
                                )
                                .map((item) => (
                                  <option key={item.EmpID} value={item.EmpID}>
                                    {item.EName}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.EmpID && formik.errors.EmpID ? (
                              <div className="text-danger">
                                {formik.errors.EmpID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="EmpID"
                              className="form-label"
                            >
                              Employee
                            </Label>
                            <select
                              name="EmpID"
                              id="EmpID"
                              className="form-select form-select-sm"
                              value={formik.values.EmpID}
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1">---Select---</option>
                              {employee?.length > 0 ? (
                                employee.map((group) => (
                                  <option
                                    key={group.EmpID}
                                    value={group.EmpID}
                                  >
                                    {group.EName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No Employee available
                                </option>
                              )}
                            </select>
                            {formik.touched.EmpID &&
                              formik.errors.EmpID ? (
                              <div className="text-danger">
                                {formik.errors.EmpID}
                              </div>
                            ) : null}
                          </div>
                        </Col> */}
                        <Col xxl={2} md={3}>
                          <div>
                            <Label
                              htmlFor="FName"
                              className="form-label"
                            >
                              Father Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="FName"
                              {...formik.getFieldProps("FName")}
                              placeholder="Father Name"
                            />
                            {formik.touched.EmpID &&
                              formik.errors.EmpID ? (
                              <div className="text-danger">
                                {formik.errors.EmpID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          {/* Department */}
                          <div className="mb-3">
                            <Label
                              htmlFor="DeptID"
                              className="form-label"
                            >
                              Department
                            </Label>
                            <select
                              name="DeptID"
                              id="DeptID"
                              className="form-select form-select-sm"
                              value={formik.values.DeptID} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1">---Select---</option>
                              {department.data?.length > 0 ? (
                                department.data.map((group) => (
                                  <option
                                    key={group.VID}
                                    value={group.VID}
                                  >
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No Department available
                                </option>
                              )}
                            </select>
                            {formik.touched.DeptID &&
                              formik.errors.DeptID ? (
                              <div className="text-danger">
                                {formik.errors.DeptID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="DesgID"
                              className="form-label"
                            >
                              Designation
                            </Label>
                            <select
                              name="DesgID"
                              id="DesgID"
                              className="form-select form-select-sm"
                              value={formik.values.DesgID} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1">---Select---</option>
                              {designation?.length > 0 ? (
                                designation.map((group) => (
                                  <option
                                    key={group.VID}
                                    value={group.VID}
                                  >
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No Designation available
                                </option>
                              )}
                            </select>
                            {formik.touched.DesgID &&
                              formik.errors.DesgID ? (
                              <div className="text-danger">
                                {formik.errors.DesgID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
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
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="NIC"
                              className="form-label"
                            >
                              CNIC
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="NIC"
                              {...formik.getFieldProps("NIC")}
                              placeholder="xxxx-xxxxxxxx-x"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          {/* Location */}
                          <div className="mb-3">
                            <Label
                              htmlFor="LocationID"
                              className="form-label"
                            >
                              Location
                            </Label>
                            <select
                              name="LocationID"
                              id="LocationID"
                              className="form-select form-select-sm"
                              value={formik.values.LocationID} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1">---Select---</option>
                              {locations?.length > 0 ? (
                                locations.map((group) => (
                                  <option
                                    key={group.VID}
                                    value={group.VID}
                                  >
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No location available
                                </option>
                              )}
                            </select>
                            {formik.touched.LocationID &&
                              formik.errors.LocationID ? (
                              <div className="text-danger">
                                {formik.errors.LocationID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="ShiftID"
                              className="form-label"
                            >
                              Shift
                            </Label>
                            <select
                              name="ShiftID"
                              id="ShiftID"
                              className="form-select form-select-sm"
                              value={formik.values.ShiftID} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1">---Select---</option>
                              {shift?.length > 0 ? (
                                shift.map((group) => (
                                  <option
                                    key={group.VID}
                                    value={group.VID}
                                  >
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No Shift available
                                </option>
                              )}
                            </select>
                            {formik.touched.ShiftID &&
                              formik.errors.ShiftID ? (
                              <div className="text-danger">
                                {formik.errors.ShiftID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          {/* Religion */}
                          <div className="mb-3">
                            <Label
                              htmlFor="ReligionID"
                              className="form-label"
                            >
                              Region
                            </Label>
                            <select
                              name="ReligionID"
                              id="ReligionID"
                              className="form-select form-select-sm"
                              value={formik.values.ReligionID} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1">---Select---</option>
                              {religion?.length > 0 ? (
                                religion.map((group) => (
                                  <option
                                    key={group.VID}
                                    value={group.VID}
                                  >
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No Religion available
                                </option>
                              )}
                            </select>
                            {formik.touched.ReligionID &&
                              formik.errors.ReligionID ? (
                              <div className="text-danger">
                                {formik.errors.ReligionID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          {/* Grade */}
                          <div className="mb-3">
                            <Label
                              htmlFor="GradeID"
                              className="form-label"
                            >
                              Grade
                            </Label>
                            <select
                              name="GradeID"
                              id="GradeID"
                              className="form-select form-select-sm"
                              value={formik.values.GradeID} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1">---Select---</option>
                              {grade?.length > 0 ? (
                                grade.map((group) => (
                                  <option
                                    key={group.VID}
                                    value={group.VID}
                                  >
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No grade available
                                </option>
                              )}
                            </select>
                            {formik.touched.GradeID &&
                              formik.errors.GradeID ? (
                              <div className="text-danger">
                                {formik.errors.GradeID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="PseudoName"
                              className="form-label"
                            >
                              Pseudo Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="PseudoName"
                              name="PseudoName"
                              {...formik.getFieldProps("PseudoName")}
                              placeholder="Pseudo Name"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="leftStatusId" className="form-label">
                              Left Status
                            </Label>
                            <select
                              name="leftStatusId"
                              id="leftStatusId"
                              className="form-select form-select-sm"
                              value={formik.values.leftStatusId} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1">---Select---</option>
                              <option value="1">Left</option>
                              <option value="2">Not Left</option>
                            </select>
                            {formik.touched.leftStatusId &&
                              formik.errors.leftStatusId ? (
                              <div className="text-danger">
                                {formik.errors.leftStatusId}
                              </div>
                            ) : null}
                          </div>

                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label
                              htmlFor="BloodGroup"
                              className="form-label"
                            >
                              Blood Group
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="BloodGroup"
                              name="BloodGroup"
                              {...formik.getFieldProps("BloodGroup")}
                              placeholder="Blood Group"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="SalaryFrom" className="form-label">
                              Salary From
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="SalaryFrom"
                              name="SalaryFrom"
                              {...formik.getFieldProps("SalaryFrom")}
                              placeholder="Salary From"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="SalaryTo" className="form-label">
                              Salary To
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="SalaryTo"
                              name="SalaryTo"
                              {...formik.getFieldProps("SalaryTo")}
                              placeholder="Salary To"
                            />
                          </div>
                        </Col>
                        <Col xxl={4} md={9}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Report Title
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Report Title"
                            />
                          </div>
                        </Col>
                        <Row>
                          <Col xxl={2} md={2}>
                            <Label className="form-check-label" htmlFor="JoinDateCheck">
                              Join Date
                            </Label>
                            <span className="form-control input-sm input-checkbox p-1 mt-2">
                              <Input
                                className="form-check-input"
                                type="checkbox"
                                id="JoinDateCheck"
                                checked={joinDateEnabled}
                                onChange={e => setJoinDateEnabled(e.target.checked)}
                              />
                            </span>
                          </Col>
                          <Col xxl={2} md={4}>
                            <div>
                              <Label htmlFor="JoinDateFrom" className="form-label">
                                Join Date From
                              </Label>
                              <Input
                                type="date"
                                className="form-control-sm"
                                id="JoinDateFrom"
                                name="JoinDateFrom"
                                disabled={!joinDateEnabled}
                                {...formik.getFieldProps("JoinDateFrom")}
                              />
                            </div>
                          </Col>
                          <Col xxl={2} md={4}>
                            <div>
                              <Label htmlFor="JoinDateTo" className="form-label">
                                Join Date To
                              </Label>
                              <Input
                                type="date"
                                className="form-control-sm"
                                id="JoinDateTo"
                                name="JoinDateTo"
                                disabled={!joinDateEnabled}
                                {...formik.getFieldProps("JoinDateTo")}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col xxl={2} md={2}>
                            <Label className="form-check-label" htmlFor="ResignEmployeeCheck">
                              Resign Employee
                            </Label>
                            <span className="form-control input-sm input-checkbox p-1 mt-2">
                              <Input
                                className="form-check-input"
                                type="checkbox"
                                id="ResignEmployeeCheck"
                                checked={resignDateEnabled}
                                onChange={e => setResignDateEnabled(e.target.checked)}
                              />
                            </span>
                          </Col>
                          <Col xxl={2} md={4}>
                            <div>
                              <Label htmlFor="ResignDateFrom" className="form-label">
                                Resign Date From
                              </Label>
                              <Input
                                type="date"
                                className="form-control-sm"
                                id="ResignDateFrom"
                                name="ResignDateFrom"
                                disabled={!resignDateEnabled}
                                {...formik.getFieldProps("ResignDateFrom")}
                              />
                            </div>
                          </Col>
                          <Col xxl={2} md={4}>
                            <div>
                              <Label htmlFor="ResignDateTo" className="form-label">
                                Resign Date To
                              </Label>
                              <Input
                                type="date"
                                className="form-control-sm"
                                id="ResignDateTo"
                                name="ResignDateTo"
                                disabled={!resignDateEnabled}
                                {...formik.getFieldProps("ResignDateTo")}
                              />
                            </div>
                          </Col>
                        </Row>
                        {/* Optional grid */}
                        <Col lg={12} className="bg-white p-1">
                          <Row className="mt-2 p-2">
                            <Col xxl={2} md={3}>
                              <div className="form-check mt-3" dir="ltr">
                                <Input
                                  type="radio"
                                  className="form-check-input"
                                  id="EmpList"
                                  name="ReportType"
                                  value="EmpList"
                                  checked={formik.values.ReportType === "EmpList"}
                                  onChange={formik.handleChange}
                                />
                                <Label className="form-check-label" htmlFor="EmpList">
                                  Employee Records
                                </Label>
                              </div>
                            </Col>
                            <Col xxl={2} md={3}>
                              <div className="form-check mt-3" dir="ltr">
                                <Input
                                  type="radio"
                                  className="form-check-input"
                                  id="EmpOnDate"
                                  name="ReportType"
                                  value="EmpOnDate"
                                  checked={formik.values.ReportType === "EmpOnDate"}
                                  onChange={formik.handleChange}
                                />
                                <Label className="form-check-label" htmlFor="EmpOnDate">
                                  Employee On Date
                                </Label>
                              </div>
                            </Col>
                            <Col xxl={2} md={3}>
                              <div className="form-check mt-3" dir="ltr">
                                <Input
                                  type="radio"
                                  className="form-check-input"
                                  id="EmpStrength"
                                  name="ReportType"
                                  value="EmpStrength"
                                  checked={formik.values.ReportType === "EmpStrength"}
                                  onChange={formik.handleChange}
                                />
                                <Label className="form-check-label" htmlFor="EmpStrength">
                                  Department Strength
                                </Label>
                              </div>
                            </Col>
                            <Col xxl={2} md={3}>
                              <div className="form-check mt-3" dir="ltr">
                                <Input
                                  type="radio"
                                  className="form-check-input"
                                  id="EmpStrengthOnDate"
                                  name="ReportType"
                                  value="EmpStrengthOnDate"
                                  checked={formik.values.ReportType === "EmpStrengthOnDate"}
                                  onChange={formik.handleChange}
                                />
                                <Label className="form-check-label" htmlFor="EmpStrengthOnDate">
                                  Strength On Date
                                </Label>
                              </div>
                            </Col>
                            <Col xxl={2} md={2}>
                              <div className="form-check mt-3" dir="ltr">
                                <Input
                                  type="radio"
                                  className="form-check-input"
                                  id="EmpCard"
                                  name="ReportType"
                                  value="EmpCard"
                                  checked={formik.values.ReportType === "EmpCard"}
                                  onChange={formik.handleChange}
                                />
                                <Label className="form-check-label" htmlFor="EmpCard">
                                  Employee Card
                                </Label>
                              </div>
                            </Col>
                            <Col xxl={2} md={3}>
                              <div className="form-check mt-3" dir="ltr">
                                <Input
                                  type="radio"
                                  className="form-check-input"
                                  id="EmpHierarchy"
                                  name="ReportType"
                                  value="EmpHierarchy"
                                  checked={formik.values.ReportType === "EmpHierarchy"}
                                  onChange={formik.handleChange}
                                />
                                <Label className="form-check-label" htmlFor="EmpHierarchy">
                                  Employee Hierarchy
                                </Label>
                              </div>
                            </Col>
                            <Col xxl={2} md={3}>
                              <div className="form-check mt-3" dir="ltr">
                                <Input
                                  type="radio"
                                  className="form-check-input"
                                  id="TrialEmployee"
                                  name="ReportType"
                                  value="TrialEmployee"
                                  checked={formik.values.ReportType === "TrialEmployee"}
                                  onChange={formik.handleChange}
                                />
                                <Label className="form-check-label" htmlFor="TrialEmployee">
                                  Trial Employee
                                </Label>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Card>
              </Col>

            </Form>
          </Row>
        </Container>

        <Container fluid>
          <Row>
            <Col xxl={12} md={12}>
              <Card className="shadow-sm">
                <CardBody>
                  {showPreview ? (
                    formik.values.ReportType === "EmpCard" && filteredData.length > 0 ? (
                      <Row>
                        {filteredData.map(emp => (
                          <Col key={emp.EmpID} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Card className="text-center h-100" style={{ borderRadius: "15px", boxShadow: "0 2px 8px #40518982" }}>
                              <div style={{ marginTop: "16px" }}>
                                {console.log('1', emp)}
                                <img
                                  src={emp.ImageUrl || avatar1}
                                  alt={emp.EName}
                                  style={{
                                    width: "70px",
                                    height: "70px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "4px solid gold"
                                  }}
                                />
                                {emp.IsActive === true || emp.IsActive === 1 ? (
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: "14px",
                                      height: "14px",
                                      background: "green",
                                      borderRadius: "50%",
                                      border: "2px solid #fff",
                                      position: "relative",
                                      left: "-18px",
                                      top: "-18px"
                                    }}
                                  ></span>
                                ) : (
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: "14px",
                                      height: "14px",
                                      background: "#ff3d3d",
                                      borderRadius: "50%",
                                      border: "2px solid #fff",
                                      position: "relative",
                                      left: "-18px",
                                      top: "-18px"
                                    }}
                                  ></span>
                                )}

                              </div>
                              <CardBody>
                                <h5>
                                  {emp.EName}{" "}
                                  {emp.IsActive === true || emp.IsActive === 1 ? (
                                    <span style={{ color: "green" }}>Online</span>
                                  ) : (
                                    <span style={{ color: "red" }}>Offline</span>
                                  )}
                                </h5>
                                <div style={{ fontSize: "14px", color: "#555" }}>
                                  <div>
                                    <i className="mdi mdi-office-building"></i> {emp.Department || ""}
                                  </div>
                                  <div>
                                    <i className="mdi mdi-account-tie"></i> {emp.Designation || ""}
                                  </div>
                                  <div>
                                    <i className="mdi mdi-email"></i> {emp.Email}
                                  </div>
                                  <div>
                                    <i className="mdi mdi-domain"></i> {emp.CompanyName}
                                  </div>
                                </div>
                                <Button color="primary" className="mt-2" style={{ width: "100%" }}>
                                  View Profile
                                </Button>
                              </CardBody>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      dynamicColumns.length > 0 ? (
                        <DataTable
                          title="Employee Report"
                          columns={dynamicColumns}
                          data={filteredData}
                          pagination
                          paginationPerPage={100}
                          paginationRowsPerPageOptions={[100, 200, 500]}
                          highlightOnHover
                          responsive
                          customStyles={customStyles}
                        />
                      ) : (
                        <div style={{ padding: "2rem", textAlign: "center", color: "#aaa" }}>
                          No data to display.
                        </div>
                      )
                    )
                  ) : (
                    null
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <DeleteModal
        show={deleteModal}
        onCloseClick={() => setDeleteModal(!deleteModal)}
        onDeleteClick={handleDeleteConfirm}
      />
    </React.Fragment>
  );
};

export default EmployeeList;
