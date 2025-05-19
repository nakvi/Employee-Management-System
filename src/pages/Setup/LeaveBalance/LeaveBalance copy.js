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
import { format } from "date-fns";
import { Link } from "react-router-dom";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { getAttendanceGroup } from "../../../slices/setup/attendanceGroup/thunk";
import {
  deleteLeaveBalance,
  getLeaveBalance,
  submitLeaveBalance,
  updateLeaveBalance,
} from "../../../slices/setup/leaveBalance/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";

const LeaveBalance = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  // Access Redux state
  const { loading, error, leaveBalance } = useSelector(
    (state) => state.LeaveBalance
  );
  const { attendanceGroup } = useSelector((state) => state.AttendanceGroup);
  const { location } = useSelector((state) => state.Location);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getLeaveBalance());
    dispatch(getAttendanceGroup());
    dispatch(getLocation());
  }, [dispatch]);
  const formik = useFormik({
    initialValues: {
      VName: "",
      AttGroupID: "-1",
      DateFrom: "",
      DateTo: "",
      LeaveLimit: "",
      LocationID: "-1",  // Default to "-1"
      CompanyID: "1",
      UID: "1",
      IsActive: false,
    },
    validationSchema: Yup.object({
      VName: Yup.string()
        .required("Title is required.")
        .min(3, "Title at least must be 3 characters "),
        DateFrom: Yup.date()
        .required("Start date is required."),
      DateTo: Yup.date()
        .required("End date is required.")
        .min(Yup.ref("DateFrom"), "End date must be later than Start date."),
      LeaveLimit: Yup.number()
        .typeError("Leave limit must be a number.")
        .required("Leave limit is required."),
      // AttGroupID: Yup.number().required("Attendance Group is required."),
      AttGroupID: Yup.string()
      .test("is-valid-leave-type", "Attendance Group is required.", (value) => value !== "-1"),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      // Add your form submission logic here
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
      };
          // Remove LocationID if it's "-1" (default/unselected)
    if (transformedValues.LocationID === -1) {
      transformedValues.LocationID === "";
    }
      if (editingGroup) {
        console.log("Editing Group", transformedValues);
        dispatch(
          updateLeaveBalance({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null); // Reset after submission
      } else {
        dispatch(submitLeaveBalance(transformedValues));
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
      dispatch(deleteLeaveBalance(deleteId));
    }
    setDeleteModal(false);
  };
  const handleEditClick = (group) => {
    setEditingGroup(group);
    const formatDateForInput = (dateString) => {
      return dateString ? dateString.split("T")[0] : ""; // Extract YYYY-MM-DD part
    };   
     formik.setValues({
      VName: group.VName,
      AttGroupID: group.AttGroupID,
      DateFrom: formatDateForInput(group.DateFrom),
      DateTo: formatDateForInput(group.DateTo),
      LeaveLimit: group.LeaveLimit,
      LocationID: group.LocationID,
      UID: group.UID,
      CompanyID: group.CompanyID,
      IsActive: group.IsActive === 1,
    });
  };
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };
 
  document.title = "Leave Balance | EMS";
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
                    title="Leave Balance"
                    onCancel={formik.resetForm}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Attendance Group
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                              {...formik.getFieldProps("AttGroupID")}
                            >
                              <option value="-1" >
                                ---Select---
                              </option>
                              {attendanceGroup?.data?.length > 0 ? (
                                attendanceGroup.data.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>
                                  No groups available
                                </option>
                              )}
                            </select>
                            {formik.touched.AttGroupID &&
                            formik.errors.AttGroupID ? (
                              <div className="text-danger">
                                {formik.errors.AttGroupID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="LeaveLimit" className="form-label">
                              Leave Limit
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="LeaveLimit"
                              placeholder="Leave Limit"
                              {...formik.getFieldProps("LeaveLimit")}
                            />
                            {formik.touched.LeaveLimit &&
                            formik.errors.LeaveLimit ? (
                              <div className="text-danger">
                                {formik.errors.LeaveLimit}
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
                          <div className="mb-3">
                            <Label htmlFor="LocationID" className="form-label">
                            Location
                            </Label>
                            <select
                              name="LocationID"
                              id="LocationID"
                              className="form-select form-select-sm"
                              value={formik.values.LocationID} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1" >
                                ---Select---
                              </option>
                              {location?.length > 0 ? (
                                location.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No location available
                                </option>
                              )}
                            </select>
                            {formik.touched.LocationID && formik.errors.LocationID ? (
                              <div className="text-danger">
                                {formik.errors.LocationID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Date From
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                              {...formik.getFieldProps("DateFrom")}
                            />
                            {formik.touched.DateFrom &&
                            formik.errors.DateFrom ? (
                              <div className="text-danger">
                                {formik.errors.DateFrom}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="DateTo" className="form-label">
                              Date To
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateTo"
                              {...formik.getFieldProps("DateTo")}
                             

                            />
                            {formik.touched.DateTo && formik.errors.DateTo ? (
                              <div className="text-danger">
                                {formik.errors.DateTo}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2} className="mt-4">
                          <div
                            className="form-check form-switch mt-3 "
                            dir="ltr"
                          >
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
                    <Row className="g-4 mb-3">
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

                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap table-sm"
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                          <th className="" data-sort="sorting">
                              Attendance Group
                            </th>
                            <th className="" data-sort="sorting">
                              Leave Limit
                            </th>
                            <th className="" data-sort="title">
                              Title
                            </th>
                            <th className="" data-sort="location">
                              Location
                            </th>
                            
                            <th className="" data-sort="sorting">
                              Date From
                            </th>
                            <th className="" data-sort="sorting">
                              Date To
                            </th>
                            <th className="" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {leaveBalance?.length > 0 ? (
                            leaveBalance.map((group, index) => (
                              <tr key={group.VID}>
                                  <td>
                                  {attendanceGroup?.data?.find(
                                    (groupItem) =>
                                      groupItem.VID === group.AttGroupID
                                  )?.VName || "N/A"}
                                </td>
                                <td>{group.LeaveLimit}</td>
                                <td>{group.VName}</td>
                                <td>
                                  {location?.find(
                                    (groupItem) => groupItem.VID === group.LocationID
                                  )?.VName || ""}
                                </td>
                                <td>{formatDate(group.DateFrom)}</td>
                                <td>{formatDate(group.DateTo)}</td>
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
                                No leave Balance found.
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

export default LeaveBalance;
