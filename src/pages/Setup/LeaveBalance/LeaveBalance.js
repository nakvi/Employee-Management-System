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
  CardHeader
} from "reactstrap";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { getAttendanceGroup } from "../../../slices/setup/attendanceGroup/thunk";
import {
  deleteLeaveBalance,
  getLeaveBalance,
  submitLeaveBalance,
  updateLeaveBalance,
} from "../../../slices/setup/leaveBalance/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";

const LeaveBalance = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Access Redux state
  const { loading, error, leaveBalance } = useSelector(
    (state) => state.LeaveBalance
  );
  const { attendanceGroup } = useSelector((state) => state.AttendanceGroup);
  const { location } = useSelector((state) => state.Location);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getLeaveBalance());
    dispatch(getAttendanceGroup());
    dispatch(getLocation());
  }, [dispatch]);
  // Filtered DataTable data
  useEffect(() => {
    if (leaveBalance) {
      const filtered = leaveBalance.filter((item) =>
        [
          attendanceGroup?.data?.find((g) => g.VID === item.AttGroupID)?.VName || "",
          item.LeaveLimit,
          item.VName,
          location?.find((g) => g.VID === item.LocationID)?.VName || "",
          formatDate(item.DateFrom),
          formatDate(item.DateTo),
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, leaveBalance, attendanceGroup, location]);


  const formik = useFormik({
    initialValues: {
      VName: "",
      AttGroupID: "-1",
      DateFrom: "",
      DateTo: "",
      LeaveLimit: "",
      LocationID: "-1",  // Default to "-1"
      CompanyID: "1",
      UID: "1",
      IsActive: false,
    },
    validationSchema: Yup.object({
      VName: Yup.string()
        .required("Title is required.")
        .min(3, "Title at least must be 3 characters "),
      DateFrom: Yup.date()
        .required("Start date is required."),
      DateTo: Yup.date()
        .required("End date is required.")
        .min(Yup.ref("DateFrom"), "End date must be later than Start date."),
      LeaveLimit: Yup.number()
        .typeError("Leave limit must be a number.")
        .required("Leave limit is required."),
      // AttGroupID: Yup.number().required("Attendance Group is required."),
      AttGroupID: Yup.string()
        .test("is-valid-leave-type", "Attendance Group is required.", (value) => value !== "-1"),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      // Add your form submission logic here
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
      };
      // Remove LocationID if it's "-1" (default/unselected)
      if (transformedValues.LocationID === -1) {
        transformedValues.LocationID === "";
      }
      if (editingGroup) {
        console.log("Editing Group", transformedValues);
        dispatch(
          updateLeaveBalance({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null); // Reset after submission
      } else {
        dispatch(submitLeaveBalance(transformedValues));
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
      dispatch(deleteLeaveBalance(deleteId));
    }
    setDeleteModal(false);
  };
  const handleEditClick = (group) => {
    setEditingGroup(group);
    const formatDateForInput = (dateString) => {
      return dateString ? dateString.split("T")[0] : ""; // Extract YYYY-MM-DD part
    };
    formik.setValues({
      VName: group.VName,
      AttGroupID: group.AttGroupID,
      DateFrom: formatDateForInput(group.DateFrom),
      DateTo: formatDateForInput(group.DateTo),
      LeaveLimit: group.LeaveLimit,
      LocationID: group.LocationID,
      UID: group.UID,
      CompanyID: group.CompanyID,
      IsActive: group.IsActive === 1,
    });
  };
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  document.title = "Leave Balance | EMS";

  const isEditMode = editingGroup !== null;
  const handleCancel = () => {
    formik.resetForm();
    setEditingGroup(null);
  };
  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LeaveBalance");
    XLSX.writeFile(workbook, "LeaveBalance.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Leave Balance Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Attendance Group", "Leave Limit", "Title", "Location", "Date From", "Date To"]];
    const data = (filteredData || []).map(row => [
      attendanceGroup?.data?.find((g) => g.VID === row.AttGroupID)?.VName || "",
      row.LeaveLimit,
      row.VName,
      location?.find((g) => g.VID === row.LocationID)?.VName || "",
      formatDate(row.DateFrom),
      formatDate(row.DateTo),
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

    doc.save(`LeaveBalance_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];

    // Add header row
    if (data.length > 0) {
      const headerCells = [
        "Attendance Group", "Leave Limit", "Title", "Location", "Date From", "Date To"
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
    data.forEach(row => {
      const rowCells = [
        attendanceGroup?.data?.find((g) => g.VID === row.AttGroupID)?.VName || "",
        row.LeaveLimit,
        row.VName,
        location?.find((g) => g.VID === row.LocationID)?.VName || "",
        formatDate(row.DateFrom),
        formatDate(row.DateTo),
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
              text: "Leave Balance",
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
      saveAs(blob, "LeaveBalance.docx");
    });
  };

  // DataTable columns
  const columns = [
    {
      name: "Attendance Group",
      selector: (row) =>
        attendanceGroup?.data?.find((g) => g.VID === row.AttGroupID)?.VName || "",
      sortable: true,
    },
    { name: "Leave Limit", selector: (row) => row.LeaveLimit, sortable: true },
    { name: "Title", selector: (row) => row.VName, sortable: true },
    {
      name: "Location",
      selector: (row) =>
        location?.find((g) => g.VID === row.LocationID)?.VName || "",
      sortable: true,
    },
    { name: "Date From", selector: (row) => formatDate(row.DateFrom), sortable: true },
    { name: "Date To", selector: (row) => formatDate(row.DateTo), sortable: true },
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
                  {/* <PreviewCardHeader
                    title={isEditMode ? "Edit Leave Balance" : "Add Leave Balance"}
                    onCancel={handleCancel}
                    isEditMode={isEditMode}
                  /> */}
                  <CardHeader className="align-items-center d-flex py-2">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Leave Balance
                    </h4>
                    <div className="flex-shrink-0">
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                        id="create-btn"
                      >
                        <i className="align-bottom me-1"></i>Save
                      </Button>
                      <Button color="dark" className="add-btn me-1 py-1"
                        onCancel={handleCancel}>
                        <i className="align-bottom me-1"></i> Cancel
                      </Button>
                    </div>
                    <div className="d-inline-block position-relative">
                      <Button
                        tag="label"
                        type="button" // <-- Fix here
                        color="primary"
                        className="add-btn me-1 py-1 mb-0"
                        htmlFor="file-upload"
                        title="Employee Leave"
                      >
                        <i className="align-bottom me-1"></i>Upload
                      </Button>
                      <Input
                        type="file"
                        id="file-upload"
                        accept=".xlsx, .xls"
                        // onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                    <div className="d-inline-block position-relative">
                      <Button
                        tag="label"
                        type="button" // <-- Fix here
                        color="primary"
                        className="add-btn me-1 py-1 mb-0"
                        htmlFor="file-upload"
                        title="Leave Balanace"
                      >
                        <i className="align-bottom me-1"></i>Upload
                      </Button>
                      <Input
                        type="file"
                        id="file-upload"
                        accept=".xlsx, .xls"
                        // onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  </CardHeader>
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">

                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Attendance Group
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                              {...formik.getFieldProps("AttGroupID")}
                            >
                              <option value="-1" >
                                ---Select---
                              </option>
                              {attendanceGroup?.data?.length > 0 ? (
                                attendanceGroup.data.map((group) => (
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
                            {formik.touched.AttGroupID &&
                              formik.errors.AttGroupID ? (
                              <div className="text-danger">
                                {formik.errors.AttGroupID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="LeaveLimit" className="form-label">
                              Leave Limit
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="LeaveLimit"
                              placeholder="Leave Limit"
                              {...formik.getFieldProps("LeaveLimit")}
                            />
                            {formik.touched.LeaveLimit &&
                              formik.errors.LeaveLimit ? (
                              <div className="text-danger">
                                {formik.errors.LeaveLimit}
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
                          <div className="mb-3">
                            <Label htmlFor="LocationID" className="form-label">
                              Location
                            </Label>
                            <select
                              name="LocationID"
                              id="LocationID"
                              className="form-select form-select-sm"
                              value={formik.values.LocationID} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1" >
                                ---Select---
                              </option>
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
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Date From
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
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
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="DateTo" className="form-label">
                              Date To
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateTo"
                              {...formik.getFieldProps("DateTo")}


                            />
                            {formik.touched.DateTo && formik.errors.DateTo ? (
                              <div className="text-danger">
                                {formik.errors.DateTo}
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
                              defaultChecked=""
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
                      filename="leave_balance.csv"
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
                    title="Leave Balance"
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

export default LeaveBalance;
