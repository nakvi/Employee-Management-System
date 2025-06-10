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
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { getLeaveType } from "../../../slices/Attendance/leaveType/thunk";
import {
  deleteLeave,
  getLeave,
  submitLeave,
  updateLeave,
} from "../../../slices/Attendance/leave/thunk";

const Leaves = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  // redux to get data from state
  const { loading, error, leaves } = useSelector((state) => state.Leave);
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { employeeType = [] } = useSelector(
    (state) => state.EmployeeType || {}
  );
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { leaveType } = useSelector((state) => state.LeaveType);

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getLeaveType());
    dispatch(getLeave());
  }, [dispatch]);

  // form
  const formik = useFormik({
    initialValues: {
      EmpID: "",
      ETypeID: "",
      LeaveTypeID: "",
      VNo: "",
      DateFrom: "",
      VName: "",
      DateTo: "",
      LocationID: 0,
      UID: 501,
      CompanyID: "1001",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      VName: Yup.string().required("Remarks is required"),
      LeaveTypeID: Yup.number()
        .min(1, "Leave is required")
        .required("Required"),
      VNo: Yup.string().required("Leave No is required"),
      DateFrom: Yup.date().required("Date is required"),
      DateTo: Yup.date().required("Date is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (editingGroup) {
          await dispatch(
            updateLeave({...values,VID: editingGroup.VID,})).unwrap();
        } else {
          await dispatch(submitLeave(values)).unwrap();
        }

        // Only runs if the above dispatch is successful
        formik.resetForm();
      } catch (error) {
        // Error already handled by toast in the thunk
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
      VID: group.VID,
      EmpID: group.EmpID,
      ETypeID: employeeTypeId,
      LeaveTypeID: group.LeaveTypeID,
      VNo: group.VNo,
      DateFrom: group.DateFrom.split("T")[0],
      DateTo: group.DateTo.split("T")[0],
      VName: group.VName,
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
      dispatch(deleteLeave(deleteId));
    }
    setDeleteModal(false);
  };
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };
  document.title = "Leave | EMS";
  return (
    <React.Fragment>
      {/* Inline CSS */}
      <style>
        {`
          .table-sm > :not(caption) > * > * {
            padding: 0px;
          }
        `}
      </style>
      <div className="page-content">
        <Container fluid>
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader
                    title="Leave"
                    onCancel={formik.resetForm}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row>
                        {/* First Grid */}
                        <Col lg={12}>
                          <Row className="gy-4">
                            <Col xxl={2} md={3}>
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
                                {formik.touched.ETypeID &&
                                formik.errors.ETypeID ? (
                                  <div className="text-danger">
                                    {formik.errors.ETypeID}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            <Col xxl={2} md={3}>
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
                                      <option
                                        key={item.EmpID}
                                        value={item.EmpID}
                                      >
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
                            <Col xxl={2} md={3}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="LeaveTypeID"
                                  className="form-label"
                                >
                                  Leave Type
                                </Label>
                                <select
                                  className="form-select  form-select-sm"
                                  name="LeaveTypeID"
                                  id="LeaveTypeID"
                                  value={formik.values.LeaveTypeID}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">---Select---</option>
                                  {leaveType.map((item) => (
                                    <option key={item.VID} value={item.VID}>
                                      {item.VName}
                                    </option>
                                  ))}
                                </select>
                                {formik.touched.LeaveTypeID &&
                                formik.errors.LeaveTypeID ? (
                                  <div className="text-danger">
                                    {formik.errors.LeaveTypeID}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="VNo" className="form-label">
                                  Leave No
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="VNo"
                                  placeholder="Leave No"
                                  {...formik.getFieldProps("VNo")}
                                />
                                {formik.touched.VNo && formik.errors.VNo ? (
                                  <div className="text-danger">
                                    {formik.errors.VNo}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="DateFrom"
                                  className="form-label"
                                >
                                  Date From
                                </Label>
                                <Input
                                  type="date"
                                  className="form-control-sm"
                                  id="DateFrom"
                                  name="DateFrom"
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
                                  name="DateTo"
                                  {...formik.getFieldProps("DateTo")}
                                />
                                {formik.touched.DateTo &&
                                formik.errors.DateTo ? (
                                  <div className="text-danger">
                                    {formik.errors.DateTo}
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
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>
            <Col lg={9}>
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
                            <th>Leave Type</th>
                            <th>Date From</th>
                            <th>Date To</th>
                            <th>Laeve No</th>
                            <th>Remarks</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {leaves?.length > 0 ? (
                            leaves.map((group) => (
                              <tr key={group.VID}>
                                <td>
                                  {employee.find(
                                    (emp) =>
                                      String(emp.EmpID) === String(group.EmpID)
                                  )?.EName || "N/A"}
                                </td>
                                <td>
                                  {leaveType.find(
                                    (row) => row.VID === group.LeaveTypeID
                                  )?.VName || "N/A"}
                                </td>
                                <td>{formatDate(group.DateFrom)}</td>
                                <td>{formatDate(group.DateTo)}</td>
                                <td>{group.VName}</td>
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
                                No Leave found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            {/* Second Grid */}
            <Col lg={3}>
              <table className="table-sm bg-light  mt-2">
                <thead className="table-light ">
                  <tr>
                    <th>M-L</th>
                    <th>Limit</th>
                    <th>Avail</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Casual</td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td> Sick</td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td> Annual</td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td> CPL</td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td> Special</td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        className="form-control-sm"
                        id="VName"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>2025/06/01:AL</td>
                  </tr>
                  <tr>
                    <td>2025/06/01:AL</td>
                  </tr>
                  <tr>
                    <td>2025/06/01:HL</td>
                  </tr>
                </tbody>
              </table>
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

export default Leaves;
