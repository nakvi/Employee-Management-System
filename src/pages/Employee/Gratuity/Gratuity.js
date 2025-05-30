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
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { FiRefreshCw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getSalaryBank } from "../../../slices/setup/salaryBank/thunk";

const Gratuity = () => {
  document.title = "Gratuity | EMS";
  const dispatch = useDispatch();

  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { salaryBank } = useSelector((state) => state.SalaryBank);

  useEffect(() => {
    dispatch(getSalaryBank());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
  }, [dispatch]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      VName: "",
      VDate: "",
      EmpID: "",
      ETypeID: "",
      VType: "",
      GroupID: "",
      AllowDedID: "",
      Amount: 0,
      AccountID: "",
      ChequeNo: "",
      ChequeDate: "",
      IsActive: true,
      UID: 501,
      CompanyID: "1001",
      Tranzdatetime: "2024-02-02T12:30:00Z",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      VType: Yup.string().required("Type is required"),
      GroupID: Yup.string().required("Effect is required"),
      AllowDedID: Yup.string().required("Details is required"),
      Amount: Yup.number().required("Amount is required"),
      AccountID: Yup.number()
        .min(1, "Bank Type is required")
        .required("Required"),
      VDate: Yup.date().required("Date is required"),
      ChequeNo: Yup.string().required("Cheque No is required"),
      ChequeDate: Yup.date().required("Cheque Date is required"),
      IsActive: Yup.boolean(),
    }),
     onSubmit: (values) => {
         // Add your form submission logic here
         const transformedValues = {
           ...values,
           IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
         };
         if (editingGroup) {
           dispatch(
             update({ ...transformedValues, VID: editingGroup.VID })
           );
           setEditingGroup(null); // Reset after submission
         } else {
           dispatch(submitSalaryAllowanceDeduction(transformedValues));
         }
         formik.resetForm();
       },
    });
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>} */}
          <Row>
            <Col lg={12}>
              <Card>
                <Form>
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
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Demand Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Till
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Paid On
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Previous
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                            />
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Due Amount
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Due Amount"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Amount
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Amount"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Bank
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              {salaryBank.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Cheque No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Cheque No"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Cheque Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                            />
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
                              placeholder="Cheque No"
                            />
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
                            <th> Previous</th>
                            <th>Due Amount</th>
                            <th>Amount</th>
                            <th>Bank</th>
                            <th>Cheque No</th>
                            <th>Currrent Salaray</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          <tr>
                            <td>001:Sir Amir:Hr</td>
                            <td>02/02/2025</td>
                            <td>Habib</td>
                            <td>84843</td>
                            <td>02/03/2025</td>
                            <td>2000</td>
                            <td>Loan</td>
                            <td>200</td>
                            <td>16</td>
                            <td>205555550</td>
                            <td>
                              <div className="d-flex gap-2">
                                <div className="edit ">
                                  <Button className="btn btn-soft-info">
                                    <i className="bx bx-edit"></i>
                                  </Button>
                                </div>
                                <div className="delete">
                                  <Button className="btn btn-soft-danger">
                                    <i className="ri-delete-bin-2-line"></i>
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
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
    </React.Fragment>
  );
};

export default Gratuity;
