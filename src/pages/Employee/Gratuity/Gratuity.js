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
import { FiRefreshCw } from "react-icons/fi";
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
import { getSalaryBank } from "../../../slices/setup/salaryBank/thunk";
import {
  getGratuity,
  submitGratuity,
  updateGratuity,
  deleteGratuity,
} from "../../../slices/employee/gratuity/thunk";
import config from "../../../config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PreviewCardHeaderUpload from "../../../Components/Common/PreviewCardHeaderUpload";

const Gratuity = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Redux
  const { gratuity, loading, error } = useSelector((state) => state.Gratuity);
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { salaryBank } = useSelector((state) => state.SalaryBank);

  useEffect(() => {
    dispatch(getSalaryBank());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getGratuity());
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    formik.setFieldValue("DemandTill", today);
  }, [dispatch]);

  // Filter gratuity data based on search text
  useEffect(() => {
    if (gratuity && employee && salaryBank) {
      const filtered = gratuity.filter((item) => {
        const empName = employee.find(emp => String(emp.EmpID) === String(item.EmpID))?.EName || "";
        const bankName = salaryBank.find(bank => bank.VID === item.CompanyBankID)?.VName || "";
        const searchString = [
          empName,
          formatDate(item.DemandDate),
          formatDate(item.DemandTill),
          formatDate(item.PaidTill),
          formatDate(item.PaidOn),
          item.BasicSalary,
          formatDate(item.PaidOld),
          item.DueAmount,
          item.PaidAmount,
          bankName,
          item.ChequeNo,
          formatDate(item.ChequeDate),
          item.VName,
        ].join(" ").toLowerCase();
        return searchString.includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [gratuity, employee, salaryBank, searchText]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      EmpID: "",
      ETypeID: "",
      VDate: "",
      DemandTill: "",
      PaidTill: "",
      PaidOld: "",
      PaidOn: "",
      DueAmount: "",
      DemandDate: "",
      PaidAmount: "",
      BasicSalary: "",
      NewAmount: "5000",
      CompanyBankID: "",
      ChequeNo: "",
      ChequeDate: "",
      VName: "",
      SalaryYear: "",
      UID: 10,
      CompanyID: "1001",
      Tranzdatetime: new Date().toISOString(),
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number().min(1, "Employee Type is required").required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      VName: Yup.string().required("Remarks is required"),
      VDate: Yup.date().required("Date is required"),
      DemandTill: Yup.date().required("Demand Till is required"),
      PaidTill: Yup.date().required("Paid Till is required"),
      PaidOld: Yup.date().required("Previous Date is required"),
      PaidOn: Yup.date().required("Paid Date is required"),
      DemandDate: Yup.date().required("Date is required"),
      DueAmount: Yup.number().required("Due Amount is required"),
      BasicSalary: Yup.number().required("Current Salary is required"),
      PaidAmount: Yup.number().required("Paid Amount is required"),
      CompanyBankID: Yup.number().min(1, "Bank is required").required("Required"),
      ChequeNo: Yup.string().required("Cheque No is required"),
      ChequeDate: Yup.date().required("Cheque Date is required"),
    }),
    onSubmit: async (values) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0,
      };
      try {
        let result;
        if (editingGroup) {
          result = await dispatch(updateGratuity({ ...transformedValues, VID: editingGroup.VID }));
        } else {
          result = await dispatch(submitGratuity(transformedValues));
        }
        if (submitGratuity.fulfilled.match(result) || updateGratuity.fulfilled.match(result)) {
          dispatch(getGratuity());
          formik.resetForm();
          setEditingGroup(null);
        }
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
  });

  // Fetch gratuity details
  const fetchGratuityDetails = async (empId, vDate) => {
    try {
      const response = await axios.get(`${config.api.API_URL}getEmployeeGratuityDetail`, {
        params: {
          Orgini: "LTT",
          EmpID: empId,
          VDate: vDate || selectedDate,
          UID: 1,
          IsAu: 0,
          IgnoreOld: 0,
          BasicSalary: 0,
        },
      });
      const data = response[0];
      if (data) {
        formik.setFieldValue("DueAmount", data.GratuityAmount);
        formik.setFieldValue("PaidAmount", data.GratuityAmount);
        formik.setFieldValue("PaidOld", data.LastGDate);
        formik.setFieldValue("SalaryYear", data.SalaryYear);
        formik.setFieldValue("BasicSalary", data.CurrentSalary);
        formik.setFieldValue("CompanyBankID", data.CompanyBankID);
      }
    } catch (error) {
      console.error("Error fetching gratuity details:", error);
    }
  };

  // Handle Employee change
  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    formik.handleChange(e);
    if (!empId || !formik.values.DemandTill) {
      toast.error("Please select both Employee and Demand Till date.");
      return;
    }
    fetchGratuityDetails(empId, formik.values.DemandTill);
  };

  // Handle Refresh button
  const handleRefreshClick = () => {
    const { EmpID, DemandTill } = formik.values;
    if (!EmpID || !DemandTill) {
      toast.error("Please select both Employee and Demand Till date.");
      return;
    }
    fetchGratuityDetails(EmpID, DemandTill);
  };

  // Handle DemandTill change
  const handleDemandTillChange = (e) => {
    const vDate = e.target.value;
    formik.handleChange(e);
    setSelectedDate(vDate);
    if (!formik.values.EmpID || !vDate) {
      toast.error("Please select both Employee and Demand Till date.");
      return;
    }
    fetchGratuityDetails(formik.values.EmpID, vDate);
  };

  // Format date
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  // Handle Delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteGratuity(deleteId)).then(() => {
        dispatch(getGratuity());
      });
    }
    setDeleteModal(false);
  };

  // Handle Edit
  const handleEditClick = (group) => {
    const selectedEmployee = employee.find(emp => String(emp.EmpID) === String(group.EmpID));
    const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";
    setEditingGroup(group);
    formik.setValues({
      EmpID: group.EmpID,
      ETypeID: employeeTypeId,
      VDate: group.VDate.split("T")[0],
      DemandTill: group.DemandTill.split("T")[0],
      PaidTill: group.PaidTill.split("T")[0],
      PaidOld: group.PaidOld.split("T")[0],
      PaidOn: group.PaidOn.split("T")[0],
      DueAmount: group.DueAmount,
      DemandDate: group.DemandDate.split("T")[0],
      PaidAmount: group.PaidAmount,
      BasicSalary: group.BasicSalary,
      NewAmount: group.NewAmount,
      CompanyBankID: group.CompanyBankID,
      ChequeNo: group.ChequeNo,
      ChequeDate: group.ChequeDate.split("T")[0],
      VName: group.VName,
      SalaryYear: group.SalaryYear,
      UID: 10,
      CompanyID: "1001",
      Tranzdatetime: new Date().toISOString(),
    });
  };

  // DataTable columns
  const columns = [
    {
      name: "Employee",
      selector: row => employee.find(emp => String(emp.EmpID) === String(row.EmpID))?.EName || "N/A",
      sortable: true,
    },
    {
      name: "Demand Date",
      selector: row => formatDate(row.DemandDate),
      sortable: true,
    },
    {
      name: "Demand Till",
      selector: row => formatDate(row.DemandTill),
      sortable: true,
    },
    {
      name: "Paid Till",
      selector: row => formatDate(row.PaidTill),
      sortable: true,
    },
    {
      name: "Paid On",
      selector: row => formatDate(row.PaidOn),
      sortable: true,
    },
    {
      name: "C Salary",
      selector: row => row.BasicSalary,
      sortable: true,
    },
    {
      name: "Previous",
      selector: row => formatDate(row.PaidOld),
      sortable: true,
    },
    {
      name: "Due Amount",
      selector: row => row.DueAmount,
      sortable: true,
    },
    {
      name: "Amount",
      selector: row => row.PaidAmount,
      sortable: true,
    },
    {
      name: "Bank",
      selector: row => salaryBank.find(bank => bank.VID === row.CompanyBankID)?.VName || "N/A",
      sortable: true,
    },
    {
      name: "Cheque No",
      selector: row => row.ChequeNo,
      sortable: true,
    },
    {
      name: "Cheque Date",
      selector: row => formatDate(row.ChequeDate),
      sortable: true,
    },
    {
      name: "Remarks",
      selector: row => row.VName,
      sortable: true,
    },
    {
      name: "Action",
      cell: row => (
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

  // Custom styles for DataTable
  const customStyles = {
    table: {
      style: {
        border: '1px solid #dee2e6',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        fontWeight: '600',
      },
    },
    rows: {
      style: {
        minHeight: '48px',
        borderBottom: '1px solid #dee2e6',
      },
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
        borderRight: '1px solid #dee2e6',
      },
    },
  };

  // Export functions
  const exportToExcel = () => {
    const exportData = (gratuity || []).map(item => ({
      Employee: employee.find(emp => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
      DemandDate: formatDate(item.DemandDate),
      DemandTill: formatDate(item.DemandTill),
      PaidTill: formatDate(item.PaidTill),
      PaidOn: formatDate(item.PaidOn),
      CurrentSalary: item.BasicSalary,
      Previous: formatDate(item.PaidOld),
      DueAmount: item.DueAmount,
      PaidAmount: item.PaidAmount,
      Bank: salaryBank.find(bank => bank.VID === item.CompanyBankID)?.VName || "N/A",
      ChequeNo: item.ChequeNo,
      ChequeDate: formatDate(item.ChequeDate),
      Remarks: item.VName,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gratuity");
    XLSX.writeFile(workbook, "Gratuity.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Gratuity Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Employee", "Demand Date", "Demand Till", "Paid Till", "Paid On", "C Salary", "Previous", "Due Amount", "Amount", "Bank", "Cheque No", "Cheque Date", "Remarks"]];
    const data = (gratuity || []).map(item => [
      employee.find(emp => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
      formatDate(item.DemandDate),
      formatDate(item.DemandTill),
      formatDate(item.PaidTill),
      formatDate(item.PaidOn),
      item.BasicSalary,
      formatDate(item.PaidOld),
      item.DueAmount,
      item.PaidAmount,
      salaryBank.find(bank => bank.VID === item.CompanyBankID)?.VName || "N/A",
      item.ChequeNo,
      formatDate(item.ChequeDate),
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
        doc.text(`Page ${data.pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: "center" });
      },
    });

    doc.save(`Gratuity_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToWord = () => {
    const data = gratuity || [];
    const tableRows = [];
    const headers = ["Employee", "Demand Date", "Demand Till", "Paid Till", "Paid On", "C Salary", "Previous", "Due Amount", "Amount", "Bank", "Cheque No", "Cheque Date", "Remarks"];
    const headerCells = headers.map(key => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: key, bold: true, size: 20 })], alignment: AlignmentType.CENTER })],
      width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
    }));
    tableRows.push(new TableRow({ children: headerCells }));

    data.forEach(item => {
      const rowCells = [
        employee.find(emp => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
        formatDate(item.DemandDate),
        formatDate(item.DemandTill),
        formatDate(item.PaidTill),
        formatDate(item.PaidOn),
        item.BasicSalary,
        formatDate(item.PaidOld),
        item.DueAmount,
        item.PaidAmount,
        salaryBank.find(bank => bank.VID === item.CompanyBankID)?.VName || "N/A",
        item.ChequeNo,
        formatDate(item.ChequeDate),
        item.VName,
      ].map(value => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: String(value ?? ""), size: 18 })], alignment: AlignmentType.LEFT })],
        width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
      }));
      tableRows.push(new TableRow({ children: rowCells }));
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "Gratuity Report", heading: "Heading1" }),
          new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } }),
        ],
      }],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "Gratuity.docx");
    });
  };

  document.title = "Gratuity | EMS";

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
                  <PreviewCardHeaderUpload title="Gratuity" onCancel={formik.resetForm} />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="ETypeID" className="form-label">E-Type</Label>
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
                                <option key={item.VID} value={item.VID}>{item.VName}</option>
                              ))}
                            </select>
                            {formik.touched.ETypeID && formik.errors.ETypeID ? (
                              <div className="text-danger">{formik.errors.ETypeID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="EmpID" className="form-label">Employee</Label>
                            <select
                              className="form-select form-select-sm"
                              name="EmpID"
                              id="EmpID"
                              value={formik.values.EmpID}
                              onChange={handleEmployeeChange}
                              onBlur={formik.handleBlur}
                              disabled={!formik.values.ETypeID}
                            >
                              <option value="">---Select---</option>
                              {employee
                                .filter(emp => emp.ETypeID === parseInt(formik.values.ETypeID))
                                .map(item => (
                                  <option key={item.EmpID} value={item.EmpID}>{item.EName}</option>
                                ))}
                            </select>
                            {formik.touched.EmpID && formik.errors.EmpID ? (
                              <div className="text-danger">{formik.errors.EmpID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="VDate" className="form-label">Date</Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VDate"
                              name="VDate"
                              value={formik.values.VDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.VDate && formik.errors.VDate ? (
                              <div className="text-danger">{formik.errors.VDate}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="DemandDate" className="form-label">Demand Date</Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DemandDate"
                              name="DemandDate"
                              value={formik.values.DemandDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.DemandDate && formik.errors.DemandDate ? (
                              <div className="text-danger">{formik.errors.DemandDate}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="DemandTill" className="form-label">Demand Till</Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DemandTill"
                              name="DemandTill"
                              value={selectedDate}
                              onChange={handleDemandTillChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.DemandTill && formik.errors.DemandTill ? (
                              <div className="text-danger">{formik.errors.DemandTill}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="PaidTill" className="form-label">Paid Till</Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PaidTill"
                              name="PaidTill"
                              value={formik.values.PaidTill}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.PaidTill && formik.errors.PaidTill ? (
                              <div className="text-danger">{formik.errors.PaidTill}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="PaidOn" className="form-label">Paid On</Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PaidOn"
                              name="PaidOn"
                              value={formik.values.PaidOn}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.PaidOn && formik.errors.PaidOn ? (
                              <div className="text-danger">{formik.errors.PaidOn}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="BasicSalary" className="form-label">Current Salary</Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="BasicSalary"
                              name="BasicSalary"
                              placeholder="Current Salary"
                              {...formik.getFieldProps("BasicSalary")}
                            />
                            {formik.touched.BasicSalary && formik.errors.BasicSalary ? (
                              <div className="text-danger">{formik.errors.BasicSalary}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="PaidOld" className="form-label">Previous</Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PaidOld"
                              name="PaidOld"
                              value={formik.values.PaidOld}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.PaidOld && formik.errors.PaidOld ? (
                              <div className="text-danger">{formik.errors.PaidOld}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div>
                            <Label htmlFor="SalaryYear" className="form-label">Salary / Year</Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="SalaryYear"
                              name="SalaryYear"
                              placeholder=""
                              readOnly
                              disabled
                              {...formik.getFieldProps("SalaryYear")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Button
                              className="btn btn-soft-success mt-4 px-4 py-1"
                              title="Refresh"
                              data-bs-toggle="tooltip"
                              onClick={handleRefreshClick}
                            >
                              <FiRefreshCw strokeWidth={4} />
                            </Button>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="DueAmount" className="form-label">Due Amount</Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="DueAmount"
                              name="DueAmount"
                              placeholder="Due Amount"
                              readOnly
                              disabled
                              {...formik.getFieldProps("DueAmount")}
                            />
                            {formik.touched.DueAmount && formik.errors.DueAmount ? (
                              <div className="text-danger">{formik.errors.DueAmount}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="PaidAmount" className="form-label">Amount</Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="PaidAmount"
                              placeholder="Amount"
                              {...formik.getFieldProps("PaidAmount")}
                            />
                            {formik.touched.PaidAmount && formik.errors.PaidAmount ? (
                              <div className="text-danger">{formik.errors.PaidAmount}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div className="mb-3">
                            <Label htmlFor="CompanyBankID" className="form-label">Bank</Label>
                            <select
                              className="form-select form-select-sm"
                              name="CompanyBankID"
                              id="CompanyBankID"
                              value={formik.values.CompanyBankID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {salaryBank.map((item) => (
                                <option key={item.VID} value={item.VID}>{item.VName}</option>
                              ))}
                            </select>
                            {formik.touched.CompanyBankID && formik.errors.CompanyBankID ? (
                              <div className="text-danger">{formik.errors.CompanyBankID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="ChequeNo" className="form-label">Cheque No</Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="ChequeNo"
                              name="ChequeNo"
                              placeholder="Cheque No"
                              {...formik.getFieldProps("ChequeNo")}
                            />
                            {formik.touched.ChequeNo && formik.errors.ChequeNo ? (
                              <div className="text-danger">{formik.errors.ChequeNo}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="ChequeDate" className="form-label">Cheque Date</Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="ChequeDate"
                              name="ChequeDate"
                              {...formik.getFieldProps("ChequeDate")}
                            />
                            {formik.touched.ChequeDate && formik.errors.ChequeDate ? (
                              <div className="text-danger">{formik.errors.ChequeDate}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div>
                            <Label htmlFor="VName" className="form-label">Remarks</Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
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
                    <Button className="btn-sm" color="success" onClick={exportToExcel}>Export to Excel</Button>
                    <Button className="btn-sm" color="primary" onClick={exportToWord}>Export to Word</Button>
                    <Button className="btn-sm" color="danger" onClick={exportToPDF}>Export to PDF</Button>
                    <CSVLink
                      data={gratuity || []}
                      filename="Gratuity.csv"
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
                    title="Gratuity List"
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
        onCloseClick={() => setDeleteModal(!deleteModal)}
        onDeleteClick={handleDeleteConfirm}
      />
    </React.Fragment>
  );
};

export default Gratuity;