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
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import DeleteModal from "../../../Components/Common/DeleteModal";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getLeaveType } from "../../../slices/Attendance/leaveType/thunk";
import {
  deleteSpecialLeaveEntry,
  getSpecialLeaveEntry,
  submitSpecialLeaveEntry,
  updateSpecialLeaveEntry,
} from "../../../slices/Attendance/specialLeaveEntry/thunk";

const SpecialLeaveEntry = () => {
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Redux state
  const { loading, error, specialLeaveEntry } = useSelector((state) => state.SpecialLeaveEntry);
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { employee = [] } = useSelector((state) => state.Employee || {});
  const { leaveType = [] } = useSelector((state) => state.LeaveType || {});

  // Fetch data on mount
  useEffect(() => {
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getLeaveType());
    dispatch(getSpecialLeaveEntry());
  }, [dispatch]);

  // Filter data based on search text
  useEffect(() => {
    if (specialLeaveEntry && employee && leaveType) {
      const filtered = specialLeaveEntry.filter((item) => {
        const empName = employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "";
        const leaveTypeName = leaveType.find((lt) => lt.VID === item.LeaveTypeID)?.VName || "";
        const searchString = [
          empName,
          item.VNo,
          item.VDate,
          leaveTypeName,
          item.VName,
        ].join(" ").toLowerCase();
        return searchString.includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [specialLeaveEntry, employee, leaveType, searchText]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      VName: "",
      VDate: "",
      EmpID: "",
      ETypeID: "",
      VNo: "",
      LeaveTypeID: 0,
      UID: 501,
      CompanyID: "1001",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number().min(1, "Employee Type is required").required("Required"),
      VName: Yup.string().required("Remarks is required"),
      VNo: Yup.string().required("Application No is required"),
      LeaveTypeID: Yup.number().min(1, "Leave Type is required").required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      VDate: Yup.date().required("Date is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (editingGroup) {
          await dispatch(updateSpecialLeaveEntry({ ...values, VID: editingGroup.VID })).unwrap();
          setEditingGroup(null);
          formik.resetForm();
        } else {
          await dispatch(submitSpecialLeaveEntry(values)).unwrap();
          formik.resetForm();
        }
        dispatch(getSpecialLeaveEntry());
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
  });

  // Edit handler
  const handleEditClick = (group) => {
    const selectedEmployee = employee.find((emp) => String(emp.EmpID) === String(group.EmpID));
    const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";
    setEditingGroup(group);
    formik.setValues({
      VID: group.VID,
      VName: group.VName,
      VDate: group.VDate.split("T")[0],
      EmpID: group.EmpID,
      ETypeID: employeeTypeId,
      VNo: group.VNo,
      LeaveTypeID: group.LeaveTypeID,
      UID: 501,
      CompanyID: "1001",
    });
  };

  // Delete handler
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteSpecialLeaveEntry(deleteId)).then(() => {
        dispatch(getSpecialLeaveEntry());
      });
    }
    setDeleteModal(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  // DataTable columns
  const columns = [
    {
      name: "Employee",
      selector: (row) => employee.find((emp) => String(emp.EmpID) === String(row.EmpID))?.EName || "N/A",
      sortable: true,
    },
    {
      name: "Application No",
      selector: (row) => row.VNo,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => formatDate(row.VDate),
      sortable: true,
    },
    {
      name: "Leave Type",
      selector: (row) => leaveType.find((lt) => lt.VID === row.LeaveTypeID)?.VName || "N/A",
      sortable: true,
    },
    {
      name: "Remarks",
      selector: (row) => row.VName,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
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
      style: {
        border: "1px solid #dee2e6",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #dee2e6",
        fontWeight: "600",
      },
    },
    rows: {
      style: {
        minHeight: "48px",
        borderBottom: "1px solid #dee2e6",
      },
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
    const exportData = (specialLeaveEntry || []).map((item) => ({
      Employee: employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
      "Application No": item.VNo,
      Date: formatDate(item.VDate),
      "Leave Type": leaveType.find((lt) => lt.VID === item.LeaveTypeID)?.VName || "N/A",
      Remarks: item.VName,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SpecialLeaveEntry");
    XLSX.writeFile(workbook, "SpecialLeaveEntry.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Special Leave Entry Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Employee", "Application No", "Date", "Leave Type", "Remarks"]];
    const data = (specialLeaveEntry || []).map((item) => [
      employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
      item.VNo,
      formatDate(item.VDate),
      leaveType.find((lt) => lt.VID === item.LeaveTypeID)?.VName || "N/A",
      item.VName,
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

    doc.save(`SpecialLeaveEntry_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Export to Word
  const exportToWord = () => {
    const data = specialLeaveEntry || [];
    const tableRows = [];
    const headers = ["Employee", "Application No", "Date", "Leave Type", "Remarks"];

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
        item.VNo,
        formatDate(item.VDate),
        leaveType.find((lt) => lt.VID === item.LeaveTypeID)?.VName || "N/A",
        item.VName,
      ].map((value) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: String(value ?? ""), size: 18 })],
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
              text: "Special Leave Entry Report",
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
      saveAs(blob, "SpecialLeaveEntry.docx");
    });
  };

  document.title = "Special Leave Entry | EMS";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader title="Special Leave Entry" onCancel={formik.resetForm} />
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
                              <div className="text-danger">{formik.errors.ETypeID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
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
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VNo" className="form-label">
                              Application No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VNo"
                              name="VNo"
                              placeholder="Application No"
                              {...formik.getFieldProps("VNo")}
                            />
                            {formik.touched.VNo && formik.errors.VNo ? (
                              <div className="text-danger">{formik.errors.VNo}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VDate" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VDate"
                              name="VDate"
                              {...formik.getFieldProps("VDate")}
                            />
                            {formik.touched.VDate && formik.errors.VDate ? (
                              <div className="text-danger">{formik.errors.VDate}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
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
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>
            <Col lg={12}>
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
                        "Application No": item.VNo,
                        Date: formatDate(item.VDate),
                        "Leave Type": leaveType.find((lt) => lt.VID === item.LeaveTypeID)?.VName || "N/A",
                        Remarks: item.VName,
                      }))}
                      filename="SpecialLeaveEntry.csv"
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
                    title="Special Leave Entry List"
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

export default SpecialLeaveEntry;