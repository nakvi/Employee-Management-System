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
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import DeleteModal from "../../../Components/Common/DeleteModal";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import {
  deleteLateComingExemptAttendance,
  getLateComingExemptAttendance,
  submitLateComingExemptAttendance,
  updateLateComingExemptAttendance,
} from "../../../slices/Attendance/lateComingExemptAttendance/thunk";

const LateComingExemptAttendance = () => {
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  // redux to get data from state
  const { loading, error, lateComingExemptAttendance } = useSelector(
    (state) => state.LateComingExemptAttendance
  );
  const { location = [] } = useSelector((state) => state.Location || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { employeeType = [] } = useSelector(
    (state) => state.EmployeeType || {}
  );
  const { employee = {} } = useSelector((state) => state.Employee || {});
  useEffect(() => {
    dispatch(getLocation());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getDepartment());
    dispatch(getLateComingExemptAttendance());
  }, [dispatch]);
  // form
  const formik = useFormik({
    initialValues: {
      EmpID: "",
      ETypeID: "",
      VDate: "",
      DeptID: "",
      LocationID: 0,
      VName: "",
      UID: 501,
      CompanyID: "1001",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      VName: Yup.string().required("Remarks is required"),
      DeptID: Yup.number()
        .min(1, "Department is required")
        .required("Required"),
      LocationID: Yup.number()
        .min(1, "Location is required")
        .required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      VDate: Yup.date().required("Date is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (editingGroup) {
          await dispatch(
            updateLateComingExemptAttendance({
              ...values,
              VID: editingGroup.VID,
            })
          );
          setEditingGroup(null); // Reset editingGroup to switch back to "add" mode
        } else {
          await dispatch(submitLateComingExemptAttendance(values));
        }
        formik.resetForm(); // Reset the form fields
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
  });
  // Handle edit click
  const handleEditClick = (group) => {
    // Find the employee record to get the ETypeID
    const selectedEmployee = employee.find(
      (emp) => String(emp.EmpID) === String(group.EmpID)
    );
    const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";
    setEditingGroup(group);
    formik.setValues({
      EmpID: group.EmpID,
      ETypeID: employeeTypeId,
      LocationID: group.LocationID,
      VID: group.VID,
      VName: group.VName,
      DeptID: group.DeptID,
      LeaveTypeID: group.LeaveTypeID,
      VDate: group.VDate.split("T")[0],
      UID: 202,
      CompanyID: 3001,
      Tranzdatetime: "2025-04-24T10:19:32.099586Z",
    });
  };
  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteLateComingExemptAttendance(deleteId));
    }
    setDeleteModal(false);
  };
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };
  document.title = "Late Coming Exempt | EMS";
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
                    title="Late Coming Exempt Attendance"
                    onCancel={formik.resetForm}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="ETypeID" className="form-label">
                              E-Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="ETypeID"
                              id="ETypeID"
                              value={formik.values.ETypeID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {employeeType.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.ETypeID && formik.errors.ETypeID ? (
                              <div className="text-danger">
                                {formik.errors.ETypeID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div className="mb-3">
                            <Label htmlFor="EmpID" className="form-label">
                              Employee
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="EmpID"
                              id="EmpID"
                              value={formik.values.EmpID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              disabled={!formik.values.ETypeID}
                            >
                              <option value="">---Select---</option>
                              {employee
                                .filter(
                                  (emp) =>
                                    emp.ETypeID ===
                                    parseInt(formik.values.ETypeID)
                                )
                                .map((item) => (
                                  <option key={item.EmpID} value={item.EmpID}>
                                    {item.EName}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.EmpID && formik.errors.EmpID ? (
                              <div className="text-danger">
                                {formik.errors.EmpID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="LocationID" className="form-label">
                              Location
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="LocationID"
                              id="LocationID"
                              value={formik.values.LocationID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select--- </option>
                              {location.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.LocationID &&
                            formik.errors.LocationID ? (
                              <div className="text-danger">
                                {formik.errors.LocationID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="DeptID" className="form-label">
                              Department
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="DeptID"
                              id="DeptID"
                              value={formik.values.DeptID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="-1">---Select---</option>
                              {departmentList.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.DeptID && formik.errors.DeptID ? (
                              <div className="text-danger">
                                {formik.errors.DeptID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VDate" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VDate"
                              name="VDate"
                              {...formik.getFieldProps("VDate")}
                            />
                            {formik.touched.VDate && formik.errors.VDate ? (
                              <div className="text-danger">
                                {formik.errors.VDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={6}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Remarks
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              name="VName"
                              placeholder="Remarks"
                              {...formik.getFieldProps("VName")}
                            />
                            {formik.touched.VName && formik.errors.VName ? (
                              <div className="text-danger">
                                {formik.errors.VName}
                              </div>
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
                            <th>Employee</th>
                            <th>Location </th>
                            <th>Department</th>
                            <th>Date</th>
                            <th>Remarks</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {lateComingExemptAttendance?.length > 0 ? (
                            lateComingExemptAttendance.map((group) => (
                              <tr key={group.VID}>
                                <td>
                                  {employee.find(
                                    (emp) =>
                                      String(emp.EmpID) === String(group.EmpID)
                                  )?.EName || "N/A"}
                                </td>
                                <td>
                                  {location.find(
                                    (row) => row.VID === group.LocationID
                                  )?.VName || "N/A"}
                                </td>
                                <td>
                                  {departmentList.find(
                                    (row) => row.VID === group.DeptID
                                  )?.VName || "N/A"}
                                </td>
                                <td>{formatDate(group.VDate)}</td>
                                <td>{group.VName}</td>
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
                              <td colSpan="11" className="text-center">
                                No Late Coming Exempt Attendance found.
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

export default LateComingExemptAttendance;
