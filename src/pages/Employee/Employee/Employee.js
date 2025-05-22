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
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation
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
import { getSalaryBank } from "../../../slices/setup/salaryBank/thunk";
import { getEmployeeType } from "../../../slices//employee/employeeType/thunk";
import { getShift } from "../../../slices/setup/shift/thunk";

const Employee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Access location to get passed state
  const [selectedDate, setSelectedDate] = useState("");
  const [editingGroup, setEditingGroup] = useState(null); // Track the group being edited

  // Access Redux state
  const { loading, error, employee } = useSelector((state) => state.Employee);
  const { location: locations } = useSelector((state) => state.Location);
  const { department } = useSelector((state) => state.Department);
  const { designation } = useSelector((state) => state.Designation);
  const { religion } = useSelector((state) => state.Religion);
  const { grade } = useSelector((state) => state.Grade);
  const { gender } = useSelector((state) => state.Gender);
  const { salaryBank } = useSelector((state) => state.SalaryBank);
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { shift } = useSelector((state) => state.Shift);

  // Get employee data from location state
  const employeeData = location.state?.employee;

  // Format date for input type="date"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  // Transform employee data for Formik
  const transformEmployeeData = (data) => {
    if (!data) return {};
    return {
      ...data,
      // Convert numeric booleans to actual booleans
      Isactive: data.Isactive === 1,
      IsactiveAct: data.IsactiveAct === 1,
      HaveOT: data.HaveOT === 1,
      HaveOTAct: data.HaveOTAct === 1,
      HaveOTOFF: data.HaveOTOFF === 1,
      IsBank: data.IsBank === 1,
      IsGroupInsurance: data.IsGroupInsurance === 1,
      IsPFundEntitled: data.IsPFundEntitled === 1,
      IsPFund: data.IsPFund === 1,
      IsPessi: data.IsPessi === 1,
      IsExempt: data.IsExempt === 1,
      IsShiftEmployee: data.IsShiftEmployee === 1,
      IsShiftEmployeeAct: data.IsShiftEmployeeAct === 1,
      ExemptLate: data.ExemptLate === 1,
      IsTransport: data.IsTransport === 1,
      IsManager: data.IsManager === 1,
      IsShowForAudit: data.IsShowForAudit === 1,
      IsStopSalary: data.IsStopSalary === 1,
      BusDeduction: data.BusDeduction === 1,
      BlackList: data.BlackList === 1,
      // Format date fields
      DOB: formatDate(data.DOB),
      DOJ: formatDate(data.DOJ),
      DOJAct: formatDate(data.DOJAct),
      DOL: formatDate(data.DOL),
      DOLAct: formatDate(data.DOLAct),
      ProbitionDate: formatDate(data.ProbitionDate),
      PFundEntitledDate: formatDate(data.PFundEntitledDate),
      PessiDate: formatDate(data.PessiDate),
      TransportDate: formatDate(data.TransportDate),
      NICExpairy: formatDate(data.NICExpairy),
    };
  };

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getEmployee());
    dispatch(getLocation());
    dispatch(getDesignation());
    dispatch(getDepartment());
    dispatch(getReligion());
    dispatch(getGrade());
    dispatch(getGender());
    dispatch(getSalaryBank());
    dispatch(getEmployeeType());
    dispatch(getShift());

    // Set editingGroup and Formik values if employeeData exists
    if (employeeData) {
      setEditingGroup(employeeData);
      formik.setValues(transformEmployeeData(employeeData));
    }
  }, [dispatch, employeeData]);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      EmpID: 0,
      ETypeID: 0,
      LocationID: "-1",
      EmpCode: "0",
      AccCode: "0",
      MachineCode: "0",
      EName: "",
      FName: "",
      DeptID: 0,
      DesgID: 0,
      HODID: "0",
      DOB: "",
      DOJ: "",
      DOJAct: "",
      HireType: "",
      JobType: "",
      OffDay1: 0,
      OffDay2: 0,
      ShiftID: 0,
      NIC: "",
      BasicSalary: "",
      ActualSalary: "",
      ManagerSalary: "0",
      IncomeTax: "",
      HaveOT: false,
      HaveOTAct: false,
      HaveOTOFF: false,
      ReplacementOf: "",
      IsBank: false,
      BankAccountNo: "",
      CompanyBankID: "",
      Isactive: false,
      IsactiveAct: false,
      DOL: "",
      DOLAct: "",
      LeftRemarks: "",
      GradeID: 0,
      ProbitionStatus: "",
      ProbitionDate: "",
      CellPhone: "",
      IcePhone: "",
      Address: "",
      AddressPermanent: "",
      Bloodgroup: "",
      EOBINo: "",
      EOBINoAct: "",
      SSNo: "",
      LifeInsuranceNo: "",
      IsGroupInsurance: false,
      MartialStatus: "",
      IsPFundEntitled: false,
      PFundEntitledDate: "",
      IsPFund: false,
      PFAmount: "",
      IsPessi: false,
      PessiDate: "",
      Gender: "",
      ReligionID: 0,
      IsExempt: false,
      IsShiftEmployee: false,
      IsShiftEmployeeAct: false,
      ExemptLate: false,
      ExemptMinuts: 0,
      Education: "",
      ENameUrdu: "",
      FNameUrdu: "",
      AddressUrdu: "",
      DesignationTitle: "",
      OldCode: "-",
      MotherName: "",
      NextToKin: "",
      IsTransport: false,
      TransportDate: "",
      TransportRoute: "",
      TransportLocation: "",
      IsManager: false,
      IsShowForAudit: false,
      IsStopSalary: false,
      OTRate: "0",
      OTRateOFF: "0",
      NICExpairy: "",
      BusDeduction: false,
      BlackList: false,
      UID: 1010,
      Tranzdatetime: "2025-04-23T14:00:00",
      CompanyID: 1,
    },

    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      LocationID: Yup.string()
        .notOneOf(["-1"], "Location is required")
        .required("Required"),
      EName: Yup.string().required("Employee Name is required"),
      FName: Yup.string().required("Father Name is required"),
      JobType: Yup.string().required("Job Type is required"),
      DeptID: Yup.number()
        .min(1, "Department is required")
        .required("Required"),
      DesgID: Yup.number()
        .min(1, "Designation is required")
        .required("Required"),
      DOB: Yup.date().required("Date of Birth is required"),
      DOJ: Yup.date().required("Date of Joining is required"),
      HireType: Yup.string().required("Hire Type is required"),
      OffDay1: Yup.number()
        .min(1, "Off Day 1 is required")
        .required("Required"),
      OffDay2: Yup.number()
        .min(1, "Off Day 2 is required")
        .required("Required"),
      NIC: Yup.string()
        .matches(
          /^[0-9]{5}-[0-9]{7}-[0-9]$/,
          "NIC must be in the format 12345-1234567-1"
        )
        .required("NIC is required"),
      NICExpairy: Yup.date().required("Date of NIC Expairy is required"),
      Gender: Yup.string().required("Gender is required"),
      ReligionID: Yup.number()
        .min(1, "Religion is required")
        .required("Required"),

      BankAccountNo: Yup.string().test(
        "bank-account-required",
        "Bank Account is required when Bank is checked",
        function (value) {
          const { IsBank } = this.parent;
          return !IsBank || (IsBank && !!value);
        }
      ),
      CompanyBankID: Yup.string().test(
        "company-bank-required",
        "Company Bank is required when Bank is checked",
        function (value) {
          const { IsBank } = this.parent;
          return !IsBank || (IsBank && value !== "-1" && !!value);
        }
      ),
      ShiftID: Yup.number()
        .min(1, "Shift type is required")
        .required("Required"),
      ProbitionStatus: Yup.string().required(
        "Probition Status  Type is required"
      ),
      // ProbitionDate: Yup.date().required("Probition Date is required"),
      GradeID: Yup.number()
        .min(1, "Grade type is required")
        .required("Required"),
      MartialStatus: Yup.string().required("Martial Status Type is required"),
      // PFundEntitledDate: Yup.date().required("PFund Entitled Date is required"),
      // PessiDate: Yup.date().required("Pessi Date is required"),
      BasicSalary: Yup.number()
        .nullable()
        .required("Required")
        .min(0, "Basic Salary must be positive")
        .max(9999999999, "Basic Salary must be less than 10 digits"),

      ActualSalary: Yup.number()
        .nullable()
        .notRequired()
        .min(0, "Actual Salary must be positive")
        .max(9999999999, "Actual Salary must be less than 10 digits"),

      IncomeTax: Yup.number()
        .nullable()
        .required("Required")
        .min(0, "Income Tax must be positive")
        .max(999999999999999999, "Income Tax must be less than 18 digits"),

      OTRate: Yup.number()
        .nullable()
        .notRequired()
        .min(0, "OT Rate must be positive")
        .max(99.99, "OT Rate must be less than 100"),

      OTRateOFF: Yup.number()
        .nullable()
        .notRequired()
        .min(0, "OT Rate OFF must be positive")
        .max(99.99, "OT Rate OFF must be less than 100"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const transformedValues = {
        ...values,
        ActualSalary: values.ActualSalary ? Number(values.ActualSalary) : 0,
        CompanyBankID: values.CompanyBankID ? Number(values.CompanyBankID) : 0,
        PFAmount: values.PFAmount ? Number(values.PFAmount) : 0,
        OTRate: values.OTRate ? Number(values.OTRate) : 0,
        OTRateOFF: values.OTRateOFF ? Number(values.OTRateOFF) : 0,
        Isactive: values.Isactive ? 1 : 0,
        IsactiveAct: values.IsactiveAct ? 1 : 0,
        HaveOT: values.HaveOT ? 1 : 0,
        HaveOTAct: values.HaveOTAct ? 1 : 0,
        HaveOTOFF: values.HaveOTOFF ? 1 : 0,
        IsBank: values.IsBank ? 1 : 0,
        IsGroupInsurance: values.IsGroupInsurance ? 1 : 0,
        IsPFundEntitled: values.IsPFundEntitled ? 1 : 0,
        IsPFund: values.IsPFund ? 1 : 0,
        IsPessi: values.IsPessi ? 1 : 0,
        IsExempt: values.IsExempt ? 1 : 0,
        IsShiftEmployee: values.IsShiftEmployee ? 1 : 0,
        IsShiftEmployeeAct: values.IsShiftEmployeeAct ? 1 : 0,
        ExemptLate: values.ExemptLate ? 1 : 0,
        IsTransport: values.IsTransport ? 1 : 0,
        IsManager: values.IsManager ? 1 : 0,
        IsShowForAudit: values.IsShowForAudit ? 1 : 0,
        IsStopSalary: values.IsStopSalary ? 1 : 0,
        BusDeduction: values.BusDeduction ? 1 : 0,
        BlackList: values.BlackList ? 1 : 0,
      };

      try {
        if (editingGroup) {
          await dispatch(
            updateEmployee({ ...transformedValues, VID: editingGroup.VID })
          ).unwrap();

          // ✅ Reset form only on success
          formik.resetForm();
          setEditingGroup(null);
        } else {
          await dispatch(submitEmployee(transformedValues)).unwrap();

          // ✅ Reset form only on success
          formik.resetForm();
        }
      } catch (error) {
        // ❌ Don't reset form, show error if needed
        console.error("Error in form submission:", error);
      } finally {
        setSubmitting(false);
      }
    },

    // onSubmit: (values) => {
    //   const transformedValues = {
    //     ...values,
    //     Isactive: values.Isactive ? 1 : 0,
    //     IsactiveAct: values.IsactiveAct ? 1 : 0,
    //     HaveOT: values.HaveOT ? 1 : 0,
    //     HaveOTAct: values.HaveOTAct ? 1 : 0,
    //     HaveOTOFF: values.HaveOTOFF ? 1 : 0,
    //     IsBank: values.IsBank ? 1 : 0,
    //     IsGroupInsurance: values.IsGroupInsurance ? 1 : 0,
    //     IsPFundEntitled: values.IsPFundEntitled ? 1 : 0,
    //     IsPFund: values.IsPFund ? 1 : 0,
    //     IsPessi: values.IsPessi ? 1 : 0,
    //     IsExempt: values.IsExempt ? 1 : 0,
    //     IsShiftEmployee: values.IsShiftEmployee ? 1 : 0,
    //     IsShiftEmployeeAct: values.IsShiftEmployeeAct ? 1 : 0,
    //     ExemptLate: values.ExemptLate ? 1 : 0,
    //     IsTransport: values.IsTransport ? 1 : 0,
    //     IsManager: values.IsManager ? 1 : 0,
    //     IsShowForAudit: values.IsShowForAudit ? 1 : 0,
    //     IsStopSalary: values.IsStopSalary ? 1 : 0,
    //     BusDeduction: values.BusDeduction ? 1 : 0,
    //     BlackList: values.BlackList ? 1 : 0,
    //   };
    //   if (editingGroup) {
    //     dispatch(
    //       updateEmployee({ ...transformedValues, VID: editingGroup.VID })
    //     );
    //     // Only navigate if update was successful
    //     // navigate(-1);
    //     setEditingGroup(null); // Reset after submission
    //   } else {
    //     // console.log(transformedValues);
    //     dispatch(submitEmployee(transformedValues));
    //   }
    //   formik.resetForm();
    // },
  });

  // Set date format
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const handleCancel = () => {
    formik.resetForm();
    navigate(-1); // Go back to previous page
  };
  document.title = "Employee | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading && <p>Loading...</p>}
          {/* {error && <p className="text-danger">{error}</p>} */}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader
                    title={editingGroup ? "Edit Employee" : "Employee Details"}
                    onCancel={
                      editingGroup ? handleCancel : () => formik.resetForm()
                    }
                    isEditMode={!!editingGroup} // Pass whether we're in edit mode
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      {/* First Row */}
                      <Row>
                        <Col lg={10}>
                          <Row className="gy-4">
                            {/* E-Type */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="ETypeID" className="form-label">
                                  E-Type<span className="text-danger">*</span>
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="ETypeID"
                                  name="ETypeID"
                                  value={formik.values.ETypeID}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="-1">---Select---</option>
                                  {employeeType?.length > 0 ? (
                                    employeeType.map((group) => (
                                      <option key={group.VID} value={group.VID}>
                                        {group.VName}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="0" disabled>
                                      No Employee Type available
                                    </option>
                                  )}
                                </select>
                                {formik.touched.ETypeID &&
                                formik.errors.ETypeID ? (
                                  <div className="text-danger">
                                    {formik.errors.ETypeID}
                                  </div>
                                ) : null}
                              </div>
                            </Col>

                            {/* Location */}
                            <Col xxl={2} md={3}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="LocationID"
                                  className="form-label"
                                >
                                  Location<span className="text-danger">*</span>
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
                                  {locations?.length > 0 ? (
                                    locations.map((group) => (
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
                                  name="EmpCode"
                                  placeholder="Emp Code"
                                  readOnly
                                  disabled
                                  {...formik.getFieldProps("EmpCode")}
                                />
                              </div>
                            </Col>

                            {/* Machine Code */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="MachineCode"
                                  className="form-label"
                                >
                                  Machine Code
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="MachineCode"
                                  name="MachineCode"
                                  placeholder="Machine Code"
                                  readOnly
                                  disabled
                                  {...formik.getFieldProps("MachineCode")}
                                />
                              </div>
                            </Col>

                            {/* Name */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="EName" className="form-label">
                                  Name<span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="EName"
                                  name="EName"
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
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="FName"
                                  name="FName"
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

                            {/* Job Type */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="JobType" className="form-label">
                                  Job Type<span className="text-danger">*</span>
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="JobType"
                                  name="JobType"
                                  value={formik.values.JobType} // Bind to Formik state
                                  onChange={formik.handleChange} // Handle changes
                                  onBlur={formik.handleBlur} // Track field blur
                                >
                                  <option value="-1">---Select---</option>
                                  <option value="Contractual">
                                    Contractual
                                  </option>
                                  <option value="Permanent">Permanent</option>
                                </select>
                                {formik.touched.JobType &&
                                formik.errors.JobType ? (
                                  <div className="text-danger">
                                    {formik.errors.JobType}
                                  </div>
                                ) : null}
                              </div>
                            </Col>

                            {/* Department */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="DeptID" className="form-label">
                                  Department
                                  <span className="text-danger">*</span>
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="DeptID"
                                  name="DeptID"
                                  value={formik.values.DeptID}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="-1">---Select---</option>
                                  {department?.data.length > 0 ? (
                                    department.data.map((group) => (
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
                                {formik.touched.DeptID &&
                                formik.errors.DeptID ? (
                                  <div className="text-danger">
                                    {formik.errors.DeptID}
                                  </div>
                                ) : null}
                              </div>
                            </Col>

                            {/* Designation */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="DesgID" className="form-label">
                                  Designation
                                  <span className="text-danger">*</span>
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="DesgID"
                                  name="DesgID"
                                  value={formik.values.DesgID}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
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
                                {formik.touched.DesgID &&
                                formik.errors.DesgID ? (
                                  <div className="text-danger">
                                    {formik.errors.DesgID}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            {/* HOD */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="HODID" className="form-label">
                                  HOD
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="HODID"
                                  name="HODID"
                                  placeholder="HOD"
                                  {...formik.getFieldProps("HODID")}
                                />
                              </div>
                            </Col>
                            {/* DOB */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="DOB" className="form-label">
                                  DOB<span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="date"
                                  className="form-control-sm"
                                  id="DOB"
                                  name="DOB"
                                  {...formik.getFieldProps("DOB")}
                                />
                                {formik.touched.DOB && formik.errors.DOB ? (
                                  <div className="text-danger">
                                    {formik.errors.DOB}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            {/* DOJ */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="DOJ" className="form-label">
                                  DOJ<span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="date"
                                  className="form-control-sm"
                                  id="DOJ"
                                  name="DOJ"
                                  {...formik.getFieldProps("DOJ")}
                                />
                                {formik.touched.DOJ && formik.errors.DOJ ? (
                                  <div className="text-danger">
                                    {formik.errors.DOJ}
                                  </div>
                                ) : null}
                              </div>
                            </Col>

                            {/* Hire Type */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="HireType"
                                  className="form-label"
                                >
                                  Hire Type
                                  <span className="text-danger">*</span>
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="HireType"
                                  name="HireType"
                                  value={formik.values.HireType}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="Full-time">Full-time</option>
                                  <option value="Part-time">Part-time</option>
                                </select>
                                {formik.touched.HireType &&
                                formik.errors.HireType ? (
                                  <div className="text-danger">
                                    {formik.errors.HireType}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            {/* Replacement Of */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="ReplacementOf"
                                  className="form-label"
                                >
                                  Replace off
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="ReplacementOf"
                                  name="ReplacementOf"
                                  placeholder="Replacement Of"
                                  {...formik.getFieldProps("ReplacementOf")}
                                />
                              </div>
                            </Col>
                            {/* Off Day- 1 */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="OffDay1" className="form-label">
                                  Off Day- 1
                                  <span className="text-danger">*</span>
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="OffDay1"
                                  name="OffDay1"
                                  value={formik.values.OffDay1}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="1">Monday</option>
                                  <option value="2">Tuesday</option>
                                  <option value="3">Wednesday</option>
                                  <option value="4">Thursday</option>
                                  <option value="5">Friday</option>
                                  <option value="6">Saturday</option>
                                  <option value="7">Sunday</option>
                                </select>
                                {formik.touched.OffDay1 &&
                                formik.errors.OffDay1 ? (
                                  <div className="text-danger">
                                    {formik.errors.OffDay1}
                                  </div>
                                ) : null}
                              </div>
                            </Col>

                            {/* Off Day- 2 */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="OffDay2" className="form-label">
                                  Off Day- 2
                                  <span className="text-danger">*</span>
                                </Label>
                                <select
                                  className="form-select form-select-sm"
                                  id="OffDay2"
                                  name="OffDay2"
                                  value={formik.values.OffDay2}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value="">--- Select ---</option>
                                  <option value="1">Monday</option>
                                  <option value="2">Tuesday</option>
                                  <option value="3">Wednesday</option>
                                  <option value="4">Thursday</option>
                                  <option value="5">Friday</option>
                                  <option value="6">Saturday</option>
                                  <option value="7">Sunday</option>
                                </select>
                                {formik.touched.OffDay2 &&
                                formik.errors.OffDay2 ? (
                                  <div className="text-danger">
                                    {formik.errors.OffDay2}
                                  </div>
                                ) : null}
                              </div>
                            </Col>

                            {/* NIC */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label htmlFor="NIC" className="form-label">
                                  NIC<span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control-sm"
                                  id="NIC"
                                  name="NIC"
                                  placeholder="xxxxx-xxxxxxx-x"
                                  {...formik.getFieldProps("NIC")}
                                />
                                {formik.touched.NIC && formik.errors.NIC ? (
                                  <div className="text-danger">
                                    {formik.errors.NIC}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            {/* NIC Expiry */}
                            <Col xxl={2} md={3}>
                              <div>
                                <Label
                                  htmlFor="NICExpairy"
                                  className="form-label"
                                >
                                  NIC Expairy
                                  <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="date"
                                  className="form-control-sm"
                                  id="NICExpairy"
                                  name="NICExpairy"
                                  {...formik.getFieldProps("NICExpairy")}
                                />
                                {formik.touched.NICExpairy &&
                                formik.errors.NICExpairy ? (
                                  <div className="text-danger">
                                    {formik.errors.NICExpairy}
                                  </div>
                                ) : null}
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

                      {/* Second Row */}
                      <Row
                        className="gy-4 mt-2 p-1"
                        style={{ border: "2px dotted lightgray" }}
                      >
                        {/* BasicSalary */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="BasicSalary" className="form-label">
                              Basic Salary<span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="BasicSalary"
                              name="BasicSalary"
                              placeholder="00 "
                              {...formik.getFieldProps("BasicSalary")}
                            />
                            {formik.touched.BasicSalary &&
                            formik.errors.BasicSalary ? (
                              <div className="text-danger">
                                {formik.errors.BasicSalary}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/* Income Tax */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="IncomeTax" className="form-label">
                              Income Tax<span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="IncomeTax"
                              name="IncomeTax"
                              placeholder="00"
                              {...formik.getFieldProps("IncomeTax")}
                            />
                            {formik.touched.IncomeTax &&
                            formik.errors.IncomeTax ? (
                              <div className="text-danger">
                                {formik.errors.IncomeTax}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/* Have OverTime */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="HaveOT">
                            Have Over Time
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="HaveOT"
                              name="HaveOT"
                              {...formik.getFieldProps("HaveOT")}
                              checked={formik.values.HaveOT}
                            />
                          </span>
                        </Col>

                        {/*   IsBank Grid */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsBank">
                            Bank
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
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
                              name="BankAccountNo"
                              placeholder="Bank Account"
                              {...formik.getFieldProps("BankAccountNo")}
                            />
                            {formik.touched.BankAccountNo &&
                            formik.errors.BankAccountNo ? (
                              <div className="text-danger">
                                {formik.errors.BankAccountNo}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* Company Bank */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="CompanyBankID"
                              className="form-label"
                            >
                              Company Bank
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="CompanyBankID"
                              value={formik.values.CompanyBankID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="-1">---Select---</option>
                              {console.log(salaryBank)}
                              {salaryBank?.length > 0 ? (
                                salaryBank.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No Bank available
                                </option>
                              )}
                            </select>
                            {formik.touched.CompanyBankID &&
                            formik.errors.CompanyBankID ? (
                              <div className="text-danger">
                                {formik.errors.CompanyBankID}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/* Shift */}
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="ShiftID" className="form-label">
                              Shift
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="ShiftID"
                              value={formik.values.ShiftID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="-1">---Select---</option>
                              {shift?.length > 0 ? (
                                shift.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="0" disabled>
                                  No Shift available
                                </option>
                              )}
                            </select>
                            {formik.touched.ShiftID && formik.errors.ShiftID ? (
                              <div className="text-danger">
                                {formik.errors.ShiftID}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/* IsActive */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="Isactive">
                            Active
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="Isactive"
                              name="Isactive"
                              {...formik.getFieldProps("Isactive")}
                              checked={formik.values.Isactive}
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
                              name="DOL"
                              {...formik.getFieldProps("DOL")}
                              // min={getMinDate()} // Prevent past dates
                              // value={selectedDate}
                            />
                            {formik.touched.DOL && formik.errors.DOL ? (
                              <div className="text-danger">
                                {formik.errors.DOL}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/* Left Remarks */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="LeftRemarks" className="form-label">
                              Left Remarks
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="LeftRemarks"
                              name="LeftRemarks"
                              placeholder="Left Remarks"
                              {...formik.getFieldProps("LeftRemarks")}
                            />
                          </div>
                        </Col>

                        {/* ProbitionStatus */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="ProbitionStatus"
                              className="form-label"
                            >
                              Probition
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="ProbitionStatus"
                              name="ProbitionStatus"
                              value={formik.values.ProbitionStatus}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">--- Select ---</option>
                              <option value="Completed">Completed</option>
                            </select>
                            {formik.touched.ProbitionStatus &&
                            formik.errors.ProbitionStatus ? (
                              <div className="text-danger">
                                {formik.errors.ProbitionStatus}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/* Probition Date */}
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
                              name="ProbitionDate"
                              {...formik.getFieldProps("ProbitionDate")}
                            />
                            {/* {formik.touched.ProbitionDate &&
                            formik.errors.ProbitionDate ? (
                              <div className="text-danger">
                                {formik.errors.ProbitionDate}
                              </div>
                            ) : null} */}
                          </div>
                        </Col>

                        {/* CellPhone */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="CellPhone" className="form-label">
                              Contact
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="CellPhone"
                              name="CellPhone"
                              placeholder="Contact"
                              {...formik.getFieldProps("CellPhone")}
                            />
                          </div>
                        </Col>

                        {/* IcePhone */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="IcePhone" className="form-label">
                              Emergency Contact
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="IcePhone"
                              name="IcePhone"
                              placeholder="In Case of Emergency"
                              {...formik.getFieldProps("IcePhone")}
                            />
                          </div>
                        </Col>

                        {/* Address */}
                        <Col xxl={4} md={4}>
                          <div>
                            <Label htmlFor="Address" className="form-label">
                              Present Address
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="Address"
                              name="Address"
                              placeholder="Address"
                              {...formik.getFieldProps("Address")}
                            />
                          </div>
                        </Col>

                        {/* Permanent Address */}
                        <Col xxl={4} md={4}>
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
                            <Label htmlFor="Bloodgroup" className="form-label">
                              Blood Group
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="Blood group"
                              name="Bloodgroup"
                              placeholder="Blood group"
                              {...formik.getFieldProps("Bloodgroup")}
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
                              value={formik.values.Gender} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
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
                            {formik.touched.Gender && formik.errors.Gender ? (
                              <div className="text-danger">
                                {formik.errors.Gender}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/* Religion */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="ReligionID" className="form-label">
                              Religion
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="ReligionID"
                              value={formik.values.ReligionID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
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
                                  No Religion available
                                </option>
                              )}
                            </select>
                            {formik.touched.ReligionID &&
                            formik.errors.ReligionID ? (
                              <div className="text-danger">
                                {formik.errors.ReligionID}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/*  Old Code */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="OldCode" className="form-label">
                              Old Code
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="OldCode"
                              placeholder="Old Code"
                              readOnly
                              disabled
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

                        {/* Grade*/}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="GradeID" className="form-label">
                              Grade
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="GradeID"
                              value={formik.values.GradeID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
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
                            {formik.touched.GradeID && formik.errors.GradeID ? (
                              <div className="text-danger">
                                {formik.errors.GradeID}
                              </div>
                            ) : null}
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
                              name="EOBINo"
                              {...formik.getFieldProps("EOBINo")}
                            />
                          </div>
                        </Col>

                        {/* SSNo*/}
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

                        {/* LifeInsuranceNo*/}
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
                              name="LifeInsuranceNo"
                              placeholder="Life Insurance No"
                              {...formik.getFieldProps("LifeInsuranceNo")}
                            />
                          </div>
                        </Col>

                        {/* IsGroupInsurance*/}
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="IsGroupInsurance"
                          >
                            Group Insurance
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsGroupInsurance"
                              name="IsGroupInsurance"
                              {...formik.getFieldProps("IsGroupInsurance")}
                              checked={formik.values.IsGroupInsurance}
                            />
                          </span>
                        </Col>

                        {/* MartialStatus  */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="MartialStatus"
                              className="form-label"
                            >
                              Martial Status
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="MartialStatus"
                              name="MartialStatus"
                              value={formik.values.MartialStatus} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1 ">--- Select ---</option>
                              <option value="Married">Married</option>
                              <option value="Single">Single</option>
                            </select>
                            {formik.touched.MartialStatus &&
                            formik.errors.MartialStatus ? (
                              <div className="text-danger">
                                {formik.errors.MartialStatus}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* Blan column for adjustment  */}
                        <Col xxl={2} md={2}></Col>
                        {/* IsPFundEntitled  */}
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="IsPFundEntitled"
                          >
                            P-Fund Entitled
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsPFundEntitled"
                              {...formik.getFieldProps("IsPFundEntitled")}
                              checked={formik.values.IsPFundEntitled}
                            />
                          </span>
                        </Col>

                        {/* PFundEntitledDate  */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="PFundEntitledDate"
                              className="form-label"
                            >
                              P-Fund Entitled Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PFundEntitledDate"
                              name="PFundEntitledDate"
                              {...formik.getFieldProps("PFundEntitledDate")}
                            />
                            {/* {formik.touched.PFundEntitledDate &&
                            formik.errors.PFundEntitledDate ? (
                              <div className="text-danger">
                                {formik.errors.PFundEntitledDate}
                              </div>
                            ) : null} */}
                          </div>
                        </Col>

                        {/* IsPFund */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsPFund">
                            P-Fund
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsPFund"
                              name="IsPFund"
                              {...formik.getFieldProps("IsPFund")}
                              checked={formik.values.IsPFund}
                            />
                          </span>
                        </Col>

                        {/* PF Amount */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="PFAmount" className="form-label">
                              PF Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="PFAmount"
                              name="PFAmount"
                              placeholder="00"
                              {...formik.getFieldProps("PFAmount")}
                            />
                          </div>
                        </Col>

                        {/* IsPessi */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsPessi">
                            Pessi
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsPessi"
                              name="IsPessi"
                              {...formik.getFieldProps("IsPessi")}
                              checked={formik.values.IsPessi}
                            />
                          </span>
                        </Col>

                        {/* Pessi Amount */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="PessiDate" className="form-label">
                              Pessi Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PessiDate"
                              name="PessiDate"
                              {...formik.getFieldProps("PessiDate")}
                            />
                            {/* {formik.touched.PessiDate &&
                            formik.errors.PessiDate ? (
                              <div className="text-danger">
                                {formik.errors.PessiDate}
                              </div>
                            ) : null} */}
                          </div>
                        </Col>

                        {/* Is Empt grid*/}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsExempt">
                            Exempt
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsExempt"
                              name="IsExempt"
                              {...formik.getFieldProps("IsExempt")}
                              checked={formik.values.IsExempt}
                            />
                          </span>
                        </Col>

                        {/* ExemptLate */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="ExemptLate">
                            Exempt
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="ExemptLate"
                              name="ExemptLate"
                              {...formik.getFieldProps("ExemptLate")}
                              checked={formik.values.ExemptLate}
                            />
                          </span>
                        </Col>

                        {/* ExemptMinuts */}
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
                              name="ExemptMinuts"
                              {...formik.getFieldProps("ExemptMinuts")}
                            />
                          </div>
                        </Col>

                        {/* IsShift Employee */}
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="IsShiftEmployee"
                          >
                            Shift Employee
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsShiftEmployee"
                              name="IsShiftEmployee"
                              {...formik.getFieldProps("IsShiftEmployee")}
                              checked={formik.values.IsShiftEmployee}
                            />
                          </span>
                        </Col>

                        {/* IsManager */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsManager">
                            Manager
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsManager"
                              {...formik.getFieldProps("IsManager")}
                              checked={formik.values.IsManager}
                            />
                          </span>
                        </Col>

                        {/* IsStopSalary */}
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="IsStopSalary"
                          >
                            Stop Salary
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsStopSalary"
                              {...formik.getFieldProps("IsStopSalary")}
                            />
                          </span>
                        </Col>

                        {/* IsTransport */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsTransport">
                            Transport
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsTransport"
                              {...formik.getFieldProps("IsTransport")}
                              checked={formik.values.IsTransport}
                            />
                          </span>
                        </Col>

                        {/* Transport Date */}
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
                              name="TransportDate"
                              {...formik.getFieldProps("TransportDate")}
                            />
                          </div>
                        </Col>

                        {/* Transport Route */}
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
                              name="TransportRoute"
                              placeholder="Transport Route"
                              {...formik.getFieldProps("TransportRoute")}
                            />
                          </div>
                        </Col>

                        {/* Transport Location */}
                        <Col xxl={4} md={4}>
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
                              name="TransportLocation"
                              {...formik.getFieldProps("TransportLocation")}
                            />
                          </div>
                        </Col>

                        {/* Bus Deduction */}
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="BusDeduction"
                          >
                            Bus Deduction
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="BusDeduction"
                              {...formik.getFieldProps("BusDeduction")}
                              checked={formik.values.BusDeduction}
                            />
                          </span>
                        </Col>
                      </Row>

                      {/* Third Row */}
                      <Row
                        className="gy-4 mt-2 p-1"
                        style={{ border: "2px dotted lightgray" }}
                      >
                        {/* Employee Name Urdu */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="ENameUrdu" className="form-label">
                              Employee Name Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="ENameUrdu"
                              name="ENameUrdu"
                              placeholder="Education Urdu"
                              {...formik.getFieldProps("ENameUrdu")}
                            />
                          </div>
                        </Col>

                        {/* Father Name Urdu */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="FNameUrdu" className="form-label">
                              Father Name Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="FNameUrdu"
                              name="FNameUrdu"
                              placeholder="Father Name Urdu"
                              {...formik.getFieldProps("FNameUrdu")}
                            />
                          </div>
                        </Col>

                        {/* AddressUrdu */}
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
                              name="AddressUrdu"
                              {...formik.getFieldProps("AddressUrdu")}
                            />
                          </div>
                        </Col>

                        {/* DesignationTitle */}
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
                              name="DesignationTitle"
                              placeholder="Designation Title"
                              {...formik.getFieldProps("DesignationTitle")}
                            />
                          </div>
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
                              name="MotherName"
                              placeholder="Mother Name"
                              {...formik.getFieldProps("MotherName")}
                            />
                          </div>
                        </Col>

                        {/* NextToKin */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="NextToKin" className="form-label">
                              NextTo Kin
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="NextToKin"
                              name="NextToKin"
                              placeholder="NextTo Kin"
                              {...formik.getFieldProps("NextToKin")}
                            />
                          </div>
                        </Col>
                      </Row>

                      {/* 4th Row */}
                      <Row
                        className="gy-4 mt-2 p-1"
                        style={{ border: "2px dotted lightgray" }}
                      >
                        {/* DOJAct */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DOJAct" className="form-label">
                              DOJ Act
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DOJAct"
                              name="DOJAct"
                              {...formik.getFieldProps("DOJAct")}
                            />
                          </div>
                        </Col>

                        {/* ActualSalary */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label
                              htmlFor="ActualSalary"
                              className="form-label"
                            >
                              Actual Salary
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="ActualSalary"
                              name="ActualSalary"
                              placeholder="Actual Salary"
                              {...formik.getFieldProps("ActualSalary")}
                            />
                            {formik.touched.ActualSalary &&
                            formik.errors.ActualSalary ? (
                              <div className="text-danger">
                                {formik.errors.ActualSalary}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/* OTRate */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="OTRate" className="form-label">
                              OT Rate
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="OTRate"
                              name="OTRate"
                              placeholder="OT Rate"
                              {...formik.getFieldProps("OTRate")}
                            />
                            {formik.touched.OTRate && formik.errors.OTRate ? (
                              <div className="text-danger">
                                {formik.errors.OTRate}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        {/* OTRateOFF */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="OTRateOFF" className="form-label">
                              OT Rate OFF
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="OTRateOFF"
                              name="OTRateOFF"
                              placeholder="OT Rate OFF"
                              {...formik.getFieldProps("OTRateOFF")}
                            />
                            {formik.touched.OTRateOFF &&
                            formik.errors.OTRateOFF ? (
                              <div className="text-danger">
                                {formik.errors.OTRateOFF}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* IsShowForAudit */}
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="IsShowForAudit"
                          >
                            Show For Audit
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsShowForAudit"
                              {...formik.getFieldProps("IsShowForAudit")}
                              checked={formik.values.IsShowForAudit}
                            />
                          </span>
                        </Col>

                        {/* BlackList */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="BlackList">
                            Black List
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="BlackList"
                              {...formik.getFieldProps("BlackList")}
                              checked={formik.values.BlackList}
                            />
                          </span>
                        </Col>

                        {/* HaveOTAct */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="HaveOTAct">
                            Have OT Act
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="HaveOTAct"
                              {...formik.getFieldProps("HaveOTAct")}
                              checked={formik.values.HaveOTAct}
                            />
                          </span>
                        </Col>

                        {/* HaveOTOFF */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="HaveOTOFF">
                            Have OT OFF
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="HaveOTOFF"
                              {...formik.getFieldProps("HaveOTOFF")}
                              checked={formik.values.HaveOTOFF}
                            />
                          </span>
                        </Col>

                        {/* IsactiveAct */}
                        <Col xxl={2} md={2}>
                          <Label className="form-check-label" for="IsactiveAct">
                            Active Act
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsactiveAct"
                              {...formik.getFieldProps("IsactiveAct")}
                              checked={formik.values.IsactiveAct}
                            />
                          </span>
                        </Col>

                        {/* DOLAct */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DOLAct" className="form-label">
                              DOL Act
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DOLAct"
                              name="DOLAct"
                              {...formik.getFieldProps("DOLAct")}
                            />
                          </div>
                        </Col>

                        {/* IsShiftEmployeeAct */}
                        <Col xxl={2} md={2}>
                          <Label
                            className="form-check-label"
                            for="IsShiftEmployeeAct"
                          >
                            Shift Employee Act
                          </Label>
                          <span className="form-control input-sm input-checkbox p-1 mt-2">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="IsShiftEmployeeAct"
                              {...formik.getFieldProps("IsShiftEmployeeAct")}
                              checked={formik.values.IsShiftEmployeeAct}
                            />
                          </span>
                        </Col>

                        {/* EOBINoAct */}
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="EOBINoAct" className="form-label">
                              EOBI No Act
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="EOBINoAct"
                              name="EOBINoAct"
                              placeholder="EOBINoAct"
                              {...formik.getFieldProps("EOBINoAct")}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Employee;
