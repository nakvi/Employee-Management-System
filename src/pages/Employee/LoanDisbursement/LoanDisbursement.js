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
import { getSalaryBank } from "../../../slices/setup/salaryBank/thunk";
import {
  deleteLoanDisbursement,
  getLoanDisbursement,
  submitLoanDisbursement,
  updateLoanDisbursement,
} from "../../../slices/employee/loanDisbursement/thunk";
import PreviewCardHeaderUpload from "../../../Components/Common/PreviewCardHeaderUpload";

const LoanDisbursement = () => {
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // redux to get data
  const { loading, error, loanDisbursement } = useSelector(
    (state) => state.LoanDisbursement
  );
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { salaryBank } = useSelector((state) => state.SalaryBank);

  useEffect(() => {
    dispatch(getSalaryBank());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getLoanDisbursement());
  }, [dispatch]);

  useEffect(() => {
    if (loanDisbursement && employee && salaryBank) {
      const filtered = loanDisbursement.filter((item) => {
        const empName = employee.find(emp => String(emp.EmpID) === String(item.EmpID))?.EName || "";
        const bankName = salaryBank.find(bank => bank.VID === item.AccountID)?.VName || "";
        const searchString = [
          empName,
          item.VDate,
          bankName,
          item.ChequeNo,
          item.ChequeDate,
          item.Amount,
          item.Installment,
          item.VName
        ].join(" ").toLowerCase();
        return searchString.includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [loanDisbursement, employee, salaryBank, searchText]);

  // form
  const formik = useFormik({
    initialValues: {
      VName: "",
      VDate: "",
      EmpID: "",
      ETypeID: "",
      Amount: 0,
      AccountID: 0,
      ChequeNo: "",
      ChequeDate: "",
      Installment: 0,
      UID: 501,
      CompanyID: "1001",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      VName: Yup.string().required("Remarks is required"),
      AccountID: Yup.number()
        .min(1, "Bank Type is required")
        .required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      ChequeNo: Yup.string().required("Cheque is required"),
      ChequeDate: Yup.date().required("Date is required"),
      Amount: Yup.number()
        .min(1, "Amount must be greater than 0") // Updated to enforce > 0
        .required("Amount is required"),
      Installment: Yup.number()
        .min(1, "Installment must be greater than 0") // Updated to enforce > 0
        .required("Installment is required"),
      VDate: Yup.date().required("Date is required"),
    }),
    onSubmit: (values) => {
      if (editingGroup) {
        dispatch(updateLoanDisbursement({ ...values, VID: editingGroup.VID }));
      } else {
        dispatch(submitLoanDisbursement(values)).then(() => { });
      }
      formik.resetForm();
    },
  });
  // Handle edit click
  // Handle edit click
  const handleEditClick = (group) => {
    // Find the employee record to get the ETypeID
    const selectedEmployee = employee.find(
      (emp) => String(emp.EmpID) === String(group.EmpID)
    );
    const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";

    setEditingGroup(group);
    formik.setValues({
      VID: group.VID,
      VName: group.VName,
      Amount: group.Amount,
      AccountID: group.AccountID,
      ChequeNo: group.ChequeNo,
      Installment: group.Installment,
      ChequeDate: group.ChequeDate.split("T")[0],
      VDate: group.VDate.split("T")[0],
      EmpID: group.EmpID,
      ETypeID: employeeTypeId, // Set ETypeID from employee data
      UID: 202,
      CompanyID: 3001,
      Tranzdatetime: "2025-04-24T10:19:32.099586Z",
    });
  };

  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteLoanDisbursement(deleteId)).then(() => {
      });
    }
    setDeleteModal(false);
  };
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  const columns = [
    {
      name: "Employee",
      selector: row => employee.find(emp => String(emp.EmpID) === String(row.EmpID))?.EName || "",
      sortable: true,
    },
    {
      name: "Date",
      selector: row => formatDate(row.VDate),
      sortable: true,
    },
    {
      name: "Bank",
      selector: row => salaryBank.find(bank => bank.VID === row.AccountID)?.VName || "",
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
      name: "Amount",
      selector: row => row.Amount,
      sortable: true,
    },
    {
      name: "Installment",
      selector: row => row.Installment,
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
          <Button
            className="btn btn-soft-danger btn-sm"
            onClick={() => handleDeleteClick(row.VID)}
          >
            <i className="ri-delete-bin-2-line"></i>
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

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

  const exportToExcel = () => {
    const exportData = (loanDisbursement || []).map(item => ({
      Employee: employee.find(emp => String(emp.EmpID) === String(item.EmpID))?.EName || "",
      Date: item.VDate,
      Bank: salaryBank.find(bank => bank.VID === item.AccountID)?.VName || "",
      ChequeNo: item.ChequeNo,
      ChequeDate: item.ChequeDate,
      Amount: item.Amount,
      Installment: item.Installment,
      Remarks: item.VName
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LoanDisbursement");
    XLSX.writeFile(workbook, "LoanDisbursement.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Loan Disbursement Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Employee", "Date", "Bank", "Cheque No", "Cheque Date", "Amount", "Installment", "Remarks"]];
    const data = (loanDisbursement || []).map(item => [
      employee.find(emp => String(emp.EmpID) === String(item.EmpID))?.EName || "",
      item.VDate,
      salaryBank.find(bank => bank.VID === item.AccountID)?.VName || "",
      item.ChequeNo,
      item.ChequeDate,
      item.Amount,
      item.Installment,
      item.VName
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
        doc.text(
          `Page ${data.pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }
    });

    doc.save(`LoanDisbursement_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToWord = () => {
    const data = loanDisbursement || [];
    const tableRows = [];
    const headers = ["Employee", "Date", "Bank", "Cheque No", "Cheque Date", "Amount", "Installment", "Remarks"];
    // Header row
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

    // Data rows
    data.forEach(item => {
      const rowCells = [
        employee.find(emp => String(emp.EmpID) === String(item.EmpID))?.EName || "",
        item.VDate,
        salaryBank.find(bank => bank.VID === item.AccountID)?.VName || "",
        item.ChequeNo,
        item.ChequeDate,
        item.Amount,
        item.Installment,
        item.VName
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
              text: "Loan Disbursement Report",
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
      saveAs(blob, "LoanDisbursement.docx");
    });
  };
  document.title = "Loan Disbursement | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>} */}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeaderUpload
                    title="Loan Disbursement"
                    onCancel={formik.resetForm}
                  />
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
                        {/* <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Loan Type
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">Car Loan</option>
                              <option value="Choices2">Short term Loan</option>
                            </select>
                          </div>
                        </Col> */}
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
                              <div className="text-danger">
                                {formik.errors.VDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="AccountID" className="form-label">
                              Bank
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="AccountID"
                              id="AccountID"
                              {...formik.getFieldProps("AccountID")}
                            >
                              <option value="">---Select---</option>
                              {salaryBank.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.AccountID &&
                              formik.errors.AccountID ? (
                              <div className="text-danger">
                                {formik.errors.AccountID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="ChequeNo" className="form-label">
                              Cheque No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="ChequeNo"
                              name="ChequeNo"
                              placeholder="Cheque No"
                              {...formik.getFieldProps("ChequeNo")}
                            />
                            {formik.touched.ChequeNo &&
                              formik.errors.ChequeNo ? (
                              <div className="text-danger">
                                {formik.errors.ChequeNo}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="ChequeDate" className="form-label">
                              Cheque Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="ChequeDate"
                              name="ChequeDate"
                              {...formik.getFieldProps("ChequeDate")}
                            />
                            {formik.touched.ChequeDate &&
                              formik.errors.ChequeDate ? (
                              <div className="text-danger">
                                {formik.errors.ChequeDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="Amount" className="form-label">
                              Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="Amount"
                              name="Amount"
                              placeholder="00"
                              {...formik.getFieldProps("Amount")}
                            />
                            {formik.touched.Amount && formik.errors.Amount ? (
                              <div className="text-danger">
                                {formik.errors.Amount}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="Installment" className="form-label">
                              Installment
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="Installment"
                              name="Installment"
                              placeholder="00"
                              {...formik.getFieldProps("Installment")}
                            />
                            {formik.touched.Installment &&
                              formik.errors.Installment ? (
                              <div className="text-danger">
                                {formik.errors.Installment}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
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
                              <div className="text-danger">
                                {formik.errors.VName}
                              </div>
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
                      data={loanDisbursement || []}
                      filename="LoanDisbursement.csv"
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
                    title="Loan Disbursement List"
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

export default LoanDisbursement;
