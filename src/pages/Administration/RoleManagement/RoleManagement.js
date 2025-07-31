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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";

import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  getRole,
  submitRole,
  updateRole,
  deleteRole,
} from "../../../slices/administration/roles/thunk";


// Dummy data for roles
const RoleManagement = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  // Access Redux state
  const { loading, error, role } = useSelector((state) => state.Role);
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getRole());
  }, [dispatch]);

  const [filterText, setFilterText] = useState("");
  const filteredItems = role?.filter(
    (item) =>
      item.VName && item.VName.toLowerCase().includes(filterText.toLowerCase())
  );


  // Formik form setup
  const formik = useFormik({
    initialValues: {
      VName: "",
      IsActive: true,
      UID: "1",
      CompanyID: "1",
    },
    validationSchema: Yup.object({
      VName: Yup.string()
        .required("Title is required.")
        .min(3, "Title at least must be 3 characters "),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      // Add your form submission logic here
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
      };
      if (editingGroup) {
        console.log("Editing Group", transformedValues);
        dispatch(updateRole({ ...transformedValues, VID: editingGroup.VID }));
        setEditingGroup(null); // Reset after submission
      } else {
        dispatch(submitRole(transformedValues));
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
      dispatch(deleteRole(deleteId));
    }
    setDeleteModal(false);
  };
  const handleEditClick = (group) => {
    setEditingGroup(group);
    formik.setValues({
      VName: group.VName,
      UID: group.UID,
      CompanyID: group.CompanyID,
      IsActive: group.IsActive === 1,
    });
  };
  const columns = [
    {
      name: "Role Name",
      selector: (row) => row.VName,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.IsActive === 1 ? "Active" : "Inactive"),
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


  document.title = "Role Management | EMS";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar /> */}
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader
                    title="Role Management"
                    onCancel={() => {
                      formik.resetForm();
                      setEditingGroup(null);
                    }}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={3} md={4}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Role Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Enter role name"
                              {...formik.getFieldProps("VName")}
                            />
                            {formik.touched.VName && formik.errors.VName ? (
                              <div className="text-danger">
                                {formik.errors.VName}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2} className="mt-3">
                          <div className="form-check form-switch mt-4" dir="ltr">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="IsActive"
                              {...formik.getFieldProps("IsActive")}
                              checked={formik.values.IsActive}
                            />
                            <Label className="form-check-label" htmlFor="IsActive">
                              Is Active
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
                  {/* <div className="d-flex flex-wrap gap-2 mb-2">

                  </div> */}
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                    <div></div>
                    <div>
                     <Input
                        type="text"
                        className="form-control-sm"
                        placeholder="Search roles..."
                        value={filterText}
                        style={{ width: '200px' }}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                    </div>
                  </div>

                  <DataTable
                    title="Roles"
                    columns={columns}
                    data={filteredItems}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={100}
                    paginationRowsPerPageOptions={[100, 200, 500]}
                    highlightOnHover
                    responsive
                  />

                  {/* <div className="Location-table" id="customerList">
                    <Row className="g-4 mb-4">
                      <Col className="col-sm">
                        <div className="d-flex justify-content-sm-end">
                          <div className="search-box ms-2">
                            <input
                              type="text"
                              className="form-control-sm search"
                              placeholder=""
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="table-responsive table-card mb-1">
                      <table
                        className="table align-middle table-nowrap table-striped table-sm"
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th data-sort="VName">Name</th>
                            <th data-sort="IsActive">Status</th>
                            <th data-sort="action">Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {role.length > 0 ? (
                            [...role]
                              .sort((a, b) => a.VName.localeCompare(b.VName))
                              .map((group) => (
                                <tr key={group.VID}>
                                  <td>{group.VName}</td>
                                  <td>
                                    {group.IsActive === 1 ? "Active" : "Inactive"}
                                  </td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <Button
                                        className="btn btn-soft-info btn-sm"
                                        onClick={() => handleEditClick(group)}
                                      >
                                        <i className="bx bx-edit"></i>
                                      </Button>
                                      <Button
                                        className="btn btn-soft-danger btn-sm"
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
                              <td colSpan="4" className="text-center">
                                No Roles found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-end">
                      <div className="pagination-wrap hstack gap-2">
                        <Link
                          className="page-item pagination-prev disabled"
                          to="#"
                        >
                          Previous
                        </Link>
                        <ul className="pagination listjs-pagination mb-0"></ul>
                        <Link className="page-item pagination-next" to="#">
                          Next
                        </Link>
                      </div>
                    </div>
                  </div> */}
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

export default RoleManagement;