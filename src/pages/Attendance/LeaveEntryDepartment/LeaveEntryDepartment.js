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
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getLeaveType } from "../../../slices/Attendance/leaveType/thunk";
import {
  deleteLeaveEntryDepartment,
  getLeaveEntryDepartment,
  submitLeaveEntryDepartment,
} from "../../../slices/Attendance/leaveEntryDepartment/thunk";

const LeaveEntryDepartment = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Redux state
  const { loading, error, leaveEntryDepartment } = useSelector((state) => state.LeaveEntryDepartment || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { leaveType = [] } = useSelector((state) => state.LeaveType || {});

  // Fetch data on mount
  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getLeaveType());
    dispatch(getLeaveEntryDepartment());
  }, [dispatch]);

  // Filter data based on search text
  useEffect(() => {
    if (leaveEntryDepartment && departmentList && leaveType) {
      const filtered = leaveEntryDepartment.filter((item) => {
        const deptName = departmentList.find((row) => row.VID === item.DeptID)?.VName || "";
        const leaveTypeName = leaveType.find((row) => row.VID === item.LeaveTypeID)?.VName || "";
        const searchString = [
          deptName,
          formatDate(item.DateFrom),
          leaveTypeName,
          item.VName,
        ].join(" ").toLowerCase();
        return searchString.includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [leaveEntryDepartment, departmentList, leaveType, searchText]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      DeptID: "",
      DateFrom: "",
      DateTo: "",
      VName: "",
      LeaveTypeID: 0,
      UID: 501,
      CompanyID: "1001",
    },
    validationSchema: Yup.object({
      DeptID: Yup.number().min(1, "Department Type is required").required("Required"),
      VName: Yup.string().required("Remarks is required"),
      LeaveTypeID: Yup.number().min(1, "Leave Type is required").required("Required"),
      DateFrom: Yup.date().required("Date is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(submitLeaveEntryDepartment(values)).unwrap();
        dispatch(getLeaveEntryDepartment());
        resetForm();
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
  });

  // Sync DateTo with DateFrom whenever DateFrom changes
  useEffect(() => {
    formik.setFieldValue("DateTo", formik.values.DateFrom);
  }, [formik.values.DateFrom]);

  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteLeaveEntryDepartment(deleteId)).then(() => {
        dispatch(getLeaveEntryDepartment());
      });
    }
    setDeleteModal(false);
  };

  // Format dates
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  // DataTable columns
  const columns = [
    {
      name: "Department",
      selector: (row) => departmentList.find((item) => item.VID === row.DeptID)?.VName || "N/A",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => formatDate(row.DateFrom),
      sortable: true,
    },
    {
      name: "Leave Type",
      selector: (row) => leaveType.find((item) => item.VID === row.LeaveTypeID)?.VName || "N/A",
      sortable: true,
    },
    {
      name: "Remarks",
      selector: (row) => row.VName || "N/A",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
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

  // DataTable custom styles
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

  // Export to Excel
  const exportToExcel = () => {
    const exportData = (filteredData || []).map((item) => ({
      Department: departmentList.find((row) => row.VID === item.DeptID)?.VName || "N/A",
      Date: formatDate(item.DateFrom),
      "Leave Type": leaveType.find((row) => row.VID === item.LeaveTypeID)?.VName || "N/A",
      Remarks: item.VName || "N/A",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LeaveEntryDepartment");
    XLSX.writeFile(workbook, "LeaveEntryDepartment.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Leave Entry Department Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Department", "Date", "Leave Type", "Remarks"]];
    const data = (filteredData || []).map((item) => [
      departmentList.find((row) => row.VID === item.DeptID)?.VName || "N/A",
      formatDate(item.DateFrom),
      leaveType.find((row) => row.VID === item.LeaveTypeID)?.VName || "N/A",
      item.VName || "N/A",
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
        doc.text(`Page ${data.pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
          align: "center",
        });
      },
    });

    doc.save(`LeaveEntryDepartment_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Export to Word
  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];
    const headers = ["Department", "Date", "Leave Type", "Remarks"];

    // Header row
    const headerCells = headers.map((key) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: key, bold: true, size: 20 })],
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
      })
    );
    tableRows.push(new TableRow({ children: headerCells }));

    // Data rows
    data.forEach((item) => {
      const rowCells = [
        departmentList.find((row) => row.VID === item.DeptID)?.VName || "N/A",
        formatDate(item.DateFrom),
        leaveType.find((row) => row.VID === item.LeaveTypeID)?.VName || "N/A",
        item.VName || "N/A",
      ].map((value) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: String(value), size: 18 })],
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
              text: "Leave Entry Department Report",
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

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "LeaveEntryDepartment.docx");
    });
  };

  document.title = "Leave Entry Department | EMS";

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
                  <PreviewCardHeader title="Leave Entry Department" onCancel={formik.resetForm} />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="DeptID" className="form-label">
                              Department
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="DeptID"
                              id="DeptID"
                              value={formik.values.DeptID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {departmentList.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.DeptID && formik.errors.DeptID ? (
                              <div className="text-danger">{formik.errors.DeptID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                              name="DateFrom"
                              {...formik.getFieldProps("DateFrom")}
                            />
                            {formik.touched.DateFrom && formik.errors.DateFrom ? (
                              <div className="text-danger">{formik.errors.DateFrom}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="LeaveTypeID" className="form-label">
                              Leave Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="LeaveTypeID"
                              id="LeaveTypeID"
                              value={formik.values.LeaveTypeID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {leaveType.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.LeaveTypeID && formik.errors.LeaveTypeID ? (
                              <div className="text-danger">{formik.errors.LeaveTypeID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={6}>
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
                    <Button className="btn-sm" color="success" onClick={exportToExcel}>
                      Export to Excel
                    </Button>
                    <Button className="btn-sm" color="primary" onClick={exportToWord}>
                      Export to Word
                    </Button>
                    <Button className="btn-sm" color="danger" onClick={exportToPDF}>
                      Export to PDF
                    </Button>
                    <CSVLink
                      data={filteredData.map((item) => ({
                        Department: departmentList.find((row) => row.VID === item.DeptID)?.VName || "N/A",
                        Date: formatDate(item.DateFrom),
                        "Leave Type": leaveType.find((row) => row.VID === item.LeaveTypeID)?.VName || "N/A",
                        Remarks: item.VName || "N/A",
                      }))}
                      filename="LeaveEntryDepartment.csv"
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
                    title="Leave Entry Department List"
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
        onCloseClick={() => setDeleteModal(false)}
        onDeleteClick={handleDeleteConfirm}
      />
    </React.Fragment>
  );
};

export default LeaveEntryDepartment;