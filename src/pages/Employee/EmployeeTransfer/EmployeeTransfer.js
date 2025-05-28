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
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"; // Import react-toastify for notifications
import DeleteModal from "../../../Components/Common/DeleteModal";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { format } from "date-fns";
import {
  getEmployeeLocationTransfer,
  submitEmployeeLocationTransfer,
  updateEmployeeLocationTransfer,
  deleteEmployeeLocationTransfer,
} from "../../../slices/employee/employeeTransfer/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import { getEmployeeType } from "../../../slices/employee/employeeType/thunk";
import { getEmployee } from "../../../slices/employee/employee/thunk";

const EmployeeTransfer = () => {
  const dispatch = useDispatch();
  const [editingGroup, setEditingGroup] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Redux state
  const { loading, error, employeeLocationTransfer } = useSelector(
    (state) => state.EmployeeLocationTransfer
  );
  const { location } = useSelector((state) => state.Location);
  const { employeeType } = useSelector((state) => state.EmployeeType);
  const { employee = [] } = useSelector((state) => state.Employee || {});

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getEmployeeLocationTransfer());
    dispatch(getLocation());
    dispatch(getEmployeeType());
    dispatch(getEmployee());
  }, [dispatch]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      VID: 0,
      VName: "",
      VNo: "0",
      VDate: new Date().toISOString().split("T")[0],
      EmpID: "",
      ETypeID: "",
      CurrentLocationID: 0,
      LocationID: 0,
      IsPosted: 1,
      PostedBy: 101,
      PostedDate: "2025-04-23T11:00:00Z",
      IsActive: true,
      UID: 202,
      CompanyID: 3001,
      Tranzdatetime: "2025-04-24T10:19:32.099586Z",
    },
    validationSchema: Yup.object({
      ETypeID: Yup.number()
        .min(1, "Employee Type is required")
        .required("Required"),
      EmpID: Yup.string().required("Employee is required"),
      LocationID: Yup.string()
        .notOneOf(["-1"], "Location is required")
        .required("Required"),
      VDate: Yup.date().required("Date is required"),
      VName: Yup.string().required("Remarks is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const transformedValues = {
          ...values,
          IsActive: values.IsActive ? 1 : 0,
        };
        if (editingGroup) {
          await dispatch(
            updateEmployeeLocationTransfer({
              ...transformedValues,
              VID: editingGroup.VID,
            })
          ).unwrap();
          setEditingGroup(null);
        } else {
          await dispatch(submitEmployeeLocationTransfer(transformedValues)).unwrap();        }
        resetForm({
          values: {
            ...formik.initialValues,
            VDate: new Date().toISOString().split("T")[0],
            ETypeID: employeeType[0]?.VID || "",
          },
        });
      } catch (err) {
        toast.error("Failed to submit employee transfer.");
      }
    },
  });

  // Set default ETypeID and reset EmpID when employeeType loads or ETypeID changes
  useEffect(() => {
    if (employeeType.length > 0 && !formik.values.ETypeID) {
      formik.setFieldValue("ETypeID", employeeType[0].VID);
    }
    formik.setFieldValue("EmpID", ""); // Reset EmpID when ETypeID changes
  }, [employeeType, formik.values.ETypeID]);

  // Set CurrentLocationID based on selected EmpID
  useEffect(() => {
    const selectedEmployee = employee.find(
      (emp) => emp.EmpID === parseInt(formik.values.EmpID)
    );
    if (selectedEmployee && selectedEmployee.LocationID) {
      formik.setFieldValue("CurrentLocationID", selectedEmployee.LocationID);
    } else {
      formik.setFieldValue("CurrentLocationID", 0);
    }
  }, [formik.values.EmpID, employee]);

  // Format date for display
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Handle edit click
  const handleEditClick = (group) => {
      // Find the employee record to get the ETypeID
  const selectedEmployee = employee.find(
    (emp) => String(emp.EmpID) === String(group.EmpID)
  );
  const employeeTypeId = selectedEmployee ? selectedEmployee.ETypeID : "";
    setEditingGroup(group);
    formik.setValues({
      VID: group.VID,
      VName: group.VName,
      VNo: group.VNo,
      VDate: group.VDate.split("T")[0], // Adjust date format for input
      EmpID: group.EmpID,
      ETypeID: employeeTypeId, 
      CurrentLocationID: group.CurrentLocationID,
      LocationID: group.LocationID,
      IsPosted: group.IsPosted,
      PostedBy: group.PostedBy,
      PostedDate: group.PostedDate,
      IsActive: group.IsActive === 1,
      UID: 202,
      CompanyID: 3001,
      Tranzdatetime: "2025-04-24T10:19:32.099586Z",
    });
  };

  // Handle delete click
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteEmployeeLocationTransfer(deleteId)).unwrap();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
    }
  };

  document.title = "Employee Location Transfer | EMS";

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
                    title="Employee Location Transfer"
                    onCancel={() =>
                      formik.resetForm({
                        values: {
                          ...formik.initialValues,
                          VDate: new Date().toISOString().split("T")[0],
                          ETypeID: employeeType[0]?.VID || "",
                        },
                      })
                    }
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
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="CurrentLocationID" className="form-label">
                              Old Location
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="CurrentLocationID"
                              readOnly
                              disabled
                              value={
                                location.find(
                                  (loc) => loc.VID === formik.values.CurrentLocationID
                                )?.VName || ""
                              }
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="LocationID" className="form-label">
                              New Location
                            </Label>
                            <select
                              name="LocationID"
                              id="LocationID"
                              className="form-select form-select-sm"
                              value={formik.values.LocationID}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
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
                            {formik.touched.LocationID && formik.errors.LocationID ? (
                              <div className="text-danger">
                                {formik.errors.LocationID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div className="mb-3">
                            <Label htmlFor="VDate" className="form-label">
                              Effective Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VDate"
                              name="VDate"
                              min={getMinDate()}
                              value={formik.values.VDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.VDate && formik.errors.VDate ? (
                              <div className="text-danger">
                                {formik.errors.VDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={4}>
                          <div className="mb-3">
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
                  <div className="table-responsive table-card mt-3 mb-1">
                    <table className="table align-middle table-nowrap table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Employee</th>
                          <th>Old Location</th>
                          <th>New Location</th>
                          <th>Effective Date</th>
                          <th>Remarks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="list form-check-all">
                        {console.log("d",employeeLocationTransfer)}
                        {employeeLocationTransfer?.length > 0 ? (
                          employeeLocationTransfer.map((group) => (
                            
                            <tr key={group.VID}>
                              <td>
                                  {employee.find((emp) => String(emp.EmpID) === String(group.EmpID))?.EName|| "N/A"}
                                </td>
                              <td>
                                {location?.find(
                                  (loc) => loc.VID === group.CurrentLocationID
                                )?.VName || ""}
                              </td>
                              <td>
                                {location?.find(
                                  (loc) => loc.VID === group.LocationID
                                )?.VName || ""}
                              </td>
                              <td>{formatDate(group.VDate)}</td>
                              <td>{group.VName}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    className="btn btn-soft-info"
                                    onClick={() => handleEditClick(group)}
                                  >
                                    <i className="bx bx-edit"></i>
                                  </Button>
                                  <Button
                                    className="btn btn-soft-danger"
                                    onClick={() => handleDeleteClick(group.VID)}
                                  >
                                    <i className="ri-delete-bin-2-line"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No Employee Location Transfer found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <DeleteModal
            show={showDeleteModal}
            onDeleteClick={handleDeleteConfirm}
            onCloseClick={() => setShowDeleteModal(false)}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EmployeeTransfer;