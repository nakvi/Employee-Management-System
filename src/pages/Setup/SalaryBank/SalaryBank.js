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
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  getSalaryBank,
  submitSalaryBank,
  updateSalaryBank,
  deleteSalaryBank,
} from "../../../slices/setup/salaryBank/thunk";

const SalaryBank = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Access Redux state
  const { loading, error, salaryBank } = useSelector(
    (state) => state.SalaryBank
  );

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getSalaryBank());
  }, [dispatch]);

  useEffect(() => {
    if (salaryBank) {
      const filtered = salaryBank.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, salaryBank]);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      VCode: "",
      VName: "",
      BranchName: "",
      AccountNumber: "",
      AccountManager: "",
      SortOrder: 0,
      CompanyID: "1",
      LocationID: "1",
      UID: "1",
      IsCash: 0,
      IsActive: true,
    },
    validationSchema: Yup.object({
      VCode: Yup.string()
        .required("Code is required.")
        .min(3, "Code must be at least 3 characters ")
        .max(10, "Code must be less then 10 characters"),
      VName: Yup.string()
        .required("Title is required.")
        .min(3, "Title at least must be 3 characters "),
      BranchName: Yup.string().required("Branch Name is required."),
      AccountNumber: Yup.number()
        .typeError("Account Number must be a number.")
        .required("Account Number is required."),
      AccountManager: Yup.string().required("Account Manager is required."),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0,
      };
      if (editingGroup) {
        dispatch(
          updateSalaryBank({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null);
      } else {
        dispatch(submitSalaryBank(transformedValues));
      }
      formik.resetForm();
    },
  });

  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
       if (editingGroup && editingGroup.VID === deleteId) {
        formik.resetForm(); // Reset the form
        setEditingGroup(null); // Clear the editing state
      }
      dispatch(deleteSalaryBank(deleteId));
    }
    setDeleteModal(false);
  };
  const handleEditClick = (group) => {
    setEditingGroup(group);
    formik.setValues({
      VCode: group.VCode,
      VName: group.VName,
      AccountNumber: group.AccountNumber,
      AccountManager: group.AccountManager,
      LocationID: group.LocationID,
      IsCash: 0,
      BranchName: group.BranchName,
      SortOrder: group.SortOrder,
      UID: group.UID,
      CompanyID: group.CompanyID,
      IsActive: group.IsActive === 1 || group.IsActive === true,
    });
  };
  const isEditMode = editingGroup !== null;
  const handleCancel = () => {
    formik.resetForm();
    setEditingGroup(null);
  };

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SalaryBanks");
    XLSX.writeFile(workbook, "SalaryBanks.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Salary Banks Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Code", "Title", "Branch Name", "Account No", "Account Manager", "Active"]];
    const data = (filteredData || []).map(row => [
      row.VCode,
      row.VName,
      row.BranchName,
      row.AccountNumber,
      row.AccountManager,
      row.IsActive ? "Yes" : "No"
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

    doc.save(`SalaryBanks_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];

    // Add header row
    if (data.length > 0) {
      const headerCells = [
        "Code", "Title", "Branch Name", "Account No", "Account Manager", "Active"
      ].map(key =>
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
          width: { size: 100 / 6, type: WidthType.PERCENTAGE },
        })
      );
      tableRows.push(new TableRow({ children: headerCells }));
    }

    // Add data rows
    data.forEach(item => {
      const rowCells = [
        item.VCode,
        item.VName,
        item.BranchName,
        item.AccountNumber,
        item.AccountManager,
        item.IsActive ? "Yes" : "No"
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
          width: { size: 100 / 6, type: WidthType.PERCENTAGE },
        })
      );
      tableRows.push(new TableRow({ children: rowCells }));
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Salary Banks",
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
      saveAs(blob, "SalaryBanks.docx");
    });
  };

  // DataTable columns
  const columns = [
    { name: "Code", selector: (row) => row.VCode, sortable: true },
    { name: "Title", selector: (row) => row.VName, sortable: true },
    { name: "Branch Name", selector: (row) => row.BranchName, sortable: true },
    { name: "Account No", selector: (row) => row.AccountNumber, sortable: true },
    { name: "Account Manager", selector: (row) => row.AccountManager, sortable: true },
    { name: "Active", selector: (row) => row.IsActive ? "Yes" : "No", sortable: true },
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

  document.title = "Salary Banks | EMS";
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
                    // title={isEditMode ? "Edit Salary Bank" : "Add Salary Bank"}
                    title="Salary Bank"
                    onCancel={handleCancel}
                    isEditMode={isEditMode}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VCode" className="form-label">
                              Code
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VCode"
                              placeholder="Code"
                              {...formik.getFieldProps("VCode")}
                            />
                            {formik.touched.VCode && formik.errors.VCode ? (
                              <div className="text-danger">
                                {formik.errors.VCode}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Title
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Title"
                              {...formik.getFieldProps("VName")}
                            />
                            {formik.touched.VName && formik.errors.VName ? (
                              <div className="text-danger">
                                {formik.errors.VName}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="BranchName" className="form-label">
                              Branch Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="BranchName"
                              placeholder="Branch Name"
                              {...formik.getFieldProps("BranchName")}
                            />
                            {formik.touched.BranchName &&
                            formik.errors.BranchName ? (
                              <div className="text-danger">
                                {formik.errors.BranchName}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label
                              htmlFor="AccountNumber"
                              className="form-label"
                            >
                              Account Number
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="AccountNumber"
                              placeholder="Account Number"
                              {...formik.getFieldProps("AccountNumber")}
                            />
                            {formik.touched.AccountNumber &&
                            formik.errors.AccountNumber ? (
                              <div className="text-danger">
                                {formik.errors.AccountNumber}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label
                              htmlFor="AccountManager"
                              className="form-label"
                            >
                              Account Manager
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="AccountManager"
                              placeholder="Account Manager"
                              {...formik.getFieldProps("AccountManager")}
                            />
                            {formik.touched.AccountManager &&
                            formik.errors.AccountManager ? (
                              <div className="text-danger">
                                {formik.errors.AccountManager}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2} className="mt-4">
                          <div
                            className="form-check form-switch mt-3 "
                            dir="ltr"
                          >
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="IsActive"
                              {...formik.getFieldProps("IsActive")}
                              checked={formik.values.IsActive}
                            />
                            <Label className="form-check-label" for="IsActive">
                              IsActive
                            </Label>
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
                      data={filteredData || []}
                      filename="salarybanks.csv"
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
                        style={{ width: '200px' }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                  <DataTable
                    title="Salary Banks"
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

export default SalaryBank;