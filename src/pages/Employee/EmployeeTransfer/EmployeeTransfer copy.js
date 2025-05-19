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
import { useDispatch, useSelector } from "react-redux";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { format } from "date-fns";
import {
  getEmployeeLocationTransfer,
  submitEmployeeLocationTransfer,
  updateEmployeeLocationTransfer,
  deleteEmployeeLocationTransfer,
} from "../../../slices/employee/employeeTransfer/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getEmployeeType } from "../../../slices/thunks";

const EmployeeTransfer = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState("");
  // get Employee Transfor
  const { loading, error, employeeLocationTransfer } = useSelector(
    (state) => state.EmployeeLocationTransfer
  );
  const { location } = useSelector((state) => state.Location);
  const { employeeType } = useSelector((state) => state.EmployeeType);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getEmployeeLocationTransfer());
  }, [dispatch]);
  // set date in input feilds
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  document.title = "Employee Location Transfer | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          <Row>
            <Col lg={12}>
              <Card>
                <Form>
                  <PreviewCardHeader
                    title="Employee Location Transfer"
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
                              <option value="Choices1">Staf</option>
                              <option value="Choices2">Worker</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Employee
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">001:Sir Amir:Hr</option>
                              <option value="Choices2">002:Sir Ijaz:HOD</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Old Location
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Lahore"
                              readOnly="true"
                              disabled="true"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="LocationID" className="form-label">
                              Location
                            </Label>
                            <select
                              name="LocationID"
                              id="LocationID"
                              className="form-select form-select-sm"
                              // value={formik.values.LocationID} // Bind to Formik state
                              // onChange={formik.handleChange} // Handle changes
                              // onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1">---Select---</option>
                              {location?.length > 0 ? (
                                location.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No location available
                                </option>
                              )}
                            </select>
                            {/* {formik.touched.LocationID &&
                            formik.errors.LocationID ? (
                              <div className="text-danger">
                                {formik.errors.LocationID}
                              </div>
                            ) : null} */}
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Effective Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                              min={getMinDate()} // Prevent past dates
                              value={selectedDate}
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
                              placeholder="Remarks"
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
                            <th>Old Location</th>
                            <th>New Location</th>
                            <th>Effective Date</th>
                            <th>Remarks</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {employeeLocationTransfer?.length > 0 ? (
                            employeeLocationTransfer.map((group, index) => (
                              <tr key={group.VID}>
                                <td>{group.VCode}</td>
                                <td>
                                  {location?.find(
                                    (groupItem) =>
                                      groupItem.VID === group.LocationID
                                  )?.VName || ""}
                                </td>
                                <td>
                                  {location?.find(
                                    (groupItem) =>
                                      groupItem.VID === group.LocationID
                                  )?.VName || ""}
                                </td>
                                <td>{formatDate(group.VDate)}</td>
                                <td>Ok</td>
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
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center">
                                No Employee Location Transfer found.
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
    </React.Fragment>
  );
};

export default EmployeeTransfer;
