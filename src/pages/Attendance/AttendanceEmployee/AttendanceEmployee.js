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
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getAttendanceEmployee, saveAttendanceEmployee, resetAttendanceEmployeeData } from "../../../slices/Attendance/AttendanceEmployee/thunk";
import { toast } from "react-toastify";

const AttendanceEmployee = () => {
  const dispatch = useDispatch();
  document.title = "Attendance Employee | EMS";

  // Form state
  const [formData, setFormData] = useState({
    etypeid: "",
    deptids: "",
    employeeidlist: "",
    location: "",
    datefrom: new Date().toISOString().split("T")[0], // Set current date as default
    dateto: new Date().toISOString().split("T")[0], // Set current date as default
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    etypeid: "",
  });

  // State to manage table data with editable fields and checkbox status
  const [tableData, setTableData] = useState([]);

  // Selectors for Redux state
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = Array.isArray(department.data) ? department.data : [];
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { employee = [] } = useSelector((state) => state.Employee || {});
  const { location = [] } = useSelector((state) => state.Location || {});
  const { attendanceEmployeeData = [], loading, error, saveLoading, saveError } = useSelector(
    (state) => state.AttendanceEmployee || { attendanceEmployeeData: [], loading: false, error: null, saveLoading: false, saveError: null }
  );

  // Fetch initial data
  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getLocation());
  }, [dispatch]);

  // Update tableData when attendanceEmployeeData changes
  useEffect(() => {
    setTableData(
      attendanceEmployeeData.map((item) => ({
        ...item,
        post: item.changed || false,
      }))
    );
  }, [attendanceEmployeeData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const errors = { etypeid: "" };

    if (!formData.etypeid) {
      errors.etypeid = "E-Type is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Handle Fetch button click
  const handleFetch = () => {
    if (!validateForm()) {
      console.log("Validation failed:", validationErrors);
      return;
    }

    let datefrom = formData.datefrom || "";
    let dateto = formData.dateto || "";
    if (datefrom && !dateto) {
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
      employeeidlist: formData.employeeidlist || "",
      locationid: formData.location || "0",
      vdate: "2025-05-28",
      datefrom: datefrom,
      dateto: dateto,
      orgini: "LTT",
      companyid: "1",
      empid: "0",
      isau: "0",
      onlyot: "0",
      isexport: "0",
      uid: "1",
      inflage: "0",
    };
    console.log("Fetching with params:", params);
    dispatch(getAttendanceEmployee(params));
  };

  // Handle Cancel button click
  const handleCancel = () => {
    console.log("Cancel button clicked, resetting form and Redux state");
    setFormData({
      etypeid: "",
      deptids: "",
      employeeidlist: "",
      location: "",
      datefrom: new Date().toISOString().split("T")[0],
      dateto: new Date().toISOString().split("T")[0],
    });
    setValidationErrors({ etypeid: "" });
    dispatch(resetAttendanceEmployeeData());
    setTableData([]);
    console.log("Form data after reset:", formData);
  };

  // Handle Save button click
  const handleSave = () => {
    // Check for changes by comparing tableData with attendanceEmployeeData
    const changedRows = tableData.filter((row, index) => {
      const originalRow = attendanceEmployeeData[index];
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
        empid: Number(row.empid) || 1,
        vdate: formData.datefrom || new Date().toISOString().split("T")[0],
        vid1: row.vid1 || 0,
        vid2: row.vid2 || 0,
        shiftID: row.shiftID || 3,
        dateIn1: row.timeIn ? `${formData.datefrom} ${row.timeIn}:00` : "1900-01-01",
        dateOut1: row.timeOut ? `${formData.datefrom} ${row.timeOut}:00` : "1900-01-01",
        dateIn2: row.timeIn2 ? `${formData.datefrom} ${row.timeIn2}:00` : "1900-01-01",
        dateOut2: row.timeOut2 ? `${formData.datefrom} ${row.timeOut2}:00` : "1900-01-01",
        remarks: row.remarks || "",
        uID: 1,
        computerName: "HR-PC-001",
      };
      dispatch(saveAttendanceEmployee(payload));
    });
  };

  // Handle form submission to prevent default behavior
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
          {saveLoading && <p>Saving changes...</p>}
          {saveError && <p className="text-danger">{saveError}</p>}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={handleFormSubmit}>
                  <CardHeader className="align-items-center d-flex py-2">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Attendance Employee
                    </h4>
                    <div className="flex-shrink-0">
                      <Button
                        type="button"
                        color="success"
                        className="add-btn me-1 py-1"
                        onClick={handleFetch}
                      >
                        <i className="align-bottom me-1"></i>Fetch
                      </Button>
                      <Button
                        type="button"
                        color="success"
                        className="add-btn me-1 py-1"
                        onClick={handleSave}
                      >
                        <i className="align-bottom me-1"></i>Save
                      </Button>
                      <Button
                        type="button"
                        color="dark"
                        className="add-btn me-1 py-1"
                        onClick={handleCancel}
                      >
                        <i className="align-bottom me-1"></i>Cancel
                      </Button>
                      <Button
                        type="button"
                        color="danger"
                        className="add-btn me-1 py-1"
                        disabled
                      >
                        <i className="align-bottom me-1"></i>Remove Extra Attendance
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="etypeid" className="form-label">
                              E-Type
                            </Label>
                            <select
                              className={`form-select form-select-sm ${validationErrors.etypeid ? "is-invalid" : ""}`}
                              name="etypeid"
                              id="etypeid"
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
                          <div className="mb-3">
                            <Label htmlFor="employeeidlist" className="form-label">
                              Employee
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="employeeidlist"
                              id="employeeidlist"
                              value={formData.employeeidlist}
                              onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
                              {employee.map((item) => (
                                <option key={item.EmpID} value={item.EmpID}>
                                  {item.EName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="datefrom" className="form-label">
                              Date From
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="datefrom"
                              name="datefrom"
                              value={formData.datefrom}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="dateto" className="form-label">
                              Date To
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="dateto"
                              name="dateto"
                              value={formData.dateto}
                              onChange={handleInputChange}
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
                            <th>Sr #</th>
                            <th>Date</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Time In 2</th>
                            <th>Time Out 2</th>
                            <th>Remarks</th>
                            <th>
                              <Input
                                className="form-check-input me-1"
                                type="checkbox"
                              />
                              Post
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {Array.isArray(tableData) && tableData.length > 0 ? (
                            tableData.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.date || "N/A"}</td>
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
                            ))
                          ) : (
                            <tr>
                              {/* <td colSpan="8" className="text-center">
                                No attendance data available.
                              </td> */}
                            </tr>
                          )}
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
                            {/* <p className="text-muted mb-0">
                              Please select an E-Type and click Fetch to view attendance data.
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

export default AttendanceEmployee;