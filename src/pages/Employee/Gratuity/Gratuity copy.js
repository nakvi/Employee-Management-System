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
import { FiRefreshCw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getSalaryBank } from "../../../slices/setup/salaryBank/thunk";
import {
  getGratuity,
  submitGratuity,
  updateGratuity,
  deleteGratuity,
} from "../../../slices/employee/gratuity/thunk";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import DeleteModal from "../../../Components/Common/DeleteModal";

const Gratuity = () => {
  document.title = "Gratuity | EMS";
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Redux state
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = [] } = useSelector((state) => state.Employee || {});
  const { salaryBank } = useSelector((state) => state.SalaryBank);
  const { gratuity, loading, error } = useSelector((state) => state.Gratuity);

  useEffect(() => {
    dispatch(getSalaryBank());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getGratuity());
  }, [dispatch]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      VName: "",
      VDate: "",
      DemandTill: "",
      PaidTill: "",
      PaidOld: "",
      EmpID: "",
      ETypeID: "",
      DueAmount: "",
      PaidAmount: "",
      NewAmount: "",
      GYearsEffected: "",
      GYears: "",
      GMonths: "",
      isApproved: 1,
      isPosted: 1,
      PostedDate: "1900-01-01",
      PostedBy: 1,
      CompanyBankID: "",
      ChequeNo: "",
      ChequeDate: "",
      FinancialYearID: 2025,
      isCancel: 0,
      UID: 10,
      CompanyID: "1001",
      Tranzdatetime: new Date().toISOString(),
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      VName: Yup.string().required("Name is required"),
      VDate: Yup.date().required("Date is required"),
      DemandTill: Yup.date().required("Demand Till is required"),
      PaidTill: Yup.date().required("Paid Till is required"),
      PaidOld: Yup.date().required("Previous Date is required"),
      DueAmount: Yup.number().required("Due Amount is required"),
      PaidAmount: Yup.number().required("Paid Amount is required"),
      NewAmount: Yup.number().required("New Amount is required"),
      CompanyBankID: Yup.number()
        .min(1, "Bank is required")
        .required("Required"),
      ChequeNo: Yup.string().required("Cheque No is required"),
      ChequeDate: Yup.date().required("Cheque Date is required"),
      isApproved: Yup.number().oneOf([0, 1], "Invalid approval status"),
      isPosted: Yup.number().oneOf([0, 1], "Invalid posted status"),
      isCancel: Yup.number().oneOf([0, 1], "Invalid cancel status"),
    }),
    onSubmit: (values) => {
      const transformedValues = {
        ...values,
        isApproved: parseInt(values.isApproved),
        isPosted: parseInt(values.isPosted),
        isCancel: parseInt(values.isCancel),
        PostedBy: parseInt(values.PostedBy),
        FinancialYearID: parseInt(values.FinancialYearID),
        UID: parseInt(values.UID),
        CompanyBankID: parseInt(values.CompanyBankID),
        DueAmount: parseFloat(values.DueAmount),
        PaidAmount: parseFloat(values.PaidAmount),
        NewAmount: parseFloat(values.NewAmount),
      };
      if (editingGroup) {
        dispatch(updateGratuity({ ...transformedValues, VID: editingGroup.VID }));
        setEditingGroup(null);
      } else {
        dispatch(submitGratuity(transformedValues));
      }
      formik.resetForm();
    },
  });

  // Handle edit button click
  const handleEditClick = (group) => {
    setEditingGroup(group);
    formik.setValues({
      VName: group.VName || "",
      VDate: group.VDate ? group.VDate.split("T")[0] : "",
      DemandTill: group.DemandTill ? group.DemandTill.split("T")[0] : "",
      PaidTill: group.PaidTill ? group.PaidTill.split("T")[0] : "",
      PaidOld: group.PaidOld ? group.PaidOld.split("T")[0] : "",
      EmpID: group.EmpID || "",
      ETypeID: employee.find((emp) => emp.EmpID === group.EmpID)?.ETypeID || "",
      DueAmount: group.DueAmount || "",
      PaidAmount: group.PaidAmount || "",
      NewAmount: group.NewAmount || "",
      GYearsEffected: group.GYearsEffected || "",
      GYears: group.GYears || "",
      GMonths: group.GMonths || "",
      isApproved: group.isApproved || 1,
      isPosted: group.isPosted || 1,
      PostedDate: group.PostedDate ? group.PostedDate.split("T")[0] : "1900-01-01",
      PostedBy: group.PostedBy || 1,
      CompanyBankID: group.CompanyBankID || "",
      ChequeNo: group.ChequeNo || "",
      ChequeDate: group.ChequeDate ? group.ChequeDate.split("T")[0] : "",
      FinancialYearID: group.FinancialYearID || 2025,
      isCancel: group.isCancel || 0,
      UID: group.UID || 10,
      CompanyID: group.CompanyID || "1001",
      Tranzdatetime: group.Tranzdatetime || new Date().toISOString(),
    });
  };

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteGratuity(deleteId));
    }
    setDeleteModal(false);
    setDeleteId(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

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
                    title="Gratuity"
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
                              <div className="text-danger">{formik.errors.ETypeID}</div>
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
                                .filter((emp) => emp.ETypeID === parseInt(formik.values.ETypeID))
                                .map((item) => (
                                  <option key={item.EmpID} value={item.EmpID}>
                                    {item.EName}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.EmpID && formik.errors.EmpID ? (
                              <div className="text-danger">{formik.errors.EmpID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="VName" className="form-label">
                              Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              name="VName"
                              placeholder="Name"
                              value={formik.values.VName}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.VName && formik.errors.VName ? (
                              <div className="text-danger">{formik.errors.VName}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="VDate" className="form-label">
                              Demand Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VDate"
                              name="VDate"
                              value={formik.values.VDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.VDate && formik.errors.VDate ? (
                              <div className="text-danger">{formik.errors.VDate}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="DemandTill" className="form-label">
                              Demand Till
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DemandTill"
                              name="DemandTill"
                              value={formik.values.DemandTill}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.DemandTill && formik.errors.DemandTill ? (
                              <div className="text-danger">{formik.errors.DemandTill}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="PaidTill" className="form-label">
                              Paid Till
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PaidTill"
                              name="PaidTill"
                              value={formik.values.PaidTill}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.PaidTill && formik.errors.PaidTill ? (
                              <div className="text-danger">{formik.errors.PaidTill}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="PaidOld" className="form-label">
                              Previous
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PaidOld"
                              name="PaidOld"
                              value={formik.values.PaidOld}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.PaidOld && formik.errors.PaidOld ? (
                              <div className="text-danger">{formik.errors.PaidOld}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="DueAmount" className="form-label">
                              Due Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="DueAmount"
                              name="DueAmount"
                              placeholder="Due Amount"
                              value={formik.values.DueAmount}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.DueAmount && formik.errors.DueAmount ? (
                              <div className="text-danger">{formik.errors.DueAmount}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="PaidAmount" className="form-label">
                              Paid Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="PaidAmount"
                              name="PaidAmount"
                              placeholder="Paid Amount"
                              value={formik.values.PaidAmount}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.PaidAmount && formik.errors.PaidAmount ? (
                              <div className="text-danger">{formik.errors.PaidAmount}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="NewAmount" className="form-label">
                              New Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="NewAmount"
                              name="NewAmount"
                              placeholder="New Amount"
                              value={formik.values.NewAmount}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.NewAmount && formik.errors.NewAmount ? (
                              <div className="text-danger">{formik.errors.NewAmount}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="CompanyBankID" className="form-label">
                              Bank
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="CompanyBankID"
                              id="CompanyBankID"
                              value={formik.values.CompanyBankID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {salaryBank.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.CompanyBankID && formik.errors.CompanyBankID ? (
                              <div className="text-danger">{formik.errors.CompanyBankID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="ChequeNo" className="form-label">
                              Cheque No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="ChequeNo"
                              name="ChequeNo"
                              placeholder="Cheque No"
                              value={formik.values.ChequeNo}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.ChequeNo && formik.errors.ChequeNo ? (
                              <div className="text-danger">{formik.errors.ChequeNo}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="ChequeDate" className="form-label">
                              Cheque Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="ChequeDate"
                              name="ChequeDate"
                              value={formik.values.ChequeDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.ChequeDate && formik.errors.ChequeDate ? (
                              <div className="text-danger">{formik.errors.ChequeDate}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="GYears" className="form-label">
                              Gratuity Years
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="GYears"
                              name="GYears"
                              placeholder="Gratuity Years"
                              value={formik.values.GYears}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Button
                              className="btn btn-soft-success mt-4 px-4 py-1"
                              title="Refresh"
                              onClick={() => dispatch(getGratuity())}
                            >
                              <FiRefreshCw strokeWidth={4} />
                            </Button>
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
                              placeholder="Search..."
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
                            <th>Demand Date</th>
                            <th>Demand Till</th>
                            <th>Paid Till</th>
                            <th>Previous</th>
                            <th>Due Amount</th>
                            <th>Paid Amount</th>
                            <th>New Amount</th>
                            <th>Bank</th>
                            <th>Cheque No</th>
                            <th>Cheque Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {gratuity?.length > 0 ? (
                            gratuity.map((item) => (
                              <tr key={item.VID}>
                                <td>
                                  {employee.find((emp) => emp.EmpID === item.EmpID)?.EName || "N/A"}
                                </td>
                                <td>{formatDate(item.VDate)}</td>
                                <td>{formatDate(item.DemandTill)}</td>
                                <td>{formatDate(item.PaidTill)}</td>
                                <td>{formatDate(item.PaidOld)}</td>
                                <td>{item.DueAmount}</td>
                                <td>{item.PaidAmount}</td>
                                <td>{item.NewAmount}</td>
                                <td>
                                  {salaryBank.find((bank) => bank.VID === item.CompanyBankID)?.VName || "N/A"}
                                </td>
                                <td>{item.ChequeNo}</td>
                                <td>{formatDate(item.ChequeDate)}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <Button
                                      className="btn btn-soft-info"
                                      onClick={() => handleEditClick(item)}
                                      disabled={loading}
                                    >
                                      <i className="bx bx-edit"></i>
                                    </Button>
                                    <Button
                                      className="btn btn-soft-danger"
                                      onClick={() => handleDeleteClick(item.VID)}
                                      disabled={loading}
                                    >
                                      <i className="ri-delete-bin-2-line"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="12" className="text-center">
                                No Gratuity data found.
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
          <DeleteModal
            show={deleteModal}
            onCloseClick={() => setDeleteModal(false)}
            onDeleteClick={handleDeleteConfirm}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Gratuity;