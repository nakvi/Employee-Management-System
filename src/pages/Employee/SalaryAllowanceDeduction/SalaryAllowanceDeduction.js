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
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import DeleteModal from "../../../Components/Common/DeleteModal";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getSalaryBank } from "../../../slices/setup/salaryBank/thunk";
import { deleteSalaryAllowanceDeduction, getSalaryAllowanceDeduction, submitSalaryAllowanceDeduction, updateSalaryAllowanceDeduction } from "../../../slices/employee/salaryAllowanceDeduction/thunk";
import { getAllowanceDeductionDetails } from "../../../slices/employee/allowanceDeductionDetails/thunk";
import { getAllowanceDeductionGroup } from "../../../slices/setup/allowanceDeductionGroup/thunk";
import config from "../../../config";

const SalaryAllowanceDeduction = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [tableAllowanceDetails, setTableAllowanceDetails] = useState({});
  const [dropdownAllowanceDetails, setDropdownAllowanceDetails] = useState([]);

  // Redux state
  const { loading, error, salaryAllowanceDeduction } = useSelector((state) => state.SalaryAllowanceDeduction || {});
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { employee = [] } = useSelector((state) => state.Employee || {});
  const { salaryBank = [] } = useSelector((state) => state.SalaryBank || {});
  const { allowanceDeductionGroup = [] } = useSelector((state) => state.AllowanceDeductionGroup || {});
  const { allowanceDeductionDetails = [], loading: detailsLoading } = useSelector((state) => state.AllowanceDeductionDetails || {});

  // Set initial date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    dispatch(getSalaryBank());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getSalaryAllowanceDeduction());
    dispatch(getAllowanceDeductionGroup());
  }, [dispatch]);

  // Fetch allowance details for table
  useEffect(() => {
    const fetchDetailsForTable = async () => {
      const detailsMap = {};
      for (const group of salaryAllowanceDeduction || []) {
        if (group.AllowDedID && !detailsMap[group.AllowDedID]) {
          try {
            const response = await fetch(
              `${config.api.API_URL}getTypeByAllowDedId/?allowDedID=${group.AllowDedID}`
            );
            const data = await response.json();
            if (data && data.length > 0) {
              const { VType, EffectID } = data[0];
              const detailsResponse = await dispatch(
                getAllowanceDeductionDetails({
                  VType,
                  GroupID: EffectID.toString(),
                })
              ).unwrap();
              const detail = detailsResponse.find((item) => item.VID === group.AllowDedID);
              if (detail) {
                detailsMap[group.AllowDedID] = detail;
              }
            }
          } catch (error) {
            console.error(`Error fetching details for AllowDedID ${group.AllowDedID}:`, error);
          }
        }
      }
      setTableAllowanceDetails(detailsMap);
    };

    if (salaryAllowanceDeduction?.length > 0) {
      fetchDetailsForTable();
    }
  }, [salaryAllowanceDeduction, dispatch]);

  // Filter data based on search text
  useEffect(() => {
    if (salaryAllowanceDeduction && employee && salaryBank && tableAllowanceDetails) {
      const filtered = salaryAllowanceDeduction.filter((item) => {
        const empName = employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "";
        const detailName = tableAllowanceDetails[item.AllowDedID]?.VName || "";
        const bankName = salaryBank.find((bank) => bank.VID === item.AccountID)?.VName || "";
        const searchString = [
          empName,
          detailName,
          item.Amount,
          formatDate(item.VDate),
          bankName,
          item.ChequeNo,
          formatDate(item.ChequeDate),
        ].join(" ").toLowerCase();
        return searchString.includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [salaryAllowanceDeduction, employee, salaryBank, tableAllowanceDetails, searchText]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      VName: "",
      VDate: "",
      EmpID: "",
      ETypeID: "",
      VType: "",
      GroupID: "",
      AllowDedID: "",
      Amount: 0,
      AccountID: "",
      ChequeNo: "",
      ChequeDate: "",
      IsActive: true,
      UID: 501,
      CompanyID: "1001",
      Tranzdatetime: "2024-02-02T12:30:00Z",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number().min(1, "Employee Type is required").required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      VType: Yup.string().required("Type is required"),
      GroupID: Yup.string().required("Effect is required"),
      AllowDedID: Yup.string().required("Details is required"),
      Amount: Yup.number().required("Amount is required"),
      AccountID: Yup.number().min(1, "Bank Type is required").required("Required"),
      VDate: Yup.date().required("Date is required"),
      ChequeNo: Yup.string().required("Cheque No is required"),
      ChequeDate: Yup.date().required("Cheque Date is required"),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0,
      };
      if (editingGroup) {
        dispatch(updateSalaryAllowanceDeduction({ ...transformedValues, VID: editingGroup.VID })).then(() => {
          dispatch(getSalaryAllowanceDeduction());
          setEditingGroup(null);
          resetForm();
          setDropdownAllowanceDetails([]);
        });
      } else {
        dispatch(submitSalaryAllowanceDeduction(transformedValues)).then(() => {
          dispatch(getSalaryAllowanceDeduction());
          resetForm();
          setDropdownAllowanceDetails([]);
        });
      }
    },
  });

  // Fetch allowanceDeductionDetails for dropdown
  useEffect(() => {
    if (formik.values.VType && formik.values.GroupID && !editingGroup) {
      dispatch(
        getAllowanceDeductionDetails({
          VType: formik.values.VType,
          GroupID: formik.values.GroupID,
        })
      ).then((response) => {
        setDropdownAllowanceDetails(response.payload || []);
      });
      formik.setFieldValue("AllowDedID", "");
    }
  }, [formik.values.VType, formik.values.GroupID, dispatch, editingGroup]);

  // Format dates
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  const formatDateForInput = (dateString) => {
    return dateString ? dateString.split("T")[0] : "";
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Fetch VType and GroupID for editing
  const fetchTypeAndEffectDetails = async (allowDedID) => {
    try {
      const response = await fetch(`${config.api.API_URL}getTypeByAllowDedId/?allowDedID=${allowDedID}`);
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          VType: data[0].VType,
          GroupID: data[0].EffectID.toString(),
        };
      }
      return { VType: "", GroupID: "" };
    } catch (error) {
      console.error("Error fetching type and effect details:", error);
      return { VType: "", GroupID: "" };
    }
  };

  // Handle edit button click
  const handleEditClick = async (row) => {
    const selectedEmployee = employee.find((emp) => String(emp.EmpID) === String(row.EmpID));
    const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";
    const { VType, GroupID } = await fetchTypeAndEffectDetails(row.AllowDedID);

    // Fetch allowanceDeductionDetails for dropdown
    if (VType && GroupID) {
      const response = await dispatch(
        getAllowanceDeductionDetails({
          VType,
          GroupID,
        })
      ).unwrap();
      setDropdownAllowanceDetails(response || []);
    }

    setEditingGroup(row);
    formik.setValues({
      VName: row.VName || "",
      VDate: formatDateForInput(row.VDate) || "",
      EmpID: row.EmpID || "",
      ETypeID: employeeTypeId,
      VType: VType || row.VType || "",
      GroupID: GroupID || row.GroupID || "",
      AllowDedID: row.AllowDedID || "",
      Amount: row.Amount || 0,
      AccountID: row.AccountID || "",
      ChequeNo: row.ChequeNo || "",
      ChequeDate: formatDateForInput(row.ChequeDate) || "",
      IsActive: row.IsActive === 1,
      UID: row.UID || 501,
      CompanyID: row.CompanyID || "1001",
      Tranzdatetime: row.Tranzdatetime || new Date().toISOString(),
    });
  };

  // Handle delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteSalaryAllowanceDeduction(deleteId)).then(() => {
        dispatch(getSalaryAllowanceDeduction());
      });
    }
    setDeleteModal(false);
  };

  // DataTable columns
  const columns = [
    {
      name: "Employee",
      selector: (row) => employee.find((emp) => String(emp.EmpID) === String(row.EmpID))?.EName || "N/A",
      sortable: true,
    },
    {
      name: "Details",
      selector: (row) => tableAllowanceDetails[row.AllowDedID]?.VName || "N/A",
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.Amount || "N/A",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => formatDate(row.VDate),
      sortable: true,
    },
    {
      name: "Bank",
      selector: (row) => salaryBank.find((bank) => bank.VID === row.AccountID)?.VName || "N/A",
      sortable: true,
    },
    {
      name: "Cheque No",
      selector: (row) => row.ChequeNo || "N/A",
      sortable: true,
    },
    {
      name: "Cheque Date",
      selector: (row) => formatDate(row.ChequeDate),
      sortable: true,
    },
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
      Employee: employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
      Details: tableAllowanceDetails[item.AllowDedID]?.VName || "N/A",
      Amount: item.Amount || "N/A",
      Date: formatDate(item.VDate),
      Bank: salaryBank.find((bank) => bank.VID === item.AccountID)?.VName || "N/A",
      "Cheque No": item.ChequeNo || "N/A",
      "Cheque Date": formatDate(item.ChequeDate),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SalaryAllowanceDeduction");
    XLSX.writeFile(workbook, "SalaryAllowanceDeduction.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Salary Allowance Deduction Report", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

    const headers = [["Employee", "Details", "Amount", "Date", "Bank", "Cheque No", "Cheque Date"]];
    const data = (filteredData || []).map((item) => [
      employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
      tableAllowanceDetails[item.AllowDedID]?.VName || "N/A",
      item.Amount || "N/A",
      formatDate(item.VDate),
      salaryBank.find((bank) => bank.VID === item.AccountID)?.VName || "N/A",
      item.ChequeNo || "N/A",
      formatDate(item.ChequeDate),
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

    doc.save(`SalaryAllowanceDeduction_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Export to Word
  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];
    const headers = ["Employee", "Details", "Amount", "Date", "Bank", "Cheque No", "Cheque Date"];

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
        employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
        tableAllowanceDetails[item.AllowDedID]?.VName || "N/A",
        item.Amount || "N/A",
        formatDate(item.VDate),
        salaryBank.find((bank) => bank.VID === item.AccountID)?.VName || "N/A",
        item.ChequeNo || "N/A",
        formatDate(item.ChequeDate),
      ].map((value) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: String(value ?? ""), size: 18 })],
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
              text: "Salary Allowance Deduction Report",
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
      saveAs(blob, "SalaryAllowanceDeduction.docx");
    });
  };

  document.title = "Salary Allowance Deduction | EMS";

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
                    title="Salary Allowance Deduction"
                    onCancel={() => {
                      formik.resetForm();
                      setDropdownAllowanceDetails([]);
                    }}
                    isEditMode={!!editingGroup}
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
                              <div className="text-danger">{formik.errors.ETypeID}</div>
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
                              disabled={!formik.values.ETypeID}
                            >
                              <option value="">---Select---</option>
                              {employee
                                .filter((emp) => emp.ETypeID === parseInt(formik.values.ETypeID))
                                .map((item) => (
                                  <option key={item.EmpID} value={item.EmpID}>
                                    {item.EName}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.EmpID && formik.errors.EmpID ? (
                              <div className="text-danger">{formik.errors.EmpID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="VType" className="form-label">
                              Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="VType"
                              id="VType"
                              value={formik.values.VType}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              <option value="Allowance">Allowance</option>
                              <option value="Deduction">Deduction</option>
                            </select>
                            {formik.touched.VType && formik.errors.VType ? (
                              <div className="text-danger">{formik.errors.VType}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="GroupID" className="form-label">
                              Effect
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="GroupID"
                              id="GroupID"
                              value={formik.values.GroupID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              disabled={!formik.values.VType}
                            >
                              <option value="">---Select---</option>
                              {allowanceDeductionGroup.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.GroupID && formik.errors.GroupID ? (
                              <div className="text-danger">{formik.errors.GroupID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="AllowDedID" className="form-label">
                              Details
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="AllowDedID"
                              id="AllowDedID"
                              value={formik.values.AllowDedID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              disabled={!formik.values.GroupID || detailsLoading}
                            >
                              <option value="">---Select---</option>
                              {dropdownAllowanceDetails.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.AllowDedID && formik.errors.AllowDedID ? (
                              <div className="text-danger">{formik.errors.AllowDedID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="Amount" className="form-label">
                              Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="Amount"
                              name="Amount"
                              placeholder="00"
                              {...formik.getFieldProps("Amount")}
                            />
                            {formik.touched.Amount && formik.errors.Amount ? (
                              <div className="text-danger">{formik.errors.Amount}</div>
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
                              name="VDate"
                              min={getMinDate()}
                              {...formik.getFieldProps("VDate")}
                            />
                            {formik.touched.VDate && formik.errors.VDate ? (
                              <div className="text-danger">{formik.errors.VDate}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="AccountID" className="form-label">
                              Bank
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="AccountID"
                              id="AccountID"
                              {...formik.getFieldProps("AccountID")}
                            >
                              <option value="">---Select---</option>
                              {salaryBank.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.AccountID && formik.errors.AccountID ? (
                              <div className="text-danger">{formik.errors.AccountID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="ChequeNo" className="form-label">
                              Cheque No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="ChequeNo"
                              name="ChequeNo"
                              placeholder="Cheque No"
                              {...formik.getFieldProps("ChequeNo")}
                            />
                            {formik.touched.ChequeNo && formik.errors.ChequeNo ? (
                              <div className="text-danger">{formik.errors.ChequeNo}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="ChequeDate" className="form-label">
                              Cheque
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="ChequeDate"
                              name="ChequeDate"
                              {...formik.getFieldProps("ChequeDate")}
                            />
                            {formik.touched.ChequeDate && formik.errors.ChequeDate ? (
                              <div className="text-danger">{formik.errors.ChequeDate}</div>
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
                        Employee: employee.find((emp) => String(emp.EmpID) === String(item.EmpID))?.EName || "N/A",
                        Details: tableAllowanceDetails[item.AllowDedID]?.VName || "N/A",
                        Amount: item.Amount || "N/A",
                        Date: formatDate(item.VDate),
                        Bank: salaryBank.find((bank) => bank.VID === item.AccountID)?.VName || "N/A",
                        "Cheque No": item.ChequeNo || "N/A",
                        "Cheque Date": formatDate(item.ChequeDate),
                      }))}
                      filename="SalaryAllowanceDeduction.csv"
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
                    title="Salary Allowance Deduction List"
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

export default SalaryAllowanceDeduction;