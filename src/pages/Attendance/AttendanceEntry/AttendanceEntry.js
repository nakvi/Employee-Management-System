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
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
  import { getLocation } from "../../../slices/setup/location/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getAttendanceEntry, saveAttendanceEntry, resetAttendanceData } from "../../../slices/Attendance/AttendanceEntry/thunk";
import PreviewCardHeader2 from "../../../Components/Common/PreviewCardHeader2";

const AttendanceEntry = () => {
  const dispatch = useDispatch();
  document.title = "Attendance Entry | EMS";

  // Form state
  const [formData, setFormData] = useState({
    location: "",
    department: [],
    employeeType: "",
    designation: [],
    vdate: "",
    vType: "2", // Default to "Both"
  });

  // Validation error state
  const [errors, setErrors] = useState({
    employeeType: "",
    vdate: "", // Add vdate to errors state
    timeErrors: [],
    apiError: "",
  });

  // State to track changed records
  const [changedRecords, setChangedRecords] = useState({});

  // Modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Get data from Redux store
  const { location = [] } = useSelector((state) => state.Location || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { designation = [] } = useSelector((state) => state.Designation || {});
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { attendanceData = [], loading, error, saveLoading, saveError } = useSelector((state) => state.AttendanceEntry || {});

  useEffect(() => {
    dispatch(getLocation());
    dispatch(getDepartment());
    dispatch(getDesignation());
    dispatch(getEmployeeType());
  }, [dispatch]);

  // Reset changedRecords and errors when attendanceData changes
  useEffect(() => {
    setChangedRecords({});
    setErrors((prev) => ({ ...prev, timeErrors: [], apiError: "" }));
  }, [attendanceData]);

  // Handle Redux error and success feedback
  useEffect(() => {
    if (error) {
      console.error("Fetch error:", error);
      setErrors((prev) => ({ ...prev, apiError: error }));
    } else if (attendanceData.length > 0 && !loading) {
      console.log("Fetch success, data:", attendanceData);
    }
  }, [error, attendanceData, loading]);

  // Handle save error feedback
  useEffect(() => {
    if (saveError) {
      console.error("Save error:", saveError);
      setErrors((prev) => ({ ...prev, apiError: saveError }));
    }
  }, [saveError]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "employeeType" && value) {
      setErrors((prev) => ({ ...prev, employeeType: "" }));
    }
  };

  // Handle multi-select changes
  const handleMultiChange = (name, selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  // Handle radio button changes
  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, vType: e.target.value }));
  };

  // Validate form for fetch
  const validateForm = () => {
    let isValid = true;
    const newErrors = { employeeType: "", vdate: "", timeErrors: [], apiError: "" };

    if (!formData.employeeType) {
      newErrors.employeeType = "Employee Type is required";
      isValid = false;
    }

    if (!formData.vdate) {
      newErrors.vdate = "Date is required";
      isValid = false;
    } else if (isNaN(new Date(formData.vdate).getTime())) {
      newErrors.vdate = "Invalid date";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Construct employeeidlist string
  const buildEmployeeIdList = () => {
    const conditions = [];

    if (formData.location) {
      // conditions.push(`E."LocationID" = ${formData.location}`);
      conditions.push(`E."LocationID" = 4`);
    }

    if (formData.department.length > 0) {
      if (formData.department.length === 1) {
        conditions.push(`E."DeptID" = ${formData.department[0]}`);
      } else {
        conditions.push(`E."DeptID" IN (${formData.department.join(",")})`);
      }
    }

    if (formData.designation.length > 0) {
      if (formData.designation.length === 1) {
        conditions.push(`E."DesgID" = ${formData.designation[0]}`);
      } else {
        conditions.push(`E."DesgID" IN (${formData.designation.join(",")})`);
      }
    }

    if (formData.employeeType) {
      conditions.push(`E."ETypeID" = ${formData.employeeType}`);
    }

    return conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";
  };

  // Handle fetch
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    // Set vdate, datefrom, dateto, vid1, and vid2
    // const vdate = formData.vdate;
    // const datefrom = `${formData.vdate} 01:00:00`;
    // const datetoDate = new Date(`${formData.vdate}T01:00:00`);
    // datetoDate.setHours(datetoDate.getHours() + 9);
    // const dateto = `${formData.vdate} ${datetoDate.getHours().toString().padStart(2, "0")}:${datetoDate.getMinutes().toString().padStart(2, "0")}:00`;

    // Validate vdate
    const vdate = formData.vdate;
    if (!vdate || !/^\d{4}-\d{2}-\d{2}$/.test(vdate)) {
      throw new Error("Invalid vdate format. Expected YYYY-MM-DD");
    }

    // Set datefrom as vdate
    const datefrom = vdate;

    // Create datetoDate and add one day
    const datetoDate = new Date(vdate);
    if (isNaN(datetoDate.getTime())) {
      throw new Error("Invalid date in vdate");
    }
    datetoDate.setDate(datetoDate.getDate() + 1);

    // Format dateto as YYYY-MM-DD
    const dateto = `${datetoDate.getFullYear()}-${(datetoDate.getMonth() + 1).toString().padStart(2, "0")}-${datetoDate.getDate().toString().padStart(2, "0")}`;
    const vid1 = datefrom; // Same as datefrom
    const vid2 = dateto; // Same as dateto

    // Map vType to inflage
    const inflage = formData.vType; // vType directly maps to inflage (0, 1, or 2)

    const params = {
      orgini: "LTT",
      vdate: vdate,
      datefrom: datefrom,
      dateto: dateto,
      deptids: formData.department.join(","),
      employeeidlist: buildEmployeeIdList(),
      companyid: "0",
      locationid: formData.location,
      etypeid: formData.employeeType,
      empid: "0",
      isau: "0",
      onlyot: "0",
      isexport: "0",
      uid: "0",
      inflage: inflage,
      vid1: vid1,
      vid2: vid2,
    };
    console.log("Dispatching getAttendanceEntry with params:", params);
    dispatch(getAttendanceEntry(params));
  };

  // Validate time entries for save
  const validateTimeEntries = () => {
    const timeErrors = [];
    let isValid = true;

    attendanceData.forEach((original, index) => {
      const record = changedRecords[index] || {};
      const errorsForRow = {};

      const timeIn1 = record.timeIn || original.timeIn || "";
      const timeOut1 = record.timeOut || original.timeOut || "";
      const timeIn2 = record.timeIn2 || original.timeIn2 || "";
      const timeOut2 = record.timeOut2 || original.timeOut2 || "";

      // Validation 1: TimeIn1 required if any other time fields are filled
      if (!timeIn1 && (timeOut1 || timeIn2 || timeOut2)) {
        errorsForRow.timeIn1 = "Time In 1 is required when other time fields are filled";
        isValid = false;
      }

      // Validation 2: TimeOut1 required if TimeIn1 is filled
      // if (timeIn1 && !timeOut1) {
      //   errorsForRow.timeOut1 = "Invalid Time Out 1: Time Out 1 is required when Time In 1 is filled";
      //   isValid = false;
      // }

      // Validation 3: TimeOut1 must be later than TimeIn1
      if (timeIn1 && timeOut1 && timeOut1 <= timeIn1) {
        errorsForRow.timeOut1 = "Invalid Time Out 1: Time Out 1 must be later than Time In 1";
        isValid = false;
      }

      // Validation 4: TimeIn2 requires TimeOut1
      if (timeIn2 && !timeOut1) {
        errorsForRow.timeIn2 = "Invalid Time In 2: Time Out 1 is required before Time In 2";
        isValid = false;
      }

      // Validation 5: TimeIn2 must be later than TimeOut1
      if (timeOut1 && timeIn2 && timeIn2 <= timeOut1) {
        errorsForRow.timeIn2 = "Invalid Time In 2: Time In 2 must be later than Time Out 1";
        isValid = false;
      }

      // Validation 6: TimeOut2 requires TimeIn2
      if (timeOut2 && !timeIn2) {
        errorsForRow.timeOut2 = "Invalid Time Out 2: Time In 2 is required before Time Out 2";
        isValid = false;
      }

      // Validation 7: TimeOut2 must be later than TimeIn2
      if (timeIn2 && timeOut2 && timeOut2 <= timeIn2) {
        errorsForRow.timeOut2 = "Invalid Time Out 2: Time Out 2 must be later than Time In 2";
        isValid = false;
      }

      if (Object.keys(errorsForRow).length > 0) {
        timeErrors[index] = errorsForRow;
      }
    });

    setErrors((prev) => ({ ...prev, timeErrors }));
    return isValid;
  };

  // Check if there are any changed records
  const hasChanges = () => {
    return Object.values(changedRecords).some((record) => record.changed);
  };

  // Compare records to detect changes
  const getChangedData = () => {
    const changedData = [];
    attendanceData.forEach((original, index) => {
      const record = changedRecords[index] || {};
      const fields = ["timeIn", "timeOut", "timeIn2", "timeOut2", "remarks"];
      const hasFieldChanged = fields.some(
        (field) => record[field] !== undefined && record[field] !== (original[field] || "")
      );

      if (hasFieldChanged) {
        changedData.push({
          empid: original.empid,
          vdate: formData.vdate,
          vid1: original.vid1,
          vid2: original.vid2,
          shiftID: original.shiftID || 3,
          dateIn1: record.timeIn ? `${formData.vdate} ${record.timeIn}:00` : original.timeIn ? `${formData.vdate} ${original.timeIn}:00` : "",
          dateOut1: record.timeOut ? `${formData.vdate} ${record.timeOut}:00` : original.timeOut ? `${formData.vdate} ${original.timeOut}:00` : "",
          dateIn2: record.timeIn2 ? `${formData.vdate} ${record.timeIn2}:00` : original.timeIn2 ? `${formData.vdate} ${original.timeIn2}:00` : "",
          dateOut2: record.timeOut2 ? `${formData.vdate} ${record.timeOut2}:00` : original.timeOut2 ? `${formData.vdate} ${original.timeOut2}:00` : "",
          remarks: record.remarks || original.remarks || "",
          uID: 101,
          computerName: "HR-PC-001",
        });
      }
    });
    return changedData;
  };

  // Handle save button click
  const handleSave = (e) => {
    e.preventDefault();
    console.log("Save button clicked, vdate:", formData.vdate);

    if (!formData.vdate || isNaN(new Date(formData.vdate).getTime())) {
      setErrors((prev) => ({ ...prev, apiError: "Date is required to save attendance" }));
      return;
    }

    if (!hasChanges()) {
      return;
    }

    if (!validateTimeEntries()) {
      console.log("Save validation failed:", errors.timeErrors);
      return;
    }

    setIsSaveModalOpen(true);
  };

  // Confirm save action
  const confirmSave = async () => {
    const changedData = getChangedData();
    if (!changedData || changedData.length === 0) {
      setIsSaveModalOpen(false);
      return;
    }

    console.log("Save API Parameters:", JSON.stringify(changedData, null, 2));

    try {
      for (const record of changedData) {
        console.log("Saving record:", JSON.stringify(record, null, 2));
        await dispatch(saveAttendanceEntry(record)).unwrap();
      }
    } catch (error) {
      console.error("Failed to save some records:", error);
      setErrors((prev) => ({ ...prev, apiError: `Failed to save records: ${error.message}` }));
    }

    setIsSaveModalOpen(false);
  };

  // Close save modal
  const closeSaveModal = () => {
    setIsSaveModalOpen(false);
  };

  // Handle cancel button click
  const handleCancel = () => {
    console.log("Cancel button clicked");
    if (hasChanges()) {
      setIsCancelModalOpen(true);
    } else {
      resetForm();
    }
  };

  // Handle time input changes
  const handleTimeChange = (index, field, value) => {
    const originalValue = attendanceData[index][field] || "";
    const isChanged = value !== originalValue;

    setChangedRecords((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
        changed: isChanged || (prev[index]?.changed && prev[index][field] !== originalValue),
      },
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      location: "",
      department: [],
      employeeType: "",
      designation: [],
      vdate: "",
      vType: "2",
    });
    setChangedRecords({});
    setErrors({ employeeType: "", timeErrors: [], apiError: "" });
    dispatch(resetAttendanceData()); // Reset the attendance data in Redux store
  };

  // Confirm cancel action
  const confirmCancel = () => {
    resetForm();
    setIsCancelModalOpen(false);
  };

  // Close cancel modal
  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <Form>
                  <PreviewCardHeader2
                    title="Attendance Entry"
                    onFetch={handleSubmit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    disabled={loading || saveLoading}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2} className="px-1">
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

                        <Col xxl={2} md={2} className="px-1">
                          <div className="mb-3">
                            <Label htmlFor="departmentGroupInput" className="form-label">
                              Department
                            </Label>
                            <Select
                              isMulti
                              name="department"
                              id="departmentGroupInput"
                              value={departmentList
                                .filter((dept) => formData.department.includes(dept.VID))
                                .map((dept) => ({
                                  value: dept.VID,
                                  label: dept.VName || dept.DepartmentName || dept.title,
                                }))}
                              onChange={(selected) => handleMultiChange("department", selected)}
                              options={departmentList.map((dept) => ({
                                value: dept.VID,
                                label: dept.VName || dept.DepartmentName || dept.title,
                              }))}
                            />
                          </div>
                        </Col>

                        <Col xxl={2} md={2} className="px-1">
                          <div className="mb-3">
                            <Label htmlFor="employeeTypeInput" className="form-label">
                              E-Type
                            </Label>
                            <select
                              className={`form-select form-select-sm ${errors.employeeType ? "is-invalid" : ""}`}
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
                            {errors.employeeType && (
                              <FormFeedback>{errors.employeeType}</FormFeedback>
                            )}
                          </div>
                        </Col>

                        <Col xxl={2} md={2} className="px-1">
                          <div className="mb-3">
                            <Label htmlFor="designationInput" className="form-label">
                              Designation
                            </Label>
                            <Select
                              isMulti
                              name="designation"
                              id="designationInput"
                              value={designation
                                .filter((desig) => formData.designation.includes(desig.VID))
                                .map((desig) => ({
                                  value: desig.VID,
                                  label: desig.VName || desig.DesignationName || desig.title,
                                }))}
                              onChange={(selected) => handleMultiChange("designation", selected)}
                              options={designation.map((desig) => ({
                                value: desig.VID,
                                label: desig.VName || desig.DesignationName || desig.title,
                              }))}
                            />
                          </div>
                        </Col>

                        {/* <Col xxl={2} md={2} className="px-1">
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
                        </Col> */}

                        <Col xxl={2} md={2} className="px-1">
                          <div className="mb-3">
                            <Label htmlFor="vdate" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className={`form-control-sm ${errors.vdate ? "is-invalid" : ""}`}
                              id="vdate"
                              name="vdate"
                              value={formData.vdate}
                              onChange={handleInputChange}
                            />
                            {errors.vdate && <FormFeedback>{errors.vdate}</FormFeedback>}
                          </div>
                        </Col>

                        <Col xxl={2} md={2} className="px-1">
                          <div className="d-flex gap-2 mt-3">
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="VIN"
                                name="vType"
                                value="0"
                                checked={formData.vType === "0"}
                                onChange={handleRadioChange}
                              />
                              <Label className="form-check-label" htmlFor="VIN">
                                In
                              </Label>
                            </div>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="VOUT"
                                name="vType"
                                value="1"
                                checked={formData.vType === "1"}
                                onChange={handleRadioChange}
                              />
                              <Label className="form-check-label" htmlFor="VOUT">
                                Out
                              </Label>
                            </div>
                            <div className="form-check mt-3" dir="ltr">
                              <Input
                                type="radio"
                                className="form-check-input"
                                id="BOTH"
                                name="vType"
                                value="2"
                                checked={formData.vType === "2"}
                                onChange={handleRadioChange}
                              />
                              <Label className="form-check-label" htmlFor="BOTH">
                                Both
                              </Label>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      {errors.apiError && (
                        <div className="mt-3 text-danger">
                          {errors.apiError}
                        </div>
                      )}
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
                            <th>Time In 2</th>
                            <th>Time Out 2</th>
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
                                    className={`form-control form-control-sm ${errors.timeErrors[index]?.timeIn1 ? "is-invalid" : ""
                                      }`}
                                    defaultValue={entry.timeIn || ""}
                                    onChange={(e) =>
                                      handleTimeChange(index, "timeIn", e.target.value)
                                    }
                                  />
                                  {errors.timeErrors[index]?.timeIn1 && (
                                    <FormFeedback>
                                      {errors.timeErrors[index].timeIn1}
                                    </FormFeedback>
                                  )}
                                </td>
                                <td>
                                  <Input
                                    type="time"
                                    className={`form-control form-control-sm ${errors.timeErrors[index]?.timeOut1 ? "is-invalid" : ""
                                      }`}
                                    defaultValue={entry.timeOut || ""}
                                    onChange={(e) =>
                                      handleTimeChange(index, "timeOut", e.target.value)
                                    }
                                  />
                                  {errors.timeErrors[index]?.timeOut1 && (
                                    <FormFeedback>
                                      {errors.timeErrors[index].timeOut1}
                                    </FormFeedback>
                                  )}
                                </td>
                                <td>
                                  <Input
                                    type="time"
                                    className={`form-control form-control-sm ${errors.timeErrors[index]?.timeIn2 ? "is-invalid" : ""
                                      }`}
                                    defaultValue={entry.timeIn2 || ""}
                                    onChange={(e) =>
                                      handleTimeChange(index, "timeIn2", e.target.value)
                                    }
                                  />
                                  {errors.timeErrors[index]?.timeIn2 && (
                                    <FormFeedback>
                                      {errors.timeErrors[index].timeIn2}
                                    </FormFeedback>
                                  )}
                                </td>
                                <td>
                                  <Input
                                    type="time"
                                    className={`form-control form-control-sm ${errors.timeErrors[index]?.timeOut2 ? "is-invalid" : ""
                                      }`}
                                    defaultValue={entry.timeOut2 || ""}
                                    onChange={(e) =>
                                      handleTimeChange(index, "timeOut2", e.target.value)
                                    }
                                  />
                                  {errors.timeErrors[index]?.timeOut2 && (
                                    <FormFeedback>
                                      {errors.timeErrors[index].timeOut2}
                                    </FormFeedback>
                                  )}
                                </td>
                                <td>
                                  <Input
                                    className="form-control-sm w-75"
                                    type="text"
                                    defaultValue={entry.remarks || ""}
                                    onChange={(e) =>
                                      handleTimeChange(index, "remarks", e.target.value)
                                    }
                                  />
                                </td>
                                <td>
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={changedRecords[index]?.changed || false}
                                    onChange={() => {
                                      setChangedRecords((prev) => ({
                                        ...prev,
                                        [index]: {
                                          ...prev[index],
                                          changed: !prev[index]?.changed,
                                        },
                                      }));
                                    }}
                                  />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center">
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

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={isCancelModalOpen} toggle={closeCancelModal} centered>
        <ModalHeader toggle={closeCancelModal}>Confirm Cancel</ModalHeader>
        <ModalBody>
          You have unsaved changes in the attendance data. Are you sure you want to discard these changes?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeCancelModal}>
            Keep Changes
          </Button>
          <Button color="danger" onClick={confirmCancel}>
            Discard Changes
          </Button>
        </ModalFooter>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal isOpen={isSaveModalOpen} toggle={closeSaveModal} centered>
        <ModalHeader toggle={closeSaveModal}>Confirm Save</ModalHeader>
        <ModalBody>
          Do you really want to save the changed attendance data?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeSaveModal}>
            Cancel
          </Button>
          <Button color="success" onClick={confirmSave}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default AttendanceEntry;