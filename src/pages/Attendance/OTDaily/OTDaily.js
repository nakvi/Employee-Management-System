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
  FormFeedback,
} from "reactstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PreviewCardHeader2 from "../../../Components/Common/PreviewCardHeader2";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getOTDaily, submitOTDaily } from "../../../slices/Attendance/OTDaily/thunk";

const OTDaily = () => {
  document.title = "O/T Daily | EMS";

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    eType: "",
    department: [],
    dateFrom: "",
    dateTo: "",
    otOnly: false,
    otEntries: [],
  });

  const [errors, setErrors] = useState({
    eType: "",
  });

  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];
  const { employeeType = [] } = useSelector((state) => state.EmployeeType || {});
  const { otDaily, loading, error } = useSelector((state) => state.OTDaily || {});

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getEmployeeType());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "eType" && value) {
      setErrors((prev) => ({ ...prev, eType: "" }));
    }
  };

  const handleMultiChange = (name, selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  const handleOTEntryChange = (index, field, value) => {
    const updatedEntries = [...formData.otEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setFormData((prev) => ({ ...prev, otEntries: updatedEntries }));
  };

  const validateEType = () => {
    if (!formData.eType) {
      setErrors((prev) => ({ ...prev, eType: "E-Type is required" }));
      toast.error("E-Type is required!");
      return false;
    }
    return true;
  };

  const buildEmployeeIdList = () => {
    const conditions = [];
    if (formData.eType) {
      conditions.push(`E."ETypeID" = ${formData.eType}`);
    }
    if (formData.department.length > 0) {
      conditions.push(`E."DeptID" IN (${formData.department.join(",")})`);
    }
    return conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";
  };

  const handleFetch = () => {
    if (!validateEType()) return;

    const filterConditions = {
      Orgini: "LLT",
      Vdate: "2025-05-28",
      DateFrom: formData.dateFrom || "2025-01-01",
      DateTo: formData.dateTo || "2025-12-31",
      DeptIDs: formData.department.length > 0 ? formData.department.join(",") : "",
      EmployeeIDList: buildEmployeeIdList(),
      CompanyID: "1",
      LocationID: "1",
      ETypeID: formData.eType || "1",
      EmpID: "1",
      IsAu: "0",
      IsExport: "0",
      UID: "0",
      InFlage: "0",
    };

    console.log("Fetch Payload:", filterConditions);

    dispatch(getOTDaily(filterConditions))
      .then((response) => {
        console.log("Thunk Response:", response);
        const dataArray = response.payload || [];
        console.log("Response Data Array:", dataArray);

        if (dataArray.length > 0) {
          const mappedEntries = dataArray.map((item) => ({
            employee: item.EName || "N/A",
            attCode: item.AttCode || "N/A",
            shiftTime: item.ShiftID || 0,
            totalTime: item.TotTime || 0,
            overTime: item.OverTime ? item.OverTime.toFixed(1) : "0.0",
            remarks: item.Remarks || "",
            post: item.post || false,
            empID: item.EmpID || 0, // Store EmpID from API
          }));

          setFormData((prev) => ({
            ...prev,
            otEntries: mappedEntries,
          }));
          console.log("Mapped Entries:", mappedEntries);
        } else {
          setFormData((prev) => ({
            ...prev,
            otEntries: [],
          }));
          toast.info("No records found for the selected criteria.");
        }
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        setFormData((prev) => ({
          ...prev,
          otEntries: [],
        }));
        toast.error("Failed to fetch data: " + error.message);
      });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateEType()) return;

    const selectedEntries = formData.otEntries.filter((entry) => entry.post);
    if (selectedEntries.length === 0) {
      toast.warning("Please select at least one entry to save!");
      return;
    }

    try {
      for (const entry of selectedEntries) {
        const payload = {
          VID: 1, // Hardcoded or auto-increment
          VName: "Overtime Entry",
          VNo: `OT-${new Date().getFullYear()}-001`, // Dynamic or hardcoded
          VDate: formData.dateFrom || new Date().toISOString(),
          EmpID: entry.empID,
          OverTime: parseFloat(entry.overTime) || 0,
          LeaveTypeID: 3,
          UID: 1001,
          CompanyID: 10,
          Tranzdatetime: new Date().toISOString(),
        };

        console.log("Submitting Payload:", payload);
        await dispatch(submitOTDaily(payload)).unwrap();
      }

      // Clear selected entries after successful save
      setFormData((prev) => ({
        ...prev,
        otEntries: prev.otEntries.map((entry) => ({
          ...entry,
          post: false,
        })),
      }));
      toast.success("Selected O/T entries saved successfully!");
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save O/T entries: " + error);
    }
  };

  const handleCancel = () => {
    setFormData({
      eType: "",
      department: [],
      dateFrom: "",
      dateTo: "",
      otOnly: false,
      otEntries: [], // Fixed typo from ot11
    });
    setErrors({ eType: "" });
    toast.info("Form reset successfully!");
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
                    title="O/T Daily"
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
                              className={`form-select form-select-sm ${errors.eType ? "is-invalid" : ""}`}
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
                            {errors.eType && <FormFeedback>{errors.eType}</FormFeedback>}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
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
                              To
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

export default OTDaily;