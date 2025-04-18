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
import DeleteModal from "../../../Components/Common/DeleteModal";
// Assume these thunks fetch and manage user rights data
// import { getUserRoles, getUserRights, updateUserRights } from "../../../slices/setup/userRights/thunk";

const UserRights = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingRights, setEditingRights] = useState(null);

  // Sample data structure based on the image (replace with Redux state)
  const roles = ["ACCOUNTS", "ADMIN", "EMPLOYEE", "HR", "SHOP"];
  const pages = [
    { name: "MFileLogin", permissions: { View: true, Insert: true, Update: false, Delete: false, Backdate: false, Print: false } },
    { name: "MFileChangePassword", permissions: { View: true, Insert: true, Update: false, Delete: false, Backdate: false, Print: false } },
    { name: "MSetupSP1", permissions: { View: true, Insert: true, Update: false, Delete: false, Backdate: false, Print: false } },
    { name: "MSetupLocation", permissions: { View: false, Insert: false, Update: false, Delete: false, Backdate: false, Print: false } },
    { name: "MSetupDepartmentGroup", permissions: { View: false, Insert: false, Update: false, Delete: false, Backdate: false, Print: false } },
  ];

  // Mock Redux state (replace with actual state)
  const userRights = roles.map((role) => ({
    roleName: role,
    pages: pages.map((page) => ({
      pageName: page.name,
      permissions: { ...page.permissions },
    })),
  }));

  // Fetch data on component mount (mocked here)
  useEffect(() => {
    // dispatch(getUserRoles());
    // dispatch(getUserRights());
  }, [dispatch]);

  // Formik setup for managing roles and permissions
  const formik = useFormik({
    initialValues: {
      roleName: "",
      pages: pages.reduce((acc, page) => {
        acc[page.name] = { View: false, Insert: false, Update: false, Delete: false, Backdate: false, Print: false };
        return acc;
      }, {}),
    },
    validationSchema: Yup.object({
      roleName: Yup.string().required("Role Name is required."),
    }),
    onSubmit: (values) => {
      if (editingRights) {
        dispatch(updateUserRights({ ...values, roleId: editingRights.roleId }));
        setEditingRights(null);
      } else {
        // Add new role logic here
      }
      formik.resetForm();
    },
  });

  const handleEditClick = (role) => {
    setEditingRights(role);
    formik.setValues({
      roleName: role.roleName,
      pages: role.pages.reduce((acc, page) => {
        acc[page.pageName] = { ...page.permissions };
        return acc;
      }, {}),
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      // dispatch(deleteUserRights(deleteId));
    }
    setDeleteModal(false);
  };

  document.title = "User Rights | EMS";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader
                    title="User Rights"
                    onCancel={formik.resetForm}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={3} md={4}>
                          <div>
                            <Label htmlFor="roleName" className="form-label">
                              Role Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="roleName"
                              placeholder="Role Name"
                              {...formik.getFieldProps("roleName")}
                            />
                            {formik.touched.roleName && formik.errors.roleName ? (
                              <div className="text-danger">{formik.errors.roleName}</div>
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
                  <div className="Location-table" id="customerList">
                    <Row className="g-4 mb-4">
                      <Col className="col-sm">
                        <div className="d-flex justify-content-sm-end">
                          <div className="search-box ms-2">
                            <input
                              type="text"
                              className="form-control-sm search"
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
                            <th data-sort="roleName">Role Name</th>
                            <th data-sort="select">Select</th>
                            <th data-sort="pageName">Page Name</th>
                            <th data-sort="view">View</th>
                            <th data-sort="insert">Insert</th>
                            <th data-sort="update">Update</th>
                            <th data-sort="delete">Delete</th>
                            <th data-sort="backdate">Backdate</th>
                            <th data-sort="print">Print</th>
                            <th data-sort="action">Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {userRights?.length > 0 ? (
                            userRights.map((role) =>
                              role.pages.map((page, index) => (
                                <tr key={`${role.roleName}-${page.pageName}`}>
                                  {index === 0 && (
                                    <td rowSpan={role.pages.length}>{role.roleName}</td>
                                  )}
                                  {index === 0 && (
                                    <td rowSpan={role.pages.length}>
                                      <Input type="checkbox" />
                                    </td>
                                  )}
                                  <td>{page.pageName}</td>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      checked={page.permissions.View}
                                      onChange={() => {
                                        // Update permissions logic
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      checked={page.permissions.Insert}
                                      onChange={() => {
                                        // Update permissions logic
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      checked={page.permissions.Update}
                                      onChange={() => {
                                        // Update permissions logic
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      checked={page.permissions.Delete}
                                      onChange={() => {
                                        // Update permissions logic
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      checked={page.permissions.Backdate}
                                      onChange={() => {
                                        // Update permissions logic
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="checkbox"
                                      checked={page.permissions.Print}
                                      onChange={() => {
                                        // Update permissions logic
                                      }}
                                    />
                                  </td>
                                  {index === 0 && (
                                    <td rowSpan={role.pages.length}>
                                      <div className="d-flex gap-2">
                                        <div className="edit">
                                          <Button
                                            className="btn btn-soft-info"
                                            onClick={() => handleEditClick(role)}
                                          >
                                            <i className="bx bx-edit"></i>
                                          </Button>
                                        </div>
                                        <div className="delete">
                                          <Button
                                            className="btn btn-soft-danger"
                                            onClick={() => handleDeleteClick(role.roleName)}
                                          >
                                            <i className="ri-delete-bin-2-line"></i>
                                          </Button>
                                        </div>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              ))
                            )
                          ) : (
                            <tr>
                              <td colSpan="10" className="text-center">
                                No User Rights found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <div className="noresult" style={{ display: "none" }}>
                        <div className="text-center">
                          <lord-icon
                            src="https://cdn.lordicon.com/msoeawqm.json"
                            trigger="loop"
                            colors="primary:#121331,secondary:#08a88a"
                            style={{ width: "75px", height: "75px" }}
                          ></lord-icon>
                          <h5 className="mt-2">Sorry! No Result Found</h5>
                          <p className="text-muted mb-0">
                            We've searched more than 150+ Orders We did not find
                            any orders for your search.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <div className="pagination-wrap hstack gap-2">
                        <Link
                          className="page-item pagination-prev disabled"
                          to="#"
                        >
                          Previous
                        </Link>
                        <ul className="pagination Location-pagination mb-0"></ul>
                        <Link className="page-item pagination-next" to="#">
                          Next
                        </Link>
                      </div>
                    </div>
                  </div>
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

export default UserRights;