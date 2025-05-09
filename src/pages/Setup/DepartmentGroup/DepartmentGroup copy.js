// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Button,
// // //   Card,
// // //   CardBody,
// // //   Col,
// // //   Container,
// // //   Row,
// // //   Input,
// // //   Label,
// // //   Form,
// // // } from "reactstrap";
// // // import { Link } from "react-router-dom";
// // // import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { useFormik } from "formik";
// // // import * as Yup from "yup";
// // // import DeleteModal from "../../../Components/Common/DeleteModal";
// // // import {
// // //   getDepartmentGroup,
// // //   submitDepartmentGroup,
// // //   deleteDepartmentGroup,
// // //   updateDepartmentGroup,
// // // } from "../../../slices/setup/departmentGroup/thunk";

// // // const DepartmentGroup = () => {
// // //   // Delete Task
// // //   const [deleteModal, setDeleteModal] = useState(false);
// // //   const [deleteId, setDeleteId] = useState(null);
// // //   const [editingGroup, setEditingGroup] = useState(null); // Track the group being edited

// // //   const dispatch = useDispatch();
// // //   // Access Redux state
// // //   const { loading, error, departmentGroup } = useSelector(
// // //     (state) => state.DepartmentGroup
// // //   );
// // //   // Validations
// // //   const formik = useFormik({
// // //     initialValues: {
// // //       VCode: "",
// // //       VName: "",
// // //       VNameUrdu: "",
// // //       SortOrder: 0,
// // //       CompanyID: "1",
// // //       UID: "1",
// // //       IsActive: false,
// // //     },
// // //     validationSchema: Yup.object({
// // //       VCode: Yup.string()
// // //         .required("Code is required.")
// // //         .min(3, "Code must be at least 3 characters ")
// // //         .max(10, "Code must be less then 10 characters"),
// // //       VName: Yup.string()
// // //         .required("Title is required.")
// // //         .min(3, "Title at least must be 3 characters "),
// // //       VNameUrdu: Yup.string()
// // //         .required("Title Urdu is required.")
// // //         .min(3, "Title at least must be 3 characters "),
// // //       SortOrder: Yup.number()
// // //         .typeError("Sort Order must be a number.")
// // //         .required("Sort Order is required."),
// // //       IsActive: Yup.boolean(),
// // //     }),
// // //     onSubmit: (values) => {
// // //       // Add your form submission logic here
// // //       const transformedValues = {
// // //         ...values,
// // //         IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
// // //       };
// // //       // dispatch(submitDepartmentGroup(transformedValues));
// // //       if (editingGroup) {
// // //         dispatch(
// // //           updateDepartmentGroup({ ...transformedValues, VID: editingGroup.VID })
// // //         );
// // //       } else {
// // //         dispatch(submitDepartmentGroup(transformedValues));
// // //       }
// // //       formik.resetForm();
// // //     },
// // //   });
// // //   // Fetch data on component mount
// // //   useEffect(() => {
// // //     dispatch(getDepartmentGroup());
// // //   }, [dispatch]);

// // //   // Delete Data
// // //   const handleDeleteClick = (id) => {
// // //     setDeleteId(id);
// // //     setDeleteModal(true);
// // //   };

// // //   const handleDeleteConfirm = () => {
// // //     if (deleteId) {
// // //       dispatch(deleteDepartmentGroup(deleteId));
// // //     }
// // //     setDeleteModal(false);
// // //   };
// // //   // edit data
// // //   const handleEditClick = (group) => {
// // //     setEditingGroup(group);
// // //     formik.setValues({
// // //       VCode: group.VCode,
// // //       VName: group.VName,
// // //       VNameUrdu: group.VNameUrdu,
// // //       SortOrder: group.SortOrder,
// // //       CompanyID: group.CompanyID,
// // //       UID: group.UID,
// // //       IsActive: group.IsActive === 1,
// // //     });
// // //   };
// // //   document.title = "Department Group | EMS";
// // //   return (
// // //     <React.Fragment>
// // //       <div className="page-content">
// // //         <Container fluid>
// // //           {loading && <p>Loading...</p>}
// // //           {error && <p className="text-danger">{error}</p>}
// // //           <Row>
// // //             <Col lg={12}>
// // //               <Card>
// // //                 <Form onSubmit={formik.handleSubmit}>
// // //                   <PreviewCardHeader
// // //                     title="Department Group"
// // //                     onCancel={formik.resetForm}
// // //                   />
// // //                   <CardBody className="card-body">
// // //                     <div className="live-preview">
// // //                       <Row className="gy-4">
// // //                         <Col xxl={2} md={3}>
// // //                           <div>
// // //                             <Label htmlFor="VCode" className="form-label">
// // //                               Code
// // //                             </Label>
// // //                             <Input
// // //                               type="text"
// // //                               className="form-control-sm"
// // //                               id="VCode"
// // //                               placeholder="Code"
// // //                               {...formik.getFieldProps("VCode")}
// // //                             />
// // //                             {formik.touched.VCode && formik.errors.VCode ? (
// // //                               <div className="text-danger">
// // //                                 {formik.errors.VCode}
// // //                               </div>
// // //                             ) : null}
// // //                           </div>
// // //                         </Col>
// // //                         <Col xxl={2} md={3}>
// // //                           <div>
// // //                             <Label htmlFor="VName" className="form-label">
// // //                               Title
// // //                             </Label>
// // //                             <Input
// // //                               type="text"
// // //                               className="form-control-sm"
// // //                               id="VName"
// // //                               placeholder="Title"
// // //                               {...formik.getFieldProps("VName")}
// // //                             />
// // //                             {formik.touched.VName && formik.errors.VName ? (
// // //                               <div className="text-danger">
// // //                                 {formik.errors.VName}
// // //                               </div>
// // //                             ) : null}
// // //                           </div>
// // //                         </Col>
// // //                         <Col xxl={2} md={3}>
// // //                           <div>
// // //                             <Label htmlFor="VNameUrdu" className="form-label">
// // //                               Title-Urdu
// // //                             </Label>
// // //                             <Input
// // //                               type="text"
// // //                               className="form-control-sm"
// // //                               id="VNameUrdu"
// // //                               placeholder="Title Urdu"
// // //                               {...formik.getFieldProps("VNameUrdu")}
// // //                             />
// // //                             {formik.touched.VNameUrdu &&
// // //                             formik.errors.VNameUrdu ? (
// // //                               <div className="text-danger">
// // //                                 {formik.errors.VNameUrdu}
// // //                               </div>
// // //                             ) : null}
// // //                           </div>
// // //                         </Col>
// // //                         <Col xxl={2} md={3}>
// // //                           <div>
// // //                             <Label htmlFor="SortOrder" className="form-label">
// // //                               Sort Order
// // //                             </Label>
// // //                             <Input
// // //                               type="number"
// // //                               className="form-control-sm "
// // //                               id="SortOrder"
// // //                               placeholder="Sort Order"
// // //                               {...formik.getFieldProps("SortOrder")}
// // //                             />
// // //                             {formik.touched.SortOrder &&
// // //                             formik.errors.SortOrder ? (
// // //                               <div className="text-danger">
// // //                                 {formik.errors.SortOrder}
// // //                               </div>
// // //                             ) : null}
// // //                           </div>
// // //                         </Col>
// // //                         <Col xxl={2} md={2}>
// // //                           <div
// // //                             className="form-check form-switch mt-3 "
// // //                             dir="ltr"
// // //                           >
// // //                             <Input
// // //                               type="checkbox"
// // //                               className="form-check-input"
// // //                               id="IsActive"
// // //                               {...formik.getFieldProps("IsActive")}
// // //                               checked={formik.values.IsActive}
// // //                             />
// // //                             <Label
// // //                               className="form-check-label"
// // //                               htmlFor="IsActive"
// // //                             >
// // //                               IsActive
// // //                             </Label>
// // //                           </div>
// // //                         </Col>
// // //                       </Row>
// // //                     </div>
// // //                   </CardBody>
// // //                 </Form>
// // //               </Card>
// // //             </Col>
// // //             <Col lg={12}>
// // //               <Card>
// // //                 <CardBody>
// // //                   <div className="Location-table" id="customerList">
// // //                     <Row className="g-4 mb-3">
// // //                       <Col className="col-sm">
// // //                         <div className="d-flex justify-content-sm-end">
// // //                           <div className="search-box ms-2">
// // //                             <input
// // //                               type="text"
// // //                               className="form-control-sm search"
// // //                             />
// // //                             <i className="ri-search-line search-icon"></i>
// // //                           </div>
// // //                         </div>
// // //                       </Col>
// // //                     </Row>

// // //                     <div className="table-responsive table-card mt-3 mb-1">
// // //                       <table
// // //                         className="table align-middle table-nowrap table-sm"
// // //                         id="customerTable"
// // //                       >
// // //                         <thead className="table-light">
// // //                           <tr>
// // //                             <th className="" data-sort="code">
// // //                               Code
// // //                             </th>
// // //                             <th className="" data-sort="title">
// // //                               Title
// // //                             </th>
// // //                             <th className="" data-sort="titleUrdu">
// // //                               Title Urdu
// // //                             </th>
// // //                             <th className="" data-sort="action">
// // //                               Action
// // //                             </th>
// // //                           </tr>
// // //                         </thead>
// // //                         <tbody className="list form-check-all">
// // //                           {/* {departmentGroups.map((departmentGroup, index) => (

// // //                           <tr>
// // //                             <td >{departmentGroup.VCode}</td>
// // //                             <td>{departmentGroup.VName}</td>
// // //                             <td>{departmentGroup.VNameUrdu}</td>
// // //                             <td>
// // //                               <div className="d-flex gap-2">
// // //                                 <div className="edit ">
// // //                                   <Button
// // //                                     className="btn btn-soft-info"
// // //                                   >
// // //                                     <i className="bx bx-edit"></i>
// // //                                   </Button>
// // //                                 </div>
// // //                                 <div className="delete">
// // //                                   <Button
// // //                                     className="btn btn-soft-danger"
// // //                                     onClick={() => setDeleteModal(true)}
// // //                                   >
// // //                                     <i className="ri-delete-bin-2-line"></i>
// // //                                   </Button>
// // //                                 </div>
// // //                               </div>
// // //                             </td>
// // //                           </tr>
// // //                         ))} */}
// // //                           {departmentGroup?.data?.length > 0 ? (
// // //                             departmentGroup.data.map((group, index) => (
// // //                               <tr key={group.VID}>
// // //                                 <td>{group.VCode}</td>
// // //                                 <td>{group.VName}</td>
// // //                                 <td>{group.VNameUrdu}</td>
// // //                                 <td>
// // //                                   <div className="d-flex gap-2">
// // //                                     <div className="edit">
// // //                                       <button
// // //                                         className="btn btn-soft-info"
// // //                                         onClick={() => handleEditClick(group)}
// // //                                       >
// // //                                         <i className="bx bx-edit"></i>
// // //                                       </button>
// // //                                     </div>
// // //                                     <div className="delete">
// // //                                       <button
// // //                                         className="btn btn-soft-danger"
// // //                                         onClick={() =>
// // //                                           handleDeleteClick(group.VID)
// // //                                         }
// // //                                       >
// // //                                         <i className="ri-delete-bin-2-line"></i>
// // //                                       </button>
// // //                                     </div>
// // //                                   </div>
// // //                                 </td>
// // //                               </tr>
// // //                             ))
// // //                           ) : (
// // //                             <tr>
// // //                               <td colSpan="4" className="text-center">
// // //                                 No department groups found.
// // //                               </td>
// // //                             </tr>
// // //                           )}
// // //                         </tbody>
// // //                       </table>
// // //                       <div className="noresult" style={{ display: "none" }}>
// // //                         <div className="text-center">
// // //                           <lord-icon
// // //                             src="https://cdn.lordicon.com/msoeawqm.json"
// // //                             trigger="loop"
// // //                             colors="primary:#121331,secondary:#08a88a"
// // //                             style={{ width: "75px", height: "75px" }}
// // //                           ></lord-icon>
// // //                           <h5 className="mt-2">Sorry! No Result Found</h5>
// // //                         </div>
// // //                       </div>
// // //                     </div>

// // //                     <div className="d-flex justify-content-end">
// // //                       <div className="pagination-wrap hstack gap-2">
// // //                         <Link
// // //                           className="page-item pagination-prev disabled"
// // //                           to="#"
// // //                         >
// // //                           Previous
// // //                         </Link>
// // //                         <ul className="pagination Location-pagination mb-0"></ul>
// // //                         <Link className="page-item pagination-next" to="#">
// // //                           Next
// // //                         </Link>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </CardBody>
// // //               </Card>
// // //             </Col>
// // //           </Row>
// // //         </Container>
// // //       </div>
// // //       <DeleteModal
// // //         show={deleteModal}
// // //         onCloseClick={() => setDeleteModal(!deleteModal)}
// // //         onDeleteClick={handleDeleteConfirm}
// // //       />
// // //     </React.Fragment>
// // //   );
// // // };

// // // export default DepartmentGroup;
// // import React, { useState, useEffect } from "react";
// // import {
// //   Button,
// //   Card,
// //   CardBody,
// //   Col,
// //   Container,
// //   Row,
// //   Input,
// //   Label,
// //   Form,
// // } from "reactstrap";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useFormik } from "formik";
// // import * as Yup from "yup";
// // import { jsPDF } from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import DeleteModal from "../../../Components/Common/DeleteModal";
// // import {
// //   getDepartmentGroup,
// //   submitDepartmentGroup,
// //   deleteDepartmentGroup,
// //   updateDepartmentGroup,
// // } from "../../../slices/setup/departmentGroup/thunk";

// // const DepartmentGroup = () => {
// //   const [deleteModal, setDeleteModal] = useState(false);
// //   const [deleteId, setDeleteId] = useState(null);
// //   const [editingGroup, setEditingGroup] = useState(null);

// //   const dispatch = useDispatch();
// //   const { loading, error, departmentGroup } = useSelector(
// //     (state) => state.DepartmentGroup
// //   );

// //   // Formik for form handling
// //   const formik = useFormik({
// //     initialValues: {
// //       VCode: "",
// //       VName: "",
// //       VNameUrdu: "",
// //       SortOrder: 0,
// //       CompanyID: "1",
// //       UID: "1",
// //       IsActive: false,
// //     },
// //     validationSchema: Yup.object({
// //       VCode: Yup.string()
// //         .required("Code is required")
// //         .min(3, "Code must be at least 3 characters")
// //         .max(10, "Code must be less than 10 characters"),
// //       VName: Yup.string()
// //         .required("Title is required")
// //         .min(3, "Title must be at least 3 characters"),
// //       VNameUrdu: Yup.string()
// //         .required("Title Urdu is required")
// //         .min(3, "Title must be at least 3 characters"),
// //       SortOrder: Yup.number()
// //         .typeError("Sort Order must be a number")
// //         .required("Sort Order is required"),
// //       IsActive: Yup.boolean(),
// //     }),
// //     onSubmit: (values) => {
// //       const transformedValues = {
// //         ...values,
// //         IsActive: values.IsActive ? 1 : 0,
// //       };
// //       if (editingGroup) {
// //         dispatch(
// //           updateDepartmentGroup({ ...transformedValues, VID: editingGroup.VID })
// //         );
// //       } else {
// //         dispatch(submitDepartmentGroup(transformedValues));
// //       }
// //       formik.resetForm();
// //       setEditingGroup(null);
// //     },
// //   });

// //   // Fetch department groups on component mount
// //   useEffect(() => {
// //     dispatch(getDepartmentGroup());
// //   }, [dispatch]);

// //   // Handle delete actions
// //   const handleDeleteClick = (id) => {
// //     setDeleteId(id);
// //     setDeleteModal(true);
// //   };

// //   const handleDeleteConfirm = () => {
// //     if (deleteId) {
// //       dispatch(deleteDepartmentGroup(deleteId));
// //     }
// //     setDeleteModal(false);
// //   };

// //   // Handle edit actions
// //   const handleEditClick = (group) => {
// //     setEditingGroup(group);
// //     formik.setValues({
// //       VCode: group.VCode,
// //       VName: group.VName,
// //       VNameUrdu: group.VNameUrdu,
// //       SortOrder: group.SortOrder,
// //       CompanyID: group.CompanyID,
// //       UID: group.UID,
// //       IsActive: group.IsActive === 1,
// //     });
// //   };

// //   // Export to PDF function
// //   const exportToPDF = () => {
// //     try {
// //       const doc = new jsPDF();
      
// //       // Add title
// //       doc.setFont("helvetica", "bold");
// //       doc.setFontSize(16);
// //       doc.text("Department Groups Report", 105, 15, { align: "center" });

// //       // Add date
// //       doc.setFont("helvetica", "normal");
// //       doc.setFontSize(10);
// //       doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });

// //       // Prepare data for the table
// //       const headers = [
// //         ["Code", "Title", "Title Urdu", "Sort Order", "Status"]
// //       ];
      
// //       const data = departmentGroup?.data?.map(group => [
// //         group.VCode,
// //         group.VName,
// //         group.VNameUrdu,
// //         group.SortOrder,
// //         group.IsActive === 1 ? "Active" : "Inactive"
// //       ]);

// //       // Add table
// //       autoTable(doc, {
// //         head: headers,
// //         body: data,
// //         startY: 30,
// //         margin: { top: 30 },
// //         styles: {
// //           cellPadding: 4,
// //           fontSize: 10,
// //           valign: "middle",
// //           halign: "left",
// //         },
// //         headStyles: {
// //           fillColor: [41, 128, 185],
// //           textColor: 255,
// //           fontSize: 10,
// //           fontStyle: "bold",
// //           halign: "center"
// //         },
// //         columnStyles: {
// //           0: { cellWidth: 25, halign: "center" },
// //           1: { cellWidth: 45 },
// //           2: { cellWidth: 45 },
// //           3: { cellWidth: 25, halign: "center" },
// //           4: { cellWidth: 25, halign: "center" }
// //         },
// //         didDrawPage: (data) => {
// //           // Footer
// //           doc.setFontSize(10);
// //           doc.setTextColor(100);
// //           doc.text(
// //             `Page ${data.pageCount}`,
// //             doc.internal.pageSize.width / 2,
// //             doc.internal.pageSize.height - 10,
// //             { align: "center" }
// //           );
// //         }
// //       });

// //       // Save the PDF
// //       doc.save(`Department_Groups_${new Date().toISOString().slice(0, 10)}.pdf`);
// //     } catch (error) {
// //       console.error("Error generating PDF:", error);
// //       alert("Failed to generate PDF. Please try again.");
// //     }
// //   };

// //   document.title = "Department Group | EMS";

// //   return (
// //     <React.Fragment>
// //       <div className="page-content">
// //         <Container fluid>
// //           {loading && <div className="text-center">Loading...</div>}
// //           {error && <div className="text-danger text-center">{error}</div>}
// //           <Row>
// //             <Col lg={12}>
// //               <Card>
// //                 <Form onSubmit={formik.handleSubmit}>
// //                   <CardBody>
// //                     <h4 className="card-title mb-4">Department Group</h4>
// //                     <Row className="gy-3">
// //                       <Col md={3}>
// //                         <Label htmlFor="VCode" className="form-label">Code</Label>
// //                         <Input
// //                           type="text"
// //                           id="VCode"
// //                           placeholder="Code"
// //                           {...formik.getFieldProps("VCode")}
// //                           className={formik.touched.VCode && formik.errors.VCode ? "is-invalid" : ""}
// //                         />
// //                         {formik.touched.VCode && formik.errors.VCode && (
// //                           <div className="invalid-feedback">{formik.errors.VCode}</div>
// //                         )}
// //                       </Col>
// //                       <Col md={3}>
// //                         <Label htmlFor="VName" className="form-label">Title</Label>
// //                         <Input
// //                           type="text"
// //                           id="VName"
// //                           placeholder="Title"
// //                           {...formik.getFieldProps("VName")}
// //                           className={formik.touched.VName && formik.errors.VName ? "is-invalid" : ""}
// //                         />
// //                         {formik.touched.VName && formik.errors.VName && (
// //                           <div className="invalid-feedback">{formik.errors.VName}</div>
// //                         )}
// //                       </Col>
// //                       <Col md={3}>
// //                         <Label htmlFor="VNameUrdu" className="form-label">Title Urdu</Label>
// //                         <Input
// //                           type="text"
// //                           id="VNameUrdu"
// //                           placeholder="Title Urdu"
// //                           {...formik.getFieldProps("VNameUrdu")}
// //                           className={formik.touched.VNameUrdu && formik.errors.VNameUrdu ? "is-invalid" : ""}
// //                         />
// //                         {formik.touched.VNameUrdu && formik.errors.VNameUrdu && (
// //                           <div className="invalid-feedback">{formik.errors.VNameUrdu}</div>
// //                         )}
// //                       </Col>
// //                       <Col md={3}>
// //                         <Label htmlFor="SortOrder" className="form-label">Sort Order</Label>
// //                         <Input
// //                           type="number"
// //                           id="SortOrder"
// //                           placeholder="Sort Order"
// //                           {...formik.getFieldProps("SortOrder")}
// //                           className={formik.touched.SortOrder && formik.errors.SortOrder ? "is-invalid" : ""}
// //                         />
// //                         {formik.touched.SortOrder && formik.errors.SortOrder && (
// //                           <div className="invalid-feedback">{formik.errors.SortOrder}</div>
// //                         )}
// //                       </Col>
// //                       <Col md={3}>
// //                         <div className="form-check mt-4 pt-2">
// //                           <Input
// //                             type="checkbox"
// //                             id="IsActive"
// //                             {...formik.getFieldProps("IsActive")}
// //                             checked={formik.values.IsActive}
// //                             className="form-check-input"
// //                           />
// //                           <Label className="form-check-label" htmlFor="IsActive">
// //                             Is Active
// //                           </Label>
// //                         </div>
// //                       </Col>
// //                     </Row>
// //                     <div className="mt-4">
// //                       <Button type="submit" color="primary" className="me-2">
// //                         {editingGroup ? "Update" : "Submit"}
// //                       </Button>
// //                       <Button
// //                         type="button"
// //                         color="secondary"
// //                         className="me-2"
// //                         onClick={formik.resetForm}
// //                       >
// //                         Reset
// //                       </Button>
// //                       <Button 
// //                         color="success"
// //                         onClick={exportToPDF}
// //                         disabled={!departmentGroup?.data?.length}
// //                       >
// //                         <i className="ri-file-pdf-line align-bottom me-1"></i> Export to PDF
// //                       </Button>
// //                     </div>
// //                   </CardBody>
// //                 </Form>
// //               </Card>
// //             </Col>
// //             <Col lg={12}>
// //               <Card>
// //                 <CardBody>
// //                   <div className="d-flex justify-content-between align-items-center mb-4">
// //                     <h4 className="card-title mb-0">Department Groups</h4>
// //                     <div>
// //                       <Button 
// //                         color="success"
// //                         size="sm"
// //                         onClick={exportToPDF}
// //                         disabled={!departmentGroup?.data?.length}
// //                         className="me-2"
// //                       >
// //                         <i className="ri-file-pdf-line align-bottom me-1"></i> PDF
// //                       </Button>
// //                     </div>
// //                   </div>
// //                   <div className="table-responsive">
// //                     <table className="table table-bordered table-hover mb-0">
// //                       <thead className="table-light">
// //                         <tr>
// //                           <th width="10%">Code</th>
// //                           <th width="25%">Title</th>
// //                           <th width="25%">Title Urdu</th>
// //                           <th width="10%">Sort Order</th>
// //                           <th width="10%">Status</th>
// //                           <th width="20%">Actions</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {departmentGroup?.data?.length > 0 ? (
// //                           departmentGroup.data.map((group) => (
// //                             <tr key={group.VID}>
// //                               <td>{group.VCode}</td>
// //                               <td>{group.VName}</td>
// //                               <td>{group.VNameUrdu}</td>
// //                               <td className="text-center">{group.SortOrder}</td>
// //                               <td className="text-center">
// //                                 <span className={`badge ${group.IsActive === 1 ? "bg-success" : "bg-secondary"}`}>
// //                                   {group.IsActive === 1 ? "Active" : "Inactive"}
// //                                 </span>
// //                               </td>
// //                               <td className="text-center">
// //                                 <Button
// //                                   color="info"
// //                                   size="sm"
// //                                   className="me-2"
// //                                   onClick={() => handleEditClick(group)}
// //                                 >
// //                                   <i className="ri-edit-line"></i> Edit
// //                                 </Button>
// //                                 <Button
// //                                   color="danger"
// //                                   size="sm"
// //                                   onClick={() => handleDeleteClick(group.VID)}
// //                                 >
// //                                   <i className="ri-delete-bin-line"></i> Delete
// //                                 </Button>
// //                               </td>
// //                             </tr>
// //                           ))
// //                         ) : (
// //                           <tr>
// //                             <td colSpan="6" className="text-center">
// //                               <div className="text-muted py-3">No department groups found</div>
// //                             </td>
// //                           </tr>
// //                         )}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 </CardBody>
// //               </Card>
// //             </Col>
// //           </Row>
// //         </Container>
// //       </div>
// //       <DeleteModal
// //         show={deleteModal}
// //         onCloseClick={() => setDeleteModal(false)}
// //         onDeleteClick={handleDeleteConfirm}
// //       />
// //     </React.Fragment>
// //   );
// // };

// // export default DepartmentGroup;
// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Card,
//   CardBody,
//   Col,
//   Container,
//   Row,
//   Form,
// } from "reactstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import DeleteModal from "../../../Components/Common/DeleteModal";
// import DataTable from "react-data-table-component";
// import { CSVLink } from "react-csv"; // For CSV export
// import * as XLSX from "xlsx"; // For Excel export
// import jsPDF from "jspdf"; // For PDF export
// import "jspdf-autotable"; // For PDF table
// import {
//   getDepartmentGroup,
//   submitDepartmentGroup,
//   deleteDepartmentGroup,
//   updateDepartmentGroup,
// } from "../../../slices/setup/departmentGroup/thunk";

// const DepartmentGroup = () => {
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [editingGroup, setEditingGroup] = useState(null);

//   const dispatch = useDispatch();
//   const { loading, error, departmentGroup } = useSelector(
//     (state) => state.DepartmentGroup
//   );

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
//         IsActive: values.IsActive ? 1 : 0,
//       };
//       if (editingGroup) {
//         dispatch(
//           updateDepartmentGroup({ ...transformedValues, VID: editingGroup.VID })
//         );
//       } else {
//         dispatch(submitDepartmentGroup(transformedValues));
//       }
//       formik.resetForm();
//     },
//   });

//   useEffect(() => {
//     dispatch(getDepartmentGroup());
//   }, [dispatch]);

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

//   // Export to Excel
//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(departmentGroup?.data || []);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "DepartmentGroups");
//     XLSX.writeFile(workbook, "DepartmentGroups.xlsx");
//   };

//   // Export to PDF
//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Department Groups", 20, 10);
//     doc.autoTable({
//       head: [["Code", "Title", "Title Urdu"]],
//       body: departmentGroup?.data.map((row) => [
//         row.VCode,
//         row.VName,
//         row.VNameUrdu,
//       ]),
//     });
//     doc.save("DepartmentGroups.pdf");
//   };

//   // Define columns for DataTable
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
//       name: "Actions",
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
//                 <Form onSubmit={formik.handleSubmit}>
//                   <CardBody>
//                     {/* Form Fields */}
//                   </CardBody>
//                 </Form>
//               </Card>
//             </Col>
//             <Col lg={12}>
//               <Card>
//                 <CardBody>
//                   <div className="d-flex justify-content-between mb-3">
//                     <Button color="success" onClick={exportToExcel}>
//                       Export to Excel
//                     </Button>
//                     <Button color="danger" onClick={exportToPDF}>
//                       Export to PDF
//                     </Button>
//                     <CSVLink
//                       data={departmentGroup?.data || []}
//                       filename="DepartmentGroups.csv"
//                       className="btn btn-primary"
//                     >
//                       Export to CSV
//                     </CSVLink>
//                   </div>
//                   <DataTable
//                     title="Department Groups"
//                     columns={columns}
//                     data={departmentGroup?.data || []}
//                     pagination
//                     highlightOnHover
//                     striped
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