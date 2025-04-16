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

const PermissionManagement = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  // Access Redux state
  const { loading, error, attendanceCode } = useSelector(
    (state) => state.AttendanceCode
  );
  const { attendanceGroup } = useSelector((state) => state.AttendanceGroup);

  

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      VCode: "",
      VName: "",
      SortOrder: 0,
      GroupID: "-1",
      CompanyID: "1",
      UID: "1",
      IsActive: false,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("name is required.")
        .min(3, "name must be at least 3 characters ")
        .max(30, "Code must be less then 30 characters"),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      // Add your form submission logic here
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
      };
    if (transformedValues.GroupID === -1) {
      transformedValues.GroupID === "";
    }
      if (editingGroup) {
        console.log("Editing Group", transformedValues);
        dispatch(
          updateAttendanceCode({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null); // Reset after submission
      } else {
        dispatch(submitAttendanceCode(transformedValues));
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
      dispatch(deleteAttendanceCode(deleteId));
    }
    setDeleteModal(false);
  };
  const handleEditClick = (group) => {
    setEditingGroup(group);
    formik.setValues({
      VCode: group.VCode,
      VName: group.VName,
      SortOrder: group.SortOrder,
      GroupID: group.GroupID,
      UID: group.UID,
      CompanyID: group.CompanyID,
      IsActive: group.IsActive === 1,
    });
  };
  document.title = "Permission Management | EMS";
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
                    title="Permission Management"
                    onCancel={formik.resetForm}
                  />
                  <CardBody className="card-body">
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
                              placeholder=" name    "
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
                              id="IsActive"
                              defaultChecked=""
                              {...formik.getFieldProps("IsActive")}
                              checked={formik.values.IsActive}
                            />
                            <Label className="form-check-label" for="IsActive">
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
                        className="table align-middle  table-nowrap table-striped table-sm "
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th className="" data-sort="name">
                              Name
                            </th>
                            <th className="" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {attendanceCode?.length > 0 ? (
                            attendanceCode.map((group, index) => (
                              <tr key={group.VID}>
                                <td>{group.VCode}</td>
                                <td>{group.VName}</td>
                                <td>
                                  {attendanceGroup?.data?.find(
                                    (groupItem) =>
                                      groupItem.VID === group.GroupID
                                  )?.VName || "N/A"}
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <div className="edit ">
                                      <Button
                                        className="btn btn-soft-info"
                                        onClick={() => handleEditClick(group)}
                                      >
                                        <i className="bx bx-edit"></i>
                                      </Button>
                                    </div>
                                    <div className="delete">
                                      <Button
                                        className="btn btn-soft-danger"
                                        onClick={() =>
                                          handleDeleteClick(group.VID)
                                        }
                                      >
                                        <i className="ri-delete-bin-2-line"></i>
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center">
                                No Permission found.
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
                            any orders for you search.
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

export default PermissionManagement;
