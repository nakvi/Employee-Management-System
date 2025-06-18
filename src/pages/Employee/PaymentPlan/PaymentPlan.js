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
  CardHeader,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";
import PreviewCardHeader2 from "../../../Components/Common/PreviewCardHeader2";

const PaymentPlan = () => {
  const dispatch = useDispatch();

  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];

  useEffect(() => {
    dispatch(getEmployeeType());
    dispatch(getDepartment());
  }, [dispatch]);
  // Formik setup
  const formik = useFormik({
    initialValues: {
      ETypeID: "",
      DesgID: "",
      Month: "",
      UID: 501,
      CompanyID: "1001",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      // DesgID: Yup.number()
      //   .min(1, "Department is required")
      //   .required("Required"),
      // Month: Yup.month().required("Month is required"),
    }),
    // onSubmit: (values) => {
    //   if (editingGroup) {
    //     dispatch(
    //       updateSalaryAllowanceDeduction({ ...values, VID: editingGroup.VID })
    //     ).then(() => {
    //       dispatch(getAdvance()); // Fetch updated data after update
    //       setEditingGroup(null); // Reset editing state
    //       formik.resetForm(); // Reset form
    //     });
    //   } else {
    //     dispatch(submitSalaryAllowanceDeduction(values)).then(() => {
    //       dispatch(getAdvance()); // Fetch updated data after submission
    //       formik.resetForm(); // Reset form
    //     });
    //   }
    // },
  });
  // fetch data 
  const handleFetch = () =>{
    alert("ok");
  }
  
  document.title = "Payment Plan | EMS";
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
                  {/* <CardHeader className="align-items-center d-flex py-2">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Payment Plan
                    </h4>
                    <div className="flex-shrink-0">
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                        id="create-btn"
                      >
                        <i className="align-bottom me-1"></i>Fetch
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                        id="create-btn"
                      >
                        <i className="align-bottom me-1"></i>Save
                      </Button>
                      <Button color="dark" className="add-btn me-1 py-1">
                        <i className="align-bottom me-1"></i> Cancel
                      </Button>
                    </div>
                  </CardHeader> */}
                  <PreviewCardHeader2
                    title="Payment Plan"
                    onFetch={handleFetch}
                    // onSave={handleSave}
                    onCancel={formik.resetForm}
                    // disabled={false}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="ETypeID" className="form-label">
                              E-Type
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="ETypeID"
                              id="ETypeID"
                               value={formik.values.ETypeID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select--- </option>
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
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="DesgID" className="form-label">
                              Department
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="DesgID"
                              id="DesgID"
                               value={formik.values.DesgID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select--- </option>
                              {departmentList.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>

                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="month" className="form-label">
                              Month
                            </Label>
                            <Input
                              type="month"
                              className="form-control-sm"
                              name="Month"
                              id="Month"
                               {...formik.getFieldProps("Month")}
                            />
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
                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap table-sm"
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th>Employee</th>
                            <th>Loan Date</th>
                            <th>Loan Amount</th>
                            <th>Installment</th>
                            <th>Balance</th>
                            <th>Ded Amount</th>
                            <th>
                              <Input
                                className="form-check-input me-1"
                                type="checkbox"
                              />
                              Finalized
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          <tr>
                            <td>001:Sir Amir:Hr</td>
                            <td>02/02/2025</td>
                            <td>3000</td>
                            <td>1000</td>
                            <td>100</td>
                            <td>
                              <Input
                                className="form-control-sm w-75"
                                type="number"
                                placeholder="1000"
                              />
                            </td>
                            <td>
                              <Input
                                className="form-check-input"
                                type="checkbox"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
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

export default PaymentPlan;
