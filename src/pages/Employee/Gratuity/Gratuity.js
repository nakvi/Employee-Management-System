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
const Gratuity = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  // redux
  const { gratuity, loading, error } = useSelector((state) => state.Gratuity);
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { salaryBank } = useSelector((state) => state.SalaryBank);

  useEffect(() => {
    dispatch(getSalaryBank());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getGratuity());
  }, [dispatch]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      EmpID: "",
      ETypeID: "",
      VDate: "",
      DemandTill: "",
      PaidTill: "",
      PaidOld: "",
      DueAmount: "",
      PaidAmount: "",
      CompanyBankID: "",
      ChequeNo: "",
      ChequeDate: "",
      VName: "",
      NewAmount: "5000",
      UID: 10,
      CompanyID: "1001",
      Tranzdatetime: new Date().toISOString(),
    },
    validationSchema: Yup.object({
      // ETypeID: Yup.number()
      //   .min(1, "Employee Type is required")
      //   .required("Required"),
      // EmpID: Yup.string().required("Employee is required"),
      // VName: Yup.string().required("Remarks is required"),
      // VDate: Yup.date().required("Date is required"),
      // DemandTill: Yup.date().required("Demand Till is required"),
      // PaidTill: Yup.date().required("Paid Till is required"),
      // PaidOld: Yup.date().required("Previous Date is required"),
      // DueAmount: Yup.number().required("Due Amount is required"),
      // PaidAmount: Yup.number().required("Paid Amount is required"),
      // NewAmount: Yup.number().required("New Amount is required"),
      // CompanyBankID: Yup.number()
      //   .min(1, "Bank is required")
      //   .required("Required"),
      // ChequeNo: Yup.string().required("Cheque No is required"),
      // ChequeDate: Yup.date().required("Cheque Date is required"),
      // isApproved: Yup.number().oneOf([0, 1], "Invalid approval status"),
      // isPosted: Yup.number().oneOf([0, 1], "Invalid posted status"),
      // isCancel: Yup.number().oneOf([0, 1], "Invalid cancel status"),
    }),
    // onSubmit: (values) => {
    //   // Add your form submission logic here
    //   const transformedValues = {
    //     ...values,
    //     IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
    //   };
    //   try {
    //   if (editingGroup) {
    //     dispatch(updateGratuity({ ...transformedValues, VID: editingGroup.VID }));
    //     setEditingGroup(null); // Reset after submission
    //   } else {
    //     dispatch(submitGratuity(transformedValues));
    //   }
    //   formik.resetForm();
    //    } catch (error) {
    //     // Error already handled by toast, so do nothing here or log if needed
    //     console.error("Submission failed:", error);
    //   }
    // },
    onSubmit: async (values) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0,
      };

      try {
        let result;
        if (editingGroup) {
          result = await dispatch(
            updateGratuity({ ...transformedValues, VID: editingGroup.VID })
          );
          setEditingGroup(null);
        } else {
          result = await dispatch(submitGratuity(transformedValues));
        }

        // Check if the asyncThunk was fulfilled
        if (
          submitGratuity.fulfilled.match(result) ||
          updateGratuity.fulfilled.match(result)
        ) {
          formik.resetForm();
        }
      } catch (error) {
        console.error("Submission failed:", error);
        // Errors already shown via toast, nothing else needed
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
      VDate: group.VDate.split("T")[0],
      DemandTill: group.DemandTill.split("T")[0],
      PaidTill: group.PaidTill.split("T")[0],
      PaidOld: group.PaidOld.split("T")[0],
      DueAmount: group.DueAmount,
      PaidAmount: group.PaidAmount,
      CompanyBankID: group.CompanyBankID,
      ChequeNo: group.ChequeNo,
      ChequeDate: group.ChequeDate.split("T")[0],
      VName: group.VName,
      NewAmount: "5000",
      UID: 202,
      CompanyID: 3001,
      Tranzdatetime: "2025-04-24T10:19:32.099586Z",
    });
  };
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };
  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteGratuity(deleteId));
    }
    setDeleteModal(false);
  };
  document.title = "Gratuity | EMS";
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
                              <div className="text-danger">
                                {formik.errors.VDate}
                              </div>
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
                            {formik.touched.DemandTill &&
                            formik.errors.DemandTill ? (
                              <div className="text-danger">
                                {formik.errors.DemandTill}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="PaidTill" className="form-label">
                              Paid On
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
                            {formik.touched.PaidTill &&
                            formik.errors.PaidTill ? (
                              <div className="text-danger">
                                {formik.errors.PaidTill}
                              </div>
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
                              <div className="text-danger">
                                {formik.errors.PaidOld}
                              </div>
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
                              {...formik.getFieldProps("DueAmount")}
                            />
                            {formik.touched.DueAmount &&
                            formik.errors.DueAmount ? (
                              <div className="text-danger">
                                {formik.errors.DueAmount}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="PaidAmount" className="form-label">
                              Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="PaidAmount"
                              placeholder="Amount"
                              {...formik.getFieldProps("PaidAmount")}
                            />
                            {formik.touched.PaidAmount &&
                            formik.errors.PaidAmount ? (
                              <div className="text-danger">
                                {formik.errors.PaidAmount}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div className="mb-3">
                            <Label
                              htmlFor="CompanyBankID"
                              className="form-label"
                            >
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
                            {formik.touched.CompanyBankID &&
                            formik.errors.CompanyBankID ? (
                              <div className="text-danger">
                                {formik.errors.CompanyBankID}
                              </div>
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
                        <Col xxl={2} md={4}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Remarks
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
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
                        <Col xxl={2} md={4}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Current Salary
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Current Salary"
                              readOnly
                              disabled
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Button
                              className="btn btn-soft-success mt-4 px-4 py-1"
                              title="Refresh"
                              data-bs-toggle="tooltip"
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
                            <th>Demand Date </th>
                            <th>Demand Till</th>
                            <th>Paid Till</th>
                            <th>Previous</th>
                            <th>Due Amount</th>
                            <th>Amount</th>
                            <th>Bank</th>
                            <th>Cheque No</th>
                            <th>Currrent Salaray</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {gratuity?.length > 0 ? (
                            gratuity.map((group) => (
                              <tr key={group.VID}>
                                <td>
                                  {employee.find(
                                    (emp) =>
                                      String(emp.EmpID) === String(group.EmpID)
                                  )?.EName || "N/A"}
                                </td>
                                <td>{formatDate(group.VDate)}</td>
                                <td>{formatDate(group.DemandTill)}</td>
                                <td>{formatDate(group.PaidTill)}</td>
                                <td>{formatDate(group.PaidOld)}</td>
                                <td>{group.DueAmount}</td>
                                <td>{group.PaidAmount}</td>
                                <td>
                                  {salaryBank.find(
                                    (bank) => bank.VID === group.CompanyBankID
                                  )?.VName || "N/A"}
                                </td>
                                <td>{group.ChequeNo}</td>
                                <td>205555550</td>
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
                                No Gratuity found.
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

export default Gratuity;
