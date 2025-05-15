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
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv"; // For CSV export
import * as XLSX from "xlsx"; // For Excel export
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import DeleteModal from "../../../Components/Common/DeleteModal";
// Import Images
import avtarImage3 from "../../../assets/images/users/avatar-3.jpg";
import {
  getLocation,
  submitLocation,
  updateLocation,
  deleteLocation,
} from "../../../slices/setup/location/thunk";

const Location = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For previewing selected image
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // Access Redux state
  const { loading, error, location } = useSelector((state) => state.Location);
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getLocation());
  }, [dispatch]);

  // searchText
  // Filtering
  useEffect(() => {
    if (location) {
      const filtered = location.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, location]);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      VCode: "",
      VName: "",
      VNameUrdu: "",
      SortOrder: 0,
      Address: "",
      AddressUrdu: "",
      Logo: null,
      CompanyID: "1",
      UID: "1",
      IsActive: false,
    },
    validationSchema: Yup.object({
      VCode: Yup.string()
        .required("Code is required.")
        .min(3, "Code at least must be 3 characters ")
        .max(4, "Code must be 4 characters or less."),
      VName: Yup.string()
        .required("Title is required.")
        .min(3, "Title at least must be 3 characters "),
      VNameUrdu: Yup.string()
        .required("Title Urdu is required.")
        .min(3, "Title at least must be 3 characters "),
      Address: Yup.string().required("Address is required."),
      AddressUrdu: Yup.string().required("Address Urdu is required."),
      SortOrder: Yup.number()
        .typeError("Sort Order must be a number.")
        .required("Sort Order is required."),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      // Add your form submission logic here
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
      };
      if (editingGroup) {
        console.log("Editing Group", transformedValues);
        dispatch(
          updateLocation({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null); // Reset after submission
      } else {
        dispatch(submitLocation(transformedValues));
      }
      formik.resetForm();
      setImagePreview(null); // Reset image preview
    },
  });
  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("Logo", file); // Set file in Formik
      setImagePreview(URL.createObjectURL(file)); // Create preview URL
    }
  };
  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteLocation(deleteId));
    }
    setDeleteModal(false);
  };
  const handleEditClick = (group) => {
    setEditingGroup(group);
    console.log(group);
    formik.setValues({
      Address: group.Address,
      AddressUrdu: group.AddressUrdu,
      Logo: null,
      VCode: group.VCode,
      VName: group.VName,
      VNameUrdu: group.VNameUrdu,
      SortOrder: group.SortOrder,
      UID: group.UID,
      CompanyID: group.CompanyID,
      IsActive: group.IsActive == true,
    });
    setImagePreview(group.Logo || null); // Show existing image if available
  };
  document.title = "Location | EMS";

  // ...existing code...

// Export to Excel
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(location || []);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Locations");
  XLSX.writeFile(workbook, "Locations.xlsx");
};

// Export to PDF
const exportToPDF = () => {
  try {
    const doc = new jsPDF();

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Locations Report", 105, 15, { align: "center" });

    // Add date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    // Prepare data for the table
    const headers = [
      ["Code", "Title", "Title Urdu", "Address", "Address Urdu", "Sort Order", "Status"]
    ];

    const data = location.map(loc => [
      loc.VCode,
      loc.VName,
      loc.VNameUrdu,
      loc.Address,
      loc.AddressUrdu,
      loc.SortOrder,
      loc.IsActive === 1 || loc.IsActive === true ? "Active" : "Inactive"
    ]);

    // Add table
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
        halign: "center"
      },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 20, halign: "center" },
        6: { cellWidth: 20, halign: "center" }
      },
      didDrawPage: (data) => {
        // Footer
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

    // Save the PDF
    doc.save(`Locations_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};

// Export to Word
const exportToWord = () => {
  const data = location || [];

  const tableRows = [];

  // Add header row
  if (data.length > 0) {
    const headerCells = [
      "Code", "Title", "Title Urdu", "Address", "Address Urdu", "Sort Order", "Status"
    ].map(key =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: key,
                bold: true,
                size: 20, // 12pt font
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: {
          size: 100 / 7,
          type: WidthType.PERCENTAGE,
        },
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
      item.Address,
      item.AddressUrdu,
      item.SortOrder,
      item.IsActive === 1 || item.IsActive === true ? "Active" : "Inactive"
    ].map(value =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: String(value ?? ""),
                size: 18, // 11pt font
              }),
            ],
            alignment: AlignmentType.LEFT,
          }),
        ],
        width: {
          size: 100 / 7,
          type: WidthType.PERCENTAGE,
        },
      })
    );
    tableRows.push(new TableRow({ children: rowCells }));
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Locations",
            heading: "Heading1", // Bigger title
          }),
          new Table({
            rows: tableRows,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, "Locations.docx");
  });
};

// ...existing code...
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
    name: "Address",
    selector: (row) => row.Address,
    sortable: true,
  },
  {
    name: "Address Urdu",
    selector: (row) => row.AddressUrdu,
    sortable: true,
  },
  {
    name: "Logo",
    cell: (row) => (
      <img
        src={row.Logo || avtarImage3}
        alt="Logo"
        className="avatar-xs rounded-circle"
      />
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
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
                <Form
                  onSubmit={formik.handleSubmit}
                  encType="multipart/form-data"
                >
                  <PreviewCardHeader
                    title={isEditMode ? "Edit Location" : "Add Location"}
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
                            <Label htmlFor="VNameUrdu" className="form-label">
                              Title-Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
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
                              type="text"
                              className="form-control-sm"
                              id="SortOrder"
                              placeholder="Sort Order"
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
                            <Label htmlFor="Address" className="form-label">
                              Address
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="Address"
                              placeholder="Address"
                              {...formik.getFieldProps("Address")}
                            />
                            {formik.touched.Address && formik.errors.Address ? (
                              <div className="text-danger">
                                {formik.errors.Address}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="AddressUrdu" className="form-label">
                              Address-Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="AddressUrdu"
                              placeholder="Address Urdu"
                              {...formik.getFieldProps("AddressUrdu")}
                            />
                            {formik.touched.AddressUrdu &&
                            formik.errors.AddressUrdu ? (
                              <div className="text-danger">
                                {formik.errors.AddressUrdu}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="formFile" className="form-label">
                              Logo
                            </Label>
                            <Input
                              className="form-control-sm"
                              type="file"
                              id="formFile"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                            {imagePreview && (
                              <div className="mt-2">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="avatar-md rounded"
                                />
                              </div>
                            )}
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
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <Button className="btn-sm" color="success" onClick={exportToExcel}>Export to Excel</Button>
                    <Button className="btn-sm" color="primary" onClick={exportToWord}>Export to Word</Button>
                    <Button className="btn-sm" color="danger" onClick={exportToPDF}>Export to PDF</Button>
                    <CSVLink
                      data={location || []}
                      filename="location.csv"
                      className="btn btn-sm btn-secondary"
                    >
                      Export to CSV
                    </CSVLink>
                  </div>
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
                    title="locations"
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationPerPage={100} 
                    paginationRowsPerPageOptions={[100, 200, 500]} 
                    highlightOnHover
                    responsive
                    customStyles={customStyles}
                    // subHeader
                    // subHeaderComponent={
                    //   <div className="d-flex justify-content-end">
                    //     <input
                    //       type="text"
                    //       placeholder="Search"
                    //       className="form-control-sm"
                    //       value={searchText}
                    //       onChange={(e) => setSearchText(e.target.value)} // ate search text
                    //     />
                    //   </div>
                    // }
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

export default Location;
