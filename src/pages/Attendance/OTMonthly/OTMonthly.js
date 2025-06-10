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
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PreviewCardHeader2 from "../../../Components/Common/PreviewCardHeader2";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getOTMonthly, submitOTMonthly } from "../../../slices/Attendance/OTMonthly/thunk";

const OTMonthly = () => {
  document.title = "O/T Monthly | EMS";

  const dispatch = useDispatch();

  // State for form inputs
  const [formData, setFormData] = useState({
    eType: "",
    location: "",
    department: [],
    designation: "",
    month: "",
    otOnly: false,
    otEntries: [],
  });

  // Selectors for data
  const { location = [] } = useSelector((state) => state.Location || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { designation = [] } = useSelector((state) => state.Designation || {});
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { otMonthly, loading, error } = useSelector((state) => state.OTMonthly || {});

  // Fetch data on mount
  useEffect(() => {
    dispatch(getLocation());
    dispatch(getDepartment());
    dispatch(getDesignation());
    dispatch(getEmployeeType());
  }, [dispatch]);

  // Log otEntries for debugging
  useEffect(() => {
    console.log("Current otEntries in state:", formData.otEntries);
  }, [formData.otEntries]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle multi-select changes for department
  const handleMultiChange = (name, selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  // Handle OT entry changes (for the table row)
  const handleOTEntryChange = (index, field, value) => {
    const updatedEntries = [...formData.otEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setFormData((prev) => ({ ...prev, otEntries: updatedEntries }));
  };

  // Validate E-Type
  const validateEType = () => {
    if (!formData.eType) {
      toast.error("E-Type is required!");
      return false;
    }
    return true;
  };

  // Construct EmployeeIdList string
  const buildEmployeeIdList = () => {
    const conditions = [];

    if (formData.eType) {
      conditions.push(`E."ETypeID" = ${formData.eType}`);
    }

    if (formData.location) {
      conditions.push(`E."LocationID" = ${formData.location}`);
    }

    if (formData.department.length > 0) {
      if (formData.department.length === 1) {
        conditions.push(`E."DeptID" = ${formData.department[0]}`);
      } else {
        conditions.push(`E."DeptID" IN (${formData.department.join(",")})`);
      }
    }

    if (formData.designation) {
      conditions.push(`E."DesgID" = ${formData.designation}`);
    }

    return conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";
  };

  // Handle Fetch button click
  const handleFetch = () => {
    if (!validateEType()) return;

    const filterConditions = {
      eType: formData.eType,
      location: formData.location,
      department: formData.department,
      designation: formData.designation,
      month: formData.month,
      employeeIdList: buildEmployeeIdList(),
    };

    console.log("Fetch Payload:", JSON.stringify(filterConditions, null, 2));

    dispatch(getOTMonthly(filterConditions)).then((response) => {
      console.log("Raw API Response:", response);
      console.log("API Response Payload:", response.payload);

      const dataArray = Array.isArray(response.payload) ? response.payload : [];

      console.log("Data Array:", dataArray);

      if (dataArray.length) {
        const mappedEntries = dataArray.map((item) => ({
          employee: item.EName || item.EmpCode || "N/A",
          attCode: item.AttCode || "N/A",
          shiftTime: item.ShiftTime || 0,
          totalTime: item.TotalTime || 0,
          overTime: item.OverTime !== undefined ? String(item.OverTime) : "0.0",
          remarks: item.Remarks || "",
          post: item.IsChanged === 1,
        }));

        console.log("Mapped OT Entries:", mappedEntries);

        setFormData((prev) => ({
          ...prev,
          otEntries: mappedEntries,
        }));
      } else {
        console.log("No data to map, setting otEntries to empty array");
        setFormData((prev) => ({
          ...prev,
          otEntries: [],
        }));
        toast.info("No records found for the selected criteria.");
      }
    });
  };

  // Handle Save button click
  const handleSave = (e) => {
    e.preventDefault();
    if (!validateEType()) return;

    // Filter entries where post is true
    const selectedEntries = formData.otEntries.filter((entry) => entry.post);

    if (selectedEntries.length === 0) {
      toast.error("No entries selected for submission!");
      return;
    }

    // Construct payload for each selected entry
    const otEntriesPayload = selectedEntries.map((entry, index) => ({
      VID: 1, // Temporary unique ID for each entry
      VName: "Monthly Overtime",
      VNo: `OT-2025-${String(index + 1).padStart(3, "0")}`, // e.g., OT-2025-001
      VDate: "2025-06-10T08:00:00Z", // Hardcoded as per requirement
      // EmpID: entry.employee, // Assuming employee field contains EmpID or EmpCode
      EmpID: "entry.employee", // Assuming employee field contains EmpID or EmpCode
      OverTime: parseFloat(entry.overTime) || 0.0, // Convert to number
      LeaveTypeID: 2, // Hardcoded
      IsPosted: 0, // Hardcoded
      PostedDate: "1900-01-01", // Hardcoded
      PostedBy: 1, // Hardcoded
      IsCanceled: 0, // Hardcoded
      CanceledDate: "1900-01-01", // Hardcoded
      CanceledBy: 1, // Hardcoded
      UID: 1002, // Hardcoded
      CompanyID: 5, // Hardcoded
      Tranzdatetime: "2025-06-10T09:30:00Z", // Hardcoded
    }));

    const payload = {
      employeeIdList: buildEmployeeIdList(),
      otEntries: otEntriesPayload,
    };

    console.log("Submit Payload:", JSON.stringify(payload, null, 2));

    dispatch(submitOTMonthly(payload)).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("O/T Monthly submitted successfully!");
        // Optionally clear or refresh the form
        setFormData((prev) => ({
          ...prev,
          otEntries: [],
        }));
      }
    });
  };

  // Handle Cancel button click
  const handleCancel = () => {
    setFormData({
      eType: "",
      location: "",
      department: [],
      designation: "",
      month: "",
      otOnly: false,
      otEntries: [],
    });
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
                <Form onSubmit={(e) => e.preventDefault()}>
                  <PreviewCardHeader2
                    title="O/T Monthly"
                    onFetch={handleFetch}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    disabled={loading}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="eType" className="form-label">
                              E-Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="eType"
                              id="eType"
                              value={formData.eType}
                              onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
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
                            <Label htmlFor="location" className="form-label">
                              Location
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="location"
                              id="location"
                              value={formData.location}
                              onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
                              {location.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="department" className="form-label">
                              Department
                            </Label>
                            <Select
                              isMulti
                              name="department"
                              id="department"
                              value={departmentList
                                .filter((dept) => formData.department.includes(dept.VID))
                                .map((dept) => ({
                                  value: dept.VID,
                                  label: dept.VName,
                                }))}
                              onChange={(selected) => handleMultiChange("department", selected)}
                              options={departmentList.map((dept) => ({
                                value: dept.VID,
                                label: dept.VName,
                              }))}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="designation" className="form-label">
                              Designation
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="designation"
                              id="designation"
                              value={formData.designation}
                              onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
                              {designation.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="month" className="form-label">
                              Month
                            </Label>
                            <Input
                              type="month"
                              className="form-control-sm"
                              id="month"
                              name="month"
                              value={formData.month}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2} className="mt-3">
                          <div className="form-check mt-4">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="otOnly"
                              name="otOnly"
                              checked={formData.otOnly}
                              onChange={handleInputChange}
                            />
                            <Label className="form-check-label" htmlFor="otOnly">
                              O/T Only
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
                            <th>Attendance Code</th>
                            <th>Shift Time</th>
                            <th>Total Time</th>
                            <th>Over Time</th>
                            <th>Remarks</th>
                            <th>
                              <Input
                                className="form-check-input me-1"
                                type="checkbox"
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const updatedEntries = formData.otEntries.map((entry) => ({
                                    ...entry,
                                    post: checked,
                                  }));
                                  setFormData((prev) => ({ ...prev, otEntries: updatedEntries }));
                                }}
                              />
                              Post
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {formData.otEntries.map((entry, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{entry.employee}</td>
                              <td>{entry.attCode}</td>
                              <td>{entry.shiftTime}</td>
                              <td>{entry.totalTime}</td>
                              <td>
                                <Input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={entry.overTime}
                                  onChange={(e) =>
                                    handleOTEntryChange(index, "overTime", e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <Input
                                  className="form-control-sm w-75"
                                  type="text"
                                  value={entry.remarks}
                                  onChange={(e) =>
                                    handleOTEntryChange(index, "remarks", e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={entry.post}
                                  onChange={(e) =>
                                    handleOTEntryChange(index, "post", e.target.checked)
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {formData.otEntries.length === 0 && (
                        <div className="noresult text-center mt-4">
                          <lord-icon
                            src="https://cdn.lordicon.com/msoeawqm.json"
                            trigger="loop"
                            colors="primary:#121331,secondary:#08a88a"
                            style={{ width: "75px", height: "75px" }}
                          ></lord-icon>
                          <h5 className="mt-2">No Results Found</h5>
                          <p className="text-muted mb-0">
                            No records match the selected criteria. Please adjust your filters and try again.
                          </p>
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

export default OTMonthly;