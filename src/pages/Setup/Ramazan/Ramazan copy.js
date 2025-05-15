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
import { format } from "date-fns";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { deleteRamazan, getRamazan, submitRamazan, updateRamazan } from "../../../slices/thunks";
const Ramazan = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editingGroup, setEditingGroup] = useState(null);
  // Access Redux state
    const { loading, error, ramazan } = useSelector(
      (state) => state.Ramazan
    );
      // Fetch data on component mount
      useEffect(() => {
        dispatch(getRamazan());
      }, [dispatch]);
   // Formik form setup
    const formik = useFormik({
      initialValues: {
        VName: "",
        DateFrom: "",
        DateTo: "",
        CompanyID: "1",
        UID: "1",
        IsActive: false,
      },
      validationSchema: Yup.object({
        VName: Yup.string()
          .required("Title is required.")
          .min(3, "Title at least must be 3 characters "),
        DateFrom: Yup.date()
          .required("Start date is required.")
          .max(
            Yup.ref('DateTo'),
            "Start date must be earlier than or the same as the end date"
          ),
        DateTo: Yup.date()
          .required("End date is required.")
          .min(
            Yup.ref('DateFrom'),
            "End date must be later than or the same as the start date"
          ),
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
            updateRamazan({ ...transformedValues, VID: editingGroup.VID })
          );
          setEditingGroup(null); // Reset after submission

        } else {
          dispatch(submitRamazan(transformedValues));
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
      dispatch(deleteRamazan(deleteId));
    }
    setDeleteModal(false);
  };
    const formatDate = (dateString) => {
      return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
    };
   // Today Date
 useEffect(() => {
  const today = new Date().toISOString().split("T")[0];
  setSelectedDate(today);
}, []);

  document.title = "Ramazan Dates | EMS";
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
                <PreviewCardHeader title="Ramazan Dates" onCancel={formik.resetForm}  />
                <CardBody className="card-body">
                  <div className="live-preview">
                    <Row className="gy-4">
                      <Col xxl={2} md={4}>
                        <div>
                          <Label htmlFor="VName" className="form-label">
                            Title
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="VName"
                            placeholder="Title"
                            {...formik.getFieldProps("VName")}

                          />
                          {formik.touched.VName && formik.errors.VName ? (
                              <div className="text-danger">
                                {formik.errors.VName}
                              </div>
                            ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={3}>
                        <div>
                          <Label htmlFor="DateFrom" className="form-label">
                          Date From
                          </Label>
                          <Input
                            type="date"
                            className="form-control-sm"
                            id="DateFrom"
                            {...formik.getFieldProps("DateFrom")}
                            // min={new Date().toISOString().split("T")[0]} // Prevent past dates
                            // value={selectedDate}
                          />
                          {formik.touched.DateFrom && formik.errors.DateFrom ? (
                              <div className="text-danger">
                                {formik.errors.DateFrom}
                              </div>
                            ) : null}
                        </div>
                      </Col>  
                       <Col xxl={2} md={3}>
                        <div>
                          <Label htmlFor="DateTo" className="form-label">
                           To
                          </Label>
                          <Input
                            type="date"
                            className="form-control-sm"
                            id="DateTo"
                           
                            // min={formik.values.DateFrom || new Date().toISOString().split("T")[0]} // Prevent past & earlier than DateFrom
                            {...formik.getFieldProps("DateTo")}
                            //  value={selectedDate}
                          />
                         {formik.touched.DateTo && formik.errors.DateTo ? (
                              <div className="text-danger">
                                {formik.errors.DateTo}
                              </div>
                            ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2} className="mt-4">
                        <div className="form-check form-switch mt-3 " dir="ltr">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="IsActive"
                            {...formik.getFieldProps("IsActive")}
                            checked={formik.values.IsActive}
                          />
                          <Label
                            className="form-check-label"
                            for="IsActive"
                          >
                            IsActive
                          </Label>
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
                            <th className="" data-sort="title">
                              Title
                            </th>
                            <th className="" data-sort="sorting">
                              Date From
                            </th>
                            <th className="" data-sort="sorting">
                             To
                            </th>
                            <th className="" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                        {ramazan?.length > 0 ? (
                            ramazan.map((group, index) => (
                              <tr key={group.VID}>
                            <td >{group.VName}</td>
                            <td >{formatDate(group.DateFrom)}</td>
                            <td >{formatDate(group.DateTo)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <div className="edit ">
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
                                  No ramazan found.
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

export default Ramazan;
