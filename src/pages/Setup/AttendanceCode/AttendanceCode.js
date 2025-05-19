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
import { getAttendanceGroup } from "../../../slices/setup/attendanceGroup/thunk";
import {
  getAttendanceCode,
  submitAttendanceCode,
  updateAttendanceCode,
  deleteAttendanceCode,
} from "../../../slices/setup/attendanceCode/thunk";

const AttendanceCode = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Redux state
  const { loading, error, attendanceCode } = useSelector(
    (state) => state.AttendanceCode
  );
  const { attendanceGroup } = useSelector((state) => state.AttendanceGroup);

  // Fetch data on mount
  useEffect(() => {
    dispatch(getAttendanceCode());
    dispatch(getAttendanceGroup());
  }, [dispatch]);

  // Filtered DataTable data
  useEffect(() => {
    if (attendanceCode) {
      const filtered = attendanceCode.filter((item) =>
        [
          item.VCode,
          item.VName,
          attendanceGroup?.data?.find((g) => g.VID === item.GroupID)?.VName || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, attendanceCode, attendanceGroup]);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      VCode: "",
      VName: "",
      SortOrder: 0,
      GroupID: "-1",
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
      SortOrder: Yup.number()
        .typeError("Sort Order must be a number.")
        .required("Sort Order is required."),
      GroupID: Yup.string().test(
        "is-valid-leave-type",
        "Attendance Group is required.",
        (value) => value !== "-1"
      ),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0,
      };
      if (transformedValues.GroupID === -1) {
        transformedValues.GroupID = "";
      }
      if (editingGroup) {
        dispatch(
          updateAttendanceCode({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null);
      } else {
        dispatch(submitAttendanceCode(transformedValues));
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
      dispatch(deleteAttendanceCode(deleteId));
    }
    setDeleteModal(false);
  };
  const handleEditClick = (group) => {
    setEditingGroup(group);
    formik.setValues({
      VCode: group.VCode,
      VName: group.VName,
      SortOrder: group.SortOrder,
      GroupID: group.GroupID,
      UID: group.UID,
      CompanyID: group.CompanyID,
      IsActive: group.IsActive === 1,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "AttendanceCodes");
    XLSX.writeFile(workbook, "AttendanceCodes.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Attendance Codes Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Code", "Title", "Attendance Group", "Active"]];
    const data = (filteredData || []).map(row => [
      row.VCode,
      row.VName,
      attendanceGroup?.data?.find((g) => g.VID === row.GroupID)?.VName || "",
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

    doc.save(`AttendanceCodes_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];

    // Add header row
    if (data.length > 0) {
      const headerCells = [
        "Code", "Title", "Attendance Group", "Active"
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
        row.VCode,
        row.VName,
        attendanceGroup?.data?.find((g) => g.VID === row.GroupID)?.VName || "",
        row.IsActive ? "Yes" : "No"
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
              text: "Attendance Codes",
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
      saveAs(blob, "AttendanceCodes.docx");
    });
  };

  // DataTable columns
  const columns = [
    { name: "Code", selector: (row) => row.VCode, sortable: true },
    { name: "Title", selector: (row) => row.VName, sortable: true },
    {
      name: "Attendance Group",
      selector: (row) =>
        attendanceGroup?.data?.find((g) => g.VID === row.GroupID)?.VName || "",
      sortable: true,
    },
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

  document.title = "Attendance Codes | EMS";
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
                    title={isEditMode ? "Edit Attendance Code" : "Add Attendance Code"}
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
                          <div className="mb-3">
                            <Label htmlFor="GroupID" className="form-label">
                              Attendance Group
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="GroupID"
                              id="GroupID"
                              value={formik.values.GroupID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="-1">---Select---</option>
                              {attendanceGroup?.data?.length > 0 ? (
                                attendanceGroup.data.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>
                                  No Attendance Group available
                                </option>
                              )}
                            </select>
                            {formik.touched.GroupID && formik.errors.GroupID ? (
                              <div className="text-danger">
                                {formik.errors.GroupID}
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
                        <Col xxl={2} md={2}>
                          <div className="form-check form-switch mt-3" dir="ltr">
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
                      filename="attendance_codes.csv"
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
                    title="Attendance Codes"
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

export default AttendanceCode;