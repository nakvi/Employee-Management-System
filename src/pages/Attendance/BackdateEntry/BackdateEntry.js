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
import PreviewCardHeader2 from "../../../Components/Common/PreviewCardHeader2";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getBackdateEntry, submitBackdateEntry } from "../../../slices/Attendance/BackdateEntry/thunk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BackdateEntry = () => {
  document.title = "Backdate Entry | EMS";
  const dispatch = useDispatch();

  // State for form inputs
  const [formData, setFormData] = useState({
    eType: "",
    dateFrom: "",
    dateTo: "",
    oldSalary: "",
    oldTax: "",
    inActual: false,
    retainOldAttendance: false,
    entries: [],
  });

  // Selectors for data
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { backdateEntry, loading, error } = useSelector((state) => state.BackdateEntry || {});

  // Fetch employee types on mount
  useEffect(() => {
    dispatch(getEmployeeType());
  }, [dispatch]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle table row selection
  const handleRowSelection = (index, checked) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[index] = { ...updatedEntries[index], selected: checked };
    setFormData((prev) => ({ ...prev, entries: updatedEntries }));
  };

  // Select all rows
  const handleSelectAll = (checked) => {
    const updatedEntries = formData.entries.map((entry) => ({
      ...entry,
      selected: checked,
    }));
    setFormData((prev) => ({ ...prev, entries: updatedEntries }));
  };

  // Validate E-Type
  const validateEType = () => {
    if (!formData.eType) {
      toast.error("E-Type is required!");
      return false;
    }
    return true;
  };

  // Construct employeeIdList string
  const buildEmployeeIdList = () => {
    const conditions = [];

    if (formData.eType) {
      conditions.push(`E."ETypeID" = ${formData.eType}`);
    }

    if (formData.dateFrom) {
      conditions.push(`"DateFrom" = '${formData.dateFrom}'`);
    }

    if (formData.dateTo) {
      conditions.push(`"DateTo" = '${formData.dateTo}'`);
    }

    if (formData.oldSalary) {
      conditions.push(`"OldSalary" = ${formData.oldSalary}`);
    }

    if (formData.oldTax) {
      conditions.push(`"OldTax" = ${formData.oldTax}`);
    }

    if (formData.inActual !== undefined) {
      conditions.push(`"InActual" = ${formData.inActual ? 1 : 0}`);
    }

    if (formData.retainOldAttendance !== undefined) {
      conditions.push(`"RetainOldAttendance" = ${formData.retainOldAttendance ? 1 : 0}`);
    }

    const employeeIdList = conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";
    console.log("Step 1 - Generated employeeIdList:", employeeIdList);
    return employeeIdList;
  };

  // Handle Fetch button click
  const handleFetch = () => {
    if (!validateEType()) return;

    const employeeIdList = buildEmployeeIdList();
    const filterConditions = {
      eType: formData.eType,
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo,
      employeeIdList: employeeIdList,
    };

    console.log("Step 2 - Fetch Payload (filterConditions):", JSON.stringify(filterConditions, null, 2));

    dispatch(getBackdateEntry(filterConditions)).then((response) => {
      if (response.payload) {
        const dataArray = Array.isArray(response.payload) ? response.payload : response.payload.data || [];
        setFormData((prev) => ({
          ...prev,
          entries: dataArray.length
            ? dataArray.map((item) => ({
                employee: item.employee || "N/A",
                department: item.department || "N/A",
                designation: item.designation || "N/A",
                selected: item.selected || false,
              }))
            : [],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          entries: [],
        }));
        toast.info("No records found for the selected criteria.");
      }
    });
  };

  // Handle Save button click
  const handleSave = (e) => {
    e.preventDefault();
    if (!validateEType()) return;

    const payload = {
      eType: formData.eType,
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo,
      oldSalary: formData.oldSalary,
      oldTax: formData.oldTax,
      inActual: formData.inActual,
      retainOldAttendance: formData.retainOldAttendance,
      entries: formData.entries,
    };

    dispatch(submitBackdateEntry(payload)).then((response) => {
      if (response.payload) {
        toast.success("Backdate Entry saved successfully!");
      }
    });
  };

  // Handle Cancel button click
  const handleCancel = () => {
    setFormData({
      eType: "",
      dateFrom: "",
      dateTo: "",
      oldSalary: "",
      oldTax: "",
      inActual: false,
      retainOldAttendance: false,
      entries: [],
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
                <Form onSubmit={handleSave}>
                  <PreviewCardHeader2
                    title="Backdate Entry"
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
                            <Label htmlFor="AttGroupID" className="form-label">
                              E-Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="eType"
                              id="AttGroupID"
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
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="oldSalary" className="form-label">
                              Old Salary
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="oldSalary"
                              name="oldSalary"
                              placeholder="Old Salary"
                              value={formData.oldSalary}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="oldTax" className="form-label">
                              Old Tax
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="oldTax"
                              name="oldTax"
                              placeholder="Old Tax"
                              value={formData.oldTax}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="inActual"
                              name="inActual"
                              checked={formData.inActual}
                              onChange={handleInputChange}
                            />
                            <Label className="form-check-label" htmlFor="inActual">
                              In Actual
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mb-2 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="retainOldAttendance"
                              name="retainOldAttendance"
                              checked={formData.retainOldAttendance}
                              onChange={handleInputChange}
                            />
                            <Label className="form-check-label" htmlFor="retainOldAttendance">
                              Retain Old Attendance
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
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                checked={formData.entries.length > 0 && formData.entries.every(entry => entry.selected)}
                              />
                              Select ALL
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {formData.entries.map((entry, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{entry.employee}</td>
                              <td>{entry.department}</td>
                              <td>{entry.designation}</td>
                              <td>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={entry.selected}
                                  onChange={(e) => handleRowSelection(index, e.target.checked)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {formData.entries.length === 0 && (
                        <div className="noresult text-center mt-4">
                          <lord-icon
                            src="https://cdn.lordicon.com/msoeawqm.json"
                            trigger="loop"
                            colors="primary:#121331,secondary:#08a88a"
                            style={{ width: "75px", height: "75px" }}
                          ></lord-icon>
                          <h5 className="mt-2">No Results Found</h5>
                          <p className="text-muted mb-0">
                            We've searched more than 150+ entries. We did not find any records for your search.
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

export default BackdateEntry;