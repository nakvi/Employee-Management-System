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
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { getLeaveType } from "../../../slices/Attendance/leaveType/thunk";
import {
  deleteLeave,
  getLeave,
  submitLeave,
  updateLeave,
} from "../../../slices/Attendance/leave/thunk";
import config from "../../../config";

const Leaves = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Redux state
  const { loading, error, leaves = [] } = useSelector((state) => state.Leave || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { employee = [] } = useSelector((state) => state.Employee || {});
  const { leaveType = [] } = useSelector((state) => state.LeaveType || {});

  // Fetch data on mount
  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getLeaveType());
    dispatch(getLeave());
  }, [dispatch]);

  // Filter data based on search text
  useEffect(() => {
    if (leaves && employee && leaveType) {
      const filtered = leaves.filter((item) => {
        const empName = employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "";
        const leaveTypeName = leaveType.find((row) => row.VID === item.LeaveTypeID)?.VName || "";
        const searchString = [
          empName,
          leaveTypeName,
          formatDate(item.DateFrom),
          formatDate(item.DateTo),
          item.VNo,
          item.VName,
        ].join(" ").toLowerCase();
        return searchString.includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [leaves, employee, leaveType, searchText]);

document.title = "Leave | EMS";
  // Formik setup
  const formik = useFormik({
    initialValues: {
      EmpID: "",
      ETypeID: "",
      LeaveTypeID: "",
      VNo: "",
      DateFrom: "",
      VName: "",
      DateTo: "",
      LocationID: 0,
      UID: 501,
      CompanyID: "1001",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number().min(1, "Employee Type is required").required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      VName: Yup.string().required("Remarks is required"),
      LeaveTypeID: Yup.number().min(1, "Leave is required").required("Required"),
      VNo: Yup.string().required("Leave No is required"),
      DateFrom: Yup.date().required("Date is required"),
      DateTo: Yup.date().required("Date is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingGroup) {
          await dispatch(updateLeave({ ...values, VID: editingGroup.VID })).unwrap();
          setAttendanceRecords([]);
          setLeaveBalances([]);
        } else {
          await dispatch(submitLeave(values)).unwrap();
        }
        dispatch(getLeave());
        resetForm();
        setEditingGroup(null);
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
  });

  // Handle edit click and fetch attendance records and leave balances
  const handleEditClick = async (group) => {
    const selectedEmployee = employee.find((emp) => String(emp.EmpID) === String(group.EmpID));
    const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";

    setEditingGroup(group);
    formik.setValues({
      VID: group.VID,
      EmpID: group.EmpID || "",
      ETypeID: employeeTypeId || "",
      LeaveTypeID: group.LeaveTypeID || "",
      VNo: group.VNo || "",
      DateFrom: group.DateFrom ? group.DateFrom.split("T")[0] : "",
      DateTo: group.DateTo ? group.DateTo.split("T")[0] : "",
      VName: group.VName || "",
      UID: group.UID || 202,
      CompanyID: group.CompanyID || "3001",
      Tranzdatetime: group.Tranzdatetime || "",
    });

    // Fetch attendance records
    try {
      const response = await fetch(
        `${config.api.API_URL}employeeLast10AttRecord/?empID=${group.EmpID}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      if (result.status === "0" && result.data) {
        setAttendanceRecords(result.data);
      } else {
        console.error("Failed to fetch attendance records:", result.message);
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      setAttendanceRecords([]);
    }

    // Get current year and date for API query
    const currentYear = new Date().getFullYear();
    const dateFrom = `${currentYear}-01-01`;
    const dateTo = `${currentYear}-12-31`;
    const vDate = format(new Date(), "yyyy-MM-dd");

    // Fetch leave balance
    try {
      const response = await fetch(
        `${config.api.API_URL}employeeLeaveBalance?Orgini=LTT&cWhere&DateFrom=${dateFrom}&DateTo=${dateTo}&VDate=${vDate}&IsAu=0&EmpID=${group.EmpID}&IsExport=0&cWhereLimit`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      setLeaveBalances(result);
    } catch (error) {
      console.error("Error fetching leave balances:", error);
      setLeaveBalances([]);
    }
  };

  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteLeave(deleteId)).then(() => {
        dispatch(getLeave());
        setAttendanceRecords([]);
        setLeaveBalances([]);
      });
    }
    setDeleteModal(false);
  };

  // Format dates
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  // Handle cancel action
  const handleCancel = () => {
    formik.resetForm();
    setEditingGroup(null);
    setAttendanceRecords([]);
    setLeaveBalances([]);
  };

  // Map leave types to the API response
  const leaveTypes = [
    { name: "Casual", data: leaveBalances[0] || {} },
    { name: "Sick", data: leaveBalances[1] || {} },
    { name: "Annual", data: leaveBalances[2] || {} },
    { name: "CPL", data: leaveBalances[3] || {} },
    { name: "Special", data: leaveBalances[4] || {} },
  ];

  // DataTable columns
  const columns = [
    {
      name: "Employee",
      selector: (row) => employee.find((emp) => String(emp.EmpID) === String(row.EmpID))?.EName || "N/A",
      sortable: true,
    },
    {
      name: "Leave Type",
      selector: (row) => leaveType.find((item) => item.VID === row.LeaveTypeID)?.VName || "N/A",
      sortable: true,
    },
    {
      name: "Date From",
      selector: (row) => formatDate(row.DateFrom),
      sortable: true,
    },
    {
      name: "Date To",
      selector: (row) => formatDate(row.DateTo),
      sortable: true,
    },
    {
      name: "Leave No",
      selector: (row) => row.VNo || "N/A",
      sortable: true,
    },
    {
      name: "Remarks",
      selector: (row) => row.VName || "N/A",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button className="btn btn-soft-info btn-sm" onClick={() => handleEditClick(row)}>
            <i className="bx bx-edit"></i>
          </Button>
          <Button className="btn btn-soft-danger btn-sm" onClick={() => handleDeleteClick(row.VID)}>
            <i className="ri-delete-bin-2-line"></i>
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // DataTable custom styles
  const customStyles = {
    table: {
      style: { border: "1px solid #dee2e6" },
    },
    headRow: {
      style: {
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #dee2e6",
        fontWeight: "600",
      },
    },
    rows: {
      style: { minHeight: "48px", borderBottom: "1px solid #dee2e6" },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        borderRight: "1px solid #dee2e6",
      },
    },
  };

  // Export to Excel
  const exportToExcel = () => {
    const exportData = (filteredData || []).map((item) => ({
      Employee: employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
      "Leave Type": leaveType.find((row) => row.VID === item.LeaveTypeID)?.VName || "N/A",
      "Date From": formatDate(item.DateFrom),
      "Date To": formatDate(item.DateTo),
      "Leave No": item.VNo || "N/A",
      Remarks: item.VName || "N/A",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leaves");
    XLSX.writeFile(workbook, "Leaves.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Leaves Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Employee", "Leave Type", "Date From", "Date To", "Leave No", "Remarks"]];
    const data = (filteredData || []).map((item) => [
      employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
      leaveType.find((row) => row.VID === item.LeaveTypeID)?.VName || "N/A",
      formatDate(item.DateFrom),
      formatDate(item.DateTo),
      item.VNo || "N/A",
      item.VName || "N/A",
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      margin: { top: 30 },
      styles: { cellPadding: 4, fontSize: 10, valign: "middle", halign: "left" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10, fontStyle: "bold", halign: "center" },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Page ${data.pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
          align: "center",
        });
      },
    });

    doc.save(`Leaves_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Export to Word
  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];
    const headers = ["Employee", "Leave Type", "Date From", "Date To", "Leave No", "Remarks"];

    // Header row
    const headerCells = headers.map((key) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: key, bold: true, size: 20 })],
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
      })
    );
    tableRows.push(new TableRow({ children: headerCells }));

    // Data rows
    data.forEach((item) => {
      const rowCells = [
        employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
        leaveType.find((row) => row.VID === item.LeaveTypeID)?.VName || "N/A",
        formatDate(item.DateFrom),
        formatDate(item.DateTo),
        item.VNo || "N/A",
        item.VName || "N/A",
      ].map((value) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: String(value), size: 18 })],
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
              text: "Leaves Report",
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

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Leaves.docx");
    });
  };

  document.title = "Leave | EMS";

  return (
    <React.Fragment>
      <style>
        {`
          .table-sm > :not(caption) > * > * {
            padding: 0px;
          }
        `}
      </style>
      <div className="page-content">
        <Container fluid>
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader title="Leave" onCancel={handleCancel} />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row>
                        <Col lg={12}>
                          <Row className="gy-4">
                            <Col xxl={2} md={3}>
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
                                  <div className="text-danger">{formik.errors.ETypeID}</div>
                                ) : null}
                              </div>
                            </Col>
                            <Col xxl={2} md={3}>
                              <div className="mb-3">
                                <Label htmlFor="EmpID" className="form-label">
                                  Employee
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  name="EmpID"
                                  id="EmpID"
                                  value={formik.values.EmpID}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  disabled={!formik.values.ETypeID}
                                >
                                  <option value="">---Select---</option>
                                  {employee
                                    .filter((emp) => emp.ETypeID === parseInt(formik.values.ETypeID))
                                    .map((item) => (
                                      <option key={item.EmpID} value={item.EmpID}>
                                        {item.EName}
                                      </option>
                                    ))}
                                </select>
                                {formik.touched.EmpID && formik.errors.EmpID ? (
                                  <div className="text-danger">{formik.errors.EmpID}</div>
                                ) : null}
                              </div>
                            </Col>
                            <Col xxl={2} md={3}>
                              <div className="mb-3">
                                <Label htmlFor="LeaveTypeID" className="form-label">
                                  Leave Type
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  name="LeaveTypeID"
                                  id="LeaveTypeID"
                                  value={formik.values.LeaveTypeID}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">---Select---</option>
                                  {leaveType.map((item) => (
                                    <option key={item.VID} value={item.VID}>
                                      {item.VName}
                                    </option>
                                  ))}
                                </select>
                                {formik.touched.LeaveTypeID && formik.errors.LeaveTypeID ? (
                                  <div className="text-danger">{formik.errors.LeaveTypeID}</div>
                                ) : null}
                              </div>
                            </Col>
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="VNo" className="form-label">
                                  Leave No
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="VNo"
                                  placeholder="Leave No"
                                  {...formik.getFieldProps("VNo")}
                                />
                                {formik.touched.VNo && formik.errors.VNo ? (
                                  <div className="text-danger">{formik.errors.VNo}</div>
                                ) : null}
                              </div>
                            </Col>
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
                                  {...formik.getFieldProps("DateFrom")}
                                />
                                {formik.touched.DateFrom && formik.errors.DateFrom ? (
                                  <div className="text-danger">{formik.errors.DateFrom}</div>
                                ) : null}
                              </div>
                            </Col>
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
                                  {...formik.getFieldProps("DateTo")}
                                />
                                {formik.touched.DateTo && formik.errors.DateTo ? (
                                  <div className="text-danger">{formik.errors.DateTo}</div>
                                ) : null}
                              </div>
                            </Col>
                            <Col xxl={2} md={6}>
                              <div>
                                <Label htmlFor="VName" className="form-label">
                                  Remarks
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="VName"
                                  name="VName"
                                  placeholder="Remarks"
                                  {...formik.getFieldProps("VName")}
                                />
                                {formik.touched.VName && formik.errors.VName ? (
                                  <div className="text-danger">{formik.errors.VName}</div>
                                ) : null}
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>
            <Col lg={9}>
              <Card>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <Button className="btn-sm" color="success" onClick={exportToExcel}>
                      Export to Excel
                    </Button>
                    <Button className="btn-sm" color="primary" onClick={exportToWord}>
                      Export to Word
                    </Button>
                    <Button className="btn-sm" color="danger" onClick={exportToPDF}>
                      Export to PDF
                    </Button>
                    <CSVLink
                      data={filteredData.map((item) => ({
                        Employee: employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
                        "Leave Type": leaveType.find((row) => row.VID === item.LeaveTypeID)?.VName || "N/A",
                        "Date From": formatDate(item.DateFrom),
                        "Date To": formatDate(item.DateTo),
                        "Leave No": item.VNo || "N/A",
                        Remarks: item.VName || "N/A",
                      }))}
                      filename="Leaves.csv"
                      className="btn btn-sm btn-secondary"
                    >
                      Export to CSV
                    </CSVLink>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                    <div></div>
                    <div>
                      <input
                        type="text"
                        placeholder="Search"
                        className="form-control form-control-sm"
                        style={{ width: "200px" }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                  <DataTable
                    title="Leaves List"
                    columns={columns}
                    data={filteredData}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={100}
                    paginationRowsPerPageOptions={[100, 200, 500]}
                    highlightOnHover
                    responsive
                  />
                </CardBody>
              </Card>
            </Col>
            <Col lg={3}>
              <table className="table-sm bg-light mt-2">
                <thead className="table-light">
                  <tr>
                    <th>M-L</th>
                    <th>Limit</th>
                    <th>Avail</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveTypes.map((type) => (
                    <tr key={type.name}>
                      <td>{type.name}</td>
                      <td>
                        <Input
                          type="text"
                          className="form-control-sm"
                          id={`limit-${type.name}`}
                          value={type.data?.Limit || ""}
                          readOnly
                          style={{ width: "50px" }}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          className="form-control-sm"
                          id={`avail-${type.name}`}
                          value={type.data?.Avail || ""}
                          readOnly
                          style={{ width: "50px" }}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          className="form-control-sm"
                          id={`balance-${type.name}`}
                          value={type.data?.Balance || ""}
                          readOnly
                          style={{ width: "50px" }}
                        />
                      </td>
                    </tr>
                  ))}
                  {attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record) => (
                      <tr key={record.VID}>
                        <td>
                          {formatDate(record.VDate)}: {record.VName}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No records found.</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
      </div>
      <DeleteModal
        show={deleteModal}
        onCloseClick={() => setDeleteModal(false)}
        onDeleteClick={handleDeleteConfirm}
      />
    </React.Fragment>
  );
};

export default Leaves;