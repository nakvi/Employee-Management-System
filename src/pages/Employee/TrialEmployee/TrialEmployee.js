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
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";
import {
  deleteEmployeeTrial,
  getEmployeeTrial,
  submitEmployeeTrial,
  updateEmployeeTrial,
} from "../../../slices/employee/employeeTrial/thunk";
import { getShift } from "../../../slices/setup/shift/thunk";

const TrialEmployee = () => {
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  // redux
  const { loading, error, employeeTrial } = useSelector(
    (state) => state.EmployeeTrial
  );
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { shift } = useSelector((state) => state.Shift);

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getEmployeeTrial());
    dispatch(getShift());
  }, [dispatch]);
  // Formik setup
  const formik = useFormik({
    initialValues: {
      EmpID: "",
      ETypeID: "",
      DeptID: 0,
      HireType: "",
      EName: "",
      FName: "",
      ShiftID: 0,
      DOJ: "",
      DOB: "",
      Address: "",
      Reference: "",
      TelePhone: "",
      NIC: "",
      ClosingDate: "",
      ClosingStatus: "",
      UID: 10,
      Tranzdatetime: "2025-05-29T10:00:00",
      CompanyID: 1,
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      DeptID: Yup.number()
        .min(1, "Department Type is required")
        .required("Required"),
      HireType: Yup.string().required("Hire is required"),
      EName: Yup.string().required("Name is required"),
      FName: Yup.string().required("Father Name is required"),
      ShiftID: Yup.number()
        .min(1, "Shift Type is required")
        .required("Required"),
      DOJ: Yup.date().required("Date is required"),
      DOB: Yup.date().required("Date is required"),
      Address: Yup.string().required("Address is required"),
      Reference: Yup.string().required("Reference is required"),
      TelePhone: Yup.number().required("Contact is required"),
      NIC: Yup.string()
        .matches(
          /^[0-9]{5}-[0-9]{7}-[0-9]$/,
          "NIC must be in the format 12345-1234567-1"
        )
        .required("NIC is required"),
      ClosingStatus: Yup.string().required("Closing Status is required"),
      ClosingDate: Yup.date().required("Date is required"),
    }),
    onSubmit: (values) => {
      // Add your form submission logic here
      if (editingGroup) {
        dispatch(
          updateEmployeeTrial({
            ...values,
            VID: editingGroup.VID,
          })
        );
        setEditingGroup(null); // Reset after submission
      } else {
        dispatch(submitEmployeeTrial(values));
      }
      formik.resetForm();
    },
  });
  // Handle edit button click
  const handleEditClick = (group) => {
       // Find the employee record to get the ETypeID
  const selectedEmployee = employee.find(
    (emp) => String(emp.EmpID) === String(group.EmpID)
  );
  const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";
    setEditingGroup(group);
    formik.setValues({
      EmpID:group.EmpID ,
       ETypeID: employeeTypeId,
       DeptID: group.DeptID ,
      HireType:group.HireType ,
      EName:group.EName ,
      FName:group.FName ,
      ShiftID:group.ShiftID ,
      DOJ:formatDateForInput(group.DOJ),
      DOB:formatDateForInput(group.DOB) ,
      Address:group.Address ,
      Reference:group.Reference ,
      TelePhone:group.TelePhone ,
      NIC:group.NIC ,
      ClosingDate:formatDateForInput(group.ClosingDate) ,
      ClosingStatus:group.ClosingStatus ,
      UID: group.UID || 501,
      CompanyID: group.CompanyID || "1001",
      Tranzdatetime: group.Tranzdatetime || new Date().toISOString(),
    });
     };
       // Delete Data
          const handleDeleteClick = (id) => {
            setDeleteId(id);
            setDeleteModal(true);
          };
          const handleDeleteConfirm = () => {
            if (deleteId) {
              dispatch(deleteEmployeeTrial(deleteId));
            }
            setDeleteModal(false);
          };
    const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : ""; };
    const formatDateForInput = (dateString) => {
      return dateString ? dateString.split("T")[0] : ""; // Extract YYYY-MM-DD part
    };
  document.title = "Trial Employee | EMS";
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
                    title="Trial Employee"
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
                        <Col xxl={2} md={2}>
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
                              <option value="">---Select--- </option>
                              {departmentList.length > 0 ? (
                                departmentList.map((dept) => (
                                  <option key={dept.VID} value={dept.VID}>
                                    {dept.VName ||
                                      dept.DepartmentName ||
                                      dept.title}
                                  </option>
                                ))
                              ) : (
                                <option disabled>
                                  No departments available
                                </option>
                              )}
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
                            <Label htmlFor="HireType" className="form-label">
                              Hire Type
                              <span className="text-danger">*</span>
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="HireType"
                              name="HireType"
                              value={formik.values.HireType}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">--- Select ---</option>
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                            </select>
                            {formik.touched.HireType &&
                            formik.errors.HireType ? (
                              <div className="text-danger">
                                {formik.errors.HireType}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* Name */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="EName" className="form-label">
                              Name<span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="EName"
                              name="EName"
                              placeholder="Name"
                              {...formik.getFieldProps("EName")}
                            />
                            {formik.touched.EName && formik.errors.EName ? (
                              <div className="text-danger">
                                {formik.errors.EName}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/* Father Name */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="FName" className="form-label">
                              Father Name
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="FName"
                              name="FName"
                              placeholder="Father Name"
                              {...formik.getFieldProps("FName")}
                            />
                            {formik.touched.FName && formik.errors.FName ? (
                              <div className="text-danger">
                                {formik.errors.FName}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* Shift */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="ShiftID" className="form-label">
                              Shift
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="ShiftID"
                              value={formik.values.ShiftID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="-1">---Select---</option>
                              {shift?.length > 0 ? (
                                shift.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No Shift available
                                </option>
                              )}
                            </select>
                            {formik.touched.ShiftID && formik.errors.ShiftID ? (
                              <div className="text-danger">
                                {formik.errors.ShiftID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* DOB */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DOB" className="form-label">
                              DOB<span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DOB"
                              name="DOB"
                              {...formik.getFieldProps("DOB")}
                            />
                            {formik.touched.DOB && formik.errors.DOB ? (
                              <div className="text-danger">
                                {formik.errors.DOB}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* DOJ */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DOJ" className="form-label">
                              DOJ<span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DOJ"
                              name="DOJ"
                              {...formik.getFieldProps("DOJ")}
                            />
                            {formik.touched.DOJ && formik.errors.DOJ ? (
                              <div className="text-danger">
                                {formik.errors.DOJ}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="Address" className="form-label">
                              Present Address
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="Address"
                              name="Address"
                              placeholder="Address"
                              {...formik.getFieldProps("Address")}
                            />
                            {formik.touched.Address && formik.errors.Address ? (
                              <div className="text-danger">
                                {formik.errors.Address}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="Reference" className="form-label">
                              Reference
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="Reference"
                              placeholder="Reference"
                              {...formik.getFieldProps("Reference")}
                            />
                            {formik.touched.Reference &&
                            formik.errors.Reference ? (
                              <div className="text-danger">
                                {formik.errors.Reference}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="TelePhone" className="form-label">
                              Contact
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="TelePhone"
                              name="TelePhone"
                              placeholder="Contact"
                              {...formik.getFieldProps("TelePhone")}
                            />
                            {formik.touched.TelePhone &&
                            formik.errors.TelePhone ? (
                              <div className="text-danger">
                                {formik.errors.TelePhone}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* NIC */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="NIC" className="form-label">
                              NIC<span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="NIC"
                              name="NIC"
                              placeholder="xxxxx-xxxxxxx-x"
                              {...formik.getFieldProps("NIC")}
                            />
                            {formik.touched.NIC && formik.errors.NIC ? (
                              <div className="text-danger">
                                {formik.errors.NIC}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="ClosingDate" className="form-label">
                              Closing Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="ClosingDate"
                              name="ClosingDate"
                              {...formik.getFieldProps("ClosingDate")}
                            />
                            {formik.touched.ClosingDate &&
                            formik.errors.ClosingDate ? (
                              <div className="text-danger">
                                {formik.errors.ClosingDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="ClosingStatus"
                              className="form-label"
                            >
                              Closing Status
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="ClosingStatus"
                              value={formik.values.ClosingStatus}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="0">---Select---</option>
                              <option value="Working">Working</option>
                              <option value="Transferred">Transferred</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            {formik.touched.ClosingStatus &&
                            formik.errors.ClosingStatus ? (
                              <div className="text-danger">
                                {formik.errors.ClosingStatus}
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
                            <th>Department</th>
                            <th>Type </th>
                            <th>Name</th>
                            <th>Father Name</th>
                            <th>Shift</th>
                            <th>DOB</th>
                            <th>DOJ</th>
                            <th>Present Address</th>
                            <th>Reference</th>
                            <th>Contact</th>
                            <th>NIC</th>
                            <th>Closing Date</th>
                             <th>Closing Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {employeeTrial?.length > 0 ? (
                            employeeTrial.map((group) => (
                              <tr key={group.EmpID}>
                                 <td>
                                  {employee.find((emp) => String(emp.EmpID) === String(group.EmpID))?.EName|| "N/A"}
                                </td>
                               <td>
                                  {departmentList.find(
                                    (item) => item.VID === group.DeptID
                                  )?.VName || "N/A"}
                                </td>
                                <td>{group.HireType}</td>
                                <td>{group.EName}</td>
                                <td>{group.FName}</td>
                                <td>
                                  {shift.find(
                                    (item) => item.VID === group.ShiftID
                                  )?.VName || "N/A"}
                                </td>
                                <td>{formatDate(group.DOJ)}</td>
                                <td>{formatDate(group.DOB)}</td>
                                <td>{group.Address}</td>
                                <td>{group.Reference}</td>
                                 <td>{group.TelePhone}</td>
                                <td>{group.NIC}</td>
                                 <td>{formatDate(group.ClosingDate)}</td>
                                <td>{group.ClosingStatus}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <div className="edit ">
                                      <Button className="btn btn-soft-info" onClick={() => handleEditClick(group)}>
                                        <i className="bx bx-edit"></i>
                                      </Button>
                                    </div>
                                    <div className="delete">
                                      <Button className="btn btn-soft-danger" onClick={() =>
                                          handleDeleteClick(group.EmpID)
                                        }>
                                        <i className="ri-delete-bin-2-line"></i>
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="15" className="text-center">
                                No Employee Trail found.
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

export default TrialEmployee;
