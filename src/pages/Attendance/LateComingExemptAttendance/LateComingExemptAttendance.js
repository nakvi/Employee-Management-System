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
import { getLocation } from "../../../slices/setup/location/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import {
  deleteLateComingExemptAttendance,
  getLateComingExemptAttendance,
  submitLateComingExemptAttendance,
  updateLateComingExemptAttendance,
} from "../../../slices/Attendance/lateComingExemptAttendance/thunk";

const LateComingExemptAttendance = () => {
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Redux state
  const { loading, error, lateComingExemptAttendance = [] } = useSelector((state) => state.LateComingExemptAttendance || {});
  const { location = [] } = useSelector((state) => state.Location || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { employee = [] } = useSelector((state) => state.Employee || {});

  // Fetch data on mount
  useEffect(() => {
    dispatch(getLocation());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getDepartment());
    dispatch(getLateComingExemptAttendance());
  }, [dispatch]);

  // Filter data based on search text
  useEffect(() => {
    if (lateComingExemptAttendance && employee && location && departmentList) {
      const filtered = lateComingExemptAttendance.filter((item) => {
        const empName = employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "";
        const locName = location.find((row) => row.VID === item.LocationID)?.VName || "";
        const deptName = departmentList.find((row) => row.VID === item.DeptID)?.VName || "";
        const searchString = [
          empName,
          locName,
          deptName,
          formatDate(item.VDate),
          item.VName,
        ].join(" ").toLowerCase();
        return searchString.includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [lateComingExemptAttendance, employee, location, departmentList, searchText]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      EmpID: "",
      ETypeID: "",
      VDate: "",
      DeptID: "",
      LocationID: 0,
      VName: "",
      UID: 501,
      CompanyID: "1001",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number().min(1, "Employee Type is required").required("Required"),
      VName: Yup.string().required("Remarks is required"),
      DeptID: Yup.number().min(1, "Department is required").required("Required"),
      LocationID: Yup.number().min(1, "Location is required").required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      VDate: Yup.date().required("Date is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingGroup) {
          await dispatch(updateLateComingExemptAttendance({ ...values, VID: editingGroup.VID })).unwrap();
          setEditingGroup(null);
        } else {
          await dispatch(submitLateComingExemptAttendance(values)).unwrap();
        }
        dispatch(getLateComingExemptAttendance());
        resetForm();
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
  });

  // Handle edit click
  const handleEditClick = (group) => {
    const selectedEmployee = employee.find((emp) => String(emp.EmpID) === String(group.EmpID));
    const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";
    setEditingGroup(group);
    formik.setValues({
      EmpID: group.EmpID || "",
      ETypeID: employeeTypeId || "",
      LocationID: group.LocationID || 0,
      VID: group.VID || "",
      VName: group.VName || "",
      DeptID: group.DeptID || "",
      VDate: group.VDate ? group.VDate.split("T")[0] : "",
      UID: group.UID || 501,
      CompanyID: group.CompanyID || "1001",
    });
  };

  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteLateComingExemptAttendance(deleteId)).then(() => {
        dispatch(getLateComingExemptAttendance());
      });
    }
    setDeleteModal(false);
  };

  // Format dates
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
      name: "Location",
      selector: (row) => location.find((item) => item.VID === row.LocationID)?.VName || "N/A",
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => departmentList.find((item) => item.VID === row.DeptID)?.VName || "N/A",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => formatDate(row.VDate),
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
      Location: location.find((row) => row.VID === item.LocationID)?.VName || "N/A",
      Department: departmentList.find((row) => row.VID === item.DeptID)?.VName || "N/A",
      Date: formatDate(item.VDate),
      Remarks: item.VName || "N/A",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LateComingExemptAttendance");
    XLSX.writeFile(workbook, "LateComingExemptAttendance.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Late Coming Exempt Attendance Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Employee", "Location", "Department", "Date", "Remarks"]];
    const data = (filteredData || []).map((item) => [
      employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
      location.find((row) => row.VID === item.LocationID)?.VName || "N/A",
      departmentList.find((row) => row.VID === item.DeptID)?.VName || "N/A",
      formatDate(item.VDate),
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

    doc.save(`LateComingExemptAttendance_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Export to Word
  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];
    const headers = ["Employee", "Location", "Department", "Date", "Remarks"];

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
        location.find((row) => row.VID === item.LocationID)?.VName || "N/A",
        departmentList.find((row) => row.VID === item.DeptID)?.VName || "N/A",
        formatDate(item.VDate),
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
              text: "Late Coming Exempt Attendance Report",
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
      saveAs(blob, "LateComingExemptAttendance.docx");
    });
  };

  // Handle cancel action
  const handleCancel = () => {
    formik.resetForm();
    setEditingGroup(null);
  };

  document.title = "Late Coming Exempt | EMS";

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
                  <PreviewCardHeader title="Late Coming Exempt Attendance" onCancel={handleCancel} />
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
                          <div className="mb-3">
                            <Label htmlFor="LocationID" className="form-label">
                              Location
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="LocationID"
                              id="LocationID"
                              value={formik.values.LocationID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {location.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.LocationID && formik.errors.LocationID ? (
                              <div className="text-danger">{formik.errors.LocationID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="DeptID" className="form-label">
                              Department
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="DeptID"
                              id="DeptID"
                              value={formik.values.DeptID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {departmentList.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.DeptID && formik.errors.DeptID ? (
                              <div className="text-danger">{formik.errors.DeptID}</div>
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
                        Location: location.find((row) => row.VID === item.LocationID)?.VName || "N/A",
                        Department: departmentList.find((row) => row.VID === item.DeptID)?.VName || "N/A",
                        Date: formatDate(item.VDate),
                        Remarks: item.VName || "N/A",
                      }))}
                      filename="LateComingExemptAttendance.csv"
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
                    title="Late Coming Exempt Attendance List"
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

export default LateComingExemptAttendance;