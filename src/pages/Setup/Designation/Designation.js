import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
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
  getDesignation,
  submitDesignation,
  updateDesignation,
  deleteDesignation,
} from "../../../slices/setup/designation/thunk";
import { toast } from "react-toastify";
import { getLocation } from "../../../slices/setup/location/thunk";
const Designation = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null); // Track the group being edited
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // Access Redux state
  const { loading, error, designation } = useSelector(
    (state) => state.Designation
  );
  const { location } = useSelector((state) => state.Location);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getDesignation());
    dispatch(getLocation());
  }, [dispatch]);

  useEffect(() => {
  if (designation) {
    const filtered = designation.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }
}, [searchText, designation]);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      VCode: "",
      VName: "",
      VNameUrdu: "",
      SortOrder: 0,
      GroupID: "0",
      DefaultSalary: 0,
      LocationID: "-1",
      CompanyID: "1",
      UID: "1",
      IsActive: false,
    },
    validationSchema: Yup.object({
      VCode: Yup.string()
        .required("Code is required.")
        .min(3, "Code must be at least 3 characters ")
        .max(10, "Code must be less then 10 characters"),
      VName: Yup.string()
        .required("Title is required.")
        .min(3, "Title at least must be 3 characters "),
      VNameUrdu: Yup.string()
        .required("Title Urdu is required.")
        .min(3, "Title at least must be 3 characters "),
      SortOrder: Yup.number()
        .typeError("Sort Order must be a number.")
        .required("Sort Order is required."),
      DefaultSalary: Yup.number()
        .typeError("Default Salary  must be a number.")
        .required("Default Salary  is required."),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      
      // Add your form submission logic here
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
      };
      // Remove LocationID if it's "-1" (default/unselected)
      if (transformedValues.LocationID === "-1") {
        transformedValues.LocationID = "-1"; // Fix incorrect assignment
      }
      if (editingGroup) {
        dispatch(
          updateDesignation({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null); // Reset after submission
      } else {
        dispatch(submitDesignation(transformedValues));
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
      dispatch(deleteDesignation(deleteId));
    }
    setDeleteModal(false);
  };
  const handleEditClick = (group) => {
    setEditingGroup(group);
    formik.setValues({
      VCode: group.VCode,
      VName: group.VName,
      VNameUrdu: group.VNameUrdu,
      SortOrder: group.SortOrder,
      DefaultSalary: group.DefaultSalary,
      GroupID: group.GroupID,
      UID: group.UID,
      CompanyID: group.CompanyID,
      LocationID: group.LocationID,
      IsActive: group.IsActive === 1,
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Check file extension
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error("Please upload an Excel file (.xlsx or .xls)");
      }
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // Optionally validate format here

      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      // Upload all records
      const uploadPromises = jsonData.map((item) => {
        const transformedValues = {
          VCode: item.Code?.toString() || "",
          VName: item.Title || "",
          VNameUrdu: item["Title Urdu"] || "",
          SortOrder: Number(item["Sort Order"]) || 0,
          DefaultSalary: Number(item["Default Salary"]) || 0,
          LocationID: "-1",
          GroupID: "0",
          CompanyID: "1",
          UID: "1",
          IsActive: 1,
        };
          if (!transformedValues.VNameUrdu) {
            toast.error(`Title Urdu is required for code ${item.Code}`);
            return Promise.reject(new Error("Title Urdu is required"));
          }
        return dispatch(submitDesignation(transformedValues));
      });

      const results = await Promise.allSettled(uploadPromises);

      const successfulUploads = results.filter((r) => r.status === "fulfilled").length;
      const failedUploads = results.filter((r) => r.status === "rejected").length;

      dispatch(getDesignation());

      if (failedUploads > 0) {
        toast.warning(
          `Upload completed with ${successfulUploads} successful and ${failedUploads} failed records.`
        );
      } else {
        toast.success(`${successfulUploads} records uploaded successfully!`);
      }
    } catch (error) {
      toast.error("Invalid file format. Please use the correct template.");
      e.target.value = "";
    }
  };

  const handleExportSample = () => {
    const templatePath = `${process.env.PUBLIC_URL}/templates/Designation_Import_Template.xlsx`;
    const link = document.createElement("a");
    link.href = templatePath;
    link.download = "Designation_Import_Template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  document.title = "Designation | EMS";

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Designations");
    XLSX.writeFile(workbook, "Designations.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Designations Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [
      ["Code", "Title", "Title Urdu", "Default Salary", "Location"]
    ];

    const data = (filteredData || []).map(des => [
      des.VCode,
      des.VName,
      des.VNameUrdu,
      des.DefaultSalary,
      location?.find((l) => l.VID === des.LocationID)?.VName || ""
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      margin: { top: 30 },
      styles: { cellPadding: 4, fontSize: 10, valign: "middle", halign: "left" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10, fontStyle: "bold", halign: "center" },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25, halign: "center" },
        4: { cellWidth: 35 }
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
      }
    });

    doc.save(`Designations_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Export to Word
  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];

    // Add header row
    if (data.length > 0) {
      const headerCells = [
        "Code", "Title", "Title Urdu", "Default Salary", "Location"
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
          width: { size: 100 / 5, type: WidthType.PERCENTAGE },
        })
      );
      tableRows.push(new TableRow({ children: headerCells }));
    }

    // Add data rows
    data.forEach(item => {
      const rowCells = [
        item.VCode,
        item.VName,
        item.VNameUrdu,
        item.DefaultSalary,
        location?.find((l) => l.VID === item.LocationID)?.VName || ""
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
          width: { size: 100 / 5, type: WidthType.PERCENTAGE },
        })
      );
      tableRows.push(new TableRow({ children: rowCells }));
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Designations",
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
      saveAs(blob, "Designations.docx");
    });
  };

  const columns = [
  {
    name: "Code",
    selector: (row) => row.VCode,
    sortable: true,
  },
  {
    name: "Title",
    selector: (row) => row.VName,
    sortable: true,
  },
  {
    name: "Title Urdu",
    selector: (row) => row.VNameUrdu,
    sortable: true,
  },
  {
    name: "Default Salary",
    selector: (row) => row.DefaultSalary,
    sortable: true,
  },
  // {
  //   name: "Location",
  //   selector: (row) =>
  //     location?.find((l) => l.VID === row.LocationID)?.VName || "",
  //   sortable: true,
  // },
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
      const isEditMode = editingGroup !== null;
      const handleCancel = () => {
      formik.resetForm();
      setEditingGroup(null); // This resets the title to "Add Department Group"
    };
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
                   <CardHeader className="align-items-center d-flex py-2">
                    <h4 className="card-title mb-0 flex-grow-1">
                      {editingGroup ? "Edit Designation" : "Add Designation"}
                    </h4>
                    <div className="flex-shrink-0">
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                        id="create-btn"
                      >
                        <i className="align-bottom me-1"></i>
                        {editingGroup ? "Update" : "Save"}
                      </Button>
                      <Button
                        color="dark"
                        className="add-btn me-1 py-1"
                        onClick={() => {
                          formik.resetForm();
                          setEditingGroup(null);
                        }}
                      >
                        <i className="align-bottom me-1"></i> Cancel
                      </Button>
                      {/* <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                        id="upload-btn"
                      >
                        <i className="align-bottom me-1"></i>Upload
                      </Button> */}
                      <div className="d-inline-block position-relative">
                        <Button
                          tag="label"
                          type="button" // <-- Fix here
                          color="primary"
                          className="add-btn me-1 py-1 mb-0"
                          htmlFor="file-upload"
                        >
                          <i className="align-bottom me-1"></i>Upload
                        </Button>
                        <Input
                          type="file"
                          id="file-upload"
                          accept=".xlsx, .xls"
                          onChange={handleFileUpload}
                          style={{ display: "none" }}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-soft-danger btn-sm"
                        onClick={handleExportSample}
                      >
                        Download Sample
                      </button>
                    </div>
                  </CardHeader>
                  {/* <PreviewCardHeader
                    title={isEditMode ? "Edit Designation" : "Add Designation"}
                    onCancel={handleCancel}
                    isEditMode={isEditMode}
                  /> */}
                  
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
                            <Label htmlFor="VNameUrdu" className="form-label">
                              Title-Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm "
                              id="VNameUrdu"
                              placeholder="Title Urdu"
                              {...formik.getFieldProps("VNameUrdu")}
                            />
                            {formik.touched.VNameUrdu &&
                            formik.errors.VNameUrdu ? (
                              <div className="text-danger">
                                {formik.errors.VNameUrdu}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="SortOrder" className="form-label">
                              Sort Order
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="SortOrder"
                              placeholder="Sort Order "
                              {...formik.getFieldProps("SortOrder")}
                            />
                            {formik.touched.SortOrder &&
                            formik.errors.SortOrder ? (
                              <div className="text-danger">
                                {formik.errors.SortOrder}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label
                              htmlFor="DefaultSalary"
                              className="form-label"
                            >
                              Default Salary
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="DefaultSalary"
                              placeholder="Default Salary"
                              {...formik.getFieldProps("DefaultSalary")}
                            />
                            {formik.touched.DefaultSalary &&
                            formik.errors.DefaultSalary ? (
                              <div className="text-danger">
                                {formik.errors.DefaultSalary}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/* <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="LocationGroupInput"
                              className="form-label"
                            >
                              Location
                            </Label>
                            <select className="form-select  form-select-sm mb-3">
                            <option value="-1" selected>
                                ----Select Location----
                              </option>
                              <option value="Choices1" >
                                Lahore
                              </option>
                              <option value="Choices2" >
                                Gujranwala
                              </option>
                            </select>
                          </div>
                        </Col> */}
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
                      filename="designations.csv"
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
                    title="Designations"
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

export default Designation;
