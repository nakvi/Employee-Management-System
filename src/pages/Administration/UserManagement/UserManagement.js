import React, { useState, useEffect, useRef } from "react";
import { Button, Card, CardBody, Col, Container, Row, Input, Label } from "reactstrap";
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
import {
  getSecUserCompany,
  submitSecUserCompany,
  updateSecUserCompany,
  deleteSecUserCompany,
} from "../../../slices/administration/secUserCompany/thunk";
import {
  getSecUserLocation,
  submitSecUserLocation,
  updateSecUserLocation,
  deleteSecUserLocation,
} from "../../../slices/administration/secUserLocation/thunk";
import {
  getSecUserRole,
  submitSecUserRole,
  updateSecUserRole,
  deleteSecUserRole,
} from "../../../slices/administration/secUserRole/thunk";
import { getRole } from "../../../slices/administration/roles/thunk";
import { getCompany } from "../../../slices/setup/company/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import Select from "react-select";

const UserManagement = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const formRef = useRef(null);

  const { loading = false, error = null, users = [] } = useSelector((state) => state.User || {});
  const { role = [] } = useSelector((state) => {
    console.log('Redux state:', state); // Debug state
    return state.Role || {};
  });
  const { company = { data: [] } } = useSelector((state) => state.Company || {});
  const { location = [] } = useSelector((state) => state.Location || {});
  const { secUserCompany = [] } = useSelector((state) => state.SecUserCompany || {});
  const { secUserLocation = [] } = useSelector((state) => state.SecUserLocation || {});
  const { secUserRole = [] } = useSelector((state) => state.SecUserRole || {});

  const customStyles = {
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  const roleOptions = role && Array.isArray(role) ? role.map((r) => ({ value: r.VName, label: r.VName, VID: r.VID })) : [];
  const locationOptions = location && Array.isArray(location) ? location.map((loc) => ({ value: loc.VName, label: loc.VName, VID: loc.VID })) : [];
  const companyOptions = company?.data && Array.isArray(company.data)
    ? company.data.map((comp) => ({ value: { VName: comp.VName, VID: comp.VID }, label: comp.VName }))
    : [];

  useEffect(() => {
    dispatch(getUser());
    dispatch(getRole());
    dispatch(getCompany());
    dispatch(getLocation());
    dispatch(getSecUserCompany());
    dispatch(getSecUserLocation());
    dispatch(getSecUserRole());
  }, [dispatch]);

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
      loginExpiry: "18/06/2025",
      isActive: false,
      allowAudit: false,
      allowActual: false,
      isAdmin: false,
      adminReportRights: false,
      isManager: false,
    },
    validationSchema: Yup.object({
      employee: Yup.string().required("Employee is required"),
      fullName: Yup.string().required("Full Name is required"),
      login: Yup.string().required("User Login is required"),
      password: Yup.string().required("Password is required"),
      roles: Yup.array().min(1, "At least one role is required"),
      locations: Yup.array().min(1, "At least one location is required"),
      company: Yup.array().min(1, "At least one company is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const companyIds = Array.isArray(values.company)
        ? values.company.map((comp) => comp.VID).filter((id) => id)
        : [];
      const roleIds = Array.isArray(values.roles)
        ? values.roles.map((roleName) => {
            const roleOption = roleOptions.find((r) => r.value === roleName);
            return roleOption ? roleOption.VID : null;
          }).filter((id) => id)
        : [];
      const locationIds = Array.isArray(values.locations)
        ? values.locations.map((locName) => {
            const loc = locationOptions.find((l) => l.value === locName);
            return loc ? loc.VID : null;
          }).filter((id) => id)
        : [];

      const userPayload = {
        Userfullname: values.fullName,
        Userlogin: values.login,
        Userpassword: values.password,
        EmployeeID: values.employee.split(":")[0],
        AllowAudit: values.allowAudit ? 1 : 0,
        AllowActual: values.allowActual ? 1 : 0,
        IsManager: values.isManager ? 1 : 0,
        IsAdmin: values.isAdmin ? 1 : 0,
        IsSystemAdmin: values.adminReportRights ? 1 : 0,
        IsActive: values.isActive ? 1 : 0,
        UID: 1,
        CompanyID: companyIds[0] || 1,
        roles: values.roles,
        locations: values.locations,
      };

      let userId;
      try {
        setSubmissionError(null);
        if (editingUser) {
          const updateResponse = await dispatch(updateUser({ ...userPayload, UserID: editingUser.UserID }));
          if (updateResponse.error) throw new Error(updateResponse.payload?.message || "Failed to update user");
          userId = editingUser.UserID;

          // Handle secUserCompany updates
          const existingCompanies = secUserCompany.filter((suc) => suc.UserID === userId);
          for (const existing of existingCompanies) {
            if (!companyIds.includes(existing.CompanyID)) {
              await dispatch(deleteSecUserCompany(existing.ID));
            }
          }
          for (const companyId of companyIds) {
            const existingRecord = existingCompanies.find((ec) => ec.CompanyID === companyId);
            if (!existingRecord) {
              await dispatch(submitSecUserCompany({ UserID: userId, CompanyID: companyId, UID: 1, IsActive: 1 }));
            } else if (existingRecord.IsActive !== 1) {
              await dispatch(updateSecUserCompany({ ID: existingRecord.ID, UserID: userId, CompanyID: companyId, UID: 1, IsActive: 1 }));
            }
          }

          // Handle secUserRole updates
          const existingRoles = secUserRole.filter((sur) => sur.UserID === userId);
          for (const existing of existingRoles) {
            if (!roleIds.includes(existing.RoleID)) {
              await dispatch(deleteSecUserRole(existing.ID));
            }
          }
          for (const roleId of roleIds) {
            const existingRecord = existingRoles.find((er) => er.RoleID === roleId);
            if (!existingRecord) {
              await dispatch(submitSecUserRole({ 
                UserID: userId, 
                RoleID: roleId, 
                UID: 1, 
                IsActive: 1, 
                CompanyID: companyIds[0] || null 
              }));
            } else if (existingRecord.IsActive !== 1) {
              await dispatch(updateSecUserRole({ 
                ID: existingRecord.ID, 
                UserID: userId, 
                RoleID: roleId, 
                UID: 1, 
                IsActive: 1, 
                CompanyID: companyIds[0] || null 
              }));
            }
          }

          // Handle secUserLocation updates
          const existingLocations = secUserLocation.filter((sul) => sul.UserID === userId);
          for (const existing of existingLocations) {
            if (!locationIds.includes(existing.LocationID)) {
              await dispatch(deleteSecUserLocation(existing.ID));
            }
          }
          for (const locationId of locationIds) {
            const existingRecord = existingLocations.find((el) => el.LocationID === locationId);
            if (!existingRecord) {
              await dispatch(submitSecUserLocation({ 
                UserID: userId, 
                LocationID: locationId, 
                UID: 1, 
                IsActive: 1, 
                CompanyID: companyIds[0] || null 
              }));
            } else if (existingRecord.IsActive !== 1) {
              await dispatch(updateSecUserLocation({ 
                ID: existingRecord.ID, 
                UserID: userId, 
                LocationID: locationId, 
                UID: 1, 
                IsActive: 1, 
                CompanyID: companyIds[0] || null 
              }));
            }
          }
        } else {
          const submitResponse = await dispatch(submitUser(userPayload));
          if (submitResponse.error) throw new Error(submitResponse.payload?.message || "Failed to create user");
          userId = submitResponse.payload?.UserID;
          if (userId) {
            // Create secUserCompany records
            for (const companyId of companyIds) {
              await dispatch(submitSecUserCompany({ UserID: userId, CompanyID: companyId, UID: 1, IsActive: 1 }));
            }
            // Create secUserRole records
            for (const roleId of roleIds) {
              await dispatch(submitSecUserRole({ 
                UserID: userId, 
                RoleID: roleId, 
                UID: 1, 
                IsActive: 1, 
                CompanyID: companyIds[0] || null 
              }));
            }
            // Create secUserLocation records
            for (const locationId of locationIds) {
              await dispatch(submitSecUserLocation({ 
                UserID: userId, 
                LocationID: locationId, 
                UID: 1, 
                IsActive: 1, 
                CompanyID: companyIds[0] || null 
              }));
            }
          } else {
            throw new Error("Failed to create user: No UserID returned");
          }
        }

        await Promise.all([
          dispatch(getUser()),
          dispatch(getSecUserCompany()),
          dispatch(getSecUserRole()),
          dispatch(getSecUserLocation())
        ]);
        formik.resetForm();
        setEditingUser(null);
      } catch (error) {
        setSubmissionError(error.message || "Failed to save user data");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        const userCompanies = secUserCompany.filter((suc) => suc.UserID === deleteId);
        for (const uc of userCompanies) {
          await dispatch(deleteSecUserCompany(uc.ID));
        }
        const userRoles = secUserRole.filter((sur) => sur.UserID === deleteId);
        for (const ur of userRoles) {
          await dispatch(deleteSecUserRole(ur.ID));
        }
        const userLocations = secUserLocation.filter((sul) => sul.UserID === deleteId);
        for (const ul of userLocations) {
          await dispatch(deleteSecUserLocation(ul.ID));
        }
        await dispatch(deleteUser(deleteId));
        await Promise.all([
          dispatch(getUser()),
          dispatch(getSecUserCompany()),
          dispatch(getSecUserRole()),
          dispatch(getSecUserLocation())
        ]);
      } catch (error) {
        setSubmissionError("Failed to delete user");
      }
    }
    setDeleteModal(false);
  };

  const handleEditClick = (user) => {
    if (!user || !user.UserID) return;
    setEditingUser(user);

    // Map roles from secUserRole
    const userRoles = secUserRole
      .filter((sur) => sur.UserID === user.UserID && sur.IsActive === 1)
      .map((sur) => {
        const roleOption = roleOptions.find((r) => r.VID === sur.RoleID);
        return roleOption ? { value: roleOption.value, label: roleOption.label } : null;
      })
      .filter((role) => role);

    // Map locations from secUserLocation
    const userLocations = secUserLocation
      .filter((sul) => sul.UserID === user.UserID && sul.IsActive === 1)
      .map((sul) => {
        const loc = locationOptions.find((l) => l.VID === sul.LocationID);
        return loc ? { value: loc.value, label: loc.label } : null;
      })
      .filter((loc) => loc);

    // Map companies from secUserCompany
    const userCompanies = secUserCompany
      .filter((suc) => suc.UserID === user.UserID && suc.IsActive === 1)
      .map((suc) => {
        const comp = company.data.find((c) => c.VID === suc.CompanyID);
        return comp ? { value: { VName: comp.VName, VID: comp.VID }, label: comp.VName } : null;
      })
      .filter((comp) => comp);

    formik.setValues({
      employeeType: user.EmployeeType || "",
      employee: user.EmployeeID ? `${user.EmployeeID}:${user.Userfullname || ''}:Hr` : "",
      fullName: user.Userfullname || "",
      login: user.Userlogin || "",
      password: user.Userpassword || "",
      roles: userRoles.map((r) => r.value),
      locations: userLocations.map((l) => l.value),
      company: userCompanies.map((c) => c.value),
      loginExpiry: user.LoginExpiry || "18/06/2025",
      isActive: user.IsActive === 1,
      allowAudit: user.AllowAudit === 1,
      allowActual: user.AllowActual === 1,
      isAdmin: user.IsAdmin === 1,
      adminReportRights: user.IsSystemAdmin === 1,
      isManager: user.IsManager === 1,
    });
  };

  document.title = "User Management | EMS";

  return (
    <div className="page-content">
      <Container fluid>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        {submissionError && <p className="text-danger">{submissionError}</p>}
        <Row>
          <Col lg={12}>
            <Card>
              <form ref={formRef} onSubmit={formik.handleSubmit}>
                <PreviewCardHeader
                  title="User Management"
                  onCancel={() => {
                    formik.resetForm();
                    setEditingUser(null);
                    setSubmissionError(null);
                  }}
                />
                <CardBody className="card-body">
                  <div className="live-preview">
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
                            value={roleOptions.filter((option) => formik.values.roles.includes(option.value))}
                            onChange={(selectedOptions) => {
                              formik.setFieldValue("roles", selectedOptions.map((option) => option.value));
                            }}
                            placeholder="Select roles..."
                            classNamePrefix="select"
                            isDisabled={loading}
                            styles={customStyles}
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
                            value={locationOptions.filter((option) => formik.values.locations.includes(option.value))}
                            onChange={(selectedOptions) => {
                              formik.setFieldValue("locations", selectedOptions.map((option) => option.value));
                            }}
                            placeholder="Select locations..."
                            classNamePrefix="select"
                            styles={customStyles}
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
                              Array.isArray(formik.values.company) && formik.values.company.some((comp) => comp?.VID === option.value.VID)
                            )}
                            onChange={(selectedOptions) => {
                              formik.setFieldValue("company", selectedOptions.map((option) => option.value));
                            }}
                            placeholder="Select companies..."
                            classNamePrefix="select"
                            styles={customStyles}
                          />
                          {formik.touched.company && formik.errors.company ? (
                            <div className="text-danger">{formik.errors.company}</div>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
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
                      <Col xxl={2} md={2}>
                        <div className="form-check form-switch mt-4">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="isManager"
                            name="isManager"
                            onChange={formik.handleChange}
                            checked={formik.values.isManager}
                          />
                          <Label className="form-check-label" htmlFor="isManager">
                            Is Manager
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
                          <input type="text" className="form-control-sm search" placeholder="" />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="table-responsive table-card mb-1">
                    <table className="table align-middle table-nowrap table-striped table-sm" id="customerTable">
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
                        {Array.isArray(users) && users.length > 0 ? (
                          users
                            .filter((user) => user && typeof user === "object" && user.UserID)
                            .map((user) => {
                              // Map roles for display
                              const userRoles = secUserRole
                                .filter((sur) => sur.UserID === user.UserID && sur.IsActive === 1)
                                .map((sur) => {
                                  const roleItem = role.find((r) => r.VID === sur.RoleID);
                                  return roleItem ? roleItem.VName : null;
                                })
                                .filter((name) => name)
                                .join(", ") || "No Roles";

                              // Map locations for display
                              const userLocations = secUserLocation
                                .filter((sul) => sul.UserID === user.UserID && sul.IsActive === 1)
                                .map((sul) => {
                                  const loc = location.find((l) => l.VID === sul.LocationID);
                                  return loc ? loc.VName : null;
                                })
                                .filter((name) => name)
                                .join(", ") || "No Locations";

                              // Map companies for display
                              const userCompanies = Array.isArray(secUserCompany)
                                ? secUserCompany
                                    .filter((suc) => suc.UserID === user.UserID && suc.IsActive === 1)
                                    .map((suc) => {
                                      const comp = Array.isArray(company.data) ? company.data.find((c) => c.VID === suc.CompanyID) : null;
                                      return comp ? comp.VName : null;
                                    })
                                    .filter((name) => name)
                                    .join(", ") || "No Companies"
                                : "No Companies";

                              return (
                                <tr key={user.UserID}>
                                  <td>{user.Userfullname || "N/A"}</td>
                                  <td>{user.Userlogin || "N/A"}</td>
                                  <td>{userRoles}</td>
                                  <td>{userLocations}</td>
                                  <td>{userCompanies}</td>
                                  <td>{user.IsActive === 1 ? "Active" : "Inactive"}</td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <Button className="btn btn-soft-info btn-sm" onClick={() => handleEditClick(user)}>
                                        <i className="bx bx-edit"></i>
                                      </Button>
                                      <Button className="btn btn-soft-danger btn-sm" onClick={() => handleDeleteClick(user.UserID)}>
                                        <i className="ri-delete-bin-2-line"></i>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
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
                      <Link className="page-item pagination-prev disabled" to="#">
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
        <DeleteModal show={deleteModal} onCloseClick={() => setDeleteModal(false)} onDeleteClick={handleDeleteConfirm} />
      </Container>
    </div>
  );
};

export default UserManagement;