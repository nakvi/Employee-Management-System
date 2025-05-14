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
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getAttendanceEntry } from "../../../slices/Attendance/AttendanceEntry/thunk";
import PreviewCardHeader2 from "../../../Components/Common/PreviewCardHeader2";

const AttendanceEntry = () => {
  const dispatch = useDispatch();
  document.title = "Attendance Entry | EMS";

  // Form state
  const [formData, setFormData] = useState({
    location: "",
    department: "",
    employeeType: "",
    designation: "",
    vdate: "",
    vType: "BOTH",
  });

  // Get data from Redux store
  const { location = [] } = useSelector((state) => state.Location || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { designation = [] } = useSelector((state) => state.Designation || {});
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { attendanceData = [], loading } = useSelector((state) => state.AttendanceEntry || {});

  useEffect(() => {
    dispatch(getLocation());
    dispatch(getDepartment());
    dispatch(getDesignation());
    dispatch(getEmployeeType());
  }, [dispatch]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle radio button changes
  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, vType: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Form Data:", formData); // Debug form data
    const params = {
      orgini: "LTT",
      vdate: formData.vdate,
      datefrom: formData.vdate,
      dateto: formData.vdate,
      deptids: formData.department,
      employeeidlist: "",
      companyid: "0",
      locationid: formData.location,
      etypeid: formData.employeeType,
      empid: "0",
      isau: "0",
      onlyot: "0",
      isexport: "0",
      uid: "0",
      inflage: "0",
    };
    console.log("API Params:", params); // Debug API params
    dispatch(getAttendanceEntry(params)).then((response) => {
      console.log("API Response:", response); // Debug API response
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={handleSubmit}>
                  <PreviewCardHeader2 title="Attendance Entry" onFetch={handleSubmit} />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="locationInput" className="form-label">
                              Location
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="location"
                              id="locationInput"
                              value={formData.location}
                              onChange={handleInputChange}
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
                          <div className="mb-3">
                            <Label htmlFor="departmentGroupInput" className="form-label">
                              Department
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="department"
                              id="departmentGroupInput"
                              value={formData.department}
                              onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
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
                          <div className="mb-3">
                            <Label htmlFor="employeeTypeInput" className="form-label">
                              E-Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="employeeType"
                              id="employeeTypeInput"
                              value={formData.employeeType}
                              onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
                              {employeeType.length > 0 ? (
                                employeeType.map((type) => (
                                  <option key={type.VID} value={type.VID}>
                                    {type.VName || type.EmployeeTypeName || type.title}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No employee types available</option>
                              )}
                            </select>
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="designationInput" className="form-label">
                              Designation
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="designation"
                              id="designationInput"
                              value={formData.designation}
                              onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
                              {designation.length > 0 ? (
                                designation.map((desig) => (
                                  <option key={desig.VID} value={desig.VID}>
                                    {desig.VName || desig.DesignationName || desig.title}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No designations available</option>
                              )}
                            </select>
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="vdate" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="vdate"
                              name="vdate"
                              value={formData.vdate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div className="d-flex gap-2 mt-3">
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="VIN"
                                name="vType"
                                value="VIN"
                                checked={formData.vType === "VIN"}
                                onChange={handleRadioChange}
                              />
                              <Label className="form-check-label" htmlFor="VIN">
                                For In
                              </Label>
                            </div>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="VOUT"
                                name="vType"
                                value="VOUT"
                                checked={formData.vType === "VOUT"}
                                onChange={handleRadioChange}
                              />
                              <Label className="form-check-label" htmlFor="VOUT">
                                For Out
                              </Label>
                            </div>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="BOTH"
                                name="vType"
                                value="BOTH"
                                checked={formData.vType === "BOTH"}
                                onChange={handleRadioChange}
                              />
                              <Label className="form-check-label" htmlFor="BOTH">
                                Both
                              </Label>
                            </div>
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div className="mt-3">
                            <Button
                              color="primary"
                              onClick={handleSubmit}
                              disabled={loading}
                            >
                              {loading ? "Loading..." : "Fetch Attendance"}
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
                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap table-sm"
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th>Sr #</th>
                            <th>Employee</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Remarks</th>
                            <th>
                              <Input
                                className="form-check-input me-1"
                                type="checkbox"
                              />
                              Changed
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {attendanceData.length > 0 ? (
                            attendanceData.map((entry, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{entry.employee || "N/A"}</td>
                                <td>
                                  <Input
                                    type="time"
                                    className="form-control form-control-sm"
                                    defaultValue={entry.timeIn || ""}
                                  />
                                </td>
                                <td>
                                  <Input
                                    type="time"
                                    className="form-control form-control-sm"
                                    defaultValue={entry.timeOut || ""}
                                  />
                                </td>
                                <td>
                                  <Input
                                    className="form-control-sm w-75"
                                    type="text"
                                    defaultValue={entry.remarks || ""}
                                  />
                                </td>
                                <td>
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultChecked={entry.changed || false}
                                  />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No attendance data available
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
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AttendanceEntry;