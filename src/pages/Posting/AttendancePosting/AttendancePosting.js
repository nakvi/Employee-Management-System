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
import PreviewCardHeader2 from "../../../Components/Common/PreviewCardHeader2";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";

const AttendancePosting = () => {


  const dispatch = useDispatch();
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { location = [] } = useSelector((state) => state.Location || {});

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getLocation());
  }, [dispatch]);
  // Formik setup
  const formik = useFormik({
    initialValues: {
      ETypeID: "",
      DeptIDs: "",
      DateFrom: "",
      DateTo: "",
      IgnoreOld: "",
      LocationID: "",
      UID: "",
      CompanyID: "",
    },
    validationSchema: Yup.object({
      // ETypeID: Yup.string().required("Employee Type is required"),
      // DeptID: Yup.string().required("Department is required"),
      DateFrom: Yup.string().required("Date From is required"),
    }),
    onSubmit: () => {
      // handleFetch();
    },

  });

  // Fetch data
  const handleFetch = () => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        const params = {
          Orgini: "LTT",
          DateFrom: "",
          DateTo: "",
          EmployeeIDList: "",
          CompanyID: "1",
          LocationID: "0",
          ETypeID: formik.values.ETypeID || "0",
          EmpID: "0",
          IsAu: "0",
          UID: "0",
          IsExport: "0",
        };
        console.log("Fetching with params:", params);
      } else {
        formik.setTouched({
          ETypeID: true,
          DeptIDs: true,
          DateFrom: true,
          DateTo: true,
        });
        console.log("Form validation errors:", errors);
      }
    });
  };

  document.title = "Attendance Posting | EMS";
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
                  <PreviewCardHeader2 title="Attendance Posting"
                    onFetch={handleFetch}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="ETypeID"
                              className="form-label"
                            >
                              E-Type
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="ETypeID"
                              id="ETypeID"
                            >
                              <option value="">---Select--- </option>
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
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="DeptIDs"
                              className="form-label"
                            >
                              Department
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="DeptIDs"
                              id="DeptIDs"
                              value={formik.values.DeptIDs}
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
                          <div className="mb-3">
                            <Label htmlFor="LocationID" className="form-label">
                              Location
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="LocationID"
                              id="LocationID"
                             value={formik.values.LocationID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {location.length > 0 ? (
                                location.map((loc) => (
                                  <option key={loc.VID} value={loc.VID}>
                                    {loc.VName || loc.LocationName || loc.title}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No locations available</option>
                              )}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
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
                             {formik.touched.DateFrom && formik.errors.DateFrom ? (
                              <div className="text-danger">{formik.errors.DateFrom}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
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
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              Pending Posting
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              Resign Employee
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
                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap table-sm"
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th>Sr #</th>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>
                              <Input
                                className="form-check-input me-1"
                                type="checkbox"
                              />
                              Select All
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          <tr>
                            <td>1</td>
                            <td>001:Sir Amir:Hr</td>
                            <td>	zeta solutions  </td>

                            <td>SOftware Developer</td>
                            <td>
                              <Input
                                className="form-check-input"
                                type="checkbox"
                              />
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
                        </div>
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

export default AttendancePosting;
