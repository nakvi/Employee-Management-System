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
import {
  getSalaryIncrement,
  submitSalaryIncrement,
  updateSalaryIncrement,
  deleteSalaryIncrement,
} from "../../../slices/thunks";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import DeleteModal from "../../../Components/Common/DeleteModal";

const Increment = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  
  // get salary increament
  const { loading, error, salaryIncrement } = useSelector(
    (state) => state.SalaryIncrement
  );
  useEffect(() => {
    dispatch(getSalaryIncrement());
  }, [dispatch]);
  // Formik form setup
  const formik = useFormik({
    initialValues: {
      VName: "",
      DateFrom: "",
      DateTo: "",
      CurrentSalary:"",
      IncrementAmount:"",
      IncrementSpecial:"",
      IncrementPromotional:"",
      FirstAmount:"",
      CompanyID: "1",
      UID: "1",
      IsActive: false,
    },
    validationSchema: Yup.object({
      // VName: Yup.string()
      //   .required("Title is required.")
      //   .min(3, "Title at least must be 3 characters "),
      // DateFrom: Yup.date()
      //   .required("Start date is required.")
      //   .max(
      //     Yup.ref("DateTo"),
      //     "Start date must be earlier than or the same as the end date"
      //   ),
      // DateTo: Yup.date()
      //   .required("End date is required.")
      //   .min(
      //     Yup.ref("DateFrom"),
      //     "End date must be later than or the same as the start date"
      //   ),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      // Add your form submission logic here
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
      };
      if (editingGroup) {
        console.log("Editing Group", transformedValues);
        dispatch(
          updateSalaryIncrement({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null); // Reset after submission
      } else {
        dispatch(submitSalaryIncrement(transformedValues));
      }
      formik.resetForm();
    },
  });
  const handleEditClick = (group) => {
    setEditingGroup(group);
    const formatDateForInput = (dateString) => {
      return dateString ? dateString.split("T")[0] : ""; // Extract YYYY-MM-DD part
    }; 
    formik.setValues({
      DateFrom: formatDateForInput(group.DateFrom),
      DateTo: formatDateForInput(group.DateTo),
      VName: group.VName,
      UID: group.UID,
      CompanyID: group.CompanyID,
      IsActive: group.IsActive === 1,
    });
  };
  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteSalaryIncrement(deleteId));
    }
    setDeleteModal(false);
  };
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  document.title = "Increment | EMS";
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
                    title="Increment"
                    // onCancel={formik.resetForm}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        {/* E-Type */}
                        <Col xxl={2} md={2}>
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
                              <option value="contractual">Contractual</option>
                            </select>
                          </div>
                        </Col>

                        <Col xxl={2} md={4}>
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
                              <option value="Choices1">Amir</option>
                              <option value="Choices2">Usama</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VDate" className="form-label">
                              Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="VDate"
                              {...formik.getFieldProps("VDate")}

                              min={getMinDate()} // Prevent past dates
                              value={selectedDate}
                            />
                               {formik.touched.VDate && formik.errors.VDate ? (
                              <div className="text-danger">
                                {formik.errors.VDate}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="DateFrom" className="form-label">
                              Effective Date
                            </Label>
                            <Input
                              type="date"
                              className="form-control-sm"
                              id="DateFrom"
                              min={getMinDate()} // Prevent past dates
                              value={selectedDate}
                              {...formik.getFieldProps("DateFrom")}

                            />
                               {formik.touched.DateFrom && formik.errors.DateFrom ? (
                              <div className="text-danger">
                                {formik.errors.DateFrom}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="VName" className="form-label">
                              Current Salary
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="VName"
                              placeholder="5000"
                              readOnly
                              disabled
                            />
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="IncrementAmount" className="form-label">
                              Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="IncrementAmount"
                              placeholder="00"
                              {...formik.getFieldProps("IncrementAmount")}

                            />
                               {formik.touched.IncrementAmount && formik.errors.IncrementAmount ? (
                              <div className="text-danger">
                                {formik.errors.IncrementAmount}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="IncrementSpecial" className="form-label">
                              Special
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="IncrementSpecial"
                              placeholder="00"
                              {...formik.getFieldProps("IncrementSpecial")}
                            />
                               {formik.touched.IncrementSpecial && formik.errors.IncrementSpecial ? (
                              <div className="text-danger">
                                {formik.errors.IncrementSpecial}
                              </div>
                            ) : null}
                          </div>
                          
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="IncrementPromotional" className="form-label">
                              Promotional
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="IncrementPromotional"
                              placeholder="000"
                              {...formik.getFieldProps("IncrementPromotional")}
                            />
                               {formik.touched.IncrementPromotional && formik.errors.IncrementPromotional ? (
                              <div className="text-danger">
                                {formik.errors.IncrementPromotional}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2}>
                          <div>
                            <Label htmlFor="FirstAmount" className="form-label">
                              First Amount
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="FirstAmount"
                              placeholder="000"
                              {...formik.getFieldProps("FirstAmount")}

                            />
                               {formik.touched.FirstAmount && formik.errors.FirstAmount ? (
                              <div className="text-danger">
                                {formik.errors.FirstAmount}
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
                            <th>Date</th>
                            <th>Effective Date</th>
                            <th>Current Salary</th>
                            <th>Amount</th>
                            <th>Special</th>
                            <th>Promotional</th>
                            <th>First Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {salaryIncrement?.length > 0 ? (
                            salaryIncrement.map((group, index) => (
                              <tr key={group.VID}>
                                <td>{group.VName}</td>
                                <td>{formatDate(group.VDate)}</td>
                                <td>{formatDate(group.DateFrom)}</td>
                                <td>{group.CurrentSalary}</td>
                                <td>{group.IncrementAmount}</td>
                                <td>{group.IncrementSpecial}</td>
                                <td>{group.IncrementPromotional}</td>
                                <td>{group.FirstAmount}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <div className="edit ">
                                      <Button className="btn btn-soft-info"
                                       onClick={() => handleEditClick(group)}
                                       >
                                        <i className="bx bx-edit"></i>
                                      </Button>
                                    </div>
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
                              <td colSpan="8" className="text-center">
                                No Salary Increment found.
                              </td>
                            </tr>
                          )}
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

export default Increment;
