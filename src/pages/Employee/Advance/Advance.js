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
import {
  getAdvance,
  submitAdvance,
  updateAdvance,
} from "../../../slices/employee/advance/thunk";
import {
  submitSalaryAllowanceDeduction,
  updateSalaryAllowanceDeduction,
  deleteSalaryAllowanceDeduction,
} from "../../../slices/employee/salaryAllowanceDeduction/thunk";
const Advance = () => {
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // redux to get data
  const { loading, error, advance } = useSelector((state) => state.Advance);
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = {} } = useSelector((state) => state.Employee || {});
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getAdvance());
  }, [dispatch]);

  // Filter advance data based on search text
  useEffect(() => {
  if (advance && employee) {
    const filtered = advance.filter((item) => {
      const empName = employee.find(emp => String(emp.EmpID) === String(item.EmpID))?.EName || "";
      const searchString = [
        empName,
        item.Amount,
        item.VDate,
        item.VName
      ].join(" ").toLowerCase();
      return searchString.includes(searchText.toLowerCase());
    });
    setFilteredData(filtered);
  }
}, [advance, employee, searchText]);
  // Formik setup
  const formik = useFormik({
    initialValues: {
      VName: "",
      VDate: "",
      EmpID: "",
      ETypeID: "",
      Amount: 0,
      AllowDedID: 6,
      UID: 501,
      CompanyID: "1001",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      VName: Yup.string().required("Remarks is required"),
      EmpID: Yup.string().required("Employee is required"),
      Amount: Yup.number().required("Amount is required"),
      VDate: Yup.date().required("Date is required"),
    }),
    onSubmit: (values) => {
      if (editingGroup) {
        dispatch(
          updateSalaryAllowanceDeduction({ ...values, VID: editingGroup.VID })
        ).then(() => {
          dispatch(getAdvance()); // Fetch updated data after update
          setEditingGroup(null); // Reset editing state
          formik.resetForm(); // Reset form
        });
      } else {
        dispatch(submitSalaryAllowanceDeduction(values)).then(() => {
          dispatch(getAdvance()); // Fetch updated data after submission
          formik.resetForm(); // Reset form
        });
      }
    },
  });
    // edit
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
    VDate: group.VDate.split("T")[0],
    EmpID: group.EmpID,
    ETypeID: employeeTypeId, // Set ETypeID from employee data
    AllowDedID: 6,
    UID: 202,
    CompanyID: 3001,
    Tranzdatetime: "2025-04-24T10:19:32.099586Z",
  });
};
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const formatDate = (dateString) => {
                 return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
               };
  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteSalaryAllowanceDeduction(deleteId)).then(() => {
        dispatch(getAdvance());
      });
    }
    setDeleteModal(false);
  };
  // Columns for DataTable
    const columns = [
    {
      name: "Employee",
      selector: row => employee.find(emp => String(emp.EmpID) === String(row.EmpID))?.EName || "",
      sortable: true,
    },
    {
      name: "Amount",
      selector: row => row.Amount,
      sortable: true,
    },
    {
      name: "Date",
      selector: row => row.VDate,
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
          <Button className="btn btn-soft-info btn-sm">
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
  // Export functions
    const exportToExcel = () => {
    const exportData = (advance || []).map(item => ({
      Employee: employee.find(emp => String(emp.EmpID) === String(item.EmpID))?.EName || "",
      Amount: item.Amount,
      Date: item.VDate,
      Remarks: item.VName
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Advance");
    XLSX.writeFile(workbook, "Advance.xlsx");
  };
    
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Advance Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Employee", "Amount", "Date", "Remarks"]];
    const data = (advance || []).map(item => [
      employee.find(emp => String(emp.EmpID) === String(item.EmpID))?.EName || "",
      item.Amount,
      item.VDate,
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

    doc.save(`Advance_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToWord = () => {
    const data = advance || [];
    const tableRows = [];
    const headers = ["Employee", "Amount", "Date", "Remarks"];
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
        item.Amount,
        item.VDate,
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
              text: "Advance Report",
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
      saveAs(blob, "Advance.docx");
    });
  };

  document.title = "Advance| EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading && <p>Loading...</p>}
          {/* {error && <p className="text-danger">{error}</p>} */}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader
                    title="Advance"
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
                            <Label htmlFor="Amount" className="form-label">
                              Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="Amount"
                              placeholder="Amount"
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
                            <Label htmlFor="VDate" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VDate"
                              min={getMinDate()} // Prevent past dates
                              value={selectedDate}
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
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Remarks
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
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
                      data={advance || []}
                      filename="Advance.csv"
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
                    title="Advance List"
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

export default Advance;
