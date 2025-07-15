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
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import DeleteModal from "../../../Components/Common/DeleteModal";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { FiRefreshCw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getSalaryBank } from "../../../slices/setup/salaryBank/thunk";
import {
  getGratuity,
  submitGratuity,
  updateGratuity,
  deleteGratuity,
} from "../../../slices/employee/gratuity/thunk";
import config from "../../../config";
import axios from "axios"; // Import axios for API calls
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Gratuity = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  // redux
  const { gratuity, loading, error } = useSelector((state) => state.Gratuity);
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = {} } = useSelector((state) => state.Employee || {});
  const { salaryBank } = useSelector((state) => state.SalaryBank);

  useEffect(() => {
    dispatch(getSalaryBank());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getGratuity());
  }, [dispatch]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      EmpID: "",
      ETypeID: "",
      VDate: "",
      DemandTill: "",
      PaidTill: "",
      PaidOld: "",
      PaidOn:"",
      DueAmount: "",
      DemandDate:"",
      PaidAmount: "",
      BasicSalary:"",
      NewAmount: "5000",
      CompanyBankID: "",
      ChequeNo: "",
      ChequeDate: "",
      VName: "",
      SalaryYear: "",
      UID: 10,
      CompanyID: "1001",
      Tranzdatetime: new Date().toISOString(),
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      VName: Yup.string().required("Remarks is required"),
      VDate: Yup.date().required("Date is required"),
      DemandTill: Yup.date().required("Demand Till is required"),
      PaidTill: Yup.date().required("Paid Till is required"),
      PaidOld: Yup.date().required("Previous Date is required"),
      PaidOn: Yup.date().required("Paid Date is required"),
      DemandDate: Yup.date().required("Date is required"),
      DueAmount: Yup.number().required("Due Amount is required"),
      BasicSalary: Yup.number().required("Current Salary is required"),
      PaidAmount: Yup.number().required("Paid Amount is required"),
      CompanyBankID: Yup.number()
        .min(1, "Bank is required")
        .required("Required"),
      ChequeNo: Yup.string().required("Cheque No is required"),
      ChequeDate: Yup.date().required("Cheque Date is required"),
    }),
    onSubmit: async (values) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0,
      };

      try {
        let result;
        result = await dispatch(submitGratuity(transformedValues));
        // Check if the asyncThunk was fulfilled
        if (
          submitGratuity.fulfilled.match(result) ||
          updateGratuity.fulfilled.match(result)
        ) {
          formik.resetForm();
        }
      } catch (error) {
        console.error("Submission failed:", error);
        // Errors already shown via toast, nothing else needed
      }
    },
  });

  // Function to fetch gratuity details
  const fetchGratuityDetails = async (empId, vDate) => {
    try {
      const response = await axios.get(
        `${config.api.API_URL}getEmployeeGratuityDetail`,
        {
          params: {
            Orgini: "LTT",
            EmpID: empId,
            VDate: vDate || selectedDate,
            UID: 1,
            IsAu: 0,
            IgnoreOld: 0,
            BasicSalary: 0,
          },
        }
      );
      const data = response[0];
      if (data) {
        formik.setFieldValue("DueAmount", data.GratuityAmount);
        formik.setFieldValue("PaidAmount", data.GratuityAmount);
        formik.setFieldValue("PaidOld", data.LastGDate);
        formik.setFieldValue("SalaryYear", data.SalaryYear);
        formik.setFieldValue("BasicSalary", data.CurrentSalary);
        formik.setFieldValue("CompanyBankID", data.CompanyBankID);
      }
    } catch (error) {
      console.error("Error fetching gratuity details:", error);
    }
  };
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    formik.setFieldValue("DemandTill", today); // Set default DemandTill
  }, []);
  // Handle Employee change
  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    formik.handleChange(e);
    // Check if required fields are empty
    if (!empId || !formik.values.DemandTill) {
      toast.error("Please select both Employee and Demand Till date.");
      return; // stop further execution
    }
    fetchGratuityDetails(empId, formik.values.DemandTill);
  };
  // Add this function to handle the refresh button click
  const handleRefreshClick = () => {
    const { EmpID, DemandTill } = formik.values;

    // Check if required fields are filled
    if (!EmpID || !DemandTill) {
      toast.error("Please select both Employee and Demand Till date.");
      return;
    }

    // Fetch gratuity details
    fetchGratuityDetails(EmpID, DemandTill);
  };
  // Handle DemandTill change
  const handleDemandTillChange = (e) => {
    const vDate = e.target.value;
    formik.handleChange(e);
    setSelectedDate(vDate);
       // Check if required fields are filled
    if (!formik.values.EmpID || !vDate) {
      toast.error("Please select both Employee and Demand Till date.");
      return;
    }
    // if (formik.values.EmpID && vDate) {
      fetchGratuityDetails(formik.values.EmpID, vDate);
    // }
  };
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };
  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteGratuity(deleteId));
    }
    setDeleteModal(false);
  };
  document.title = "Gratuity | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader
                    title="Gratuity"
                    onCancel={formik.resetForm}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="ETypeID" className="form-label">
                              E-Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="ETypeID"
                              id="ETypeID"
                              value={formik.values.ETypeID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {employeeType.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.ETypeID && formik.errors.ETypeID ? (
                              <div className="text-danger">
                                {formik.errors.ETypeID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="EmpID" className="form-label">
                              Employee
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="EmpID"
                              id="EmpID"
                              value={formik.values.EmpID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              disabled={!formik.values.ETypeID}
                            >
                              <option value="">---Select---</option>
                              {employee
                                .filter(
                                  (emp) =>
                                    emp.ETypeID ===
                                    parseInt(formik.values.ETypeID)
                                )
                                .map((item) => (
                                  <option key={item.EmpID} value={item.EmpID}>
                                    {item.EName}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.EmpID && formik.errors.EmpID ? (
                              <div className="text-danger">
                                {formik.errors.EmpID}
                              </div>
                            ) : null}
                          </div>
                        </Col> */}
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="EmpID" className="form-label">
                              Employee
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="EmpID"
                              id="EmpID"
                              value={formik.values.EmpID}
                              onChange={handleEmployeeChange}
                              onBlur={formik.handleBlur}
                              disabled={!formik.values.ETypeID}
                            >
                              <option value="">---Select---</option>
                              {employee
                                .filter(
                                  (emp) =>
                                    emp.ETypeID ===
                                    parseInt(formik.values.ETypeID)
                                )
                                .map((item) => (
                                  <option key={item.EmpID} value={item.EmpID}>
                                    {item.EName}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.EmpID && formik.errors.EmpID ? (
                              <div className="text-danger">
                                {formik.errors.EmpID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="VDate" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id=""
                              name="VDate"
                              value={formik.values.VDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.VDate &&
                            formik.errors.VDate ? (
                              <div className="text-danger">
                                {formik.errors.VDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="DemandDate" className="form-label">
                              Demand Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DemandDate"
                              name="DemandDate"
                              value={formik.values.DemandDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.DemandDate && formik.errors.DemandDate ? (
                              <div className="text-danger">
                                {formik.errors.DemandDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="DemandTill" className="form-label">
                              Demand Till
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DemandTill"
                              name="DemandTill"
                              // value={formik.values.DemandTill}
                              // onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={selectedDate}
                              onChange={handleDemandTillChange}
                              // {...formik.getFieldProps("DemandTill")}
                            />
                            {formik.touched.DemandTill &&
                            formik.errors.DemandTill ? (
                              <div className="text-danger">
                                {formik.errors.DemandTill}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="PaidTill" className="form-label">
                              Paid Till
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PaidTill"
                              name="PaidTill"
                              value={formik.values.PaidTill}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.PaidTill &&
                            formik.errors.PaidTill ? (
                              <div className="text-danger">
                                {formik.errors.PaidTill}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="PaidOn" className="form-label">
                              Paid On
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PaidOn"
                              name="PaidOn"
                              value={formik.values.PaidOn}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.PaidOn &&
                            formik.errors.PaidOn ? (
                              <div className="text-danger">
                                {formik.errors.PaidOn}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="BasicSalary" className="form-label">
                              Current Salary
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="BasicSalary"
                              name="BasicSalary"
                              placeholder="Current Salary"
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
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="PaidOld" className="form-label">
                              Previous
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="PaidOld"
                              name="PaidOld"
                              value={formik.values.PaidOld}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.PaidOld && formik.errors.PaidOld ? (
                              <div className="text-danger">
                                {formik.errors.PaidOld}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div>
                            <Label htmlFor="SalaryYear" className="form-label">
                              Salary / Year
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="SalaryYear"
                              name="SalaryYear"
                              placeholder=""
                              readOnly
                              disabled
                              {...formik.getFieldProps("SalaryYear")}
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Button
                              className="btn btn-soft-success mt-4 px-4 py-1"
                              title="Refresh"
                              data-bs-toggle="tooltip"
                              onClick={handleRefreshClick}
                            >
                              <FiRefreshCw strokeWidth={4} />
                            </Button>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="DueAmount" className="form-label">
                              Due Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="DueAmount"
                              name="DueAmount"
                              placeholder="Due Amount"
                              readOnly
                              disabled
                              {...formik.getFieldProps("DueAmount")}
                            />
                            {formik.touched.DueAmount &&
                            formik.errors.DueAmount ? (
                              <div className="text-danger">
                                {formik.errors.DueAmount}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="PaidAmount" className="form-label">
                              Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="PaidAmount"
                              placeholder="Amount"
                              {...formik.getFieldProps("PaidAmount")}
                            />
                            {formik.touched.PaidAmount &&
                            formik.errors.PaidAmount ? (
                              <div className="text-danger">
                                {formik.errors.PaidAmount}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div className="mb-3">
                            <Label
                              htmlFor="CompanyBankID"
                              className="form-label"
                            >
                              Bank
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="CompanyBankID"
                              id="CompanyBankID"
                              value={formik.values.CompanyBankID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {salaryBank.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.CompanyBankID &&
                            formik.errors.CompanyBankID ? (
                              <div className="text-danger">
                                {formik.errors.CompanyBankID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="ChequeNo" className="form-label">
                              Cheque No
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="ChequeNo"
                              name="ChequeNo"
                              placeholder="Cheque No"
                              {...formik.getFieldProps("ChequeNo")}
                            />
                            {formik.touched.ChequeNo &&
                            formik.errors.ChequeNo ? (
                              <div className="text-danger">
                                {formik.errors.ChequeNo}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="ChequeDate" className="form-label">
                              Cheque Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="ChequeDate"
                              name="ChequeDate"
                              {...formik.getFieldProps("ChequeDate")}
                            />
                            {formik.touched.ChequeDate &&
                            formik.errors.ChequeDate ? (
                              <div className="text-danger">
                                {formik.errors.ChequeDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Remarks
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Remarks"
                              {...formik.getFieldProps("VName")}
                            />
                            {formik.touched.VName && formik.errors.VName ? (
                              <div className="text-danger">
                                {formik.errors.VName}
                              </div>
                            ) : null}
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
                            <th>Demand Date </th>
                            <th>Demand Till</th>
                            <th>Paid Till</th>
                            <th>Paid On</th>
                            <th>C Salaray</th>
                            <th>Previous</th>
                            <th>Due Amount</th>
                            <th>Amount</th>
                            <th>Bank</th>
                            <th>Cheque No</th>
                            <th>Cheque Date</th>
                            <th>Remarks</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {gratuity?.length > 0 ? (
                            gratuity.map((group) => (
                              <tr key={group.VID}>
                                <td>
                                  {employee.find(
                                    (emp) =>
                                      String(emp.EmpID) === String(group.EmpID)
                                  )?.EName || "N/A"}
                                </td>
                                <td>{formatDate(group.DemandDate)}</td>
                                <td>{formatDate(group.DemandTill)}</td>
                                <td>{formatDate(group.PaidTill)}</td>
                                <td>{formatDate(group.PaidOn)}</td>
                                 <td>{group.BasicSalary}</td>
                                <td>{formatDate(group.PaidOld)}</td>
                                <td>{group.DueAmount}</td>
                                <td>{group.PaidAmount}</td>
                                <td>
                                  {salaryBank.find(
                                    (bank) => bank.VID === group.CompanyBankID
                                  )?.VName || "N/A"}
                                </td>
                                <td>{group.ChequeNo}</td>
                                <td>{formatDate(group.ChequeDate)}</td>
                                <td>{group.VName}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <div className="delete">
                                      <Button
                                        className="btn btn-soft-danger"
                                        onClick={() =>
                                          handleDeleteClick(group.VID)
                                        }
                                      >
                                        <i className="ri-delete-bin-2-line"></i>
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="20" className="text-center">
                                No Gratuity found.
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
      <DeleteModal
        show={deleteModal}
        onCloseClick={() => setDeleteModal(!deleteModal)}
        onDeleteClick={handleDeleteConfirm}
      />
    </React.Fragment>
  );
};

export default Gratuity;
