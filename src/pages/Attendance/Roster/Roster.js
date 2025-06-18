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
import PreviewCardHeader4 from "../../../Components/Common/PreviewCardHeader4";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import {
  getRoster,
  submitRoster,
  getRosterDepartments,
  getRosterShift,
} from "../../../slices/Attendance/Roster/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Roster = () => {
  document.title = "Roster | EMS";
  const dispatch = useDispatch();

  // Get current month in YYYY-MM format
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;

  // State for form inputs
  const [formData, setFormData] = useState({
    rosterDepartments: "",
    month: currentMonth,
    dateFrom: "",
    dateTo: "",
    ShiftID: "",
    offDay: "",
    employeeidlist: "",
    otEntries: [],
    empCode: "",
    eType: "",
    department: "",
  });
  const [originalOtEntries, setOriginalOtEntries] = useState([]); // Track original fetched data

  // Selectors for data
  const { rosterDepartments = [] } = useSelector((state) => state.Roster || {});
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { roster, loading, error } = useSelector((state) => state.Roster || {});
  const { employee = [] } = useSelector((state) => state.Employee || {});
  const { rosterShifts = [] } = useSelector((state) => state.Roster || {});

  // console.log("Roster Departments:", rosterDepartments); // Debug log

  // Days of the week for the offDay dropdown
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Fetch data on mount
  useEffect(() => {
    dispatch(getRosterDepartments());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getRosterShift());
  }, [dispatch]);

  // Handle input changes for form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle day input changes
  const handleDayInputChange = (rowIndex, dayIndex, value) => {
    const updatedEntries = [...formData.otEntries];
    updatedEntries[rowIndex].days[dayIndex] = value;
    setFormData((prev) => ({ ...prev, otEntries: updatedEntries }));
  };

  // Construct employeeIdList string
  const buildEmployeeIdList = () => {
    const conditions = [];
    if (formData.eType) {
      conditions.push(`E."ETypeID" = ${formData.eType}`);
    }
    if (formData.department) {
      conditions.push(`E."DeptID" = ${formData.department}`);
    }
    if (formData.employeeidlist) {
      conditions.push(`E."EmpID" = ${formData.employeeidlist}`);
    }
    const employeeIdList =
      conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";
    console.log("Step 1 - Generated employeeIdList:", employeeIdList);
    return employeeIdList;
  };

  // Handle Fetch button click
  const handleFetch = () => {
    const employeeIdList = buildEmployeeIdList();
    const filterConditions = {
      eType: formData.eType,
      department: formData.department,
      month: formData.month || "",
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo,
      ShiftID: formData.ShiftID,
      offDay: formData.offDay,
      employeeIdList: employeeIdList,
      employeeName: formData.employeeidlist
        ? employee.find((emp) => emp.EmpID === parseInt(formData.employeeidlist))?.EName || ""
        : "",
    };

    console.log("Step 2 - Fetch Payload (filterConditions):", JSON.stringify(filterConditions, null, 2));

    dispatch(getRoster(filterConditions))
      .then((response) => {
        console.log("Step 3 - getRoster Response:", response);
        console.log("Step 4 - Response Payload:", response.payload);
        if (
          response.type === "roster/getRoster/fulfilled" &&
          response.payload &&
          Array.isArray(response.payload) &&
          response.payload.length > 0
        ) {
          const newEntries = response.payload.map((item) => ({
            employee: item.VName || "N/A",
            EmpID: item.EmpID || 0, // Store EmpID for submission
            days: Array(31).fill(""),
          }));
          setFormData((prev) => ({
            ...prev,
            otEntries: newEntries,
          }));
          // Create a deep copy to avoid reference issues
          setOriginalOtEntries(JSON.parse(JSON.stringify(newEntries)));
          toast.success("Roster data fetched successfully!");
        } else {
          setFormData((prev) => ({
            ...prev,
            otEntries: [],
          }));
          setOriginalOtEntries([]);
          toast.info("No records found for the selected criteria.");
          console.log("Step 5 - No records condition triggered. Payload:", response.payload);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch roster data.");
      });
  };

  // Handle Save button click
  const handleSave = (e) => {
    e.preventDefault();

    // Debug: Log current and original entries
    console.log("Current otEntries:", JSON.stringify(formData.otEntries, null, 2));
    console.log("Original otEntries:", JSON.stringify(originalOtEntries, null, 2));

    // Check for changes by comparing otEntries with originalOtEntries
    let hasChanges = false;
    const changes = [];

    formData.otEntries.forEach((entry, entryIndex) => {
      const originalEntry = originalOtEntries[entryIndex] || { days: Array(31).fill("") };
      entry.days.forEach((dayValue, dayIndex) => {
        const originalDayValue = originalEntry.days[dayIndex] || "";
        console.log(`Comparing day ${dayIndex + 1}: current="${dayValue}", original="${originalDayValue}"`);
        if (dayValue !== originalDayValue) { // Detect any change
          hasChanges = true;
          changes.push({ entry, dayIndex, dayValue });
        }
      });
    });

    if (!hasChanges) {
      console.log("No changes detected in roster entries.");
      toast.info("No changes detected in roster entries.");
      return;
    }

    console.log("Changes detected:", changes);

    let submissionCount = changes.length;
    let successCount = 0;
    let errorCount = 0;

    changes.forEach(({ entry, dayIndex, dayValue }) => {
      // Find the corresponding roster entry to get EmpID and VName
      const rosterEntry = roster.find((r) => r.VName === entry.employee && r.EmpID === entry.EmpID);
      const empID = rosterEntry?.EmpID || entry.EmpID || 0;
      const empName = rosterEntry?.VName || entry.employee || "";

      // Calculate date based on dateFrom and dayIndex
      const date = new Date(formData.dateFrom || new Date());
      date.setDate(dayIndex + 1);
      const formattedDate = date.toISOString().split("T")[0];

      const payload = {
        VName: empName,
        VDate: formattedDate,
        EmpID: empID,
        ShiftID: parseInt(formData.ShiftID) || 0,
        IsOff: formData.offDay ? 1 : 0,
        UID: "0", // Default as no user ID provided
        CompanyID: 0, // Default as no company ID provided
        Department: formData.department || "",
        Value: dayValue, // Store the textbox value (e.g., shift code or hours)
      };

      console.log(`Submitting payload for ${empName} on ${formattedDate}:`, payload);

      dispatch(submitRoster(payload))
        .then((response) => {
          if (response.type === "roster/submitRoster/fulfilled") {
            successCount++;
            console.log(`Success: Roster submitted for ${empName} on ${formattedDate}`);
          } else {
            errorCount++;
            console.error(`Error: Failed to submit for ${empName} on ${formattedDate}`, response.payload);
          }
          checkSubmissionStatus();
        })
        .catch((err) => {
          errorCount++;
          console.error(`Error submitting for ${empName} on ${formattedDate}:`, err);
          checkSubmissionStatus();
        });
    });

    const checkSubmissionStatus = () => {
      if (successCount + errorCount === submissionCount) {
        if (successCount > 0) {
          toast.success(`${successCount} roster entries submitted successfully!`);
          // Update originalOtEntries to reflect saved changes
          setOriginalOtEntries(JSON.parse(JSON.stringify(formData.otEntries)));
        }
        if (errorCount > 0) {
          toast.error(`${errorCount} roster entries failed to submit.`);
        }
      }
    };
  };

  // Handle Cancel button click
  const handleCancel = () => {
    setFormData({
      eType: "",
      department: "",
      month: currentMonth,
      dateFrom: "",
      dateTo: "",
      ShiftID: "",
      offDay: "",
      employeeidlist: "",
      otEntries: [],
      empCode: "",
    });
    setOriginalOtEntries([]);
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
                <Form onSubmit={handleSave}>
                  <PreviewCardHeader4
                    title="Roster"
                    onFetch={handleFetch}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    disabled={loading}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="department" className="form-label">
                              Department
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="department"
                              id="department"
                              value={formData.department}
                              onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
                              {rosterDepartments.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={3} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="employeeidlist"
                              className="form-label"
                            >
                              Employee
                            </Label>
                            <select
                              className={`form-select form-select-sm ${formData.employeeidlist ? "is-invalid" : ""
                                }`}
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
                            {formData.employeeidlist && (
                              <div className="invalid-feedback">
                                {formData.employeeidlist}
                              </div>
                            )}
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
                              min="2023-01"
                              max="2025-12"
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="gy-4">
                        <Col xxl={3} md={3}>
                          <div>
                            <Label htmlFor="empCode" className="form-label">
                              Emp-Code
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="empCode"
                              name="empCode"
                              value={formData.empCode}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>
                        <Col xxl={3} md={3}>
                          <div>
                            <Label htmlFor="ShiftID" className="form-label">
                              Shift
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="ShiftID"
                              name="ShiftID"
                              value={formData.ShiftID}
                              onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
                              {rosterShifts?.length > 0 ? (
                                rosterShifts.map((shift) => (
                                  <option key={shift.VID} value={shift.VID}>
                                    {shift.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No Shift available
                                </option>
                              )}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="offDay" className="form-label">
                              Off Days
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="offDay"
                              name="offDay"
                              value={formData.offDay}
                              onChange={handleInputChange}
                            >
                              <option value="">---Select---</option>
                              {daysOfWeek.map((day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="dateFrom" className="form-label">
                              Date From
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="dateFrom"
                              name="dateFrom"
                              value={formData.dateFrom}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="dateTo" className="form-label">
                              Date To
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="dateTo"
                              name="dateTo"
                              value={formData.dateTo}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>
                        <Col xxl={4} md={4}>
                          <div className="d-flex gap-2 mt-4">
                            <Button
                              className="btn btn-success px-2 py-1"
                              title="Generate All"
                              type="button"
                            >
                              Generate All
                            </Button>
                            <Button
                              className="btn btn-success px-2 py-1"
                              title="Generate"
                              type="button"
                            >
                              Generate
                            </Button>
                            <Button
                              className="btn btn-success px-2 py-1"
                              title="Generate List"
                              type="button"
                            >
                              Generate List
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
                            {Array.from({ length: 31 }, (_, i) => (
                              <th
                                key={i + 1}
                                style={{ width: "30px", textAlign: "center" }}
                              >
                                {i + 1}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {formData.otEntries.map((entry, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>{rowIndex + 1}</td>
                              <td>{entry.employee}</td>
                              {entry.days.map((day, dayIndex) => (
                                <td key={dayIndex} style={{ padding: "0px" }}>
                                  <Input
                                    type="text"
                                    className="form-control-sm"
                                    style={{
                                      width: "25px",
                                      height: "25px",
                                      padding: "2px",
                                      fontSize: "12px",
                                      textAlign: "center",
                                    }}
                                    value={day}
                                    onChange={(e) =>
                                      handleDayInputChange(
                                        rowIndex,
                                        dayIndex,
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                              ))}
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
                            No records match the selected criteria. Please adjust
                            your filters and try again.
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

export default Roster;