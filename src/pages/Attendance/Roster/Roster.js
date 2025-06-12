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
import PreviewCardHeader4 from "../../../Components/Common/PreviewCardHeader4";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getRoster, submitRoster } from "../../../slices/Attendance/Roaster/thunk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Roster = () => {
  document.title = "Roster | EMS";
  const dispatch = useDispatch();

  // State for form inputs
  const [formData, setFormData] = useState({
    eType: "",
    department: "",
    month: "",
    dateFrom: "",
    dateTo: "",
    otEntries: [],
  });

  // Selectors for data
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { roster, loading, error } = useSelector((state) => state.Roster || {});

  // Fetch data on mount
  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
  }, [dispatch]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  // Construct employeeIdList string
  const buildEmployeeIdList = () => {
    const conditions = [];

    if (formData.eType) {
      conditions.push(`E."ETypeID" = ${formData.eType}`);
    }

    if (formData.department) {
      conditions.push(`E."DeptID" = ${formData.department}`);
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
      department: formData.department,
      month: formData.month,
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo,
      employeeIdList: employeeIdList,
    };

    console.log("Step 2 - Fetch Payload (filterConditions):", JSON.stringify(filterConditions, null, 2));

    dispatch(getRoster(filterConditions)).then((response) => {
      if (response.payload) {
        const dataArray = Array.isArray(response.payload) ? response.payload : response.payload.data || [];
        setFormData((prev) => ({
          ...prev,
          otEntries: dataArray.length
            ? dataArray.map((item) => ({
                employee: item.employee || "N/A",
                attCode: item.attCode || "N/A",
                shiftTime: item.shiftTime || 0,
                totalTime: item.totalTime || 0,
                overTime: item.overTime || "00.0",
                remarks: item.remarks || "",
                post: item.post || false,
              }))
            : [],
        }));
      } else {
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

    const payload = {
      eType: formData.eType,
      department: formData.department,
      month: formData.month,
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo,
      otEntries: formData.otEntries,
    };
    dispatch(submitRoster(payload));
  };

  // Handle Cancel button click
  const handleCancel = () => {
    setFormData({
      eType: "",
      department: "",
      month: "",
      dateFrom: "",
      dateTo: "",
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

export default Roster;