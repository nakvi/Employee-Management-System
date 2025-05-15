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
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv"; // For CSV export
import * as XLSX from "xlsx"; // For Excel export
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import {
  getDepartmentGroup,
  submitDepartmentGroup,
  deleteDepartmentGroup,
  updateDepartmentGroup,
} from "../../../slices/setup/departmentGroup/thunk";

const DepartmentGroup = () => {
  // Delete Task
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null); // Track the group being edited
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const dispatch = useDispatch();
  // Access Redux state
  const { loading, error, departmentGroup } = useSelector(
    (state) => state.DepartmentGroup
  );
  // Validations
  const formik = useFormik({
    initialValues: {
      VCode: "",
      VName: "",
      VNameUrdu: "",
      SortOrder: 0,
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
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      // Add your form submission logic here
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
      };
      // dispatch(submitDepartmentGroup(transformedValues));
      if (editingGroup) {
        dispatch(
          updateDepartmentGroup({ ...transformedValues, VID: editingGroup.VID })
        );
      } else {
        dispatch(submitDepartmentGroup(transformedValues));
      }
      formik.resetForm();
    },
  });
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getDepartmentGroup());
  }, [dispatch]);


  useEffect(() => {
    if (departmentGroup?.data) {
      // Filter data based on search text
      const filtered = departmentGroup.data.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, departmentGroup]);



  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteDepartmentGroup(deleteId));
    }
    setDeleteModal(false);
  };
  // edit data
  const handleEditClick = (group) => {
    setEditingGroup(group);
    formik.setValues({
      VCode: group.VCode,
      VName: group.VName,
      VNameUrdu: group.VNameUrdu,
      SortOrder: group.SortOrder,
      CompanyID: group.CompanyID,
      UID: group.UID,
      IsActive: group.IsActive === 1,
    });
  };
  document.title = "Department Group | EMS";



  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(departmentGroup?.data || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DepartmentGroups");
    XLSX.writeFile(workbook, "DepartmentGroups.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Department Groups Report", 105, 15, { align: "center" });

      // Add date
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

      // Prepare data for the table
      const headers = [
        ["Code", "Title", "Title Urdu", "Sort Order", "Status"]
      ];

      const data = departmentGroup?.data?.map(group => [
        group.VCode,
        group.VName,
        group.VNameUrdu,
        group.SortOrder,
        group.IsActive === 1 ? "Active" : "Inactive"
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
          0: { cellWidth: 25, halign: "center" },
          1: { cellWidth: 45 },
          2: { cellWidth: 45 },
          3: { cellWidth: 25, halign: "center" },
          4: { cellWidth: 25, halign: "center" }
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
      doc.save(`Department_Groups_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Export to Word
  const exportToWord = () => {
    const data = departmentGroup?.data || [];

    const tableRows = [];

    // Add header row
    if (data.length > 0) {
      const headerCells = Object.keys(data[0]).map(key =>
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
            size: 100 / Object.keys(data[0]).length,
            type: WidthType.PERCENTAGE,
          },
        })
      );
      tableRows.push(new TableRow({ children: headerCells }));
    }

    // Add data rows
    data.forEach(item => {
      const rowCells = Object.values(item).map(value =>
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
            size: 100 / Object.keys(item).length,
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
              text: "Department Groups",
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
      saveAs(blob, "DepartmentGroups.docx");
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
                  <PreviewCardHeader
                  title={isEditMode ? "Edit Department Group" : "Add Department Group"}
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
                              type="number"
                              className="form-control-sm "
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
                            <Label
                              className="form-check-label"
                              htmlFor="IsActive"
                            >
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
                      data={departmentGroup?.data || []}
                      filename="DepartmentGroups.csv"
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
                    title="Department Groups"
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

export default DepartmentGroup;
// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Card,
//   CardBody,
//   Col,
//   Container,
//   Row,
// } from "reactstrap";
// import { useDispatch, useSelector } from "react-redux";
// import DataTable from "react-data-table-component";
// import { getDepartmentGroup, deleteDepartmentGroup, updateDepartmentGroup } from "../../../slices/setup/departmentGroup/thunk";
// import DeleteModal from "../../../Components/Common/DeleteModal";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const DepartmentGroup = () => {
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [editingGroup, setEditingGroup] = useState(null); // Track the group being edited
//   const [searchText, setSearchText] = useState(""); // State for search input
//   const [filteredData, setFilteredData] = useState([]); // State for filtered data

//   const dispatch = useDispatch();
//   const { loading, error, departmentGroup } = useSelector(
//     (state) => state.DepartmentGroup
//   );

//   useEffect(() => {
//     dispatch(getDepartmentGroup());
//   }, [dispatch]);

//   useEffect(() => {
//     if (departmentGroup?.data) {
//       // Filter data based on search text
//       const filtered = departmentGroup.data.filter((item) =>
//         Object.values(item)
//           .join(" ")
//           .toLowerCase()
//           .includes(searchText.toLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   }, [searchText, departmentGroup]);

//   const handleDeleteClick = (id) => {
//     setDeleteId(id);
//     setDeleteModal(true);
//   };

//   const handleDeleteConfirm = () => {
//     if (deleteId) {
//       dispatch(deleteDepartmentGroup(deleteId));
//     }
//     setDeleteModal(false);
//   };

//   const handleEditClick = (group) => {
//     setEditingGroup(group);
//     formik.setValues({
//       VCode: group.VCode,
//       VName: group.VName,
//       VNameUrdu: group.VNameUrdu,
//       SortOrder: group.SortOrder,
//       CompanyID: group.CompanyID,
//       UID: group.UID,
//       IsActive: group.IsActive === 1,
//     });
//   };

//   const formik = useFormik({
//     initialValues: {
//       VCode: "",
//       VName: "",
//       VNameUrdu: "",
//       SortOrder: 0,
//       CompanyID: "1",
//       UID: "1",
//       IsActive: false,
//     },
//     validationSchema: Yup.object({
//       VCode: Yup.string()
//         .required("Code is required.")
//         .min(3, "Code must be at least 3 characters ")
//         .max(10, "Code must be less than 10 characters"),
//       VName: Yup.string()
//         .required("Title is required.")
//         .min(3, "Title must be at least 3 characters "),
//       VNameUrdu: Yup.string()
//         .required("Title Urdu is required.")
//         .min(3, "Title must be at least 3 characters "),
//       SortOrder: Yup.number()
//         .typeError("Sort Order must be a number.")
//         .required("Sort Order is required."),
//       IsActive: Yup.boolean(),
//     }),
//     onSubmit: (values) => {
//       const transformedValues = {
//         ...values,
//         IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
//       };
//       if (editingGroup) {
//         dispatch(
//           updateDepartmentGroup({ ...transformedValues, VID: editingGroup.VID })
//         );
//       } else {
//         dispatch(submitDepartmentGroup(transformedValues));
//       }
//       formik.resetForm();
//       setEditingGroup(null); // Reset editing state
//     },
//   });

//   const columns = [
//     {
//       name: "Code",
//       selector: (row) => row.VCode,
//       sortable: true,
//     },
//     {
//       name: "Title",
//       selector: (row) => row.VName,
//       sortable: true,
//     },
//     {
//       name: "Title Urdu",
//       selector: (row) => row.VNameUrdu,
//       sortable: true,
//     },
//     {
//       name: "Action",
//       cell: (row) => (
//         <div className="d-flex gap-2">
//           <Button
//             className="btn btn-soft-info btn-sm"
//             onClick={() => handleEditClick(row)}
//           >
//             <i className="bx bx-edit"></i>
//           </Button>
//           <Button
//             className="btn btn-soft-danger btn-sm"
//             onClick={() => handleDeleteClick(row.VID)}
//           >
//             <i className="ri-delete-bin-2-line"></i>
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           {loading && <p>Loading...</p>}
//           {error && <p className="text-danger">{error}</p>}
//           <Row>
//             <Col lg={12}>
//               <Card>
//                 <CardBody>
//                   <form onSubmit={formik.handleSubmit}>
//                     {/* <Row className="mt-3">
//                       <Col>
//                         <Button type="submit" color="primary">
//                           {editingGroup ? "Update" : "Submit"}
//                         </Button>
//                         <Button
//                           type="button"
//                           color="secondary"
//                           className="ms-2"
//                           onClick={() => formik.resetForm()}
//                         >
//                           Reset
//                         </Button>
//                       </Col>
//                     </Row> */}
//                     <Row className="align-items-center mb-4">
//                       <Col md={6}>
//                         <h4 className="fw-semibold mb-0 text-primary">
//                           {editingGroup ? "Edit Department Group" : "Add Department Group"}
//                         </h4>
//                       </Col>
//                       <Col md={6} className="text-end">
//                         <Button type="submit" color="primary" className="me-2">
//                           {editingGroup ? "Update" : "Submit"}
//                         </Button>
//                         <Button
//                           type="button"
//                           color="secondary"
//                           onClick={() => formik.resetForm()}
//                         >
//                           Reset
//                         </Button>
//                       </Col>
//                     </Row>

//                     <Row className="gy-4">
//                       <Col md={3}>
//                         <label htmlFor="VCode" className="form-label">
//                           Code
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           id="VCode"
//                           {...formik.getFieldProps("VCode")}
//                         />
//                         {formik.touched.VCode && formik.errors.VCode && (
//                           <div className="text-danger">{formik.errors.VCode}</div>
//                         )}
//                       </Col>
//                       <Col md={3}>
//                         <label htmlFor="VName" className="form-label">
//                           Title
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           id="VName"
//                           {...formik.getFieldProps("VName")}
//                         />
//                         {formik.touched.VName && formik.errors.VName && (
//                           <div className="text-danger">{formik.errors.VName}</div>
//                         )}
//                       </Col>
//                       <Col md={3}>
//                         <label htmlFor="VNameUrdu" className="form-label">
//                           Title Urdu
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           id="VNameUrdu"
//                           {...formik.getFieldProps("VNameUrdu")}
//                         />
//                         {formik.touched.VNameUrdu &&
//                           formik.errors.VNameUrdu && (
//                             <div className="text-danger">
//                               {formik.errors.VNameUrdu}
//                             </div>
//                           )}
//                       </Col>
//                       <Col md={3}>
//                         <label htmlFor="SortOrder" className="form-label">
//                           Sort Order
//                         </label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           id="SortOrder"
//                           {...formik.getFieldProps("SortOrder")}
//                         />
//                         {formik.touched.SortOrder &&
//                           formik.errors.SortOrder && (
//                             <div className="text-danger">
//                               {formik.errors.SortOrder}
//                             </div>
//                           )}
//                       </Col>
//                     </Row>
//                   </form>
//                 </CardBody>
//               </Card>
//             </Col>
//             <Col lg={12}>
//               <Card>
//                 <CardBody>
//                   <DataTable
//                     title="Department Groups"
//                     columns={columns}
//                     data={filteredData} // Use filtered data
//                     pagination
//                     highlightOnHover
//                     selectableRows
//                     responsive
//                     subHeader
//                     subHeaderComponent={
//                       <div className="d-flex justify-content-end">
//                         <input
//                           type="text"
//                           placeholder="Search"
//                           className="form-control-sm"
//                           value={searchText}
//                           onChange={(e) => setSearchText(e.target.value)} // Update search text
//                         />
//                       </div>
//                     }
//                   />
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//       <DeleteModal
//         show={deleteModal}
//         onCloseClick={() => setDeleteModal(!deleteModal)}
//         onDeleteClick={handleDeleteConfirm}
//       />
//     </React.Fragment>
//   );
// };

// export default DepartmentGroup;