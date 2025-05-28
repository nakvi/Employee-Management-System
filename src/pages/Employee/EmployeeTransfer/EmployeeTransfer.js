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
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify"; // Import react-toastify for notifications
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import DeleteModal from "../../../Components/Common/DeleteModal";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { format } from "date-fns";
import {
  getEmployeeLocationTransfer,
  submitEmployeeLocationTransfer,
  updateEmployeeLocationTransfer,
  deleteEmployeeLocationTransfer,
} from "../../../slices/employee/employeeTransfer/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";

const EmployeeTransfer = () => {
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Redux state
  const { loading, error, employeeLocationTransfer } = useSelector(
    (state) => state.EmployeeLocationTransfer
  );
  const { location } = useSelector((state) => state.Location);
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = [] } = useSelector((state) => state.Employee || {});

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getEmployeeLocationTransfer());
    dispatch(getLocation());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
  }, [dispatch]);
  useEffect(() => {
  if (employeeLocationTransfer) {
    const filtered = employeeLocationTransfer.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }
}, [employeeLocationTransfer, searchText]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      VID: 0,
      VName: "",
      VNo: "0",
      VDate: new Date().toISOString().split("T")[0],
      EmpID: "",
      ETypeID: "",
      CurrentLocationID: 0,
      LocationID: 0,
      IsPosted: 1,
      PostedBy: 101,
      PostedDate: "2025-04-23T11:00:00Z",
      IsActive: true,
      UID: 202,
      CompanyID: 3001,
      Tranzdatetime: "2025-04-24T10:19:32.099586Z",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      LocationID: Yup.string()
        .notOneOf(["-1"], "Location is required")
        .required("Required"),
      VDate: Yup.date().required("Date is required"),
      VName: Yup.string().required("Remarks is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const transformedValues = {
          ...values,
          IsActive: values.IsActive ? 1 : 0,
        };
        if (editingGroup) {
          await dispatch(
            updateEmployeeLocationTransfer({
              ...transformedValues,
              VID: editingGroup.VID,
            })
          ).unwrap();
          setEditingGroup(null);
        } else {
          await dispatch(submitEmployeeLocationTransfer(transformedValues)).unwrap();        }
        resetForm({
          values: {
            ...formik.initialValues,
            VDate: new Date().toISOString().split("T")[0],
            ETypeID: employeeType[0]?.VID || "",
          },
        });
      } catch (err) {
        toast.error("Failed to submit employee transfer.");
      }
    },
  });

  // Set default ETypeID and reset EmpID when employeeType loads or ETypeID changes
  useEffect(() => {
    if (employeeType.length > 0 && !formik.values.ETypeID) {
      formik.setFieldValue("ETypeID", employeeType[0].VID);
    }
    formik.setFieldValue("EmpID", ""); // Reset EmpID when ETypeID changes
  }, [employeeType, formik.values.ETypeID]);

  // Set CurrentLocationID based on selected EmpID
  useEffect(() => {
    const selectedEmployee = employee.find(
      (emp) => emp.EmpID === parseInt(formik.values.EmpID)
    );
    if (selectedEmployee && selectedEmployee.LocationID) {
      formik.setFieldValue("CurrentLocationID", selectedEmployee.LocationID);
    } else {
      formik.setFieldValue("CurrentLocationID", 0);
    }
  }, [formik.values.EmpID, employee]);

  // Format date for display
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
  };

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
      VNo: group.VNo,
      VDate: group.VDate.split("T")[0], // Adjust date format for input
      EmpID: group.EmpID,
      ETypeID: employeeTypeId, 
      CurrentLocationID: group.CurrentLocationID,
      LocationID: group.LocationID,
      IsPosted: group.IsPosted,
      PostedBy: group.PostedBy,
      PostedDate: group.PostedDate,
      IsActive: group.IsActive === 1,
      UID: 202,
      CompanyID: 3001,
      Tranzdatetime: "2025-04-24T10:19:32.099586Z",
    });
  };

  // Handle delete click
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteEmployeeLocationTransfer(deleteId)).unwrap();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
    }
  };
  const columns = [
  {
    name: "Employee",
    selector: row => employee?.find(emp => emp.EmpID === row.EmpID)?.EName || "",
    sortable: true,
  },
  {
    name: "Old Location",
    selector: row => location?.find(loc => loc.VID === row.CurrentLocationID)?.VName || "",
    sortable: true,
  },
  {
    name: "New Location",
    selector: row => location?.find(loc => loc.VID === row.LocationID)?.VName || "",
    sortable: true,
  },
  {
    name: "Effective Date",
    selector: row => formatDate(row.VDate),
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
        <Button className="btn btn-soft-info" onClick={() => handleEditClick(row)}>
          <i className="bx bx-edit"></i>
        </Button>
        <Button className="btn btn-soft-danger" onClick={() => handleDeleteClick(row.VID)}>
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
  const worksheet = XLSX.utils.json_to_sheet(employeeLocationTransfer || []);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "EmployeeTransfer");
  XLSX.writeFile(workbook, "EmployeeTransfer.xlsx");
};

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Employee Transfer Report", 105, 15, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

  const headers = [
    ["EmpID", "ETypeID", "CurrentLocationID", "LocationID", "VDate", "VName"]
  ];

  const data = (employeeLocationTransfer || []).map(row => [
    row.EmpID,
    row.ETypeID,
    row.CurrentLocationID,
    row.LocationID,
    row.VDate,
    row.VName,
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

  doc.save(`EmployeeTransfer_${new Date().toISOString().slice(0, 10)}.pdf`);
};

const exportToWord = () => {
  const data = employeeLocationTransfer || [];
  const tableRows = [];

  // Add header row
  if (data.length > 0) {
    const headerCells = [
      "EmpID", "ETypeID", "CurrentLocationID", "LocationID", "VDate", "VName"
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
      item.EmpID,
      item.ETypeID,
      item.CurrentLocationID,
      item.LocationID,
      item.VDate,
      item.VName,
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
            text: "Employee Transfer",
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
    saveAs(blob, "EmployeeTransfer.docx");
  });
};
  const isEditMode = editingGroup !== null;
  const handleCancel = () => {
     formik.resetForm({
        values: {
          ...formik.initialValues,
          VDate: new Date().toISOString().split("T")[0],
          ETypeID: employeeType[0]?.VID || "",
        },
      });
    setEditingGroup(null);
  };
  document.title = "Employee Location Transfer | EMS";

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
                    title={isEditMode ? "Edit Employee Location Transfer" : "Add Employee Location Transfer"}
                    onCancel={handleCancel}
                    isEditMode={isEditMode}
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
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="CurrentLocationID" className="form-label">
                              Old Location
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="CurrentLocationID"
                              readOnly
                              disabled
                              value={
                                location.find(
                                  (loc) => loc.VID === formik.values.CurrentLocationID
                                )?.VName || ""
                              }
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="LocationID" className="form-label">
                              New Location
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
                          <div className="mb-3">
                            <Label htmlFor="VDate" className="form-label">
                              Effective Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VDate"
                              name="VDate"
                              min={getMinDate()}
                              value={formik.values.VDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.VDate && formik.errors.VDate ? (
                              <div className="text-danger">
                                {formik.errors.VDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div className="mb-3">
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
                    title="Employee Location Transfer list"
                    columns={columns}
                    data={filteredData}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={100}
                    paginationRowsPerPageOptions={[100, 200, 500]}
                    highlightOnHover
                    responsive
                  />
                  {/* <div className="table-responsive table-card mt-3 mb-1">
                    <table className="table align-middle table-nowrap table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Employee</th>
                          <th>Old Location</th>
                          <th>New Location</th>
                          <th>Effective Date</th>
                          <th>Remarks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="list form-check-all">
                        {console.log("d",employeeLocationTransfer)}
                        {employeeLocationTransfer?.length > 0 ? (
                          employeeLocationTransfer.map((group) => (
                            
                            <tr key={group.VID}>
                              <td>
                                  {employee.find((emp) => String(emp.EmpID) === String(group.EmpID))?.EName|| "N/A"}
                                </td>
                              <td>
                                {location?.find(
                                  (loc) => loc.VID === group.CurrentLocationID
                                )?.VName || ""}
                              </td>
                              <td>
                                {location?.find(
                                  (loc) => loc.VID === group.LocationID
                                )?.VName || ""}
                              </td>
                              <td>{formatDate(group.VDate)}</td>
                              <td>{group.VName}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    className="btn btn-soft-info"
                                    onClick={() => handleEditClick(group)}
                                  >
                                    <i className="bx bx-edit"></i>
                                  </Button>
                                  <Button
                                    className="btn btn-soft-danger"
                                    onClick={() => handleDeleteClick(group.VID)}
                                  >
                                    <i className="ri-delete-bin-2-line"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No Employee Location Transfer found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <DeleteModal
            show={showDeleteModal}
            onDeleteClick={handleDeleteConfirm}
            onCloseClick={() => setShowDeleteModal(false)}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EmployeeTransfer;