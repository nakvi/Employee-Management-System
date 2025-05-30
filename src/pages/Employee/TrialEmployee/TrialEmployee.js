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
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";

const TrialEmployee = () => {
  document.title = "Trial Employee | EMS";

  const dispatch = useDispatch();

  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
  }, [dispatch]);

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
                    title="Trial Employee"
                  // onCancel={formik.resetForm}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              E-Type
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              {employeeType.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Employee
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="fatherName"
                              placeholder="Employee Name"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Department
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              {departmentList.length > 0 ? (
                                departmentList.map((dept) => (
                                  <option key={dept.VID} value={dept.VID}>
                                    {dept.VName || dept.DepartmentName || dept.title}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No departments available</option>
                              )}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="HireType" className="form-label">
                              Hire Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="Off Day- 2"
                            >
                              <option value="">--- Select ---</option>
                              <option value="it">IT</option>
                              <option value="hr">HR</option>
                            </select>
                          </div>
                        </Col>
                        {/* Name */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="name" className="form-label">
                              Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="name"
                              placeholder="Name"
                            />
                          </div>
                        </Col>

                        {/* Father Name */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="fatherName" className="form-label">
                              Father Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="fatherName"
                              placeholder="Father Name"
                            />
                          </div>
                        </Col>
                        {/* Shift */}
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="Shift" className="form-label">
                              Shift
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="Off Day- 2"
                            >
                              <option value="">--- Select ---</option>
                              <option value="it">IT</option>
                              <option value="hr">HR</option>
                            </select>
                          </div>
                        </Col>
                        {/* DOB */}
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="dob" className="form-label">
                              DOB
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="dob"
                              value="2025-02-04"
                            />
                          </div>
                        </Col>
                        {/* DOJ */}
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="doj" className="form-label">
                              DOJ
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="doj"
                              value="2025-02-04"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="VName" className="form-label">
                              Present Address
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Present Address"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="VName" className="form-label">
                              Reference
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Reference"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="VName" className="form-label">
                              Contact#
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="contact"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div >
                            <Label htmlFor="VName" className="form-label">
                              NIC
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="NIC"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Closing Date
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
                            <Label htmlFor="Shift" className="form-label">
                              Closing Status
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="Off Day- 2"
                            >
                              <option value="">--- Select ---</option>
                              <option value="it">IT</option>
                              <option value="hr">HR</option>
                            </select>
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
                            <th>Bank</th>
                            <th>Demand Date </th>
                            <th>Demand Till</th>
                            <th>Paid Till</th>
                            <th> Previous</th>
                            <th>Currrent Salaray</th>
                            <th>Due Amount</th>
                            <th>Amount</th>
                            <th>Cheque No</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          <tr>
                            <td>001:Sir Amir:Hr</td>
                            <td>Loan</td>
                            <td>02/02/2025</td>
                            <td>Habib</td>
                            <td>84843</td>
                            <td>02/03/2025</td>
                            <td>2000</td>
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

export default TrialEmployee;
