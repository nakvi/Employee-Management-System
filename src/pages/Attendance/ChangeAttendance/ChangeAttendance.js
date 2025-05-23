import React, { useState, useEffect } from "react";
import {
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
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getAttendanceChange, resetAttendanceChange } from "../../../slices/Attendance/AttendanceChange/thunk";
import PreviewCardHeader2 from "../../../Components/Common/PreviewCardHeader2";

const ChangeAttendance = () => {
  const dispatch = useDispatch();
  document.title = "Change Attendance | EMS";

  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = Array.isArray(department.data) ? department.data : [];
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { attendanceData = [], loading, error } = useSelector((state) => state.AttendanceChange || { attendanceData: [], loading: false, error: null });

  // Form state
  const [formData, setFormData] = useState({
    etypeid: "",
    deptids: "",
    vdate: "",
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    etypeid: "",
    vdate: "",
  });

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { etypeid: "", vdate: "" };

    if (!formData.etypeid) {
      errors.etypeid = "E-Type is required";
      isValid = false;
    }
    if (!formData.vdate) {
      errors.vdate = "Date is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleFetch = () => {
    if (!validateForm()) {
      console.log("Validation failed:", validationErrors);
      return;
    }

    // Calculate dateto as vdate + 1 day
    let datefrom = formData.vdate || "";
    let dateto = "";
    if (datefrom) {
      try {
        const dateObj = new Date(datefrom);
        if (!isNaN(dateObj.getTime())) {
          dateObj.setDate(dateObj.getDate() + 1);
          dateto = dateObj.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        }
      } catch (error) {
        console.error("Error calculating dateto:", error);
      }
    }

    const params = {
      etypeid: formData.etypeid || "0",
      deptids: formData.deptids || "",
      vdate: formData.vdate || "",
      datefrom: datefrom,
      dateto: dateto,
      orgini: "LTT",
      companyid: "1",
      locationid: "1",
      empid: "0",
      uid: "1",
    };
    console.log("Fetching with params:", params);
    dispatch(getAttendanceChange(params));
  };

  const handleCancel = () => {
    console.log("Cancel button clicked, resetting form and Redux state");
    setFormData({ etypeid: "", deptids: "", vdate: "" });
    setValidationErrors({ etypeid: "", vdate: "" });
    dispatch(resetAttendanceChange());
    console.log("Form data after reset:", formData);
  };

  // No-op for Save button (not implemented)
  const handleSave = () => {
    console.log("Save button clicked (no functionality implemented)");
  };

  // Prevent form submission to avoid page refresh
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submission prevented");
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
                <Form onSubmit={handleFormSubmit}>
                  <PreviewCardHeader2
                    title="Change Attendance"
                    onFetch={handleFetch}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    disabled={false}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="AttGroupID" className="form-label">
                              E-Type
                            </Label>
                            <select
                              className={`form-select form-select-sm ${validationErrors.etypeid ? "is-invalid" : ""}`}
                              name="etypeid"
                              id="AttGroupID"
                              value={formData.etypeid}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">---Select---</option>
                              {employeeType.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {validationErrors.etypeid && (
                              <div className="invalid-feedback">{validationErrors.etypeid}</div>
                            )}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="deptids" className="form-label">
                              Department
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="deptids"
                              id="deptids"
                              value={formData.deptids}
                              onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
                              {departmentList.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
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
                              className={`form-control-sm ${validationErrors.vdate ? "is-invalid" : ""}`}
                              id="vdate"
                              name="vdate"
                              value={formData.vdate}
                              onChange={handleInputChange}
                              required
                            />
                            {validationErrors.vdate && (
                              <div className="invalid-feedback">{validationErrors.vdate}</div>
                            )}
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
                            <th>Attendance Code</th>
                            <th>Shift Time</th>
                            <th>Total Time</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Remarks</th>
                            <th>
                              <Input className="form-check-input me-1" type="checkbox" />
                              Post
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {Array.isArray(attendanceData) && attendanceData.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.employee || "N/A"}</td>
                              <td>{item.attendanceCode || "N/A"}</td>
                              <td>{item.shiftTime || "N/A"}</td>
                              <td>{item.totalTime || "N/A"}</td>
                              <td>
                                <Input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={item.timeIn || ""}
                                  readOnly
                                />
                              </td>
                              <td>
                                <Input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={item.timeOut || ""}
                                  readOnly
                                />
                              </td>
                              <td>
                                <Input
                                  className="form-control-sm w-75"
                                  type="text"
                                  value={item.remarks || ""}
                                  readOnly
                                />
                              </td>
                              <td>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={item.post || false}
                                  readOnly
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {(!Array.isArray(attendanceData) || attendanceData.length === 0) && !loading && (
                        <div className="noresult">
                          <div className="text-center">
                            <lord-icon
                              src="https://cdn.lordicon.com/msoeawqm.json"
                              trigger="loop"
                              colors="primary:#121331,secondary:#08a88a"
                              style={{ width: "75px", height: "75px" }}
                            ></lord-icon>
                            <h5 className="mt-2">Sorry! No Result Found</h5>
                            {/* <p className="text-muted mb-0">
                              We've searched more than 150+ Orders We did not find
                              any orders for you search.
                            </p> */}
                          </div>
                        </div>
                      )}
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

export default ChangeAttendance;