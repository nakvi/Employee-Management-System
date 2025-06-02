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
import { getLocation } from "../../../slices/setup/location/thunk";
import { getAttendanceChange, postAttendanceChange, resetAttendanceChange } from "../../../slices/Attendance/AttendanceChange/thunk";
import { toast } from "react-toastify";
import PreviewCardHeader2 from "../../../Components/Common/PreviewCardHeader2";

const ChangeAttendance = () => {
  const dispatch = useDispatch();
  document.title = "Change Attendance | EMS";

  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = Array.isArray(department.data) ? department.data : [];
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { location = [] } = useSelector((state) => state.Location || {});
  const { attendanceData = [], loading, error, postLoading, postError } = useSelector((state) => state.AttendanceChange || { attendanceData: [], loading: false, error: null, postLoading: false, postError: null });

  // Form state
  const [formData, setFormData] = useState({
    etypeid: "",
    deptids: "",
    location: "",
    vdate: new Date().toISOString().split("T")[0], // Set current date as default
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    etypeid: "",
    vdate: "",
  });

  // State to manage table data with editable fields and checkbox status
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getLocation());
  }, [dispatch]);

  useEffect(() => {
    // Update tableData when attendanceData changes
    setTableData(
      attendanceData.map((item) => ({
        ...item,
        post: item.post || false,
      }))
    );
  }, [attendanceData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    let datefrom = formData.vdate || "";
    let dateto = "";
    if (datefrom) {
      try {
        const dateObj = new Date(datefrom);
        if (!isNaN(dateObj.getTime())) {
          dateObj.setDate(dateObj.getDate() + 1);
          dateto = dateObj.toISOString().split("T")[0];
        }
      } catch (error) {
        console.error("Error calculating dateto:", error);
      }
    }

    const params = {
      etypeid: formData.etypeid || "0",
      deptids: formData.deptids || "",
      locationid: formData.location || "0", // Include location in params
      vdate: formData.vdate || "",
      datefrom: datefrom,
      dateto: dateto,
      orgini: "LTT",
      companyid: "1",
      locationid: formData.location || "1", // Use formData.location
      empid: "0",
      uid: "1",
    };
    console.log("Fetching with params:", params);
    dispatch(getAttendanceChange(params));
  };

  const handleCancel = () => {
    console.log("Cancel button clicked, resetting form and Redux state");
    setFormData({
      etypeid: "",
      deptids: "",
      location: "",
      vdate: new Date().toISOString().split("T")[0], // Reset to current date
    });
    setValidationErrors({ etypeid: "", vdate: "" });
    dispatch(resetAttendanceChange());
    setTableData([]);
    console.log("Form data after reset:", formData);
  };

  const handleSave = () => {
    // Check for changes by comparing tableData with attendanceData
    const changedRows = tableData.filter((row, index) => {
      const originalRow = attendanceData[index];
      return (
        row.post &&
        (row.timeIn !== originalRow.timeIn ||
         row.timeOut !== originalRow.timeOut ||
         row.timeIn2 !== originalRow.timeIn2 ||
         row.timeOut2 !== originalRow.timeOut2 ||
         row.remarks !== originalRow.remarks)
      );
    });

    if (changedRows.length === 0) {
      toast.info("No changes detected.");
      return;
    }

    // Loop through changed rows and dispatch POST request for each
    changedRows.forEach((row) => {
      const payload = {
        vid: 0,
        empid: row.empid || 1,
        vdate: formData.vdate || new Date().toISOString().split("T")[0],
        vid1: row.vid1 || 0,
        vid2: 0,
        shiftID: 3, // Assuming a default shiftID as per your example
        dateIn1: row.timeIn ? `${formData.vdate} ${row.timeIn}:00` : "1900-01-01 00:00:00",
        dateOut1: row.timeOut ? `${formData.vdate} ${row.timeOut}:00` : "1900-01-01 00:00:00",
        dateIn2: row.timeIn2 ? `${formData.vdate} ${row.timeIn2}:00` : "1900-01-01 00:00:00",
        dateOut2: row.timeOut2 ? `${formData.vdate} ${row.timeOut2}:00` : "1900-01-01 00:00:00",
        remarks: row.remarks || "",
        uID: 101, // As per your example
        computerName: "HR-PC-001", // As per your example
      };
      dispatch(postAttendanceChange(payload));
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submission prevented");
  };

  // Handle changes in table inputs
  const handleTableInputChange = (index, field, value) => {
    setTableData((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [field]: value, post: true } // Auto-check post checkbox
          : item
      )
    );
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (index) => {
    setTableData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, post: !item.post } : item
      )
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          {postLoading && <p>Saving changes...</p>}
          {postError && <p className="text-danger">{postError}</p>}
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
                            <th>Time In 2</th>
                            <th>Time Out 2</th>
                            <th>Remarks</th>
                            <th>
                              <Input className="form-check-input me-1" type="checkbox" />
                              Post
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {Array.isArray(tableData) && tableData.map((item, index) => (
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
                                  onChange={(e) =>
                                    handleTableInputChange(index, "timeIn", e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <Input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={item.timeOut || ""}
                                  onChange={(e) =>
                                    handleTableInputChange(index, "timeOut", e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <Input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={item.timeIn2 || ""}
                                  onChange={(e) =>
                                    handleTableInputChange(index, "timeIn2", e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <Input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={item.timeOut2 || ""}
                                  onChange={(e) =>
                                    handleTableInputChange(index, "timeOut2", e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <Input
                                  className="form-control-sm w-75"
                                  type="text"
                                  value={item.remarks || ""}
                                  onChange={(e) =>
                                    handleTableInputChange(index, "remarks", e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={item.post || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {(!Array.isArray(tableData) || tableData.length === 0) && !loading && (
                        <div className="noresult">
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