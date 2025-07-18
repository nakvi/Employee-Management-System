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
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import DeleteModal from "../../../Components/Common/DeleteModal";
// import {
//   getEmployeeType,
//   getEmployee,
//   getSalaryBank,
//   deleteSalaryAllowanceDeduction,
//   getSalaryAllowanceDeduction,
//   submitSalaryAllowanceDeduction,
//   updateSalaryAllowanceDeduction,
//   getAllowanceDeductionDetails,
//   getAllowanceDeductionGroup,
// } from "../../../slices";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";
import { getSalaryBank } from "../../../slices/setup/salaryBank/thunk";
import { deleteSalaryAllowanceDeduction, getSalaryAllowanceDeduction, submitSalaryAllowanceDeduction, updateSalaryAllowanceDeduction } from "../../../slices/employee/salaryAllowanceDeduction/thunk";
import { getAllowanceDeductionDetails } from "../../../slices/employee/allowanceDeductionDetails/thunk";
import { getAllowanceDeductionGroup } from "../../../slices/setup/allowanceDeductionGroup/thunk"
import config from "../../../config";

const SalaryAllowanceDeduction = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [tableAllowanceDetails, setTableAllowanceDetails] = useState({});
  const [dropdownAllowanceDetails, setDropdownAllowanceDetails] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const { loading, error, salaryAllowanceDeduction } = useSelector(
    (state) => state.SalaryAllowanceDeduction
  );
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = [] } = useSelector((state) => state.Employee || {});
  const { salaryBank } = useSelector((state) => state.SalaryBank);
  const { allowanceDeductionGroup } = useSelector(
    (state) => state.AllowanceDeductionGroup
  );

  useEffect(() => {
    dispatch(getSalaryBank());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
    dispatch(getSalaryAllowanceDeduction());
    dispatch(getAllowanceDeductionGroup());
  }, [dispatch]);

  // Fetch allowance details for each salaryAllowanceDeduction row
  useEffect(() => {
    const fetchDetailsForTable = async () => {
      const detailsMap = {};
      for (const group of salaryAllowanceDeduction) {
        if (group.AllowDedID && !detailsMap[group.AllowDedID]) {
          try {
            const response = await fetch(
              `${config.api.API_URL}getTypeByAllowDedId/?allowDedID=${group.AllowDedID}`
            );
            const data = await response.json();
            if (data && data.length > 0) {
              const { VType, EffectID } = data[0];
              const detailsResponse = await dispatch(
                getAllowanceDeductionDetails({
                  VType,
                  GroupID: EffectID.toString(),
                })
              ).unwrap();
              detailsMap[group.AllowDedID] =
                detailsResponse.find((item) => item.VID === group.AllowDedID) ||
                {};
            }
          } catch (error) {
            console.error(
              `Error fetching details for AllowDedID ${group.AllowDedID}:`,
              error
            );
          }
        }
      }
      setTableAllowanceDetails(detailsMap);
    };

    if (salaryAllowanceDeduction?.length > 0) {
      fetchDetailsForTable();
    }
  }, [salaryAllowanceDeduction, dispatch]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      VName: "",
      VDate: "",
      EmpID: "",
      ETypeID: "",
      VType: "",
      GroupID: "",
      AllowDedID: "",
      Amount: 0,
      AccountID: "",
      ChequeNo: "",
      ChequeDate: "",
      IsActive: true,
      UID: 501,
      CompanyID: "1001",
      Tranzdatetime: "2024-02-02T12:30:00Z",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number().min(1, "Employee Type is required").required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      VType: Yup.string().required("Type is required"),
      GroupID: Yup.string().required("Effect is required"),
      AllowDedID: Yup.string().required("Details is required"),
      Amount: Yup.number().required("Amount is required"),
      AccountID: Yup.number().min(1, "Bank Type is required").required("Required"),
      VDate: Yup.date().required("Date is required"),
      ChequeNo: Yup.string().required("Cheque No is required"),
      ChequeDate: Yup.date().required("Cheque Date is required"),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0,
      };
      if (editingGroup) {
        dispatch(
          updateSalaryAllowanceDeduction({ ...transformedValues, VID: editingGroup.VID })
        ).then(() => {
          dispatch(getSalaryAllowanceDeduction());
          setEditingGroup(null);
          resetForm();
        });
      } else {
        dispatch(submitSalaryAllowanceDeduction(transformedValues)).then(() => {
          dispatch(getSalaryAllowanceDeduction());
          resetForm();
        });
      }
    },
  });

  // Fetch allowanceDeductionDetails for dropdown when VType or GroupID changes
  useEffect(() => {
    if (formik.values.VType && formik.values.GroupID && !editingGroup) {
      dispatch(
        getAllowanceDeductionDetails({
          VType: formik.values.VType,
          GroupID: formik.values.GroupID,
        })
      ).then((response) => {
        setDropdownAllowanceDetails(response.payload || []);
      });
      formik.setFieldValue("AllowDedID", "");
    }
  }, [formik.values.VType, formik.values.GroupID, dispatch, editingGroup]);

  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  const formatDateForInput = (dateString) => {
    return dateString ? dateString.split("T")[0] : "";
  };

  const fetchTypeAndEffectDetails = async (allowDedID) => {
    try {
      const response = await fetch(
        `${config.api.API_URL}getTypeByAllowDedId/?allowDedID=${allowDedID}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          VType: data[0].VType,
          GroupID: data[0].EffectID.toString(),
        };
      }
      return { VType: "", GroupID: "" };
    } catch (error) {
      console.error("Error fetching type and effect details:", error);
      return { VType: "", GroupID: "" };
    }
  };

  // Handle edit button click
  const handleEditClick = async (group) => {
    const selectedEmployee = employee.find(
      (emp) => String(emp.EmpID) === String(group.EmpID)
    );
    const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";
    const { VType, GroupID } = await fetchTypeAndEffectDetails(group.AllowDedID);

    // Fetch allowanceDeductionDetails for dropdown
    if (VType && GroupID) {
      const response = await dispatch(
        getAllowanceDeductionDetails({
          VType,
          GroupID,
        })
      ).unwrap();
      setDropdownAllowanceDetails(response || []);
    }

    setEditingGroup(group);
    formik.setValues({
      VName: group.VName || "",
      VDate: group.VDate || "",
      EmpID: group.EmpID || "",
      ETypeID: employeeTypeId,
      VType: VType || group.VType || "",
      GroupID: GroupID || group.GroupID || "",
      AllowDedID: group.AllowDedID || "",
      Amount: group.Amount || 0,
      AccountID: group.AccountID || "",
      ChequeNo: group.ChequeNo || "",
      ChequeDate: formatDateForInput(group.ChequeDate),
      IsActive: group.IsActive === 1,
      UID: group.UID || 501,
      CompanyID: group.CompanyID || "1001",
      Tranzdatetime: group.Tranzdatetime || new Date().toISOString(),
    });
  };

  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteSalaryAllowanceDeduction(deleteId)).then(() => {
        dispatch(getSalaryAllowanceDeduction());
      });
    }
    setDeleteModal(false);
  };

  document.title = "Salary Allowance Deduction | EMS";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading && <p>Loading...</p>}
          <Row>
            <Col lg={12}>
              <Card>
                <Form onSubmit={formik.handleSubmit}>
                  <PreviewCardHeader
                    title="Salary Allowance Deduction"
                    onCancel={() => {
                      formik.resetForm();
                      setDropdownAllowanceDetails([]);
                    }}
                    isEditMode={!!editingGroup}
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
                              <div className="text-danger">{formik.errors.ETypeID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
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
                            >
                              <option value="">---Select---</option>
                              {employee
                                .filter(
                                  (emp) => emp.ETypeID === parseInt(formik.values.ETypeID)
                                )
                                .map((item) => (
                                  <option key={item.EmpID} value={item.EmpID}>
                                    {item.EName}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.EmpID && formik.errors.EmpID ? (
                              <div className="text-danger">{formik.errors.EmpID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="VType" className="form-label">
                              Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="VType"
                              id="VType"
                              value={formik.values.VType}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="">---Select---</option>
                              <option value="Allowance">Allowance</option>
                              <option value="Deduction">Deduction</option>
                            </select>
                            {formik.touched.VType && formik.errors.VType ? (
                              <div className="text-danger">{formik.errors.VType}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="GroupID" className="form-label">
                              Effect
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="GroupID"
                              id="GroupID"
                              value={formik.values.GroupID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              disabled={!formik.values.VType}
                            >
                              <option value="">---Select---</option>
                              {allowanceDeductionGroup.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.GroupID && formik.errors.GroupID ? (
                              <div className="text-danger">{formik.errors.GroupID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="AllowDedID" className="form-label">
                              Details
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="AllowDedID"
                              id="AllowDedID"
                              value={formik.values.AllowDedID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              disabled={!formik.values.GroupID}
                            >
                              <option value="">---Select---</option>
                              {dropdownAllowanceDetails.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.AllowDedID && formik.errors.AllowDedID ? (
                              <div className="text-danger">{formik.errors.AllowDedID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="Amount" className="form-label">
                              Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="Amount"
                              name="Amount"
                              placeholder="00"
                              {...formik.getFieldProps("Amount")}
                            />
                            {formik.touched.Amount && formik.errors.Amount ? (
                              <div className="text-danger">{formik.errors.Amount}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VDate" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VDate"
                              name="VDate"
                              min={getMinDate()}
                              {...formik.getFieldProps("VDate")}
                            />
                            {formik.touched.VDate && formik.errors.VDate ? (
                              <div className="text-danger">{formik.errors.VDate}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="AccountID" className="form-label">
                              Bank
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              name="AccountID"
                              id="AccountID"
                              {...formik.getFieldProps("AccountID")}
                            >
                              <option value="">---Select---</option>
                              {salaryBank.map((item) => (
                                <option key={item.VID} value={item.VID}>
                                  {item.VName}
                                </option>
                              ))}
                            </select>
                            {formik.touched.AccountID && formik.errors.AccountID ? (
                              <div className="text-danger">{formik.errors.AccountID}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
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
                            {formik.touched.ChequeNo && formik.errors.ChequeNo ? (
                              <div className="text-danger">{formik.errors.ChequeNo}</div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="ChequeDate" className="form-label">
                              Cheque
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="ChequeDate"
                              name="ChequeDate"
                              {...formik.getFieldProps("ChequeDate")}
                            />
                            {formik.touched.ChequeDate && formik.errors.ChequeDate ? (
                              <div className="text-danger">{formik.errors.ChequeDate}</div>
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
                            <th>Details</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Bank</th>
                            <th>Cheque No</th>
                            <th>Cheque Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {salaryAllowanceDeduction?.length > 0 ? (
                            salaryAllowanceDeduction.map((group) => (
                              <tr key={group.VID}>
                                <td>
                                  {employee.find(
                                    (emp) => String(emp.EmpID) === String(group.EmpID)
                                  )?.EName || "N/A"}
                                </td>
                                <td>
                                  {tableAllowanceDetails[group.AllowDedID]?.VName || "N/A"}
                                </td>
                                <td>{group.Amount || "N/A"}</td>
                                <td>{formatDate(group.VDate)}</td>
                                <td>
                                  {salaryBank.find(
                                    (bank) => bank.VID === group.AccountID
                                  )?.VName || "N/A"}
                                </td>
                                <td>{group.ChequeNo || "N/A"}</td>
                                <td>{formatDate(group.ChequeDate)}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <div className="edit">
                                      <Button
                                        className="btn btn-soft-info"
                                        onClick={() => handleEditClick(group)}
                                      >
                                        <i className="bx bx-edit"></i>
                                      </Button>
                                    </div>
                                    <div className="delete">
                                      <Button
                                        className="btn btn-soft-danger"
                                        onClick={() => handleDeleteClick(group.VID)}
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
                              <td colSpan="8" className="text-center">
                                No Salary Allowance Deduction found.
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
        onCloseClick={() => setDeleteModal(false)}
        onDeleteClick={handleDeleteConfirm}
      />
    </React.Fragment>
  );
};

export default SalaryAllowanceDeduction;