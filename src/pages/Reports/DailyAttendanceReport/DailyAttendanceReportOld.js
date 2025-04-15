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
import PreviewCardHeaderReport from "../../../Components/Common/PreviewCardHeaderReport";
import RenderTable from "./RenderTable";

const DailyAttendanceReport = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Unposted");
  const [reportType, setReportType] = useState(""); // Stores the selected report type for fetching

  // Handle option change
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    // setShowTable(false); // Reset the table when option changes
  };
  const handleFetch = () => {
    if (selectedOption) {
      setReportType(selectedOption); // Set the selected option to fetch
      setShowTable(true);
      console.log("Fetching Report for:", selectedOption);
    }
  };
  const handleGeneratePDF = () => {
    console.log("Generating PDF...");
  };

  const handleCancel = () => {
    console.log("Cancelling...");
    setShowTable(false);
  };
  // Today Date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  document.title = "Daily Attendance Report | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>} */}
          <Row>
            <Col lg={12}>
              <Card>
                <Form>
                  <PreviewCardHeaderReport
                    title="Daily Attendance Report"
                    onFetch={handleFetch}
                    onGeneratePDF={handleGeneratePDF}
                    onCancel={handleCancel}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              E-Type
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">Staf</option>
                              <option value="Choices2">Worker</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Employee
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">IT</option>
                              <option value="Choices2">Software</option>
                            </select>
                          </div>
                        </Col>

                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              HOD
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">IT</option>
                              <option value="Choices2">Software</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Location
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">IT</option>
                              <option value="Choices2">Software</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Department
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">IT</option>
                              <option value="Choices2">Software</option>
                            </select>
                          </div>
                        </Col>

                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Designation
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1">IT</option>
                              <option value="Choices2">Software</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VName"
                              min={getMinDate()} // Prevent past dates
                              value={selectedDate}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xxl={2} md={9}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              Report Heading
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Report Heading"
                            />
                          </div>
                        </Col>
                      </Row>
                      {/* checkbox grid */}
                      <Row style={{ border: "1px dotted lightgray" }}>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="WithOverTime"
                            />
                            <Label
                              className="form-check-label"
                              for="WithOverTime"
                            >
                              WithOverTime
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsManager"
                            />
                            <Label className="form-check-label" for="IsManager">
                              IsManager
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="ShiftEmployee"
                            />
                            <Label
                              className="form-check-label"
                              for="ShiftEmployee"
                            >
                              ShiftEmployee
                            </Label>
                          </div>
                        </Col>
                      </Row>
                      {/* Optional grid */}
                      <Row>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="Unposted"
                              name="VType"
                              value="Unposted"
                              checked={selectedOption === "Unposted"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="Unposted"
                            >
                              Unposted
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="Posted"
                              name="VType"
                              value="Posted"
                              checked={selectedOption === "Posted"}
                              onChange={handleOptionChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="Posted"
                            >
                              Posted
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="Unposted"
                              name="VType"
                              value="Unposted"
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="Unposted"
                            >
                              Unposted Summary
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="PostedSummary"
                              name="VType"
                              value="PostedSummary"
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="PostedSummary"
                            >
                              Posted Summary
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="Latecomer"
                              name="VType"
                              value="Latecomer"
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="Latecomer"
                            >
                              Latecomer
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="ManualOverTime"
                              name="VType"
                              value="ManualOverTime"
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="ManualOverTime"
                            >
                              Manual Overtime
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OverTime"
                              name="VType"
                              value="OverTime"
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="OverTime"
                            >
                              OverTime
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OverTimeList"
                              name="VType"
                              value="OverTimeList"
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="OverTimeList"
                            >
                              OverTime List
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="OverTimeSheet"
                              name="VType"
                              value="OverTimeSheet"
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="OverTimeSheet"
                            >
                              OverTime Sheet
                            </Label>
                          </div>
                        </Col>

                        <Col xxl={2} md={2}>
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="ExportLog"
                              name="VType"
                              value="ExportLog"
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="ExportLog"
                            >
                              Export Log
                            </Label>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>
            {/* Conditionally render the table */}
            {showTable && <RenderTable selectedOption={reportType} />}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DailyAttendanceReport;
