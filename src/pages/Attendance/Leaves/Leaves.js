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
import config from "../../../config";

const Leaves = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);

  // Redux to get data from state
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

document.title = "Leave | EMS";
  // Formik setup
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
            updateLeave({ ...values, VID: editingGroup.VID })
          ).unwrap();
          setAttendanceRecords([]);
          setLeaveBalances([]);
        } else {
          await dispatch(submitLeave(values)).unwrap();
        }
        formik.resetForm();
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
  });

  // Handle edit click and fetch attendance records and leave balances
  const handleEditClick = async (group) => {
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

    // Fetch attendance records
    try {
      const response = await fetch(
        `${config.api.API_URL}employeeLast10AttRecord/?empID=${group.EmpID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.status === "0" && result.data) {
        setAttendanceRecords(result.data);
      } else {
        console.error("Failed to fetch attendance records:", result.message);
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      setAttendanceRecords([]);
    }

    // Get current year and date for API query
    const currentYear = new Date().getFullYear();
    const dateFrom = `${currentYear}-01-01`;
    const dateTo = `${currentYear}-12-31`;
    const vDate = format(new Date(), "yyyy-MM-dd");

    // Fetch leave balance
    try {
      const response = await fetch(
        `${config.api.API_URL}employeeLeaveBalance?Orgini=LTT&cWhere&DateFrom=${dateFrom}&DateTo=${dateTo}&VDate=${vDate}&IsAu=0&EmpID=${group.EmpID}&IsExport=0&cWhereLimit`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setLeaveBalances(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching leave balances:", error);
      setLeaveBalances([]);
    }
  };

  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteLeave(deleteId));
      setAttendanceRecords([]);
      setLeaveBalances([]);
    }
    setDeleteModal(false);
  };

  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  // Handle cancel action
  const handleCancel = () => {
    formik.resetForm();
    setEditingGroup(null);
    setAttendanceRecords([]);
    setLeaveBalances([]);
  };

  // Map leave types to API response
  // const leaveTypes = [
  //   { name: "Casual", data: leaveBalances.find((item) => item.VName === "Casual") || {} },
  //   { name: "Sick", data: leaveBalances.find((item) => item.VName === "Sick") || {} },
  //   { name: "Annual", data: leaveBalances.find((item) => item.VName === "Annual") || {} },
  //   { name: "CPL", data: leaveBalances.find((item) => item.VName === "CPL") || {} },
  //   { name: "Special", data: leaveBalances.find((item) => item.VName === "Special") || {} },
  // ];
  // Map leave types to the API response
  const leaveTypes = [
    { name: "Casual", data: leaveBalances[0] },
    { name: "Sick", data: leaveBalances[1] },
    { name: "Annual", data: leaveBalances[2] },
    { name: "CPL", data: leaveBalances[3] },
    { name: "Special", data: leaveBalances[4] || {} }, // Handle case where Special might not exist
  ];
  document.title = "Leave | EMS";
  return (
    <React.Fragment>
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
                  <PreviewCardHeader title="Leave" onCancel={handleCancel} />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row>
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
                                  className="form-select form-select-sm"
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
                            <th>Leave No</th>
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
                                <td>{group.VNo}</td>
                                <td>{group.VName}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <div className="edit">
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
            <Col lg={3}>
              <table className="table-sm bg-light mt-2">
                <thead className="table-light">
                  <tr>
                    <th>M-L</th>
                    <th>Limit</th>
                    <th>Avail</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveTypes.map((type) => (
                    <tr key={type.name}>
                      <td>{type.name}</td>
                      <td>
                        <Input
                          type="text"
                          className="form-control-sm"
                          id={`limit-${type.name}`}
                          value={type.data?.Limit || ""}
                          readOnly
                          style={{ width: "50px" }}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          className="form-control-sm"
                          id={`avail-${type.name}`}
                          value={type.data?.Avail || ""}
                          readOnly
                          style={{ width: "50px" }}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          className="form-control-sm"
                          id={`balance-${type.name}`}
                          value={type.data?.Balance || ""}
                          readOnly
                          style={{ width: "50px" }}
                        />
                      </td>
                    </tr>
                  ))}
                  {attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record) => (
                      <tr key={record.VID}>
                        <td>
                          {formatDate(record.VDate)}: {record.VName}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No records found.</td>
                    </tr>
                  )}
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
