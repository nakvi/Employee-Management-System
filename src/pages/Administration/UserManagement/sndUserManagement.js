import React, { useState } from "react";
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
import DeleteModal from "../../../Components/Common/DeleteModal";

const UserManagement = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Dummy data for users
  const dummyUsers = [
    {
      id: 1,
      employeeType: "Staff",
      employee: "001:Sir Amir:Hr",
      fullName: "Amir Khan",
      login: "amir.khan",
      password: "pass123",
      roles: ["ADMINISTRATOR"],
      locations: ["Lahore"],
      company: "Zeta Solutions",
      loginExpiry: "18/04/2025",
      isActive: true,
      allowAudit: true,
      allowActual: false,
      isAdmin: true,
      adminReportRights: false,
    },
    {
      id: 2,
      employeeType: "Worker",
      employee: "002:Sir Ijaz:HOD",
      fullName: "Ijaz Ahmed",
      login: "ijaz.ahmed",
      password: "pass456",
      roles: ["MANAGER"],
      locations: ["Islamabad"],
      company: "Zeta Solutions",
      loginExpiry: "18/04/2025",
      isActive: false,
      allowAudit: false,
      allowActual: true,
      isAdmin: false,
      adminReportRights: true,
    },
  ];

  const [users, setUsers] = useState(dummyUsers);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      employeeType: "",
      employee: "",
      fullName: "",
      login: "",
      password: "",
      roles: [],
      locations: [],
      company: "",
      loginExpiry: "18/04/2025",
      isActive: false,
      allowAudit: false,
      allowActual: false,
      isAdmin: false,
      adminReportRights: false,
    },
    validationSchema: Yup.object({
      employeeType: Yup.string().required("Employee Type is required"),
      employee: Yup.string().required("Employee is required"),
      fullName: Yup.string().required("Full Name is required"),
      login: Yup.string().required("User Login is required"),
      password: Yup.string().required("Password is required"),
      roles: Yup.array().min(1, "At least one role is required"),
      locations: Yup.array().min(1, "At least one location is required"),
      company: Yup.string().required("Company is required"),
    }),
    onSubmit: (values) => {
      if (editingUser) {
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? { ...user, ...values } : user
          )
        );
        setEditingUser(null);
      } else {
        const newUser = {
          id: users.length + 1,
          ...values,
        };
        setUsers([...users, newUser]);
      }
      formik.resetForm();
    },
  });

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setUsers(users.filter((user) => user.id !== deleteId));
    setDeleteModal(false);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    formik.setValues({
      employeeType: user.employeeType,
      employee: user.employee,
      fullName: user.fullName,
      login: user.login,
      password: user.password,
      roles: user.roles,
      locations: user.locations,
      company: user.company,
      loginExpiry: user.loginExpiry,
      isActive: user.isActive,
      allowAudit: user.allowAudit,
      allowActual: user.allowActual,
      isAdmin: user.isAdmin,
      adminReportRights: user.adminReportRights,
    });
  };

  document.title = "User Management | EMS";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader
                    title="User Management"
                    onCancel={formik.resetForm}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      {/* First Row: E-Type, Employee, Full Name, Login, Password */}
                      <Row className="gy-4">
                        <Col xxl={3} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="employeeInput" className="form-label">
                              Employee
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="employee"
                              id="employeeInput"
                              disabled
                              onChange={formik.handleChange}
                              value={formik.values.employee}
                            >
                              <option value="">---Select---</option>
                              <option value="001:Sir Amir:Hr">001:Sir Amir:Hr</option>
                              <option value="002:Sir Ijaz:HOD">002:Sir Ijaz:HOD</option>
                            </select>
                            {formik.touched.employee && formik.errors.employee ? (
                              <div className="text-danger">{formik.errors.employee}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={3} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="fullNameInput" className="form-label">
                              User Full Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control form-control-sm"
                              name="fullName"
                              id="fullNameInput"
                              readOnly
                              onChange={formik.handleChange}
                              value={formik.values.fullName}
                            />
                            {formik.touched.fullName && formik.errors.fullName ? (
                              <div className="text-danger">{formik.errors.fullName}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={3} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="loginInput" className="form-label">
                              User Login
                            </Label>
                            <Input
                              type="text"
                              className="form-control form-control-sm"
                              name="login"
                              id="loginInput"
                              onChange={formik.handleChange}
                              value={formik.values.login}
                            />
                            {formik.touched.login && formik.errors.login ? (
                              <div className="text-danger">{formik.errors.login}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={3} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="passwordInput" className="form-label">
                              User Password
                            </Label>
                            <Input
                              type="password"
                              className="form-control form-control-sm"
                              name="password"
                              id="passwordInput"
                              onChange={formik.handleChange}
                              value={formik.values.password}
                            />
                            {formik.touched.password && formik.errors.password ? (
                              <div className="text-danger">{formik.errors.password}</div>
                            ) : null}
                          </div>
                        </Col>
                      </Row>

                      {/* Second Row: Roles, Locations, Company */}
                      <Row className="gy-4">
                        <Col xxl={4} md={4}>
                          <div className="mb-3">
                            <Label htmlFor="rolesInput" className="form-label">
                              User Role
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="roles"
                              id="rolesInput"
                              multiple
                              size="2"
                              onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                                formik.setFieldValue("roles", selectedOptions);
                              }}
                              value={formik.values.roles}
                            >
                              <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                              <option value="MANAGER">MANAGER</option>
                            </select>
                            {formik.touched.roles && formik.errors.roles ? (
                              <div className="text-danger">{formik.errors.roles}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={4} md={4}>
                          <div className="mb-3">
                            <Label htmlFor="locationsInput" className="form-label">
                              User Location
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="locations"
                              id="locationsInput"
                              multiple
                              size="2"
                              onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                                formik.setFieldValue("locations", selectedOptions);
                              }}
                              value={formik.values.locations}
                            >
                              <option value="MULTI LOCATION">Lahore</option>
                              <option value="SINGLE LOCATION">Islamabad</option>
                            </select>
                            {formik.touched.locations && formik.errors.locations ? (
                              <div className="text-danger">{formik.errors.locations}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={4} md={4}>
                          <div className="mb-3">
                            <Label htmlFor="companyInput" className="form-label">
                              Company
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="company"
                              id="companyInput"
                              onChange={formik.handleChange}
                              value={formik.values.company}
                            >
                              <option value="">---Select---</option>
                              <option value="Zeta Solutions">Zeta Solutions</option>
                            </select>
                            {formik.touched.company && formik.errors.company ? (
                              <div className="text-danger">{formik.errors.company}</div>
                            ) : null}
                          </div>
                        </Col>
                      </Row>

                      {/* Third Row: Login Expiry, Active, Allow Audit, Allow Actual, Is Admin, Admin Report Rights */}
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="loginExpiryInput" className="form-label">
                              Login Expiry
                            </Label>
                            <Input
                              type="text"
                              className="form-control form-control-sm"
                              name="loginExpiry"
                              id="loginExpiryInput"
                              onChange={formik.handleChange}
                              value={formik.values.loginExpiry}
                              disabled
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check form-switch mt-4">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="isActive"
                              name="isActive"
                              onChange={formik.handleChange}
                              checked={formik.values.isActive}
                            />
                            <Label className="form-check-label" htmlFor="isActive">
                              Active
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check form-switch mt-4">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="allowAudit"
                              name="allowAudit"
                              onChange={formik.handleChange}
                              checked={formik.values.allowAudit}
                            />
                            <Label className="form-check-label" htmlFor="allowAudit">
                              Allow Audit
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check form-switch mt-4">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="allowActual"
                              name="allowActual"
                              onChange={formik.handleChange}
                              checked={formik.values.allowActual}
                            />
                            <Label className="form-check-label" htmlFor="allowActual">
                              Allow Actual
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check form-switch mt-4">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="isAdmin"
                              name="isAdmin"
                              onChange={formik.handleChange}
                              checked={formik.values.isAdmin}
                            />
                            <Label className="form-check-label" htmlFor="isAdmin">
                              Is Admin
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check form-switch mt-4">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="adminReportRights"
                              name="adminReportRights"
                              onChange={formik.handleChange}
                              checked={formik.values.adminReportRights}
                            />
                            <Label className="form-check-label" htmlFor="adminReportRights">
                              Admin Report Rights
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
                  <div className="Location-table" id="customerList">
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
                            <th data-sort="fullName">Full Name</th>
                            <th data-sort="login">User Login</th>
                            <th data-sort="roles">Roles</th>
                            <th data-sort="locations">Locations</th>
                            <th data-sort="company">Company</th>
                            <th data-sort="status">Status</th>
                            <th data-sort="action">Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {users.length > 0 ? (
                            users.map((user) => (
                              <tr key={user.id}>
                                <td>{user.fullName}</td>
                                <td>{user.login}</td>
                                <td>{user.roles.join(", ")}</td>
                                <td>{user.locations.join(", ")}</td>
                                <td>{user.company}</td>
                                <td>{user.isActive ? "Active" : "Inactive"}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <Button
                                      className="btn btn-soft-info btn-sm"
                                      onClick={() => handleEditClick(user)}
                                    >
                                      <i className="bx bx-edit"></i>
                                    </Button>
                                    <Button
                                      className="btn btn-soft-danger btn-sm"
                                      onClick={() => handleDeleteClick(user.id)}
                                    >
                                      <i className="ri-delete-bin-2-line"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center">
                                No Users found.
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

export default UserManagement;