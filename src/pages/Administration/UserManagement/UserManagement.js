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
} from "reactstrap";
import { Link } from "react-router-dom";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../../../Components/Common/DeleteModal";
import {
  getUser,
  submitUser,
  updateUser,
  deleteUser,
} from "../../../slices/administration/userManagement/thunk";
import { getRole } from "../../../slices/administration/roles/thunk";
import { getCompany } from "../../../slices/setup/company/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import Select from "react-select";

const UserManagement = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Access Redux state with fallback
  const { loading = false, error = null, users = [] } = useSelector((state) => state.User || {});
  const { role = [] } = useSelector((state) => state.Role || {});
  const { company = {} } = useSelector((state) => state.Company || {});
  const { location = [] } = useSelector((state) => state.location || {});
  
  // Custom styles for react-select to make selected item text white
  const customStyles = {
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white', // Change selected item text color to white
    }),
  };

  // Convert role data to array for react-select
  const roleOptions = role?.length > 0
    ? role.map((r) => ({
        value: r.VName, // Use r.id if available for uniqueness
        label: r.VName,
      }))
    : [];

  // Convert location data to array for react-select
  const locationOptions = location?.length > 0
    ? location.map((loc) => ({
        value: loc, // Assuming location is an array of strings; use loc.id if objects
        label: loc,
      }))
    : [
        { value: "Lahore", label: "Lahore" },
        { value: "Islamabad", label: "Islamabad" },
      ];

  // Convert company data to array for react-select
  const companyOptions = company?.data?.length > 0
    ? company.data.map((comp) => ({
        value: comp.VName, // Use comp.id if available for uniqueness
        label: comp.VName,
      }))
    : [];

  // Debug users, roles, locations, and company
  useEffect(() => {
    console.log("Users from Redux:", users);
    users.forEach((user, index) => {
      if (!user.roles || !Array.isArray(user.roles)) {
        console.warn(`User at index ${index} has invalid roles:`, user);
      }
      if (!user.locations || !Array.isArray(user.locations)) {
        console.warn(`User at index ${index} has invalid locations:`, user);
      }
    });
    console.log("Roles from Redux:", role);
    console.log("roleOptions:", roleOptions);
    console.log("Locations from Redux:", location);
    console.log("locationOptions:", locationOptions);
    console.log("Company from Redux:", company);
    console.log("companyOptions:", companyOptions);
  }, [users, role, location, company]);

  // Fetch users, roles, company, and locations on component mount
  useEffect(() => {
    dispatch(getUser());
    dispatch(getRole());
    dispatch(getCompany());
    dispatch(getLocation());
  }, [dispatch]);

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
      company: [],
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
      company: Yup.array().min(1, "At least one company is required"),
    }),
    onSubmit: (values) => {
      const transformedValues = {
        ...values,
        roles: Array.isArray(values.roles) ? values.roles : [],
        locations: Array.isArray(values.locations) ? values.locations : [],
        company: values.company,
        isActive: values.isActive ? 1 : 0,
        allowAudit: values.allowAudit ? 1 : 0,
        allowActual: values.allowActual ? 1 : 0,
        isAdmin: values.isAdmin ? 1 : 0,
        adminReportRights: values.adminReportRights ? 1 : 0,
      };
      if (editingUser) {
        dispatch(updateUser({ ...transformedValues, id: editingUser.id }));
        setEditingUser(null);
      } else {
        dispatch(submitUser(transformedValues));
      }
      formik.resetForm({
        values: {
          employeeType: "",
          employee: "",
          fullName: "",
          login: "",
          password: "",
          roles: [],
          locations: [],
          company: [],
          loginExpiry: "18/04/2025",
          isActive: false,
          allowAudit: false,
          allowActual: false,
          isAdmin: false,
          adminReportRights: false,
        },
      });
    },
  });

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteUser(deleteId));
    }
    setDeleteModal(false);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    formik.setValues({
      employeeType: user.employeeType || "",
      employee: user.employee || "",
      fullName: user.fullName || "",
      login: user.login || "",
      password: user.password || "",
      roles: Array.isArray(user.roles) ? user.roles : [],
      locations: Array.isArray(user.locations) ? user.locations : [],
      company: Array.isArray(user.company) ? user.company : [],
      loginExpiry: user.loginExpiry || "18/04/2025",
      isActive: user.isActive === 1,
      allowAudit: user.allowAudit === 1,
      allowActual: user.allowActual === 1,
      isAdmin: user.isAdmin === 1,
      adminReportRights: user.adminReportRights === 1,
    });
  };

  document.title = "User Management | EMS";

  return (
    <div className="page-content">
      <Container fluid>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        <Row>
          <Col lg={12}>
            <Card>
              <form onSubmit={formik.handleSubmit}>
                <PreviewCardHeader
                  title="User Management"
                  onCancel={() => {
                    formik.resetForm({
                      values: {
                        employeeType: "",
                        employee: "",
                        fullName: "",
                        login: "",
                        password: "",
                        roles: [],
                        locations: [],
                        company: [],
                        loginExpiry: "18/04/2025",
                        isActive: false,
                        allowAudit: false,
                        allowActual: false,
                        isAdmin: false,
                        adminReportRights: false,
                      },
                    });
                    setEditingUser(null);
                  }}
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
                          <Select
                            id="rolesInput"
                            isMulti
                            options={roleOptions}
                            value={roleOptions.filter((option) =>
                              formik.values.roles.includes(option.value)
                            )}
                            onChange={(selectedOptions) => {
                              const selectedValues = selectedOptions
                                ? selectedOptions.map((option) => option.value)
                                : [];
                              formik.setFieldValue("roles", selectedValues);
                            }}
                            placeholder="Select roles..."
                            classNamePrefix="select"
                            isDisabled={loading}
                            styles={customStyles} // Apply custom styles
                          />
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
                          <Select
                            id="locationsInput"
                            isMulti
                            options={locationOptions}
                            value={locationOptions.filter((option) =>
                              formik.values.locations.includes(option.value)
                            )}
                            onChange={(selectedOptions) => {
                              const selectedValues = selectedOptions
                                ? selectedOptions.map((option) => option.value)
                                : [];
                              formik.setFieldValue("locations", selectedValues);
                            }}
                            placeholder="Select locations..."
                            classNamePrefix="select"
                            styles={customStyles} // Apply custom styles
                          />
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
                          <Select
                            id="companyInput"
                            isMulti
                            options={companyOptions}
                            value={companyOptions.filter((option) =>
                              formik.values.company.includes(option.value)
                            )}
                            onChange={(selectedOptions) => {
                              const selectedValues = selectedOptions
                                ? selectedOptions.map((option) => option.value)
                                : [];
                              formik.setFieldValue("company", selectedValues);
                            }}
                            placeholder="Select companies..."
                            classNamePrefix="select"
                            styles={customStyles} // Apply custom styles
                          />
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
              </form>
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
                              <td>{user.Userfullname || "N/A"}</td>
                              <td>{user.Userlogin || "N/A"}</td>
                              <td>{Array.isArray(user.roles) ? user.roles.join(", ") : "No Roles"}</td>
                              <td>{Array.isArray(user.locations) ? user.locations.join(", ") : "No Locations"}</td>
                              <td>{Array.isArray(user.company) ? user.company.join(", ") : "N/A"}</td>
                              <td>{user.IsActive == 1 ? "Active" : "Inactive"}</td>
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
                      <ul className="pagination listjs-pagination mb-0"></ul>
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
        <DeleteModal
          show={deleteModal}
          onCloseClick={() => setDeleteModal(false)}
          onDeleteClick={handleDeleteConfirm}
        />
      </Container>
    </div>
  );
};

export default UserManagement;