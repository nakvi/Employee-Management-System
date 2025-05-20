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
import { useDispatch, useSelector } from "react-redux";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import avatar1 from "../../../assets/images/users/avatar-11.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getEmployee,
  submitEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../../slices/employee/employee/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getDesignation } from "../../../slices/setup/designation/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getReligion } from "../../../slices/employee/religion/thunk";
import { getGrade } from "../../../slices/setup/grade/thunk";
import { getGender } from "../../../slices/employee/gender/thunk";
const EmployeeCopy = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState("");
  const [editingGroup, setEditingGroup] = useState(null); // Track the group being edited

  // Access Redux state
  const { loading, error, employee } = useSelector((state) => state.Employee);
  const { location } = useSelector((state) => state.Location);
  const { department } = useSelector((state) => state.Department);
  const { designation } = useSelector((state) => state.Designation);
  const { religion } = useSelector((state) => state.Religion);
  const { grade } = useSelector((state) => state.Grade);
  const { gender } = useSelector((state) => state.Gender);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getEmployee());
    dispatch(getLocation());
    dispatch(getDesignation());
    dispatch(getDepartment());
    dispatch(getReligion());
    dispatch(getGrade());
    dispatch(getGender());
  }, [dispatch]);
  // Formik form setup
  const formik = useFormik({
    initialValues: {
      EmpID: 1,
      ETypeID: 2,
      LocationID: 5,
      EmpCode: "EMP001",
      AccCode: "ACC1001",
      MachineCode: "MC001",
      EName: " Ali Khan",
      FName: "Ahmed Khan",
      DeptID: 3,
      DesgID: 4,
      HODID: 101,
      DOB: "1990-05-20T00:00:00",
      DOJ: "2015-03-01T00:00:00",
      DOJAct: "2015-03-01T00:00:00",
      HireType: "Permanent",
      JobType: "Full-time",
      OffDay1: 6,
      OffDay2: 7,
      ShiftID: 1,
      NIC: "35202-1234567-1",
      BasicSalary: "50000",
      ActualSalary: "55000",
      ManagerSalary: 0,
      IncomeTax: "2000",
      HaveOT: true,
      HaveOTAct: true,
      HaveOTOFF: true,
      ReplacementOf: 0,
      IsBank: true,
      BankAccountNo: "1234567890",
      CompanyBankID: "10",
      IsActive: false,
      IsactiveAct: 1,
      DOL: "1900-01-01T00:00:00",
      DOLAct: "1900-01-01T00:00:00",
      LeftRemarks: "",
      GradeID: 2,
      ProbitionStatus: "Completed",
      ProbitionDate: "2015-09-01T00:00:00",
      CellPhone: "03001234567",
      IcePhone: "03111234567",
      Address: "House No. 123, City A",
      AddressPermanent: "Village B, District C",
      Bloodgroup: "B+",
      EOBINo: "EOBI12345",
      EOBINoAct: "EOBI12345",
      SSNo: "SS001",
      LifeInsuranceNo: "LI12345",
      IsGroupInsurance: true,
      MartialStatus: "Single",
      IsPFundEntitled: true,
      PFundEntitledDate: "2016-01-01T00:00:00",
      IsPFund: true,
      PFAmount: "5000",
      IsPessi: true,
      PessiDate: "2016-01-01T00:00:00",
      Gender: "Male",
      ReligionID: 1,
      IsExempt: false,
      IsShiftEmployee: true,
      IsShiftEmployeeAct: true,
      ExemptLate: false,
      ExemptMinuts: 0,
      Education: "BS Computer Science",
      ENameUrdu: " علی خان",
      FNameUrdu: " احمد خان",
      AddressUrdu: " گھر نمبر 123، شہر اے",
      DesignationTitle: "Software Engineer",
      OldCode: "EMP_OLD_01",
      MotherName: "Fatima",
      NextToKin: "Hassan",
      IsTransport: true,
      TransportDate: "2020-01-01T00:00:00",
      TransportRoute: "Route 5",
      TransportLocation: " Stop A",
      IsManager: false,
      IsShowForAudit: true,
      IsStopSalary: false,
      OTRate: 2,
      OTRateOFF: 1,
      NICExpairy: "2030-01-01T00:00:00",
      BusDeduction: true,
      BlackList: false,
      UID: 1010,
      Tranzdatetime: "2025-04-23T14:00:00",
      CompanyID: 1,
    },

    validationSchema: Yup.object({
      VCode: Yup.string()
        .required("Code is required.")
        .min(3, "Code must be at least 3 characters ")
        .max(10, "Code must be less then 10 characters"),
      VName: Yup.string()
        .required("Title is required.")
        .min(3, "Title at least must be 3 characters "),

      TimeIn: Yup.number().required("Time In is required."),
      TimeOut: Yup.number().required("Time Out is required."),
      RestTimeFrom: Yup.number().required("Rest From is required."),
      RestTimeTo: Yup.number().required("Rest To is required."),
      WorkingHrs: Yup.number().required("Working Hours are required."),
      RelaxTime: Yup.number().required("Relax Time is required."),
      MinAttTime: Yup.number().required("Min Time is required."),
      MinHDTime: Yup.number().required("Min Half-Day Time is required."),

      // TimeInRamazan: Yup.number().required("Time In (Ramazan) is required."),
      // TimeOutRamazan: Yup.number().required("Time Out (Ramazan) is required."),
      // RestTimeFromRamazan: Yup.number().required("Rest From (Ramazan) is required."),
      // RestTimeToRamazan: Yup.number().required("Rest To (Ramazan) is required."),
      // WorkingHrsRamazan: Yup.number().required("Working Hours (Ramazan) are required."),
      // RelaxTimeRamazan: Yup.number().required("Relax Time (Ramazan) is required."),
      // MinAttTimeRamazan: Yup.number().required("Min Time (Ramazan) is required."),
      // MinHDTimeRamazan: Yup.number().required("Min Half-Day Time (Ramazan) is required."),
      IsRoster: Yup.boolean(),
      IsSecurity: Yup.boolean(),
      SaturdayHalfTime: Yup.boolean(),
      LocationID: Yup.number().required("Location is required."),
      IsActive: Yup.boolean(),
    }),

    onSubmit: (values) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0,
        IsRoster: values.IsRoster ? 1 : 0,
        IsSecurity: values.IsSecurity ? 1 : 0,
        SaturdayHalfTime: values.SaturdayHalfTime ? 1 : 0,
      };
      if (editingGroup) {
        console.log("Editing Group", transformedValues);

        dispatch(
          updateEmployee({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null); // Reset after submission
      } else {
        dispatch(submitEmployee(transformedValues));
      }
      formik.resetForm();
    },
  });
  // set date format
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
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
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
                              <div className="mb-3">
                                <Label
                                  htmlFor="LocationID"
                                  className="form-label"
                                >
                                  Location
                                </Label>
                                <select
                                  name="LocationID"
                                  id="LocationID"
                                  className="form-select form-select-sm"
                                  value={formik.values.LocationID} // Bind to Formik state
                                  onChange={formik.handleChange} // Handle changes
                                  onBlur={formik.handleBlur} // Track field blur
                                >
                                  <option value="-1">---Select---</option>
                                  {location?.length > 0 ? (
                                    location.map((group) => (
                                      <option key={group.VID} value={group.VID}>
                                        {group.VName}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="0" disabled>
                                      No location available
                                    </option>
                                  )}
                                </select>
                                {formik.touched.LocationID &&
                                formik.errors.LocationID ? (
                                  <div className="text-danger">
                                    {formik.errors.LocationID}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            {/* Emp Code */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="EmpCode" className="form-label">
                                  Emp Code
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="EmpCode"
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
                                <Label htmlFor="EName" className="form-label">
                                  Name
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="EName"
                                  placeholder="Name"
                                  {...formik.getFieldProps("EName")}
                                />
                                {formik.touched.EName && formik.errors.EName ? (
                                  <div className="text-danger">
                                    {formik.errors.EName}
                                  </div>
                                ) : null}
                              </div>
                            </Col>

                            {/* Father Name */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="FName" className="form-label">
                                  Father Name
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="FName"
                                  placeholder="Father Name"
                                  {...formik.getFieldProps("FName")}
                                />
                                {formik.touched.FName && formik.errors.FName ? (
                                  <div className="text-danger">
                                    {formik.errors.FName}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            {/* Department */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="DeptID" className="form-label">
                                  Department
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="DeptID"
                                >
                                  <option value="-1">---Select---</option>
                                  {department?.length > 0 ? (
                                    department.map((group) => (
                                      <option key={group.VID} value={group.VID}>
                                        {group.VName}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="0" disabled>
                                      No Department available
                                    </option>
                                  )}
                                </select>
                              </div>
                            </Col>

                            {/* Designation */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="DesgID" className="form-label">
                                  Designation
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="DesgID"
                                >
                                  <option value="-1">---Select---</option>
                                  {designation?.length > 0 ? (
                                    designation.map((group) => (
                                      <option key={group.VID} value={group.VID}>
                                        {group.VName}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="0" disabled>
                                      No Designation available
                                    </option>
                                  )}
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
                                  {...formik.getFieldProps("DOB")}
                                />
                              </div>
                            </Col>
                            {/* DOJ */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="DOJ" className="form-label">
                                  DOJ
                                </Label>
                                <Input
                                  type="date"
                                  className="form-control-sm"
                                  id="DOJ"
                                  value="2025-02-04"
                                  {...formik.getFieldProps("DOJ")}
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
                                  Shift
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
                                  htmlFor="HireType"
                                  className="form-label"
                                >
                                  Hire Type
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="HireType"
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="Contractual">
                                    Contractual
                                  </option>
                                  <option value="Permanent">Permanent</option>
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
                                  Replace off
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="empCode"
                                  placeholder="NIC"
                                />
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
                      <Row
                        className="gy-4 mt-2 p-1"
                        style={{ border: "2px dotted lightgray" }}
                      >
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
                            <Label htmlFor="NIC" className="form-label">
                              NIC
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="NIC"
                              placeholder="NIC"
                              {...formik.getFieldProps("NIC")}
                            />
                          </div>
                        </Col>

                        {/* Name */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="BasicSalary" className="form-label">
                              Salary
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="BasicSalary"
                              placeholder="00 "
                              {...formik.getFieldProps("BasicSalary")}
                            />
                          </div>
                        </Col>

                        {/* Monthly Tax */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="IncomeTax" className="form-label">
                              Monthly Tax
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="IncomeTax"
                              placeholder="0.01 "
                              {...formik.getFieldProps("IncomeTax")}
                            />
                          </div>
                        </Col>

                        {/* Have OverTime */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="HaveOT">
                            Have OverTime
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="HaveOT"
                              {...formik.getFieldProps("HaveOT")}
                              checked={formik.values.HaveOT}
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
                              <option value="-1">---Select---</option>
                              {grade?.length > 0 ? (
                                grade.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No grade available
                                </option>
                              )}
                            </select>
                          </div>
                        </Col>
                        {/*   IsBank Grid */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsBank">
                            IsBank
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsBank"
                              {...formik.getFieldProps("IsBank")}
                              checked={formik.values.IsBank}
                            />
                          </span>
                        </Col>
                        {/* Bank Account */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="BankAccountNo"
                              className="form-label"
                            >
                              Bank Account
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="BankAccountNo"
                              placeholder="Bank Account"
                              {...formik.getFieldProps("BankAccountNo")}
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
                          <Label className="form-check-label" for="IsActive">
                            IsActive
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsActive"
                              {...formik.getFieldProps("IsActive")}
                              checked={formik.values.IsActive}
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
                          <Label className="form-check-label" for="IsExempt">
                            IsExempt
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsExempt"
                              {...formik.getFieldProps("IsExempt")}
                              checked={formik.values.IsExempt}
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
                            <Label
                              htmlFor="ProbitionDate"
                              className="form-label"
                            >
                              Probition Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="ProbitionDate"
                              value="2025-02-04"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="CellPhone" className="form-label">
                              Contact
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="CellPhone"
                              placeholder="Contact"
                            />
                          </div>
                        </Col>
                        {/* Address */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="Address" className="form-label">
                              Present Address
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="Address"
                              placeholder="Address"
                            />
                          </div>
                        </Col>
                        {/* Address */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="AddressPermanent"
                              className="form-label"
                            >
                              Permanent Address
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="AddressPermanent"
                              placeholder="Permanent Address"
                              {...formik.getFieldProps("AddressPermanent")}
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
                            <Label htmlFor="EOBINo" className="form-label">
                              EOBI No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="EOBINo"
                              {...formik.getFieldProps("EOBINo")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="SSNo" className="form-label">
                              SS No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="SSNo"
                              placeholder="SS No"
                              {...formik.getFieldProps("SSNo")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="LifeInsuranceNo"
                              className="form-label"
                            >
                              Life Insurance No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="LifeInsuranceNo"
                              placeholder="Life Insurance No"
                              {...formik.getFieldProps("LifeInsuranceNo")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="IsGroupInsurance"
                          >
                            IsGroupInsurance
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsGroupInsurance"
                              {...formik.getFieldProps("IsGroupInsurance")}
                              checked={formik.values.IsGroupInsurance}
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
                            for="IsPFundEntitled"
                          >
                            IsPFundEntitled
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsPFundEntitled"
                              {...formik.getFieldProps("IsPFundEntitled")}
                              checked={formik.values.IsPFundEntitled}
                            />
                          </span>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="PFundEntitledDate"
                              className="form-label"
                            >
                              PFundEntitled Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PFundEntitledDate"
                              value="2025-02-04"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsPFund">
                            IsPFund
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsPFund"
                              {...formik.getFieldProps("IsPFund")}
                              checked={formik.values.IsPFund}
                            />
                          </span>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="PFAmount" className="form-label">
                              PF Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="PFAmount"
                              placeholder="00"
                              {...formik.getFieldProps("PFAmount")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsPessi">
                            IsPessi
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsPessi"
                              {...formik.getFieldProps("IsPessi")}
                              checked={formik.values.IsPessi}
                            />
                          </span>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="PessiDate" className="form-label">
                              Pessi Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PessiDate"
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
                                <option value="-1">---Select---</option>
                              {gender?.length > 0 ? (
                                gender.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No gender available
                                </option>
                              )}
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
                                 <option value="-1">---Select---</option>
                              {religion?.length > 0 ? (
                                religion.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No religion available
                                </option>
                              )}
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="OldCode" className="form-label">
                              Old Code
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="OldCode"
                              placeholder="5535"
                              disabled
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="IsShiftEmployee"
                          >
                            IsShift Employee
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsShiftEmployee"
                              {...formik.getFieldProps("IsShiftEmployee")}
                              checked={formik.values.IsShiftEmployee}
                            />
                          </span>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="ExemptLate" className="form-label">
                              Exempt Late
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="ExemptLate"
                              placeholder="00"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="ExemptMinuts"
                              className="form-label"
                            >
                              Exempt Minuts
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="ExemptMinuts"
                              placeholder="00"
                            />
                          </div>
                        </Col>
                        {/* Education Grid */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="Education" className="form-label">
                              Education
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="Education"
                              placeholder="Education"
                              {...formik.getFieldProps("Education")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="ENameUrdu" className="form-label">
                              Education Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="ENameUrdu"
                              placeholder="Education Urdu"
                              {...formik.getFieldProps("ENameUrdu")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="FNameUrdu" className="form-label">
                              Father Name Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="FNameUrdu"
                              placeholder="Father Name Urdu"
                              {...formik.getFieldProps("FNameUrdu")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="AddressUrdu" className="form-label">
                              Address Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="AddressUrdu"
                              placeholder="Address Urdu"
                              {...formik.getFieldProps("AddressUrdu")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="DesignationTitle"
                              className="form-label"
                            >
                              Designation Title
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="DesignationTitle"
                              placeholder="Designation Title"
                              {...formik.getFieldProps("DesignationTitle")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsManager">
                            IsManager
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsManager"
                              {...formik.getFieldProps("IsPFund")}
                              checked={formik.values.IsPFund}
                            />
                          </span>
                        </Col>
                        {/* Mother Name Grid */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="MotherName" className="form-label">
                              Mother Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="MotherName"
                              placeholder="Mother Name"
                              {...formik.getFieldProps("MotherName")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="NextToKin" className="form-label">
                              NextTo Kin
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="NextToKin"
                              placeholder="NextTo Kin"
                              {...formik.getFieldProps("NextToKin")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsTransport">
                            IsTransport
                          </Label>
                          <span class="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsTransport"
                              {...formik.getFieldProps("IsTransport")}
                              checked={formik.values.IsTransport}
                            />
                          </span>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="TransportDate"
                              className="form-label"
                            >
                              Transport Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="TransportDate"
                              value="2025-02-04"
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="TransportRoute"
                              className="form-label"
                            >
                              Transport Route
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="TransportRoute"
                              placeholder="Transport Route"
                              {...formik.getFieldProps("TransportRoute")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="TransportLocation"
                              className="form-label"
                            >
                              Transport Location
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="TransportLocation"
                              placeholder="Transport Location"
                              {...formik.getFieldProps("TransportLocation")}
                            />
                          </div>
                        </Col>
                      </Row>
                      {/* Third Row */}
                      <Row
                        className="gy-4 mt-2 p-1"
                        style={{ border: "2px dotted lightgray" }}
                      >
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsShowForAudit"
                            />
                            <Label
                              className="form-check-label"
                              for="IsShowForAudit"
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
                              id="IsStopSalary"
                              {...formik.getFieldProps("IsStopSalary")}
                            />
                            <Label
                              className="form-check-label"
                              for="IsStopSalary"
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
                              {...formik.getFieldProps("IsTransport")}
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
                              id="OTRate"
                              {...formik.getFieldProps("OTRate")}
                            />
                            <Label className="form-check-label" for="OTRate">
                              OTRate
                            </Label>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="form-check mb-2 mt-2 ">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="OTRateOFF"
                              {...formik.getFieldProps("OTRateOFF")}
                            />
                            <Label className="form-check-label" for="OTRateOFF">
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

export default EmployeeCopy;
