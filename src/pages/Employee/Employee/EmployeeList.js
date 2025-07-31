import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Row,
  Input,
  Label,
  Form,
  Accordion,
  AccordionItem,
  Collapse,
} from "reactstrap";
import Invoice from "../../../Components/pdfsPreviews/invoice"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver"; import DeleteModal from "../../../Components/Common/DeleteModal";
import config from "../../../config"; // ✅ correct
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";

import avatar1 from "../../../assets/images/users/avatar-11.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getEmployee,
  submitEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../../slices/employee/employee/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getReligion } from "../../../slices/employee/religion/thunk";
import { getGrade } from "../../../slices/setup/grade/thunk";
import { getGender } from "../../../slices/employee/gender/thunk";
import classnames from "classnames";
import { getShift } from "../../../slices/setup/shift/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Access location to get filter state
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [col, setCol] = useState(false);
  const [accordionDisabled, setAccordionDisabled] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(false);


  const t_col = () => {
    setCol(!col);
  };
  // Access Redux state
  const { loading, error, employee } = useSelector((state) => state.Employee);
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { location: locations } = useSelector((state) => state.Location);
  const { shift } = useSelector((state) => state.Shift);
  const { department } = useSelector((state) => state.Department);
  const { designation } = useSelector((state) => state.Designation);
  const { religion } = useSelector((state) => state.Religion);
  const { grade } = useSelector((state) => state.Grade);
  const { gender } = useSelector((state) => state.Gender);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  console.log("EmployeeList component rendered", employee);
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getEmployee());
    dispatch(getLocation());
    dispatch(getDesignation());
    dispatch(getDepartment());
    dispatch(getReligion());
    dispatch(getGrade());
    dispatch(getGender());
    dispatch(getShift());
    dispatch(getEmployeeType());
  }, [dispatch]);
  // Restore filter state from location.state
  useEffect(() => {
    if (location.state?.filterValues) {
      console.log("Restoring filter values from state:", location.state.filterValues);
      formik.setValues(location.state.filterValues);
      setSearchText(location.state.filterValues.SearchFilter || "");
      handleFilterSubmit(location.state.filterValues);
      if (!location.state.filterValues.SearchFilter) {
        setCol(false);
        setAccordionDisabled(false);
        handleAccordionToggle(true);
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (employee) {

      const filtered = employee.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, employee]); // 🔁 FIXED dependency
  // Edit Click
  const handleEditClick = (row) => {
    navigate("/employee", { state: { employee: row, filterValues: formik.values } });
    // navigate("/employee", { state: { employee: row } });
    // window.open(`/employee?EmpID=${row.EmpID}`, '_blank', 'noopener,noreferrer');

  };

  const handleFilterSubmit = async (values) => {
    // let apiUrl = "http://192.168.18.65:8001/ems/employeeSearch/?";
    const apiUrl = `${config.api.API_URL}employeeSearch/?`;
    let params = {};

    if (values.SearchFilter && values.SearchFilter.trim() !== "") {
      // Only use string param, ignore others
      params.string = values.SearchFilter.trim();
    } else {
      // Use all other filters
      params = {
        string: "",
        etypeID: values.ETypeID || 0,
        ename: values.EmpID || 0,
        fname: values.FName || "",
        deptID: values.DeptID || 0,
        desgID: values.DesgID || 0,
        hodID: values.HODID || 0,
        nic: values.NIC || "",
        locationID: values.LocationID || 0,
        shiftID: values.ShiftID || 0,
        regionID: values.ReligionID || 0,
        gradeID: values.GradeID || 0,
        leftStatus: values.leftStatusId || "",
        bloodGroup: values.BloodGroup || "",
        salaryFrom: values.SalaryFrom || 0,
        salaryTo: values.SalaryTo || 0,
        joinDateFrom: values.JoinDateFrom || "1900-01-01",
        joinDateTo: values.JoinDateTo || "1900-01-01",
        resignDateFrom: values.ResignDateFrom || "1900-01-01",
        resignDateTo: values.ResignDateTo || "1900-01-01",
      };
    }
    // Build query string
    const queryString = Object.entries(params)
      .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      .join("&");

    const fullUrl = apiUrl + queryString;
    console.log("API URL:", fullUrl);

    // Fetch data
    try {
      const response = await fetch(fullUrl);
      const data = await response.json();
      setFilteredData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching employee data:", err);
    }
  };
  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteEmployee(deleteId));
    }
    setDeleteModal(false);
  };

  const columns = [
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
            onClick={() => handleDeleteClick(row.EmpID)}
          >
            <i className="ri-delete-bin-2-line"></i>
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Emp Code",
      selector: (row) => row.EmpCode,
      sortable: true,
    },
    {
      name: 'Employee Name',
      selector: row => row.EName,
      sortable: true,
      cell: row => (
        <span
          // style={{ cursor: "pointer", color: "#007bff" }}
          // onClick={() => navigate(`/employee/${row.EmpID}`)}
        >
          {row.EName}
        </span>
      )
      // name: "Emp Name",
      // selector: (row) => row.EName,
      // sortable: true,
    },
    {
      name: "Father Name",
      selector: (row) => row.FName,
      sortable: true,
    },
    {
      name: "Designation",
      // selector: (row) => row.DesignationTitle,
     selector: (row) =>
      designation?.find((g) => g.VID === row.DesgID)?.VName || "",
      sortable: true,
    },
    {
      name: "Birth Date",
      selector: (row) => row.DOB,
      sortable: true,
    },
    {
      name: "Joining Date",
      selector: (row) => row.DOJ,
      sortable: true,
    },
    {
      name: "Probation Date",
      selector: (row) => row.ProbitionDate,
      sortable: true,
    },
    {
      name: "CNIC No",
      selector: (row) => row.NIC,
      sortable: true,
    },
    {
      name: "Mobile No",
      selector: (row) => row.CellPhone,
      sortable: true,
    },
    // {
    //   name: "Email",
    //   selector: (row) => row.Email,
    //   sortable: true,
    // },
    {
      name: "Head Name",
      selector: (row) => row.HODName,
      sortable: true,
    },
    // {
    //   name: "Company Name",
    //   selector: (row) => row.CompanyName,
    //   sortable: true,
    // },
    // {
    //   name: "Is Active",
    //   selector: (row) => row.IsActive,
    //   sortable: true,
    // },
    {
      name: "Machine  No",
      selector: (row) => row.MachineCode,
      sortable: true,
    },
    {
      name: "Basic Salary",
      selector: (row) => row.BasicSalary,
      sortable: true,
    },

    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <div className="d-flex gap-2">
    //       <Button
    //         className="btn btn-soft-info btn-sm"
    //         onClick={() => handleEditClick(row)}
    //       >
    //         <i className="bx bx-edit"></i>
    //       </Button>
    //       <Button
    //         className="btn btn-soft-danger btn-sm"
    //         onClick={() => handleDeleteClick(row.EmpID)}
    //       >
    //         <i className="ri-delete-bin-2-line"></i>
    //       </Button>
    //     </div>
    //   ),
    //   ignoreRowClick: true,
    //   // allowOverflow: true,
    //   button: true,
    // },

  ];


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
  // Formik form setup
  const formik = useFormik({
    initialValues: {
      SearchFilter: '',
      ETypeID: '',
      EmpID: '',
      FName: '',
      DeptID: '',
      DesgID: '',
      HODID: '',
      NIC: '',
      LocationID: '',
      ShiftID: '',
      ReligionID: '',
      GradeID: '',
      PseudoName: '',
      BloodGroup: '',
      SalaryFrom: '',
      SalaryTo: '',
      JoinDateCheck: false,
      JoinDateFrom: "",
      JoinDateTo: "",
      ResignEmployeeCheck: false,
      ResignDateFrom: '',
      ResignDateTo: '',
      ReportType: 'VIN',
      leftStatusId: ''
    },

    validationSchema: Yup.object({
      SearchFilter: Yup.string(),
      NIC: Yup.string()
        .matches(/^\d{5}-\d{7}-\d{1}$/, 'CNIC must be in format XXXXX-XXXXXXX-X'),
      SalaryFrom: Yup.number().typeError('Must be a number'),
      SalaryTo: Yup.number().typeError('Must be a number'),
    }),
    onSubmit: handleFilterSubmit,
    // onSubmit: (values) => {
    //   let payload = {};

    //   if (values.SearchFilter && values.SearchFilter.trim() !== '') {
    //     payload = { Search: values.SearchFilter.trim() };
    //   } else {
    //     // Create filtered payload without empty values
    //     Object.entries(values).forEach(([key, value]) => {
    //       if (key !== 'SearchFilter' && value !== '' && value !== null && value !== undefined) {
    //         payload[key] = value;
    //       }
    //     });
    //   }

    //   console.log("Form submitted with:", payload);
    //   // Apply your filters or dispatch actions here
    // },
  });

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue("SearchFilter", value);
    setAccordionDisabled(!!value.trim());
  };

  // Toggle accordion
  const handleAccordionToggle = () => {
    if (!accordionDisabled) {
      setCol(!col);
      setSearchDisabled(!searchDisabled);
      if (!col) {
        formik.setFieldValue("SearchFilter", "");
      }
    }
  };

  // set date format
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee List");
    XLSX.writeFile(workbook, "Employee-List.xlsx");
  };

const exportToPDF = () => {
  // Use landscape orientation for more width
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Employee List", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() / 2, 22, { align: "center" });

  const headers = [[
    "Emp Code",
    "Employee Name",
    "Father Name",
    "Designation",
    "Birth Date",
    "Joining Date",
    "Probation Date",
    "CNIC No",
    "Mobile No",
    "Head Name",
    // "Company Name",
    "Is Active",
    "Machine Card No",
    "Basic Salary"
  ]];

  const data = (employee || []).map(emp => [
    emp.EmpCode,
    emp.EName,
    emp.FName,
    emp.DesignationTitle,    
    emp.DOB,
    emp.DOJ,
    emp.ProbitionDate,
    emp.NIC,
    emp.CellPhone,
    emp.HODName,
    // emp.CompanyName,
    emp.IsActive,
    emp.MachineCardNo,
    emp.BasicSalary
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 30,
    tableWidth: "auto", // Use full width in landscape
    margin: { left: 14, right: 14, top: 30 },
    styles: { cellPadding: 2, fontSize: 8, valign: "middle", halign: "left", overflow: 'linebreak' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 9, fontStyle: "bold", halign: "center" },
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

  doc.save(`Employee_List_${new Date().toISOString().slice(0, 10)}.pdf`);
};


  // Export to Word
  const exportToWord = () => {
    const data = filteredData || [];
    const tableRows = [];

    // Define the columns you want to export
    const headers = [
      "Emp Code",
      "Employee Name",
      "Father Name",
      "Designation",
      "Birth Date",
      "Joining Date",
      "Probation Date",
      "CNIC No",
      "Mobile No",
      "Head Name",
      // "Company Name",
      "Is Active",
      "Machine Card No",
      "Basic Salary"
    ];

    // Add header row
    const headerCells = headers.map(key =>
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
        width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
      })
    );
    tableRows.push(new TableRow({ children: headerCells }));

    // Add data rows
    data.forEach(item => {
      const rowCells = [
        item.EmpCode,
        item.EName,
        item.FName,
        item.DesignationTitle,
        item.DOB,
        item.DOJ,
        item.ProbitionDate,
        item.NIC,
        item.CellPhone,
        item.HODName,
        // item.CompanyName,
        item.IsActive,
        item.MachineCardNo,
        item.BasicSalary
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
              text: "Employee List",
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
      saveAs(blob, "Employee-List.docx");
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  document.title = "Employee | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Form onSubmit={formik.handleSubmit}>
              <Col lg={12} className="bg-white p-1">
                {/* <PreviewCardHeader3 title="Employee Report" /> */}
                <CardHeader
                  className="align-items-center d-flex py-2"
                  style={{
                    color: "#495057",
                    marginLeft: "16px",
                    // border: "none",
                  }}
                >
                  <h4 className="card-title mb-0 flex-grow-1">
                    Employee
                  </h4>
                  <div className="flex-shrink-0">

                    {/* <Button
                      type="submit"
                      color="success"
                      className="add-btn me-1 py-1"
                      id="create-btn"
                    >
                      <i className="align-bottom me-1"></i>Fetch
                    </Button> */}
                    {/* <Button color="dark" className="add-btn me-1 py-1" onClick={() => {
                      formik.resetForm();
                      setFilteredData(employee);
                      setCol(false);
                      setAccordionDisabled(false);
                      setSearchDisabled(false);
                    }}>

                      <i className="align-bottom me-1"></i> Cancel
                    </Button> */}
                    <Button
                      color="primary"
                      className="add-btn me-1 py-1"
                      onClick={() => navigate("/employee")}
                    >
                      <i className="align-bottom me-1"></i> New
                    </Button>
                  </div>
                </CardHeader>

                {/* <div className="search-box">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Search for name..."
                    name="SearchFilter"
                    value={formik.values.SearchFilter}
                    onChange={handleSearchChange}
                    onBlur={formik.handleBlur}
                    disabled={searchDisabled}
                  />
                  <i className="ri-search-line search-icon"></i>
                </div> */}
              </Col>
         
              {/* Optional grid */}
              {/* <Col lg={12} className="bg-white p-1">
                <Row className="mt-2 p-2">
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                        checked
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Department wise list
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="BOTH"
                        name="VType"
                        value="BOTH"
                      />
                      <Label className="form-check-label" htmlFor="BOTH">
                        Export to Excel
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VOUT"
                        name="VType"
                        value="VOUT"
                      />
                      <Label className="form-check-label" htmlFor="VOUT">
                        Employee Strength
                      </Label>
                    </div>
                  </Col>

                  <Col xxl={2} md={2}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Employee Card
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Employee Transfer
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Employee on Date
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Access Control
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={2}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Expected OverTime
                      </Label>
                    </div>
                  </Col>
                </Row>
              </Col> */}
            </Form>
          </Row>
        </Container>

        <Container fluid>
          <Row>
            <Col xxl={12} md={12}>
              <Card className="shadow-sm">
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
                        style={{ width: "200px" }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                  <DataTable
                    title="Employee List"
                    columns={columns}
                    data={Array.isArray(filteredData) ? filteredData : []} // <-- Always an array
                    pagination
                    paginationPerPage={100}
                    paginationRowsPerPageOptions={[100, 200, 500]}
                    highlightOnHover
                    responsive
                    customStyles={customStyles}
                  />
                    {/* {filteredData && filteredData.length > 0 && (
                      <div className="mt-4">
                        <h5>Invoice Preview</h5>
                        <Invoice employee={filteredData[0]} />
                      </div>
                    )} */}
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

export default EmployeeList;
