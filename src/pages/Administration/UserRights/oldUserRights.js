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
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import DeleteModal from "../../../Components/Common/DeleteModal";

const UserRights = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingRights, setEditingRights] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Admin"); // Default selected role
  const [checkedRoles, setCheckedRoles] = useState({});

  // Dummy roles for select box
  const dummyRoles = ["Admin", "User", "Guest"];

  // Roles for the sidebar table
  const roles = ["ACCOUNTS", "ADMIN", "EMPLOYEE", "HR", "SHOP"];

  // Sample pages data
  const pages = [
    { name: "MFileLogin", permissions: { View: true, Insert: true, Update: false, Delete: false, Backdate: false, Print: false } },
    { name: "MFileChangePassword", permissions: { View: true, Insert: true, Update: false, Delete: false, Backdate: false, Print: false } },
    { name: "MSetupSP1", permissions: { View: true, Insert: true, Update: false, Delete: false, Backdate: false, Print: false } },
    { name: "MSetupLocation", permissions: { View: false, Insert: false, Update: false, Delete: false, Backdate: false, Print: false } },
    { name: "MSetupDepartmentGroup", permissions: { View: false, Insert: false, Update: false, Delete: false, Backdate: false, Print: false } },
  ];

  // Filtered pages for the second table
  const filteredPages = [
    { name: "MFileChangePassword", permissions: { View: false, Insert: false, Update: false, Delete: false, Backdate: false, Print: false } },
    { name: "MSetupSP1", permissions: { View: false, Insert: false, Update: false, Delete: false, Backdate: false, Print: false } },
    { name: "MSetupLocation", permissions: { View: false, Insert: false, Update: false, Delete: false, Backdate: false, Print: false } },
  ];

  // Dummy user rights data mapped to dummyRoles
  const userRights = dummyRoles.map((role) => ({
    roleName: role,
    pages: pages.map((page) => ({
      pageName: page.name,
      permissions: {
        View: role === "Admin" ? page.permissions.View : role === "User" ? false : false,
        Insert: role === "Admin" ? page.permissions.Insert : role === "User" ? false : false,
        Update: role === "Admin" ? page.permissions.Update : role === "User" ? false : false,
        Delete: role === "Admin" ? page.permissions.Delete : role === "User" ? false : false,
        Backdate: role === "Admin" ? page.permissions.Backdate : role === "User" ? false : false,
        Print: role === "Admin" ? page.permissions.Print : role === "User" ? false : false,
      },
    })),
  }));

  const filteredUserRights = dummyRoles.map((role) => ({
    roleName: role,
    pages: filteredPages.map((page) => ({
      pageName: page.name,
      permissions: {
        View: role === "Admin" ? page.permissions.View : role === "User" ? true : false,
        Insert: role === "Admin" ? page.permissions.Insert : role === "User" ? true : false,
        Update: role === "Admin" ? page.permissions.Update : role === "User" ? true : false,
        Delete: role === "Admin" ? page.permissions.Delete : role === "User" ? true : false,
        Backdate: role === "Admin" ? page.permissions.Backdate : role === "User" ? true : false,
        Print: role === "Admin" ? page.permissions.Print : role === "User" ? true : false,
      },
    })),
  }));

  // Initialize checkedRoles state based on roles
  useEffect(() => {
    const initialCheckedRoles = roles.reduce((acc, role) => {
      acc[role] = role === "ADMIN"; // Default ADMIN as checked
      return acc;
    }, {});
    setCheckedRoles(initialCheckedRoles);
  }, []);

  useEffect(() => {
    // Placeholder for API calls
    // dispatch(getUserRoles());
    // dispatch(getUserRights());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      roleName: selectedRole || "",
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
      }
      formik.resetForm();
    },
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    formik.setFieldValue("roleName", role);
    const selectedRoleData = userRights.find((r) => r.roleName === role);
    if (selectedRoleData) {
      formik.setValues({
        roleName: role,
        pages: selectedRoleData.pages.reduce((acc, page) => {
          acc[page.pageName] = { ...page.permissions };
          return acc;
        }, {}),
      });
    }
  };

  const handleCheckboxChange = (role) => {
    setCheckedRoles((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
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
          {/* Role Select Box */}
          <Row className="mb-3">
            <Col md={3}>
              <Label htmlFor="roleSelect" className="form-label">
                Select User
              </Label>
              <Input
                type="select"
                className="form-select form-select-sm"
                id="roleSelect"
                value={selectedRole}
                onChange={(e) => handleRoleSelect(e.target.value)}
              >
                {dummyRoles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>

          <Row>
            {/* Left Sidebar for Roles with Table Structure */}
            <Col md={4} lg={3}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Roles Name</th>
                          <th>Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roles.map((role, index) => (
                          <tr key={index}>
                            <td>
                              <Button
                                color={selectedRole === role ? "primary" : "light"}
                                className="w-100 text-start"
                                // onClick={() => handleRoleSelect(role)}
                              >
                                {role}
                              </Button>
                            </td>
                            <td className="text-center">
                              <Input
                                type="checkbox"
                                checked={checkedRoles[role] || false}
                                onChange={() => handleCheckboxChange(role)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Right Section */}
            <Col md={8} lg={9}>
              {/* Top Portion: Role Selection Form */}
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader
                    title="User Rights"
                    onCancel={formik.resetForm}
                  />
                </Form>
              </Card>

              {/* First Table: Permissions for Selected Role */}
              <Card>
                <CardBody>
                  <div className="table-responsive table-card mb-1">
                    <table className="table align-middle table-nowrap table-striped table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Page Name</th>
                          <th>View</th>
                          <th>Insert</th>
                          <th>Update</th>
                          <th>Delete</th>
                          <th>Backdate</th>
                          <th>Print</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userRights
                          .find((role) => role.roleName === selectedRole)
                          ?.pages.map((page, index) => (
                            <tr key={index}>
                              <td>{page.pageName}</td>
                              <td>
                                <Input
                                  type="checkbox"
                                  checked={page.permissions.View}
                                  onChange={() => {
                                    // Update permissions logic (to be implemented with real API)
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
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>

              {/* Second Table: Filtered Permissions */}
              <Card>
                <CardBody>
                  <div className="table-responsive table-card mb-1">
                    <table className="table align-middle table-nowrap table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Page Name</th>
                          <th>View</th>
                          <th>Insert</th>
                          <th>Update</th>
                          <th>Delete</th>
                          <th>Backdate</th>
                          <th>Print</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUserRights
                          .find((role) => role.roleName === selectedRole)
                          ?.pages.map((page, index) => (
                            <tr key={index}>
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
                            </tr>
                          ))}
                      </tbody>
                    </table>
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