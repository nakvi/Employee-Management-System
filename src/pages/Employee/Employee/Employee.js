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
import { Link } from "react-router-dom";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import avatar1 from "../../../assets/images/users/avatar-11.png";
const Employee = () => {
  const [selectedDate, setSelectedDate] = useState("");
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  document.title = "Employee | EMS";
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
                  <PreviewCardHeader title="Employee Details" />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row>
                        <Col lg={10}>
                          <Row className="gy-4">
                            {/* E-Type */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="eType" className="form-label">
                                  E-Type
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="eType"
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="permanent">Permanent</option>
                                  <option value="contractual">
                                    Contractual
                                  </option>
                                </select>
                              </div>
                            </Col>

                            {/* Location */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="location"
                                  className="form-label"
                                >
                                  Location
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="location"
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="lahore">Lahore</option>
                                  <option value="islamabad">Islamabad</option>
                                </select>
                              </div>
                            </Col>
                            {/* Emp Code */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="empCode" className="form-label">
                                  Emp Code
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="empCode"
                                  placeholder="Emp Code"
                                  disabled
                                  value="039"
                                />
                              </div>
                            </Col>

                            {/* Machine */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="machine" className="form-label">
                                  Machine
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="machine"
                                  placeholder="Machine"
                                  value="1234"
                                />
                              </div>
                            </Col>

                            {/* Name */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="name" className="form-label">
                                  Name
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="name"
                                  placeholder="Name"
                                />
                              </div>
                            </Col>

                            {/* Father Name */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="fatherName"
                                  className="form-label"
                                >
                                  Father Name
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="fatherName"
                                  placeholder="Father Name"
                                />
                              </div>
                            </Col>
                            {/* Department */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="department"
                                  className="form-label"
                                >
                                  Department
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="department"
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="it">IT</option>
                                  <option value="hr">HR</option>
                                </select>
                              </div>
                            </Col>

                            {/* Designation */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="designation"
                                  className="form-label"
                                >
                                  Designation
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="designation"
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="frontend">Frontend</option>
                                  <option value="backend">Backend</option>
                                </select>
                              </div>
                            </Col>
                            {/* HOD */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="designation"
                                  className="form-label"
                                >
                                  HOD
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="designation"
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="frontend">Frontend</option>
                                  <option value="backend">Backend</option>
                                </select>
                              </div>
                            </Col>
                            {/* DOB */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="dob" className="form-label">
                                  DOB
                                </Label>
                                <Input
                                  type="date"
                                  className="form-control-sm"
                                  id="dob"
                                  value="2025-02-04"
                                />
                              </div>
                            </Col>
                            {/* DOJ */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="doj" className="form-label">
                                  DOJ
                                </Label>
                                <Input
                                  type="date"
                                  className="form-control-sm"
                                  id="doj"
                                  value="2025-02-04"
                                />
                              </div>
                            </Col>
                            {/* Replace Off */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="designation"
                                  className="form-label"
                                >
                                  Replace Off
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="designation"
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="frontend">Frontend</option>
                                  <option value="backend">Backend</option>
                                </select>
                              </div>
                            </Col>
                            {/* Designation */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="designation"
                                  className="form-label"
                                >
                                  Hire Type
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="designation"
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="frontend">Frontend</option>
                                  <option value="backend">Backend</option>
                                </select>
                              </div>
                            </Col>
                            {/* Designation */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="designation"
                                  className="form-label"
                                >
                                  Job Type
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="designation"
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="frontend">Frontend</option>
                                  <option value="backend">Backend</option>
                                </select>
                              </div>
                            </Col>
                            {/* Off Day- 1*/}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="location"
                                  className="form-label"
                                >
                                  Off Day- 1
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="location"
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="lahore">Lahore</option>
                                  <option value="islamabad">Islamabad</option>
                                </select>
                              </div>
                            </Col>

                            {/* Off Day- 2 */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="Off Day- 2"
                                  className="form-label"
                                >
                                  Off Day- 2
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="Off Day- 2"
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="it">IT</option>
                                  <option value="hr">HR</option>
                                </select>
                              </div>
                            </Col>
                          </Row>
                        </Col>

                        {/* Here Image */}
                        <Col lg={2}>
                          <Card className="mt-3">
                            <CardBody className="p-2">
                              <div className="text-center">
                                <div className="profile-user position-relative d-inline-block mx-auto  mb-2">
                                  <img
                                    src={avatar1}
                                    className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                    alt="user-profile"
                                  />
                                  <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                    <Input
                                      id="profile-img-file-input"
                                      type="file"
                                      className="profile-img-file-input"
                                    />
                                    <Label
                                      htmlFor="profile-img-file-input"
                                      className="profile-photo-edit avatar-xs"
                                    >
                                      <span className="avatar-title rounded-circle bg-light text-body">
                                        <i className="ri-camera-fill"></i>
                                      </span>
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        {/* Here is Second */}
                      </Row>
                      <Row className="gy-4 mt-2 p-1" style={{ border: "2px dotted lightgray" }}>
                        {/* Shift */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="Shift" className="form-label">
                              Shift
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="Off Day- 2"
                            >
                              <option value="">--- Select ---</option>
                              <option value="it">IT</option>
                              <option value="hr">HR</option>
                            </select>
                          </div>
                        </Col>
                        {/* Emp Code */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="empCode" className="form-label">
                              NIC
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="empCode"
                              placeholder="NIC"
                            />
                          </div>
                        </Col>

                        {/* Name */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="name" className="form-label">
                              Salary
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="name"
                              placeholder="Salary "
                            />
                          </div>
                        </Col>

                        {/* Monthly Tax */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="name" className="form-label">
                              Monthly Tax
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="name"
                              placeholder="0.01 "
                            />
                          </div>
                        </Col>

                        {/* Have OverTime */}
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="SaturdayHalfTime"
                          >
                            Have OverTime
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                          </span>
                        </Col>
                       {/* Grade*/}
                       <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                              Grade
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="designation"
                            >
                              <option value="">--- Select ---</option>
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                            </select>
                          </div>
                        </Col>
                        {/*   IsBank Grid */}
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="SaturdayHalfTime"
                          >
                            IsBank
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                          </span>
                        </Col>
                        {/* Bank Account */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="eType" className="form-label">
                              Bank Account
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="doj"
                              placeholder="Bank Account"
                            />
                          </div>
                        </Col>
                        {/* Company Bank */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="eType" className="form-label">
                              Company Bank
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="eType"
                            >
                              <option value="">--- Select ---</option>
                              <option value="permanent">Permanent</option>
                              <option value="contractual">Contractual</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="SaturdayHalfTime"
                          >
                            IsActive
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                          </span>
                        </Col>
                        {/* DOL */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DOL" className="form-label">
                              DOL
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DOL"
                              min={getMinDate()} // Prevent past dates
                              value={selectedDate}
                            />
                          </div>
                        </Col>
                        {/* Left Status */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                              Left Status
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="designation"
                            >
                              <option value="">--- Select ---</option>
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                            </select>
                          </div>
                        </Col>
                        {/* Is Empt grid*/}
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="SaturdayHalfTime"
                          >
                            IsExempt
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                          </span>
                        </Col>
                        {/* Religion */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                              Probition
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="designation"
                            >
                              <option value="">--- Select ---</option>
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="doj" className="form-label">
                              Probition Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="doj"
                              value="2025-02-04"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="email" className="form-label">
                              Contact
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="Contact"
                            />
                          </div>
                        </Col>
                        {/* Address */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="contact" className="form-label">
                             Present Address
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="Address"
                            />
                          </div>
                        </Col>
                        {/* Address */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="contact" className="form-label">
                              Permanent Address
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="Address"
                            />
                          </div>
                        </Col>
                        {/* Blood Group  */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                              Blood Group
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="designation"
                            >
                              <option value="">--- Select ---</option>
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                            </select>
                          </div>
                        </Col>
                        {/* EOBI*/}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                              EOBI No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="EOBI No"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                              SS No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="SS No"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                              Life Insurance No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="Life Insurance No"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="SaturdayHalfTime"
                          >
                            IsGroupInsurance
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                          </span>
                        </Col>
                        {/* MartialStatus  */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                              Martial Status
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="designation"
                            >
                              <option value="">--- Select ---</option>
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="SaturdayHalfTime"
                          >
                            IsPFundEntitled
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                          </span>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="doj" className="form-label">
                              PFundEntitled Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="doj"
                              value="2025-02-04"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="SaturdayHalfTime"
                          >
                            IsPFund
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                          </span>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                              PF Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="contact"
                              placeholder="00"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="SaturdayHalfTime"
                          >
                            IsPessi
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                          </span>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="doj" className="form-label">
                              Pessi Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="doj"
                              value="2025-02-04"
                            />
                          </div>
                        </Col>
                        {/* Gender Grid */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="Gender" className="form-label">
                             Gender
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="Gender"
                            >
                              <option value="">--- Select ---</option>
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="Gender" className="form-label">
                            Religion
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="Gender"
                            >
                              <option value="">--- Select ---</option>
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                            Old Code
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="5535"
                              disabled
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="SaturdayHalfTime"
                          >
                            IsShift Employee
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                          </span>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                            Exempt Late
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="contact"
                              placeholder="00"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                            Exempt Minuts
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="contact"
                              placeholder="00"
                            />
                          </div>
                        </Col>
                        {/* Education Grid */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                            Education
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="Education"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                            Education Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="Education Urdu"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                            Father Name Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="Father Name Urdu"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                            Address Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="Address Urdu"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                            Designation Title
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="Designation Title"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="SaturdayHalfTime"
                          >
                            IsManager
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                          </span>
                        </Col>
                        {/* Mother Name Grid */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                            Mother Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="Mother Name"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="designation" className="form-label">
                            NextTo Kin
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="contact"
                              placeholder="NextTo Kin"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="SaturdayHalfTime"
                          >
                            IsTransport
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                          </span>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="doj" className="form-label">
                            Transport Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="doj"
                              value="2025-02-04"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="doj" className="form-label">
                            Transport Route
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="doj"
                              placeholder="Transport Route"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="doj" className="form-label">
                            Transport Location
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="doj"
                              placeholder="Transport Location"
                            />
                          </div>
                        </Col>
                      </Row>
                      {/* Third Row */}
                      <Row className="gy-4 mt-2 p-1" style={{ border: "2px dotted lightgray" }}>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              IsShowFor Audit
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              IsStopSalary
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              HaveOTOFF
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              OTRate
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="SaturdayHalfTime"
                            />
                            <Label
                              className="form-check-label"
                              for="SaturdayHalfTime"
                            >
                              OTRateOFF
                            </Label>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>

            {/* <Col lg={12}>
              <Card>
                <Form>
                  <PreviewCardHeader
                    title="Employee"
                    // onCancel={formik.resetForm}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                      <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              E-Code
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Code"
                              disabled
                              value="123456"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Machine 
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Machine "
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Name
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Name"
                             
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Father Name
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Father Name"
                            />
                          </div>
                        </Col>
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
                              <option value="Choices1">Amir</option>
                              <option value="Choices2">Usama</option>
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
                              <option value="Choices1">Lahore</option>
                              <option value="Choices2">Islamabad</option>
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
                              <option value="Choices1" selected>Frontend</option>
                              <option value="Choices2" disabled>Backend</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                             DOJ
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                              min={getMinDate()} // Prevent past dates
                              value={selectedDate}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="departmentGroupInput"
                              className="form-label"
                            >
                              New Location
                            </Label>
                            <select
                              className="form-select  form-select-sm"
                              name="AttGroupID"
                              id="AttGroupID"
                            >
                              <option value="">---Select--- </option>
                              <option value="Choices1" disabled>Lahore</option>
                              <option value="Choices2" >Islamabad</option>
                            </select>
                          </div>
                        </Col>
                        
                       
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Remarks
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Cheque No"
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col> */}
            {/* <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="Location-table" id="customerList">
                    <Row className="g-4 mb-3">
                      <Col className="col-sm">
                        <div className="d-flex justify-content-sm-end">
                          <div className="search-box ms-2">
                            <input
                              type="text"
                              className="form-control-sm search"
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap table-sm"
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th>Employee</th>
                            <th>Code</th>
                            <th>Old Location</th>
                            <th>New Location</th>
                            <th>Effective Date</th>
                            <th>Remarks</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          <tr>
                            <td>Afraaz</td>
                            <td>55f7</td>
                            <td>Lahore</td>
                            <td>Karachi</td>
                            <td>02/02/2025</td>
                            <td>Ok</td>
                            <td>
                              <div className="d-flex gap-2">
                                <div className="edit ">
                                  <Button className="btn btn-soft-info">
                                    <i className="bx bx-edit"></i>
                                  </Button>
                                </div>
                                <div className="delete">
                                  <Button className="btn btn-soft-danger">
                                    <i className="ri-delete-bin-2-line"></i>
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="noresult" style={{ display: "none" }}>
                        <div className="text-center">
                          <lord-icon
                            src="https://cdn.lordicon.com/msoeawqm.json"
                            trigger="loop"
                            colors="primary:#121331,secondary:#08a88a"
                            style={{ width: "75px", height: "75px" }}
                          ></lord-icon>
                          <h5 className="mt-2">Sorry! No Result Found</h5>
                          <p className="text-muted mb-0">
                            We've searched more than 150+ Orders We did not find
                            any orders for you search.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <div className="pagination-wrap hstack gap-2">
                        <Link
                          className="page-item pagination-prev disabled"
                          to="#"
                        >
                          Previous
                        </Link>
                        <ul className="pagination Location-pagination mb-0"></ul>
                        <Link className="page-item pagination-next" to="#">
                          Next
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Employee;
