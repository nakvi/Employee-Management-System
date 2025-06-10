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
import { getDepartment } from "../../../slices/setup/department/thunk";
import {
  deleteEmployeeTrial,
  getEmployeeTrial,
  submitEmployeeTrial,
  updateEmployeeTrial,
} from "../../../slices/employee/employeeTrial/thunk";
import { getShift } from "../../../slices/setup/shift/thunk";

const TrialEmployee = () => {
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Redux state
  const { loading, error, employeeTrial } = useSelector((state) => state.EmployeeTrial);
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { employee = [] } = useSelector((state) => state.Employee || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { shift = [] } = useSelector((state) => state.Shift || {});

  // Fetch data on mount
  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getEmployeeTrial());
    dispatch(getShift());
  }, [dispatch]);

  // Filter data based on search text
  useEffect(() => {
    if (employeeTrial && employee && departmentList && shift) {
      const filtered = employeeTrial.filter((item) => {
        const empName = employee.find((emp) => String(emp.EmpID) === String(item.EmpIDOld))?.EName || "";
        const deptName = departmentList.find((dept) => dept.VID === item.DeptID)?.VName || "";
        const shiftName = shift.find((s) => s.VID === item.ShiftID)?.VName || "";
        const searchString = [
          empName,
          deptName,
          item.HireType,
          item.EName,
          item.FName,
          shiftName,
          formatDate(item.DOB),
          formatDate(item.DOJ),
          item.Address,
          item.Reference,
          item.TelePhone,
          item.NIC,
          formatDate(item.ClosingDate),
          item.ClosingStatus,
        ].join(" ").toLowerCase();
        return searchString.includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [employeeTrial, employee, departmentList, shift, searchText]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      EmpIDOld: "",
      ETypeID: "",
      DeptID: 0,
      HireType: "",
      EName: "",
      FName: "",
      ShiftID: 0,
      DOJ: "",
      DOB: "",
      Address: "",
      Reference: "",
      TelePhone: "",
      NIC: "",
      ClosingDate: "",
      ClosingStatus: "",
      UID: 10,
      Tranzdatetime: "2025-05-29T10:00:00",
      CompanyID: 1,
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number().min(1, "Employee Type is required").required("Required"),
      EmpIDOld: Yup.string().required("Employee is required"),
      DeptID: Yup.number().min(1, "Department Type is required").required("Required"),
      HireType: Yup.string().required("Hire is required"),
      EName: Yup.string().required("Name is required"),
      FName: Yup.string().required("Father Name is required"),
      ShiftID: Yup.number().min(1, "Shift Type is required").required("Required"),
      DOJ: Yup.date().required("Date is required"),
      DOB: Yup.date().required("Date is required"),
      Address: Yup.string().required("Address is required"),
      Reference: Yup.string().required("Reference is required"),
      TelePhone: Yup.number().required("Contact is required"),
      NIC: Yup.string()
        .matches(/^[0-9]{5}-[0-9]{7}-[0-9]$/, "NIC must be in the format 12345-1234567-1")
        .required("NIC is required"),
      ClosingStatus: Yup.string().required("Closing Status is required"),
      ClosingDate: Yup.date().required("Date is required"),
    }),
    onSubmit: (values) => {
      if (editingGroup) {
        dispatch(updateEmployeeTrial({ ...values, VID: editingGroup.VID })).then(() => {
          dispatch(getEmployeeTrial());
          setEditingGroup(null);
          formik.resetForm();
        });
      } else {
        dispatch(submitEmployeeTrial(values)).then(() => {
          dispatch(getEmployeeTrial());
          formik.resetForm();
        });
      }
    },
  });

  // Handle edit button click
  const handleEditClick = (group) => {
    const selectedEmployee = employee.find((emp) => String(emp.EmpID) === String(group.EmpIDOld));
    const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";
    setEditingGroup(group);
    formik.setValues({
      EmpIDOld: group.EmpIDOld || "",
      ETypeID: employeeTypeId || "",
      DeptID: group.DeptID || 0,
      HireType: group.HireType || "",
      EName: group.EName || "",
      FName: group.FName || "",
      ShiftID: group.ShiftID || 0,
      DOJ: formatDateForInput(group.DOJ) || "",
      DOB: formatDateForInput(group.DOB) || "",
      Address: group.Address || "",
      Reference: group.Reference || "",
      TelePhone: group.TelePhone || "",
      NIC: group.NIC || "",
      ClosingDate: formatDateForInput(group.ClosingDate) || "",
      ClosingStatus: group.ClosingStatus || "",
      UID: group.UID || 10,
      CompanyID: group.CompanyID || 1,
      Tranzdatetime: group.Tranzdatetime || new Date().toISOString(),
    });
  };

  // Handle delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteEmployeeTrial(deleteId)).then(() => {
        dispatch(getEmployeeTrial());
      });
    }
    setDeleteModal(false);
  };

  // Format dates
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  const formatDateForInput = (dateString) => {
    return dateString ? dateString.split("T")[0] : "";
  };

  // DataTable columns
  const columns = [
    {
      name: "Employee",
      selector: (row) => employee.find((emp) => String(emp.EmpID) === String(row.EmpIDOld))?.EName || "N/A",
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => departmentList.find((item) => item.VID === row.DeptID)?.VName || "N/A",
      sortable: true,
    },
    {
      name: "Hire Type",
      selector: (row) => row.HireType || "N/A",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.EName || "N/A",
      sortable: true,
    },
    {
      name: "Father Name",
      selector: (row) => row.FName || "N/A",
      sortable: true,
    },
    {
      name: "Shift",
      selector: (row) => shift.find((item) => item.VID === row.ShiftID)?.VName || "N/A",
      sortable: true,
    },
    {
      name: "DOB",
      selector: (row) => formatDate(row.DOB),
      sortable: true,
    },
    {
      name: "DOJ",
      selector: (row) => formatDate(row.DOJ),
      sortable: true,
    },
    {
      name: "Present Address",
      selector: (row) => row.Address || "N/A",
      sortable: true,
    },
    {
      name: "Reference",
      selector: (row) => row.Reference || "N/A",
      sortable: true,
    },
    {
      name: "Contact",
      selector: (row) => row.TelePhone || "N/A",
      sortable: true,
    },
    {
      name: "NIC",
      selector: (row) => row.NIC || "N/A",
      sortable: true,
    },
    {
      name: "Closing Date",
      selector: (row) => formatDate(row.ClosingDate),
      sortable: true,
    },
    {
      name: "Closing Status",
      selector: (row) => row.ClosingStatus || "N/A",
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
    const exportData = (filteredData || []).map((item) => ({
      Employee: employee.find((emp) => String(emp.EmpID) === String(item.EmpIDOld))?.EName || "N/A",
      Department: departmentList.find((dept) => dept.VID === item.DeptID)?.VName || "N/A",
      "Hire Type": item.HireType || "N/A",
      Name: item.EName || "N/A",
      "Father Name": item.FName || "N/A",
      Shift: shift.find((s) => s.VID === item.ShiftID)?.VName || "N/A",
      DOB: formatDate(item.DOB),
      DOJ: formatDate(item.DOJ),
      "Present Address": item.Address || "N/A",
      Reference: item.Reference || "N/A",
      Contact: item.TelePhone || "N/A",
      NIC: item.NIC || "N/A",
      "Closing Date": formatDate(item.ClosingDate),
      "Closing Status": item.ClosingStatus || "N/A",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TrialEmployee");
    XLSX.writeFile(workbook, "TrialEmployee.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Trial Employee Report", 148.5, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 148.5, 22, { align: "center" });

    const headers = [
      [
        "Employee",
        "Department",
        "Hire Type",
        "Name",
        "Father Name",
        "Shift",
        "DOB",
        "DOJ",
        "Present Address",
        "Reference",
        "Contact",
        "NIC",
        "Closing Date",
        "Closing Status",
      ],
    ];
    const data = (filteredData || []).map((item) => [
      employee.find((emp) => String(emp.EmpID) === String(item.EmpIDOld))?.EName || "N/A",
      departmentList.find((dept) => dept.VID === item.DeptID)?.VName || "N/A",
      item.HireType || "N/A",
      item.EName || "N/A",
      item.FName || "N/A",
      shift.find((s) => s.VID === item.ShiftID)?.VName || "N/A",
      formatDate(item.DOB),
      formatDate(item.DOJ),
      item.Address || "N/A",
      item.Reference || "N/A",
      item.TelePhone || "N/A",
      item.NIC || "N/A",
      formatDate(item.ClosingDate),
      item.ClosingStatus || "N/A",
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      margin: { top: 30 },
      styles: { cellPadding: 4, fontSize: 8, valign: "middle", halign: "left" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 8, fontStyle: "bold", halign: "center" },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 15 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
        8: { cellWidth: 30 },
        9: { cellWidth: 20 },
        10: { cellWidth: 20 },
        11: { cellWidth: 20 },
        12: { cellWidth: 15 },
        13: { cellWidth: 15 },
      },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Page ${data.pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
          align: "center",
        });
      },
    });

    doc.save(`TrialEmployee_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Export to Word
  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];
    const headers = [
      "Employee",
      "Department",
      "Hire Type",
      "Name",
      "Father Name",
      "Shift",
      "DOB",
      "DOJ",
      "Present Address",
      "Reference",
      "Contact",
      "NIC",
      "Closing Date",
      "Closing Status",
    ];

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
        employee.find((emp) => String(emp.EmpID) === String(item.EmpIDOld))?.EName || "N/A",
        departmentList.find((dept) => dept.VID === item.DeptID)?.VName || "N/A",
        item.HireType || "N/A",
        item.EName || "N/A",
        item.FName || "N/A",
        shift.find((s) => s.VID === item.ShiftID)?.VName || "N/A",
        formatDate(item.DOB),
        formatDate(item.DOJ),
        item.Address || "N/A",
        item.Reference || "N/A",
        item.TelePhone || "N/A",
        item.NIC || "N/A",
        formatDate(item.ClosingDate),
        item.ClosingStatus || "N/A",
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
              text: "Trial Employee Report",
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
      saveAs(blob, "TrialEmployee.docx");
    });
  };

  document.title = "Trial Employee | EMS";

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
                  <PreviewCardHeader title="Trial Employee" onCancel={formik.resetForm} />
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
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="EmpIDOld" className="form-label">
                              Employee
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="EmpIDOld"
                              id="EmpIDOld"
                              value={formik.values.EmpIDOld}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
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
                            {formik.touched.EmpIDOld && formik.errors.EmpIDOld ? (
                              <div className="text-danger">{formik.errors.EmpIDOld}</div>
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
                              {departmentList.length > 0 ? (
                                departmentList.map((dept) => (
                                  <option key={dept.VID} value={dept.VID}>
                                    {dept.VName || dept.DepartmentName || dept.title}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No departments available</option>
                              )}
                            </select>
                            {formik.touched.DeptID && formik.errors.DeptID ? (
                              <div className="text-danger">{formik.errors.DeptID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="HireType" className="form-label">
                              Hire Type
                              <span className="text-danger">*</span>
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="HireType"
                              name="HireType"
                              value={formik.values.HireType}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                            </select>
                            {formik.touched.HireType && formik.errors.HireType ? (
                              <div className="text-danger">{formik.errors.HireType}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="EName" className="form-label">
                              Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="EName"
                              name="EName"
                              placeholder="Name"
                              {...formik.getFieldProps("EName")}
                            />
                            {formik.touched.EName && formik.errors.EName ? (
                              <div className="text-danger">{formik.errors.EName}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="FName" className="form-label">
                              Father Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="FName"
                              name="FName"
                              placeholder="Father Name"
                              {...formik.getFieldProps("FName")}
                            />
                            {formik.touched.FName && formik.errors.FName ? (
                              <div className="text-danger">{formik.errors.FName}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="ShiftID" className="form-label">
                              Shift
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="ShiftID"
                              name="ShiftID"
                              value={formik.values.ShiftID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {shift?.length > 0 ? (
                                shift.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No Shift available
                                </option>
                              )}
                            </select>
                            {formik.touched.ShiftID && formik.errors.ShiftID ? (
                              <div className="text-danger">{formik.errors.ShiftID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DOB" className="form-label">
                              DOB <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DOB"
                              name="DOB"
                              {...formik.getFieldProps("DOB")}
                            />
                            {formik.touched.DOB && formik.errors.DOB ? (
                              <div className="text-danger">{formik.errors.DOB}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DOJ" className="form-label">
                              DOJ <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DOJ"
                              name="DOJ"
                              {...formik.getFieldProps("DOJ")}
                            />
                            {formik.touched.DOJ && formik.errors.DOJ ? (
                              <div className="text-danger">{formik.errors.DOJ}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="Address" className="form-label">
                              Present Address
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="Address"
                              name="Address"
                              placeholder="Address"
                              {...formik.getFieldProps("Address")}
                            />
                            {formik.touched.Address && formik.errors.Address ? (
                              <div className="text-danger">{formik.errors.Address}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="Reference" className="form-label">
                              Reference
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="Reference"
                              name="Reference"
                              placeholder="Reference"
                              {...formik.getFieldProps("Reference")}
                            />
                            {formik.touched.Reference && formik.errors.Reference ? (
                              <div className="text-danger">{formik.errors.Reference}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="TelePhone" className="form-label">
                              Contact
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="TelePhone"
                              name="TelePhone"
                              placeholder="Contact"
                              {...formik.getFieldProps("TelePhone")}
                            />
                            {formik.touched.TelePhone && formik.errors.TelePhone ? (
                              <div className="text-danger">{formik.errors.TelePhone}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="NIC" className="form-label">
                              NIC <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="NIC"
                              name="NIC"
                              placeholder="xxxxx-xxxxxxx-x"
                              {...formik.getFieldProps("NIC")}
                            />
                            {formik.touched.NIC && formik.errors.NIC ? (
                              <div className="text-danger">{formik.errors.NIC}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="ClosingDate" className="form-label">
                              Closing Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="ClosingDate"
                              name="ClosingDate"
                              {...formik.getFieldProps("ClosingDate")}
                            />
                            {formik.touched.ClosingDate && formik.errors.ClosingDate ? (
                              <div className="text-danger">{formik.errors.ClosingDate}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="ClosingStatus" className="form-label">
                              Closing Status
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="ClosingStatus"
                              name="ClosingStatus"
                              value={formik.values.ClosingStatus}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              <option value="Working">Working</option>
                              <option value="Transferred">Transferred</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            {formik.touched.ClosingStatus && formik.errors.ClosingStatus ? (
                              <div className="text-danger">{formik.errors.ClosingStatus}</div>
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
                        Employee: employee.find((emp) => String(emp.EmpID) === String(item.EmpIDOld))?.EName || "N/A",
                        Department: departmentList.find((dept) => dept.VID === item.DeptID)?.VName || "N/A",
                        "Hire Type": item.HireType || "N/A",
                        Name: item.EName || "N/A",
                        "Father Name": item.FName || "N/A",
                        Shift: shift.find((s) => s.VID === item.ShiftID)?.VName || "N/A",
                        DOB: formatDate(item.DOB),
                        DOJ: formatDate(item.DOJ),
                        "Present Address": item.Address || "N/A",
                        Reference: item.Reference || "N/A",
                        Contact: item.TelePhone || "N/A",
                        NIC: item.NIC || "N/A",
                        "Closing Date": formatDate(item.ClosingDate),
                        "Closing Status": item.ClosingStatus || "N/A",
                      }))}
                      filename="TrialEmployee.csv"
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
                    title="Trial Employee List"
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

export default TrialEmployee;