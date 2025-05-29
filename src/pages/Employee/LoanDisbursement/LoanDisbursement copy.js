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
import { getSalaryBank } from "../../../slices/setup/salaryBank/thunk";
import {
  deleteLoanDisbursement,
  getLoanDisbursement,
  submitLoanDisbursement,
  updateLoanDisbursement,
} from "../../../slices/employee/loanDisbursement/thunk";

const LoanDisbursement = () => {
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  // redux to get data
  const { loading, error, loanDisbursement } = useSelector(
    (state) => state.LoanDisbursement
  );
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { salaryBank } = useSelector((state) => state.SalaryBank);

  useEffect(() => {
    dispatch(getSalaryBank());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getLoanDisbursement());
  }, [dispatch]);

  // form
  const formik = useFormik({
    initialValues: {
      VName: "",
      VDate: "",
      EmpID: "",
      ETypeID: "",
      Amount: 0,
      AccountID: 0,
      ChequeNo: "",
      ChequeDate: "",
      Installment: 0,
      UID: 501,
      CompanyID: "1001",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      VName: Yup.string().required("Remarks is required"),
      AccountID: Yup.number()
        .min(1, "Bank Type is required")
        .required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      ChequeNo: Yup.string().required("Cheque is required"),
      ChequeDate: Yup.date().required("Date is required"),
      Amount: Yup.number()
        .min(1, "Amount must be greater than 0") // Updated to enforce > 0
        .required("Amount is required"),
      Installment: Yup.number()
        .min(1, "Installment must be greater than 0") // Updated to enforce > 0
        .required("Installment is required"),
      VDate: Yup.date().required("Date is required"),
    }),
    onSubmit: (values) => {
      if (editingGroup) {
        dispatch(updateLoanDisbursement({ ...values, VID: editingGroup.VID }));
      } else {
        dispatch(submitLoanDisbursement(values)).then(() => {});
      }
      formik.resetForm();
    },
  });
    // Handle edit click
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
    VName: group.VName,
    Amount: group.Amount,
    AccountID: group.AccountID,
    ChequeNo: group.ChequeNo,
    Installment: group.Installment,
    ChequeDate: group.ChequeDate.split("T")[0],
    VDate: group.VDate.split("T")[0],
    EmpID: group.EmpID,
    ETypeID: employeeTypeId, // Set ETypeID from employee data
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
      dispatch(deleteLoanDisbursement(deleteId)).then(() => {
      });
    }
    setDeleteModal(false);
  };
    const formatDate = (dateString) => {
           return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
         };
  document.title = "Loan Disbursement | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>} */}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader
                    title="Loan Disbursement"
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
                        {/* <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Loan Type
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">Car Loan</option>
                              <option value="Choices2">Short term Loan</option>
                            </select>
                          </div>
                        </Col> */}
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
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="AccountID" className="form-label">
                              Bank
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="AccountID"
                              id="AccountID"
                              {...formik.getFieldProps("AccountID")}
                            >
                              <option value="">---Select---</option>
                              {salaryBank.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.AccountID &&
                            formik.errors.AccountID ? (
                              <div className="text-danger">
                                {formik.errors.AccountID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="ChequeNo" className="form-label">
                              Cheque No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="ChequeNo"
                              name="ChequeNo"
                              placeholder="Cheque No"
                              {...formik.getFieldProps("ChequeNo")}
                            />
                            {formik.touched.ChequeNo &&
                            formik.errors.ChequeNo ? (
                              <div className="text-danger">
                                {formik.errors.ChequeNo}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="ChequeDate" className="form-label">
                              Cheque Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="ChequeDate"
                              name="ChequeDate"
                              {...formik.getFieldProps("ChequeDate")}
                            />
                            {formik.touched.ChequeDate &&
                            formik.errors.ChequeDate ? (
                              <div className="text-danger">
                                {formik.errors.ChequeDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="Amount" className="form-label">
                              Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="Amount"
                              name="Amount"
                              placeholder="00"
                              {...formik.getFieldProps("Amount")}
                            />
                            {formik.touched.Amount && formik.errors.Amount ? (
                              <div className="text-danger">
                                {formik.errors.Amount}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="Installment" className="form-label">
                              Installment
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="Installment"
                              name="Installment"
                              placeholder="00"
                              {...formik.getFieldProps("Installment")}
                            />
                            {formik.touched.Installment &&
                            formik.errors.Installment ? (
                              <div className="text-danger">
                                {formik.errors.Installment}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
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
                            <th>Date </th>
                            <th>Bank</th>
                            <th>Cheque No</th>
                            <th> Date</th>
                            <th>Amount</th>
                            <th>Installment</th>
                            <th>Remarks</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {loanDisbursement?.length > 0 ? (
                            loanDisbursement.map((group) => (
                              <tr key={group.VID}>
                                <td>
                                  {employee.find(
                                    (emp) =>
                                      String(emp.EmpID) === String(group.EmpID)
                                  )?.EName || "N/A"}
                                </td>
                                <td>{formatDate(group.VDate)}</td>
                                 <td>
                                  {salaryBank.find(
                                    (bank) => bank.VID === group.AccountID
                                  )?.VName || "N/A"}
                                </td>
                                <td>{group.ChequeNo}</td>
                                 <td>{formatDate(group.ChequeDate)}</td>
                                <td>{group.Amount}</td>
                                <td>{group.Installment}</td>
                                <td>{group.VName}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <div className="edit ">
                                      <Button className="btn btn-soft-info" onClick={() => handleEditClick(group)}>
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
                                No Loan found.
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

export default LoanDisbursement;
