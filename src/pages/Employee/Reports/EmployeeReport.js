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
  Accordion,
  AccordionItem,
  Collapse,
} from "reactstrap";
import classnames from "classnames";

import { Link } from "react-router-dom";
import PreviewCardHeader3 from "../../../Components/Common/PreviewCardHeader3";

const EmployeeReport = () => {
  // Default Accordion
  const [col, setCol] = useState(false);

  const t_col = () => {
    setCol(!col);
  };
  document.title = "Employee Report | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>} */}
          <Row>
            <Form>
              <Col lg={12} className="bg-white p-1">
                {/* <PreviewCardHeader3 title="Employee Report" /> */}
                <CardHeader
                  className="align-items-center d-flex py-2"
                  style={{
                    color: "#495057",
                    marginLeft: "16px",
                    border:"none",
                  }}
                >
                  <h4 className="card-title mb-0 flex-grow-1">
                    Employee Report
                  </h4>
                  <div className="flex-shrink-0">
                    <Button
                      type="submit"
                      color="success"
                      className="add-btn me-1 py-1"
                      id="create-btn"
                    >
                      <i className="align-bottom me-1"></i>Preview
                    </Button>
                    <Button color="dark" className="add-btn me-1 py-1">
                      <i className="align-bottom me-1"></i> Cancel
                    </Button>
                  </div>
                </CardHeader>
             
              <div className="search-box">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Search for name..."
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </Col>
              <Accordion className="lefticon-accordion custom-accordionwithicon accordion-border-box"  id="default-accordion-example">
                <AccordionItem>
                  <h2 className="accordion-header bg-light" id="headingOne">
                    <button
                      className={classnames("accordion-button", {
                        collapsed: !col,
                      })}
                      type="button"
                      onClick={t_col}
                      style={{ cursor: "pointer" }}
                    >
                      Show Advance Filter
                    </button>
                  </h2>

                  <Collapse
                    isOpen={col}
                    className="accordion-collapse"
                    id="collapseOne"
                  >
                    <div className="accordion-body p-0">
                      <Col lg={12}>
                        <Card>
                          <CardBody className="card-body">
                            <div className="live-preview">
                              <Row className="gy-4">
                                <Col xxl={2} md={2}>
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
                                  <div>
                                    <Label
                                      htmlFor="VName"
                                      className="form-label"
                                    >
                                      Father Name
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control-sm"
                                      id="VName"
                                      placeholder="Father Name"
                                    />
                                  </div>
                                </Col>
                                <Col xxl={2} md={2}>
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
                                <Col xxl={2} md={2}>
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
                                <Col xxl={2} md={2}>
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
                                <Col xxl={2} md={2}>
                                  <div>
                                    <Label
                                      htmlFor="VName"
                                      className="form-label"
                                    >
                                      CNIC
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control-sm"
                                      id="VName"
                                      placeholder="xxxx-xxxxxxxx-x"
                                    />
                                  </div>
                                </Col>
                                <Col xxl={2} md={2}>
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
                                <Col xxl={2} md={2}>
                                  <div className="mb-3">
                                    <Label
                                      htmlFor="departmentGroupInput"
                                      className="form-label"
                                    >
                                      Shift
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
                                <Col xxl={2} md={2}>
                                  <div className="mb-3">
                                    <Label
                                      htmlFor="departmentGroupInput"
                                      className="form-label"
                                    >
                                      Region
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
                                <Col xxl={2} md={2}>
                                  <div className="mb-3">
                                    <Label
                                      htmlFor="departmentGroupInput"
                                      className="form-label"
                                    >
                                      Grade
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
                                <Col xxl={2} md={2}>
                                  <div>
                                    <Label
                                      htmlFor="VName"
                                      className="form-label"
                                    >
                                      Pseudo Name
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control-sm"
                                      id="VName"
                                      placeholder="Pseudo Name"
                                    />
                                  </div>
                                </Col>
                                <Col xxl={2} md={3}>
                                  <div className="mb-3">
                                    <Label
                                      htmlFor="departmentGroupInput"
                                      className="form-label"
                                    >
                                      Left Status
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
                                      Blood Group
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
                                <Col xxl={2} md={2}>
                                  <div>
                                    <Label
                                      htmlFor="VName"
                                      className="form-label"
                                    >
                                      Salary From
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control-sm"
                                      id="VName"
                                      placeholder="Salary From"
                                    />
                                  </div>
                                </Col>
                                <Col xxl={2} md={2}>
                                  <div>
                                    <Label
                                      htmlFor="VName"
                                      className="form-label"
                                    >
                                      Salary To
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control-sm"
                                      id="VName"
                                      placeholder="Salary From"
                                    />
                                  </div>
                                </Col>
                                <Row>
                                  <Col xxl={2} md={2}>
                                    <Label
                                      className="form-check-label"
                                      for="SaturdayHalfTime"
                                    >
                                      Join Date
                                    </Label>
                                    <span class="form-control input-sm input-checkbox p-1 mt-2">
                                      <Input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="SaturdayHalfTime"
                                      />
                                    </span>
                                  </Col>
                                  <Col xxl={2} md={4}>
                                    <div>
                                      <Label
                                        htmlFor="VName"
                                        className="form-label"
                                      >
                                        Join Date From
                                      </Label>
                                      <Input
                                        type="date"
                                        className="form-control-sm"
                                        id="VName"
                                        disabled
                                      />
                                    </div>
                                  </Col>
                                  <Col xxl={2} md={4}>
                                    <div>
                                      <Label
                                        htmlFor="VName"
                                        className="form-label"
                                      >
                                        Join Date To
                                      </Label>
                                      <Input
                                        type="date"
                                        className="form-control-sm"
                                        id="VName"
                                        disabled
                                      />
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xxl={2} md={2}>
                                    <Label
                                      className="form-check-label"
                                      for="SaturdayHalfTime"
                                    >
                                      Resign Employee
                                    </Label>
                                    <span class="form-control input-sm input-checkbox p-1 mt-2">
                                      <Input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="SaturdayHalfTime"
                                      />
                                    </span>
                                  </Col>
                                  <Col xxl={2} md={4}>
                                    <div>
                                      <Label
                                        htmlFor="VName"
                                        className="form-label"
                                      >
                                        Resign Date To
                                      </Label>
                                      <Input
                                        type="date"
                                        className="form-control-sm"
                                        id="VName"
                                        disabled
                                      />
                                    </div>
                                  </Col>
                                  <Col xxl={2} md={4}>
                                    <div>
                                      <Label
                                        htmlFor="VName"
                                        className="form-label"
                                      >
                                        Resign Date To
                                      </Label>
                                      <Input
                                        type="date"
                                        className="form-control-sm"
                                        id="VName"
                                        disabled
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </Row>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </div>
                  </Collapse>
                </AccordionItem>
              </Accordion>
              {/* Optional grid */}
              <Col lg={12} className="bg-white p-1">
                <Row className="mt-2 p-2">
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                        checked
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Department wise list
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="BOTH"
                        name="VType"
                        value="BOTH"
                      />
                      <Label className="form-check-label" htmlFor="BOTH">
                        Export to Excel
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VOUT"
                        name="VType"
                        value="VOUT"
                      />
                      <Label className="form-check-label" htmlFor="VOUT">
                        Employee Strength
                      </Label>
                    </div>
                  </Col>

                  <Col xxl={2} md={2}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Employee Card
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Employee Transfer
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Employee on Date
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={3}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Access Control
                      </Label>
                    </div>
                  </Col>
                  <Col xxl={2} md={2}>
                    <div className="form-check mt-3" dir="ltr">
                      <Input
                        type="radio"
                        className="form-check-input"
                        id="VIN"
                        name="VType"
                        value="VIN"
                      />
                      <Label className="form-check-label" htmlFor="VIN">
                        Expected OverTime
                      </Label>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Form>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EmployeeReport;
