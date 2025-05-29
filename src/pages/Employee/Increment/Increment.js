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
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import {
  getSalaryIncrement,
  submitSalaryIncrement,
  updateSalaryIncrement,
  deleteSalaryIncrement,
} from "../../../slices/thunks";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TextRun,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";

const Increment = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // get salary increment
  const { loading, error, salaryIncrement } = useSelector(
    (state) => state.SalaryIncrement
  );
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = {} } = useSelector((state) => state.Employee || {});
  useEffect(() => {
    dispatch(getSalaryIncrement());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
  }, [dispatch]);

  useEffect(() => {
    if (salaryIncrement) {
      const filtered = salaryIncrement.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, salaryIncrement]);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      EmpID: "",
      DateFrom: "",
      VDate: "",
      CurrentSalary: "",
      IncrementAmount: "",
      IncrementSpecial: "",
      IncrementPromotional: "",
      FirstAmount: "",
      CompanyID: "1",
      UID: "1",
      IsActive: false,
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      EmpID: Yup.string().required("Employee Name is required"),
      VDate: Yup.date().required("Date is required"),
      DateFrom: Yup.date().required("Effective date is required"),
      CurrentSalary: Yup.number().required("Current salary is required"),
      IncrementAmount: Yup.number().required("Increment amount is required"),
      IncrementSpecial: Yup.number().required(
        "Increment Special salary is required"
      ),
      IncrementPromotional: Yup.number().required(
        "Increment Promotional is required"
      ),
      FirstAmount: Yup.number().required("First Amount is required"),
    }),
    onSubmit: (values) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0,
      };
      if (editingGroup) {
        dispatch(
          updateSalaryIncrement({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null);
      } else {
        dispatch(submitSalaryIncrement(transformedValues));
      }
      formik.resetForm();
    },
  });

  // Set default ETypeID and reset EmpID when employeeType loads or ETypeID changes
  useEffect(() => {
    if (employeeType.length > 0 && !formik.values.ETypeID) {
      formik.setFieldValue("ETypeID", employeeType[0].VID);
    }
    formik.setFieldValue("EmpID", ""); // Reset EmpID when ETypeID changes
  }, [employeeType, formik.values.ETypeID]);

  const handleEditClick = (group) => {
    setEditingGroup(group);
    const formatDateForInput = (dateString) => {
      return dateString ? dateString.split("T")[0] : "";
    };
     const selectedEmployee = employee.find(
    (emp) => String(emp.EmpID) === String(group.EmpID)
  );
  const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";
    formik.setValues({
      EmpID: group.EmpID,
      DateFrom: formatDateForInput(group.DateFrom),
      DateTo: formatDateForInput(group.DateTo),
      CurrentSalary: group.CurrentSalary,
      IncrementAmount: group.IncrementAmount,
      IncrementSpecial: group.IncrementSpecial,
      IncrementPromotional: group.IncrementPromotional,
      FirstAmount: group.FirstAmount,
       ETypeID: employeeTypeId,
      CompanyID: group.CompanyID,
      UID: group.UID,
      IsActive: group.IsActive === 1,
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteSalaryIncrement(deleteId));
    }
    setDeleteModal(false);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SalaryIncrement");
    XLSX.writeFile(workbook, "SalaryIncrement.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Salary Increment Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, {
      align: "center",
    });

    const headers = [
      [
        "Employee",
        "Date",
        "Effective Date",
        "Current Salary",
        "Amount",
        "Special",
        "Promotional",
        "First Amount",
      ],
    ];

    const data = (filteredData || []).map((row) => [
      row.EmpID,
      formatDate(row.VDate),
      formatDate(row.DateFrom),
      row.CurrentSalary,
      row.IncrementAmount,
      row.IncrementSpecial,
      row.IncrementPromotional,
      row.FirstAmount,
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      margin: { top: 30 },
      styles: {
        cellPadding: 4,
        fontSize: 10,
        valign: "middle",
        halign: "left",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20, halign: "right" },
        4: { cellWidth: 15, halign: "right" },
        5: { cellWidth: 15, halign: "right" },
        6: { cellWidth: 15, halign: "right" },
        7: { cellWidth: 15, halign: "right" },
      },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Page ${data.pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      },
    });

    doc.save(`SalaryIncrement_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];

    // Add header row
    const headerCells = [
      "Employee",
      "Date",
      "Effective Date",
      "Current Salary",
      "Amount",
      "Special",
      "Promotional",
      "First Amount",
    ].map(
      (key) =>
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
          width: { size: 100 / 8, type: WidthType.PERCENTAGE },
        })
    );
    tableRows.push(new TableRow({ children: headerCells }));

    // Add data rows
    data.forEach((item) => {
      const rowCells = [
        item.EmpID,
        formatDate(item.VDate),
        formatDate(item.DateFrom),
        item.CurrentSalary,
        item.IncrementAmount,
        item.IncrementSpecial,
        item.IncrementPromotional,
        item.FirstAmount,
      ].map(
        (value) =>
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
            width: { size: 100 / 8, type: WidthType.PERCENTAGE },
          })
      );
      tableRows.push(new TableRow({ children: rowCells }));
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Salary Increment Report",
              heading: "Heading1",
              alignment: AlignmentType.CENTER,
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
      saveAs(blob, "SalaryIncrement.docx");
    });
  };

  // DataTable columns with the specified headers
  const columns = [
    {
      name: "Employee",
      selector: (row) => row.EmpID,
      sortable: true,
      width: "150px",
    },
    {
      name: "Date",
      selector: (row) => formatDate(row.VDate),
      sortable: true,
      width: "100px",
    },
    {
      name: "Effective Date",
      selector: (row) => formatDate(row.DateFrom),
      sortable: true,
      width: "120px",
    },
    {
      name: "Current Salary",
      selector: (row) => row.CurrentSalary,
      sortable: true,
      right: true,
      width: "120px",
    },
    {
      name: "Amount",
      selector: (row) => row.IncrementAmount,
      sortable: true,
      right: true,
      width: "100px",
    },
    {
      name: "Special",
      selector: (row) => row.IncrementSpecial,
      sortable: true,
      right: true,
      width: "100px",
    },
    {
      name: "Promotional",
      selector: (row) => row.IncrementPromotional,
      sortable: true,
      right: true,
      width: "120px",
    },
    {
      name: "First Amount",
      selector: (row) => row.FirstAmount,
      sortable: true,
      right: true,
      width: "120px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button
            className="btn btn-soft-info btn-sm"
            onClick={() => handleEditClick(row)}
          >
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
      width: "100px",
    },
  ];

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

  document.title = "Increment | EMS";
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
                  <PreviewCardHeader
                    title="Increment"
                    onCancel={() => {
                      formik.resetForm();
                      setEditingGroup(null);
                    }}
                    editing={!!editingGroup}
                    isEditMode={!!editingGroup}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        {/* E-Type */}
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
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VDate" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VDate"
                              min={getMinDate()}
                              value={selectedDate}
                              {...formik.getFieldProps("VDate")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Effective Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                              min={getMinDate()}
                              {...formik.getFieldProps("DateFrom")}
                            />
                            {formik.touched.DateFrom &&
                            formik.errors.DateFrom ? (
                              <div className="text-danger">
                                {formik.errors.DateFrom}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="CurrentSalary"
                              className="form-label"
                            >
                              Current Salary
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="CurrentSalary"
                              placeholder="5000"
                              {...formik.getFieldProps("CurrentSalary")}
                            />
                            {formik.touched.CurrentSalary &&
                            formik.errors.CurrentSalary ? (
                              <div className="text-danger">
                                {formik.errors.CurrentSalary}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="IncrementAmount"
                              className="form-label"
                            >
                              Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="IncrementAmount"
                              placeholder="00"
                              {...formik.getFieldProps("IncrementAmount")}
                            />
                            {formik.touched.IncrementAmount &&
                            formik.errors.IncrementAmount ? (
                              <div className="text-danger">
                                {formik.errors.IncrementAmount}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="IncrementSpecial"
                              className="form-label"
                            >
                              Special
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="IncrementSpecial"
                              placeholder="00"
                              {...formik.getFieldProps("IncrementSpecial")}
                            />
                            {formik.touched.IncrementSpecial &&
                            formik.errors.IncrementSpecial ? (
                              <div className="text-danger">
                                {formik.errors.IncrementSpecial}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="IncrementPromotional"
                              className="form-label"
                            >
                              Promotional
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="IncrementPromotional"
                              placeholder="000"
                              {...formik.getFieldProps("IncrementPromotional")}
                            />
                            {formik.touched.IncrementPromotional &&
                            formik.errors.IncrementPromotional ? (
                              <div className="text-danger">
                                {formik.errors.IncrementPromotional}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="FirstAmount" className="form-label">
                              First Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="FirstAmount"
                              placeholder="000"
                              {...formik.getFieldProps("FirstAmount")}
                            />
                            {formik.touched.FirstAmount &&
                            formik.errors.FirstAmount ? (
                              <div className="text-danger">
                                {formik.errors.FirstAmount}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mt-4 pt-2">
                            <div className="form-check form-switch form-switch-md">
                              <Input
                                type="checkbox"
                                className="form-check-input"
                                id="IsActive"
                                checked={formik.values.IsActive}
                                onChange={formik.handleChange}
                                name="IsActive"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="IsActive"
                              >
                                Active
                              </Label>
                            </div>
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
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <Button
                      className="btn-sm"
                      color="success"
                      onClick={exportToExcel}
                    >
                      Export to Excel
                    </Button>
                    <Button
                      className="btn-sm"
                      color="primary"
                      onClick={exportToWord}
                    >
                      Export to Word
                    </Button>
                    <Button
                      className="btn-sm"
                      color="danger"
                      onClick={exportToPDF}
                    >
                      Export to PDF
                    </Button>
                    <CSVLink
                      data={filteredData || []}
                      filename="salary_increment.csv"
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
                        placeholder="Search..."
                        className="form-control form-control-sm"
                        style={{ width: "200px" }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                  <DataTable
                    title="Salary Increments"
                    columns={columns}
                    data={filteredData}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    highlightOnHover
                    responsive
                    striped
                    persistTableHead
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

export default Increment;
