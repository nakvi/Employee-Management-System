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
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getDepartment } from "../../../slices/setup/department/thunk";
import { getPaymentPlan, resetPaymentPlan } from "../../../slices/employee/paymentPlan/thunk";
import PreviewCardHeader2 from "../../../Components/Common/PreviewCardHeader2";

const PaymentPlan = () => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const { paymentPlan, loading, error,postLoading } = useSelector((state) => state.PaymentPlan || {});
  const { employeeType } = useSelector((state) => state.EmployeeType || {});
  const { department = {} } = useSelector((state) => state.Department || {});
  const departmentList = department.data || [];

  // Fetch employee types and departments on mount
  useEffect(() => {
    dispatch(getEmployeeType());
    dispatch(getDepartment());
  }, [dispatch]);

  // Update tableData when paymentPlan changes
  useEffect(() => {
    if (Array.isArray(paymentPlan)) {
      setTableData(
        paymentPlan.map((item) => ({
          ...item,
          DedAmount: item.DedAmount || 0, // Initialize DedAmount
          post: item.post || false, // Initialize post (finalized checkbox)
          dedAmountError: null, // Track validation errors
        }))
      );
    }
  }, [paymentPlan]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      ETypeID: "",
      DeptID: "",
      VDate: "",
      UID: "",
      CompanyID: "",
    },
    validationSchema: Yup.object({
      // ETypeID: Yup.string().required("Employee Type is required"),
      // DeptID: Yup.string().required("Department is required"),
      VDate: Yup.string().required("Month is required"),
    }),
    onSubmit: () => {
      handleFetch();
    },
  });

  // Construct employeeIdList string
  const buildEmployeeIdList = () => {
    const conditions = [];

    if (formik.values.ETypeID) {
      conditions.push(`E."ETypeID" = ${formik.values.ETypeID}`);
    }

    if (formik.values.DeptID) {
      conditions.push(`E."DeptID"  = ${formik.values.DeptID}`);
    }

    const EmployeeIDList = conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";
    console.log("Generated EmployeeIDList:", EmployeeIDList);
    return EmployeeIDList;
  };

  // Fetch data
  const handleFetch = () => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        const EmployeeIDList = buildEmployeeIdList();
        const formattedVDate = formik.values.VDate ? `${formik.values.VDate}-01` : "";
        const params = {
          Orgini: "LTT",
          VDate: formattedVDate || "",
          EmployeeIDList: EmployeeIDList || "",
          CompanyID: "1",
          LocationID: "0",
          ETypeID: formik.values.ETypeID || "0",
          EmpID: "0",
          IsAu: "0",
          UID: "0",
          IsExport: "0",
        };
        console.log("Fetching with params:", params);
        dispatch(getPaymentPlan(params));
      } else {
        formik.setTouched({
          EType : true,
          DeptID: true,
          VDate: true,
        });
        console.log("Form validation errors:", errors);
      }
    });
  };

  // Handle Ded Amount change
  const handleDedAmountChange = (index, value) => {
    const newTableData = [...tableData];
    const balance = parseFloat(newTableData[index].Balance) || 0;
    const dedAmount = parseFloat(value) || 0;

    // Validate DedAmount <= Balance
    if (dedAmount > balance) {
      newTableData[index] = {
        ...newTableData[index],
        DedAmount: value,
        dedAmountError: "Ded Amount cannot be greater than Balance",
        post: false,
      };
    } else {
      newTableData[index] = {
        ...newTableData[index],
        DedAmount: value,
        dedAmountError: null,
        post: dedAmount > 0,
      };
    }

    setTableData(newTableData);
  };

  // Handle Finalized checkbox change
  const handlePostChange = (index, checked) => {
    const newTableData = [...tableData];
    newTableData[index] = {
      ...newTableData[index],
      post: checked,
    };
    setTableData(newTableData);
  };
// Handle Cancel button click
  const handleCancel = () => {
    formik.resetForm({
      values: {
        ETypeID: "",
        DeptID: "",
        VDate: "",
        UID: "",
        CompanyID: "",
      },
    });
    dispatch(resetPaymentPlan());
    setTableData([]);
  };

  document.title = "Payment Plan | EMS";

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
                  <PreviewCardHeader2
                    title="Payment Plan"
                    onFetch={handleFetch}
                     onCancel={handleCancel}
                    disabled={loading || postLoading}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={3}>
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
                              <div className="text-danger">{formik.errors.ETypeID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="DeptID" className="form-label">
                              Department
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="DeptID"
                              id="DeptID"
                              value={formik.values.DeptID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              {departmentList.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.DeptID && formik.errors.DeptID ? (
                              <div className="text-danger">{formik.errors.DeptID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VDate" className="form-label">
                              Month
                            </Label>
                            <Input
                              type="month"
                              className="form-control-sm"
                              name="VDate"
                              id="VDate"
                              {...formik.getFieldProps("VDate")}
                            />
                            {formik.touched.VDate && formik.errors.VDate ? (
                              <div className="text-danger">{formik.errors.VDate}</div>
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
                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap table-sm"
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Employee</th>
                            <th>Loan Date</th>
                            <th>Loan Amount</th>
                            <th>Installment</th>
                            <th>Balance</th>
                            <th>Ded Amount</th>
                            <th>
                              {/* <Input className="form-check-input me-1" type="checkbox" /> */}
                              Finalized
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {Array.isArray(tableData) && tableData.length > 0 ? (
                            tableData.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.EName || "N/A"}</td>
                                <td>{item.LoanDate || "N/A"}</td>
                                <td>{item.LoanAmount || "N/A"}</td>
                                <td>{item.Installment || "N/A"}</td>
                                <td>{item.Balance || "N/A"}</td>
                                <td>
                                  <Input
                                    className="form-control-sm w-75"
                                    type="number"
                                    value={item.DedAmount || ""}
                                    onChange={(e) =>
                                      handleDedAmountChange(index, e.target.value)
                                    }
                                    placeholder="0"
                                  />
                                  {item.dedAmountError && (
                                    <div className="text-danger small">
                                      {item.dedAmountError}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={item.post || false}
                                    onChange={(e) =>
                                      handlePostChange(index, e.target.checked)
                                    }
                                  />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8">No data available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {(!Array.isArray(tableData) || tableData.length === 0) && !loading && (
                        <div className="noresult">
                          <div className="text-center">
                            <lord-icon
                              src="https://cdn.lordicon.com/msoeawqm.json"
                              trigger="loop"
                              colors="primary:#121331,secondary:#08a88a"
                              style={{ width: "75px", height: "75px" }}
                            ></lord-icon>
                            <h5 className="mt-2">Sorry! No Result Found</h5>
                          </div>
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

export default PaymentPlan;