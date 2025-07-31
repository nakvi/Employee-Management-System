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
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  deleteShift,
  getShift,
  submitShift,
  updateShift,
} from "../../../slices/setup/shift/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";

const Shift = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null); // Track the group being edited
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // Access Redux state
  const { loading, error, shift } = useSelector((state) => state.Shift);
    const { location } = useSelector((state) => state.Location);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getShift());
    dispatch(getLocation());
  }, [dispatch]);

  useEffect(() => {
  if (shift) {
    const filtered = shift.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }
}, [searchText, shift]);
  // Formik form setup
  const formik = useFormik({
    initialValues: {
      VCode: "",
      VName: "",
      TimeIn: "",
      TimeOut: "",
      RestTimeFrom: "",
      RestTimeTo: "",
      WorkingHrs: "",
      RelaxTime: "",
      MinAttTime: "",
      MinHDTime: "",
      TimeInRamazan: "",
      TimeOutRamazan: "",
      RestTimeFromRamazan: "",
      RestTimeToRamazan: "",
      WorkingHrsRamazan: "",
      RelaxTimeRamazan: "",
      MinAttTimeRamazan: "",
      MinHDTimeRamazan: "",
      IsDayLight: true,
      DayLightFrom: "2024-06-01T05:00:00Z",
      DayLightTo: "2024-09-01T20:00:00Z",
      TimeInDayLight: 8.3,
      TimeOutDayLight: 19.0,
      RestTimeFromDayLight: 13.3,
      RestTimeToDayLight: 14.3,
      IsRoster: false,
      IsSecurity: false,
      SaturdayHalfTime: false,
      LocationID: "-1",
      IsActive: true,
      UID: "1",
      CompanyID: "1",
    },

    validationSchema: Yup.object({
      VCode: Yup.string()
        .required("Code is required.")
        .min(3, "Code must be at least 3 characters ")
        .max(10, "Code must be less then 10 characters"),
      VName: Yup.string()
        .required("Title is required.")
        .min(3, "Title at least must be 3 characters "),

      TimeIn: Yup.number().required("Time In is required."),
      TimeOut: Yup.number().required("Time Out is required."),
      RestTimeFrom: Yup.number().required("Rest From is required."),
      RestTimeTo: Yup.number().required("Rest To is required."),
      WorkingHrs: Yup.number().required("Working Hours are required."),
      RelaxTime: Yup.number().required("Relax Time is required."),
      MinAttTime: Yup.number().required("Min Time is required."),
      MinHDTime: Yup.number().required("Min Half-Day Time is required."),

      // TimeInRamazan: Yup.number().required("Time In (Ramazan) is required."),
      // TimeOutRamazan: Yup.number().required("Time Out (Ramazan) is required."),
      // RestTimeFromRamazan: Yup.number().required("Rest From (Ramazan) is required."),
      // RestTimeToRamazan: Yup.number().required("Rest To (Ramazan) is required."),
      // WorkingHrsRamazan: Yup.number().required("Working Hours (Ramazan) are required."),
      // RelaxTimeRamazan: Yup.number().required("Relax Time (Ramazan) is required."),
      // MinAttTimeRamazan: Yup.number().required("Min Time (Ramazan) is required."),
      // MinHDTimeRamazan: Yup.number().required("Min Half-Day Time (Ramazan) is required."),
      IsRoster: Yup.boolean(),
      IsSecurity: Yup.boolean(),
      SaturdayHalfTime: Yup.boolean(),
      LocationID: Yup.number().required("Location is required."),
      IsActive: Yup.boolean(),
    }),
onSubmit: async (values, { setSubmitting }) => {
    const transformedValues = {
      ...values,
      IsActive: values.IsActive ? 1 : 0,
      IsRoster: values.IsRoster ? 1 : 0,
      IsSecurity: values.IsSecurity ? 1 : 0,
      SaturdayHalfTime: values.SaturdayHalfTime ? 1 : 0,
    };

    try {
      let result;
      if (editingGroup) {
        // Update existing shift
        result = await dispatch(
          updateShift({ ...transformedValues, VID: editingGroup.VID })
        ).unwrap();
      } else {
        // Create new shift
        result = await dispatch(submitShift(transformedValues)).unwrap();
      }
      // Only reset the form and clear editing state on success
      formik.resetForm();
      setEditingGroup(null);
    } catch (error) {
      // Error is handled in the thunk with toast notifications
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false); // Ensure form is not stuck in submitting state
    }
  },
});
    // onSubmit: (values) => {
    //   const transformedValues = {
    //     ...values,
    //     IsActive: values.IsActive ? 1 : 0,
    //     IsRoster: values.IsRoster ? 1 : 0,
    //     IsSecurity: values.IsSecurity ? 1 : 0,
    //     SaturdayHalfTime: values.SaturdayHalfTime ? 1 : 0,
    //   };
    //   if (editingGroup) {
    //     dispatch(updateShift({ ...transformedValues, VID: editingGroup.VID }));
    //     setEditingGroup(null); // Reset after submission
    //   } else {
    //     dispatch(submitShift(transformedValues));
    //   }
    //   formik.resetForm();
    // },
  // });
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
      dispatch(deleteShift(deleteId));
    }
    setDeleteModal(false);
  };
  const handleEditClick = (group) => {
    setEditingGroup(group);
    formik.setValues({
      VCode: group.VCode,
      VName: group.VName,
      TimeIn: group.TimeIn,
      TimeOut: group.TimeOut,
      RestTimeFrom: group.RestTimeFrom,
      RestTimeTo: group.RestTimeTo,
      WorkingHrs: group.WorkingHrs,
      RelaxTime: group.RelaxTime,
      MinAttTime: group.MinAttTime,
      MinHDTime: group.MinHDTime,
      TimeInRamazan: group.TimeInRamazan,
      TimeOutRamazan: group.TimeOutRamazan,
      RestTimeFromRamazan: group.RestTimeFromRamazan,
      RestTimeToRamazan: group.RestTimeToRamazan,
      WorkingHrsRamazan: group.WorkingHrsRamazan,
      RelaxTimeRamazan: group.RelaxTimeRamazan,
      MinAttTimeRamazan: group.MinAttTimeRamazan,
      MinHDTimeRamazan: group.MinHDTimeRamazan,
      IsDayLight: true,
      DayLightFrom: "2024-06-01T05:00:00Z",
      DayLightTo: "2024-09-01T20:00:00Z",
      TimeInDayLight: 8.3,
      TimeOutDayLight: 19.0,
      RestTimeFromDayLight: 13.3,
      RestTimeToDayLight: 14.3,
      IsRoster: group.IsRoster === true,
      IsSecurity: group.IsSecurity === true,
      SaturdayHalfTime: group.SaturdayHalfTime === true,
      LocationID: group.LocationID,
      IsActive: group.IsActive === true || group.IsActive === 1,
      UID: group.UID,
      CompanyID: group.CompanyID,
    });
  };
  document.title = "Shift | EMS";

  const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredData || []);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Shifts");
  XLSX.writeFile(workbook, "Shifts.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Shifts Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [
      ["Code", "Title", "Location", "Sat-H-Time", "IsRoster", "IsSecurity", "Shift", "Rest", "W-Hrs", "Relax", "Min Time", "HD Time", "Ramazan Shift", "Rest (Ramazan)", "W-Hrs (Ramazan)", "Relax (Ramazan)", "Min Time (Ramazan)", "HD Time (Ramazan)"]
    ];

    const data = (filteredData || []).map(row => [
      row.VCode,
      row.VName,
      location?.find((l) => l.VID === row.LocationID)?.VName || "",
      row.SaturdayHalfTime ? "Yes" : "No",
      row.IsRoster ? "Yes" : "No",
      row.IsSecurity ? "Yes" : "No",
      `(${row.TimeIn} - ${row.TimeOut})`,
      `(${row.RestTimeFrom} - ${row.RestTimeTo})`,
      row.WorkingHrs,
      row.RelaxTime,
      row.MinAttTime,
      row.MinHDTime,
      `(${row.TimeInRamazan} - ${row.TimeOutRamazan})`,
      `(${row.RestTimeFromRamazan} - ${row.RestTimeToRamazan})`,
      row.WorkingHrsRamazan,
      row.RelaxTimeRamazan,
      row.MinAttTimeRamazan,
      row.MinHDTimeRamazan,
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      margin: { top: 30 },
      styles: { cellPadding: 2, fontSize: 8, valign: "middle", halign: "left" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 8, fontStyle: "bold", halign: "center" },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Page ${data.pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }
    });

    doc.save(`Shifts_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];

    // Add header row
    if (data.length > 0) {
      const headerCells = [
        "Code", "Title", "Location", "Sat-H-Time", "IsRoster", "IsSecurity", "Shift", "Rest", "W-Hrs", "Relax", "Min Time", "HD Time", "Ramazan Shift", "Rest (Ramazan)", "W-Hrs (Ramazan)", "Relax (Ramazan)", "Min Time (Ramazan)", "HD Time (Ramazan)"
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
          width: { size: 100 / 18, type: WidthType.PERCENTAGE },
        })
      );
      tableRows.push(new TableRow({ children: headerCells }));
    }

    // Add data rows
    data.forEach(row => {
      const rowCells = [
        row.VCode,
        row.VName,
        location?.find((l) => l.VID === row.LocationID)?.VName || "",
        row.SaturdayHalfTime ? "Yes" : "No",
        row.IsRoster ? "Yes" : "No",
        row.IsSecurity ? "Yes" : "No",
        `(${row.TimeIn} - ${row.TimeOut})`,
        `(${row.RestTimeFrom} - ${row.RestTimeTo})`,
        row.WorkingHrs,
        row.RelaxTime,
        row.MinAttTime,
        row.MinHDTime,
        `(${row.TimeInRamazan} - ${row.TimeOutRamazan})`,
        `(${row.RestTimeFromRamazan} - ${row.RestTimeToRamazan})`,
        row.WorkingHrsRamazan,
        row.RelaxTimeRamazan,
        row.MinAttTimeRamazan,
        row.MinHDTimeRamazan,
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
          width: { size: 100 / 18, type: WidthType.PERCENTAGE },
        })
      );
      tableRows.push(new TableRow({ children: rowCells }));
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Shifts",
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
      saveAs(blob, "Shifts.docx");
    });
  };

  const columns = [
  { name: "Code", selector: (row) => row.VCode, sortable: true },
  { name: "Title", selector: (row) => row.VName, sortable: true },
  { name: "Location", selector: (row) => location?.find((l) => l.VID === row.LocationID)?.VName || "", sortable: true },
  { name: "Sat-H-Time", selector: (row) => row.SaturdayHalfTime ? "Yes" : "No", sortable: true },
  { name: "IsRoster", selector: (row) => row.IsRoster ? "Yes" : "No", sortable: true },
  { name: "IsSecurity", selector: (row) => row.IsSecurity ? "Yes" : "No", sortable: true },
  { name: "Shift", selector: (row) => `(${row.TimeIn} - ${row.TimeOut})`, sortable: false },
  { name: "Rest", selector: (row) => `(${row.RestTimeFrom} - ${row.RestTimeTo})`, sortable: false },
  { name: "W-Hrs", selector: (row) => row.WorkingHrs, sortable: true },
  { name: "Relax", selector: (row) => row.RelaxTime, sortable: true },
  { name: "Min Time", selector: (row) => row.MinAttTime, sortable: true },
  { name: "HD Time", selector: (row) => row.MinHDTime, sortable: true },
  { name: "Ramazan Shift", selector: (row) => `(${row.TimeInRamazan} - ${row.TimeOutRamazan})`, sortable: false },
  { name: "Rest (Ramazan)", selector: (row) => `(${row.RestTimeFromRamazan} - ${row.RestTimeToRamazan})`, sortable: false },
  { name: "W-Hrs (Ramazan)", selector: (row) => row.WorkingHrsRamazan, sortable: true },
  { name: "Relax (Ramazan)", selector: (row) => row.RelaxTimeRamazan, sortable: true },
  { name: "Min Time (Ramazan)", selector: (row) => row.MinAttTimeRamazan, sortable: true },
  { name: "HD Time (Ramazan)", selector: (row) => row.MinHDTimeRamazan, sortable: true },
  {
    name: "Action",
    cell: (row) => (
      <div className="d-flex gap-2">
        <Button className="btn btn-soft-info btn-sm" onClick={() => handleEditClick(row)}>
          <i className="bx bx-edit"></i>
        </Button>
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
          {/* {error && <p className="text-danger">{error}</p>} */}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader
                    //  title={isEditMode ? "Edit Shift Management" : "Add Shift Management"}
                    title="Shift Management "
                    onCancel={handleCancel}
                    isEditMode={isEditMode}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VCode"  className="form-label">
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
                        <Col xxl={2} md={2}>
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

                        {/* <Col xxl={2} md={2}>
                        <div className="mb-3">
                          <Label
                            htmlFor="LocationGroupInput"
                            className="form-label"
                          >
                            Location
                          </Label>
                          <select className="form-select  form-select-sm mb-3">
                          <option value="-1" >
                                ---Select---
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
                        <Col xxl={2} md={2}>
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
                            {formik.touched.LocationID &&
                            formik.errors.LocationID ? (
                              <div className="text-danger">
                                {formik.errors.LocationID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* <Col xxl={2} md={2}>
                        <div>
                          <Label htmlFor="titleInput" className="form-label">
                            Sat-Half Time
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="titleInput"
                            placeholder="Saturday Half Time"
                          />
                        </div>
                      </Col> */}
                        <Col xxl={2} md={2} className="mt-4">
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                              {...formik.getFieldProps("SaturdayHalfTime")}
                              checked={formik.values.SaturdayHalfTime}
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              Sat-Half Time
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={1} className="mt-4">
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsRoster"
                              {...formik.getFieldProps("IsRoster")}
                              checked={formik.values.IsRoster}
                            />
                            <Label className="form-check-label" for="IsRoster">
                              IsRoster
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={1} className="mt-4">
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsSecurity"
                              {...formik.getFieldProps("IsSecurity")}
                              checked={formik.values.IsSecurity}
                            />
                            <Label
                              className="form-check-label"
                              for="IsSecurity"
                            >
                              IsSecurity
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2} className="mt-4">
                          <div
                            className="form-check form-switch mt-2 "
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
                        {/* first set */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="TimeIn" className="form-label">
                              Time In
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="TimeIn"
                              placeholder="Time In"
                              {...formik.getFieldProps("TimeIn")}
                            />
                            {formik.touched.TimeIn && formik.errors.TimeIn ? (
                              <div className="text-danger">
                                {formik.errors.TimeIn}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="TimeOut" className="form-label">
                              Time Out
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="TimeOut"
                              placeholder="Time Out"
                              {...formik.getFieldProps("TimeOut")}
                            />
                            {formik.touched.TimeOut && formik.errors.TimeOut ? (
                              <div className="text-danger">
                                {formik.errors.TimeOut}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="RestTimeFrom"
                              className="form-label"
                            >
                              Rest From
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="RestTimeFrom"
                              placeholder="Rest From"
                              {...formik.getFieldProps("RestTimeFrom")}
                            />
                            {formik.touched.RestTimeFrom &&
                            formik.errors.RestTimeFrom ? (
                              <div className="text-danger">
                                {formik.errors.RestTimeFrom}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="RestTimeTo" className="form-label">
                              Rest To
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="RestTimeTo"
                              placeholder="Rest To"
                              {...formik.getFieldProps("RestTimeTo")}
                            />
                            {formik.touched.RestTimeTo &&
                            formik.errors.RestTimeTo ? (
                              <div className="text-danger">
                                {formik.errors.RestTimeTo}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="WorkingHrs" className="form-label">
                              Working Hrs
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="WorkingHrs"
                              placeholder="Working Hrs"
                              {...formik.getFieldProps("WorkingHrs")}
                            />
                            {formik.touched.WorkingHrs &&
                            formik.errors.WorkingHrs ? (
                              <div className="text-danger">
                                {formik.errors.WorkingHrs}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="RelaxTime" className="form-label">
                              Relax Time
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="RelaxTime"
                              placeholder="Relax Time"
                              {...formik.getFieldProps("RelaxTime")}
                            />
                            {formik.touched.RelaxTime &&
                            formik.errors.RelaxTime ? (
                              <div className="text-danger">
                                {formik.errors.RelaxTime}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="MinAttTime" className="form-label">
                              MinAtt Time
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="MinAttTime"
                              placeholder="MinAtt Time"
                              {...formik.getFieldProps("MinAttTime")}
                            />
                            {formik.touched.MinAttTime &&
                            formik.errors.MinAttTime ? (
                              <div className="text-danger">
                                {formik.errors.MinAttTime}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="MinHDTime" className="form-label">
                              MinHD Time
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="MinHDTime"
                              placeholder="MinHD Time"
                              {...formik.getFieldProps("MinHDTime")}
                            />
                            {formik.touched.MinHDTime &&
                            formik.errors.MinHDTime ? (
                              <div className="text-danger">
                                {formik.errors.MinHDTime}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 8,
                            marginBottom: 0,
                          }}
                        >
                          <span>Ramazan</span>
                          <div
                            style={{
                              flex: 1,
                              borderBottom: "1px solid",
                              margin: "0 10px",
                              color: "#E9EBEC",
                            }}
                          ></div>
                        </div>
                        {/* ramazan */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="TimeInRamazan"
                              className="form-label"
                            >
                              Time In
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="TimeInRamazan"
                              placeholder="Time In"
                              {...formik.getFieldProps("TimeInRamazan")}
                            />
                            {formik.touched.TimeInRamazan &&
                            formik.errors.TimeInRamazan ? (
                              <div className="text-danger">
                                {formik.errors.TimeInRamazan}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="TimeOutRamazan"
                              className="form-label"
                            >
                              Time Out
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="TimeOutRamazan"
                              placeholder="Time Out"
                              {...formik.getFieldProps("TimeOutRamazan")}
                            />
                            {formik.touched.TimeOutRamazan &&
                            formik.errors.TimeOutRamazan ? (
                              <div className="text-danger">
                                {formik.errors.TimeOutRamazan}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="RestTimeFromRamazan"
                              className="form-label"
                            >
                              Rest From
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="RestTimeFromRamazan"
                              placeholder="Rest From"
                              {...formik.getFieldProps("RestTimeFromRamazan")}
                            />
                            {formik.touched.RestTimeFromRamazan &&
                            formik.errors.RestTimeFromRamazan ? (
                              <div className="text-danger">
                                {formik.errors.RestTimeFromRamazan}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="RestTimeToRamazan"
                              className="form-label"
                            >
                              Rest To
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="RestTimeToRamazan"
                              placeholder="Rest To"
                              {...formik.getFieldProps("RestTimeToRamazan")}
                            />
                            {formik.touched.RestTimeToRamazan &&
                            formik.errors.RestTimeToRamazan ? (
                              <div className="text-danger">
                                {formik.errors.RestTimeToRamazan}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="WorkingHrsRamazan"
                              className="form-label"
                            >
                              Working Hrs
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="WorkingHrsRamazan"
                              placeholder="Working Hrs"
                              {...formik.getFieldProps("WorkingHrsRamazan")}
                            />
                            {formik.touched.WorkingHrsRamazan &&
                            formik.errors.WorkingHrsRamazan ? (
                              <div className="text-danger">
                                {formik.errors.WorkingHrsRamazan}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="RelaxTimeRamazan"
                              className="form-label"
                            >
                              Relax Time
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="RelaxTimeRamazan"
                              placeholder="Relax Time"
                              {...formik.getFieldProps("RelaxTimeRamazan")}
                            />
                            {formik.touched.RelaxTimeRamazan &&
                            formik.errors.RelaxTimeRamazan ? (
                              <div className="text-danger">
                                {formik.errors.RelaxTimeRamazan}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="MinAttTimeRamazan"
                              className="form-label"
                            >
                              MinAtt Time
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="MinAttTimeRamazan"
                              placeholder="MinAtt Time"
                              {...formik.getFieldProps("MinAttTimeRamazan")}
                            />
                            {formik.touched.MinAttTimeRamazan &&
                            formik.errors.MinAttTimeRamazan ? (
                              <div className="text-danger">
                                {formik.errors.MinAttTimeRamazan}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="MinHDTimeRamazan"
                              className="form-label"
                            >
                              MinHD Time
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm "
                              id="MinHDTimeRamazan"
                              placeholder="MinHD Time"
                              {...formik.getFieldProps("MinHDTimeRamazan")}
                            />
                            {formik.touched.MinHDTimeRamazan &&
                            formik.errors.MinHDTimeRamazan ? (
                              <div className="text-danger">
                                {formik.errors.MinHDTimeRamazan}
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
                    filename="shifts.csv"
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
                  title="Shifts"
                  columns={columns}
                  data={filteredData}
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

export default Shift;
