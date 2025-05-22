import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Container, Row, Col, Button } from "reactstrap";

// Dummy data for demo; replace with fetch by ID
const dummyEmployee = {
  EmpID: 6,
  ETypeID: 2,
  LocationID: 5,
  EmpCode: "EMP004",
  AccCode: "ACC1001",
  MachineCode: "MC001",
  EName: "Muhammad Ali Khan",
  FName: "Muhamamd Ahmed Khan",
  DeptID: 3,
  DeptName: "IT",
  DesgID: 4,
  DesignationTitle: "Software Engineer",
  HODID: "101",
  DOB: "1990-05-20T00:00:00Z",
  DOJ: "2015-03-01T00:00:00Z",
  HireType: "Permanent",
  JobType: "Full-time",
  ShiftID: 1,
  NIC: "35202-1234567-1",
  BasicSalary: "50000",
  ActualSalary: "55000",
  ManagerSalary: "0",
  IncomeTax: "2000",
  HaveOT: true,
  ReplacementOf: "0",
  IsBank: true,
  BankAccountNo: "1234567890",
  CompanyBankID: 10,
  Isactive: 1,
  DOL: "1900-01-01T00:00:00Z",
  LeftRemarks: "-",
  GradeID: 2,
  ProbitionStatus: "Completed",
  ProbitionDate: "2015-09-01T00:00:00Z",
  CellPhone: "03001234567",
  IcePhone: "03111234567",
  Address: "House No. 123, City A",
  AddressPermanent: "Village B, District C",
  Bloodgroup: "B+",
  EOBINo: "EOBI12345",
  SSNo: "SS001",
  LifeInsuranceNo: "LI12345",
  IsGroupInsurance: true,
  MartialStatus: "Single",
  IsPFund: true,
  PFAmount: "5000",
  IsPessi: true,
  PessiDate: "2016-01-01T00:00:00Z",
  Gender: "Male",
  Education: "BS Computer Science",
  MotherName: "Fatima",
  NextToKin: "Hassan",
  IsTransport: true,
  TransportRoute: "Route 5",
  TransportLocation: "Stop A",
  IsManager: false,
  OTRate: "2",
  NICExpairy: "2030-01-01T00:00:00Z",
};

const formatDate = (dateStr) => {
  if (!dateStr || dateStr.startsWith("1900")) return "-";
  return dateStr.split("T")[0];
};

const boolText = (val) => (val ? "Yes" : "No");

const sectionTitle = {
  color: "#0D8ABC",
  fontWeight: 700,
  fontSize: "1.1rem",
  margin: "28px 0 8px 0",
  letterSpacing: "0.5px",
};

const divider = {
  height: "1px",
  background: "#e5e5e5",
  margin: "18px 0 14px 0",
  border: "none",
};

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // TODO: Fetch employee by id
  const [employee, setEmployee] = useState(dummyEmployee);

  // useEffect(() => {
  //   // fetch employee by id and setEmployee
  // }, [id]);

  return (
    <Container fluid className="py-4">
      <Button color="secondary" onClick={() => navigate(-1)} style={{ position: "sticky", top: 10, zIndex: 10 }}>
        &larr; Back
      </Button>
      <Card className="mt-3 shadow-lg" style={{ margin: "3rem auto", borderRadius: 18 }}>
        <CardBody>
          <Row>
            <Col md={3} className="text-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.EName || "Employee")}&background=0D8ABC&color=fff&size=220`}
                alt="Avatar"
                style={{ width: 120, height: 120, borderRadius: "50%", border: "4px solid #0D8ABC" }}
              />
              <h3 className="mt-3" style={{ color: "#0D8ABC", fontWeight: 700 }}>{employee.EName}</h3>
              <div className="text-muted">{employee.DesignationTitle}</div>
              <div className="mt-2"><b>Department:</b> {employee.DeptName}</div>
              <div className="mt-2"><b>Employee Code:</b> {employee.EmpCode}</div>
              <div className="mt-2"><b>Grade:</b> {employee.GradeID}</div>
              <div className="mt-2"><b>Status:</b> {employee.Isactive ? "Active" : "Inactive"}</div>
            </Col>
            <Col md={9}>
              <div style={sectionTitle}>Personal Information</div>
              <Row>
                <Col md={6}><b>Father Name:</b> {employee.FName}</Col>
                <Col md={6}><b>Mother Name:</b> {employee.MotherName}</Col>
                <Col md={6}><b>Gender:</b> {employee.Gender}</Col>
                <Col md={6}><b>DOB:</b> {formatDate(employee.DOB)}</Col>
                <Col md={6}><b>CNIC:</b> {employee.NIC}</Col>
                <Col md={6}><b>CNIC Expiry:</b> {formatDate(employee.NICExpairy)}</Col>
                <Col md={6}><b>Blood Group:</b> {employee.Bloodgroup}</Col>
                <Col md={6}><b>Marital Status:</b> {employee.MartialStatus}</Col>
                <Col md={6}><b>Mobile:</b> {employee.CellPhone}</Col>
                <Col md={6}><b>Emergency Contact:</b> {employee.IcePhone}</Col>
                <Col md={12}><b>Address:</b> {employee.Address}</Col>
                <Col md={12}><b>Permanent Address:</b> {employee.AddressPermanent}</Col>
              </Row>
              <hr style={divider} />
              <div style={sectionTitle}>Job Information</div>
              <Row>
                <Col md={6}><b>Department:</b> {employee.DeptName}</Col>
                <Col md={6}><b>Designation:</b> {employee.DesignationTitle}</Col>
                <Col md={6}><b>Location:</b> {employee.LocationName}</Col>
                <Col md={6}><b>Joining Date:</b> {formatDate(employee.DOJ)}</Col>
                <Col md={6}><b>Probation Status:</b> {employee.ProbitionStatus}</Col>
                <Col md={6}><b>Probation End:</b> {formatDate(employee.ProbitionDate)}</Col>
                <Col md={6}><b>Job Type:</b> {employee.JobType}</Col>
                <Col md={6}><b>Hire Type:</b> {employee.HireType}</Col>
                <Col md={6}><b>Shift:</b> {employee.ShiftID}</Col>
                <Col md={6}><b>Manager:</b> {boolText(employee.IsManager)}</Col>
                <Col md={6}><b>HOD:</b> {employee.HODID}</Col>
              </Row>
              <hr style={divider} />
              <div style={sectionTitle}>Salary & Bank</div>
              <Row>
                <Col md={6}><b>Basic Salary:</b> {employee.BasicSalary}</Col>
                <Col md={6}><b>Actual Salary:</b> {employee.ActualSalary}</Col>
                <Col md={6}><b>Manager Salary:</b> {employee.ManagerSalary}</Col>
                <Col md={6}><b>Income Tax:</b> {employee.IncomeTax}</Col>
                <Col md={6}><b>Bank Account:</b> {employee.BankAccountNo}</Col>
                <Col md={6}><b>Company Bank ID:</b> {employee.CompanyBankID}</Col>
                <Col md={6}><b>Is Bank?</b> {boolText(employee.IsBank)}</Col>
              </Row>
              <hr style={divider} />
              <div style={sectionTitle}>Benefits & Other Info</div>
              <Row>
                <Col md={6}><b>EOBI No:</b> {employee.EOBINo}</Col>
                <Col md={6}><b>Social Security No:</b> {employee.SSNo}</Col>
                <Col md={6}><b>Life Insurance No:</b> {employee.LifeInsuranceNo}</Col>
                <Col md={6}><b>Group Insurance:</b> {boolText(employee.IsGroupInsurance)}</Col>
                <Col md={6}><b>Provident Fund:</b> {boolText(employee.IsPFund)}</Col>
                <Col md={6}><b>PF Amount:</b> {employee.PFAmount}</Col>
                <Col md={6}><b>PESSI:</b> {boolText(employee.IsPessi)}</Col>
                <Col md={6}><b>PESSI Date:</b> {formatDate(employee.PessiDate)}</Col>
                <Col md={6}><b>Education:</b> {employee.Education}</Col>
                <Col md={6}><b>Transport:</b> {boolText(employee.IsTransport)}</Col>
                <Col md={6}><b>Transport Route:</b> {employee.TransportRoute}</Col>
                <Col md={6}><b>Transport Location:</b> {employee.TransportLocation}</Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default EmployeeProfile;