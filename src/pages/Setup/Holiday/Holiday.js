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
import { format } from "date-fns";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import DeleteModal from "../../../Components/Common/DeleteModal";
import DataTable from "react-data-table-component";
import { getHolidayType } from "../../../slices/setup/holidayType/thunk";
import {
  deleteHoliday,
  getHoliday,
  submitHoliday,
  updateHoliday,
} from "../../../slices/setup/holiday/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";

const Holiday = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();

  // Redux state
  const { loading, error, holiday } = useSelector((state) => state.Holiday);
  const { holidayType } = useSelector((state) => state.HolidayType);
  const { location } = useSelector((state) => state.Location);

  useEffect(() => {
    dispatch(getHoliday());
    dispatch(getHolidayType());
    dispatch(getLocation());
  }, [dispatch]);

  // Filtered DataTable data
  useEffect(() => {
    if (holiday) {
      const filtered = holiday.filter((item) =>
        [
          item.VName,
          formatDate(item.VDate),
          holidayType?.data?.find((groupItem) => groupItem.VID === item.LeaveTypeID)?.VName || "",
          location?.find((groupItem) => groupItem.VID === item.LocationID)?.VName || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, holiday, holidayType, location]);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      VName: "",
      VDate: "",
      LeaveTypeID: "-1",
      LocationID: "-1",
      CompanyID: "1",
      UID: "1",
      IsActive: false,
    },
    validationSchema: Yup.object({
      VName: Yup.string()
        .required("Title is required.")
        .min(3, "Title at least must be 3 characters "),
      VDate: Yup.date().required("Date is required."),
      LeaveTypeID: Yup.string().test(
        "is-valid-leave-type",
        "Holiday Type is required.",
        (value) => value !== "-1"
      ),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0,
      };
      if (transformedValues.LocationID === -1) {
        transformedValues.LocationID = "";
      }
      if (transformedValues.LeaveTypeID === -1) {
        transformedValues.LeaveTypeID = "";
      }
      if (editingGroup) {
        dispatch(
          updateHoliday({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null);
      } else {
        dispatch(submitHoliday(transformedValues));
      }
      formik.resetForm();
    },
  });

  // Edit
  const handleEditClick = (group) => {
    setEditingGroup(group);
    const formatDateForInput = (dateString) => {
      return dateString ? dateString.split("T")[0] : "";
    };
    formik.setValues({
      VName: group.VName,
      VDate: formatDateForInput(group.VDate),
      LeaveTypeID: group.LeaveTypeID,
      LocationID: group.LocationID,
      UID: group.UID,
      CompanyID: group.CompanyID,
      IsActive: group.IsActive === 1 || group.IsActive === true,
    });
  };

  // Delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteHoliday(deleteId));
    }
    setDeleteModal(false);
  };

  const isEditMode = editingGroup !== null;
  const handleCancel = () => {
    formik.resetForm();
    setEditingGroup(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Holidays");
    XLSX.writeFile(workbook, "Holidays.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Holidays Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Title", "Holiday Type", "Date", "Location"]];
    const data = (filteredData || []).map(row => [
      row.VName,
      holidayType?.data?.find((groupItem) => groupItem.VID === row.LeaveTypeID)?.VName || "",
      formatDate(row.VDate),
      location?.find((groupItem) => groupItem.VID === row.LocationID)?.VName || "",
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

    doc.save(`Holidays_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];

    // Add header row
    if (data.length > 0) {
      const headerCells = [
        "Title", "Holiday Type", "Date", "Location"
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
          width: { size: 100 / 4, type: WidthType.PERCENTAGE },
        })
      );
      tableRows.push(new TableRow({ children: headerCells }));
    }

    // Add data rows
    data.forEach(row => {
      const rowCells = [
        row.VName,
        holidayType?.data?.find((groupItem) => groupItem.VID === row.LeaveTypeID)?.VName || "",
        formatDate(row.VDate),
        location?.find((groupItem) => groupItem.VID === row.LocationID)?.VName || "",
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
          width: { size: 100 / 4, type: WidthType.PERCENTAGE },
        })
      );
      tableRows.push(new TableRow({ children: rowCells }));
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Holidays",
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
      saveAs(blob, "Holidays.docx");
    });
  };

  // DataTable columns
  const columns = [
    { name: "Title", selector: (row) => row.VName, sortable: true },
    {
      name: "Holiday Type",
      selector: (row) =>
        holidayType?.data?.find((groupItem) => groupItem.VID === row.LeaveTypeID)?.VName || "",
      sortable: true,
    },
    { name: "Date", selector: (row) => formatDate(row.VDate), sortable: true },
    {
      name: "Location",
      selector: (row) =>
        location?.find((groupItem) => groupItem.VID === row.LocationID)?.VName || "",
      sortable: true,
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

  document.title = "Holiday | EMS";
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
                    title={isEditMode ? "Edit Holiday" : "Add Holiday"}
                    onCancel={handleCancel}
                    isEditMode={isEditMode}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
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
                          <div className="mb-3">
                            <Label htmlFor="LeaveTypeID" className="form-label">
                              Holiday Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="LeaveTypeID"
                              id="LeaveTypeID"
                              value={formik.values.LeaveTypeID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="-1">---Select---</option>
                              {holidayType?.data?.length > 0 ? (
                                holidayType.data.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>
                                  No groups available
                                </option>
                              )}
                            </select>
                            {formik.touched.LeaveTypeID &&
                            formik.errors.LeaveTypeID ? (
                              <div className="text-danger">
                                {formik.errors.LeaveTypeID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VDate" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VDate"
                              placeholder="Date"
                              {...formik.getFieldProps("VDate")}
                            />
                            {formik.touched.VDate && formik.errors.VDate ? (
                              <div className="text-danger">
                                {formik.errors.VDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="LocationID" className="form-label">
                              Location
                            </Label>
                            <select
                              name="LocationID"
                              id="LocationID"
                              className="form-select form-select-sm"
                              value={formik.values.LocationID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="-1">---Select---</option>
                              {location?.length > 0 ? (
                                location.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No location available
                                </option>
                              )}
                            </select>
                            {formik.touched.LocationID && formik.errors.LocationID ? (
                              <div className="text-danger">
                                {formik.errors.LocationID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check form-switch" dir="ltr">
                            <Input
                              type="checkbox"
                              id="IsActive"
                              className="form-check-input"
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
                    filename="holidays.csv"
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
                    title="Holidays"
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

export default Holiday;