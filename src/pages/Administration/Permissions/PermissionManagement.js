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
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

// Dummy data for permissions
const initialPermissions = [
  { id: 1, name: "Permission 1", isActive: true },
  { id: 2, name: "Permission 2", isActive: false },
  { id: 3, name: "Permission 3", isActive: true },
];

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [editingPermission, setEditingPermission] = useState(null);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      name: "",
      isActive: false,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required.")
        .min(3, "Name must be at least 3 characters")
        .max(30, "Name must be less than 30 characters"),
      isActive: Yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      if (editingPermission) {
        // Edit existing permission
        setPermissions(
          permissions.map((perm) =>
            perm.id === editingPermission.id
              ? { ...perm, name: values.name, isActive: values.isActive }
              : perm
          )
        );
        setEditingPermission(null);
      } else {
        // Add new permission
        const newPermission = {
          id: permissions.length + 1,
          name: values.name,
          isActive: values.isActive,
        };
        setPermissions([...permissions, newPermission]);
      }
      resetForm();
    },
  });

  // Handle edit
  const handleEditClick = (permission) => {
    setEditingPermission(permission);
    formik.setValues({
      name: permission.name,
      isActive: permission.isActive,
    });
  };

  // Handle delete
  const handleDeleteClick = (id) => {
    setPermissions(permissions.filter((perm) => perm.id !== id));
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingPermission(null);
    formik.resetForm();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <form onSubmit={formik.handleSubmit}>
                  <CardBody className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="card-title mb-0">Permission Management</h4>
                      <div>
                        <Button
                          type="submit"
                          color="success"
                          className="me-2"
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          color="dark"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={3} md={4}>
                          <div>
                            <Label htmlFor="name" className="form-label">
                              Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="name"
                              placeholder="name"
                              {...formik.getFieldProps("name")}
                            />
                            {formik.touched.name && formik.errors.name ? (
                              <div className="text-danger">
                                {formik.errors.name}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check form-switch mt-4" dir="ltr">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="isActive"
                              {...formik.getFieldProps("isActive")}
                              checked={formik.values.isActive}
                            />
                            <Label className="form-check-label" htmlFor="isActive">
                              IsActive
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
                          <div className="search-box ms-2 position-relative">
                            <Input
                              type="text"
                              className="form-control-sm"
                              placeholder="Search permissions..."
                              style={{
                                paddingLeft: "30px",
                                border: "1px solid #e7f0fa",
                                borderRadius: "5px",
                              }}
                            />
                            <i
                              className="ri-search-line"
                              style={{
                                position: "absolute",
                                left: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#6c757d",
                              }}
                            ></i>
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
                            <th data-sort="name">Name</th>
                            <th data-sort="action">Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {permissions.length > 0 ? (
                            permissions.map((permission) => (
                              <tr key={permission.id}>
                                <td>{permission.name}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <Button
                                      className="btn btn-soft-info btn-sm"
                                      onClick={() => handleEditClick(permission)}
                                    >
                                      <i className="bx bx-edit"></i>
                                    </Button>
                                    <Button
                                      className="btn btn-soft-danger btn-sm"
                                      onClick={() => handleDeleteClick(permission.id)}
                                    >
                                      <i className="ri-delete-bin-2-line"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="2" className="text-center">
                                No Permission found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-end">
                      <div className="pagination-wrap hstack gap-2">
                        <Button
                          style={{
                            backgroundColor: "#fff",
                            color: "#6c757d",
                            border: "1px solid #e7f0fa",
                            borderRadius: "5px",
                            padding: "6px 12px",
                          }}
                          disabled
                        >
                          Previous
                        </Button>
                        <Button
                          style={{
                            backgroundColor: "#fff",
                            color: "#6c757d",
                            border: "1px solid #e7f0fa",
                            borderRadius: "5px",
                            padding: "6px 12px",
                          }}
                          disabled
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PermissionManagement;