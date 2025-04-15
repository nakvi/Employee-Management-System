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
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { getAllowanceDeductionGroup } from "../../../slices/setup/allowanceDeductionGroup/thunk";
import { getAllowanceDeductionCategory } from "../../../slices/setup/allowanceDeductionCategory/thunk";
import {
  deleteAllowanceDeductionType,
  getAllowanceDeductionType,
  submitAllowanceDeductionType,
  updateAllowanceDeductionType,
} from "../../../slices/setup/allowanceDeductionType/thunk";
const AllowanceDeductionTypes = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [vType, setVType] = useState("Deduction"); // Default to Deduction

  // Access Redux state
  const { loading, error, allowanceDeductionType } = useSelector(
    (state) => state.AllowanceDeductionType
  );
  const { allowanceDeductionGroup } = useSelector(
    (state) => state.AllowanceDeductionGroup
  );
  const { allowanceDeductionCategory } = useSelector(
    (state) => state.AllowanceDeductionCategory
  );
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getAllowanceDeductionType());
    dispatch(getAllowanceDeductionGroup());
    dispatch(getAllowanceDeductionCategory());
  }, [dispatch]);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      VCode: "",
      VName: "",
      VType: "Deduction",
      CatID: "",
      GroupID: "",
      AmountType: "amount",
      SortOrder: 0,
      CompanyID: "1",
      UID: "1",
      IsActive: false,
    },
    validationSchema: Yup.object({
      VType: Yup.string().required("Type is required."), // Ensure validation
      VCode: Yup.string()
        .required("Code is required.")
        .min(3, "Code at least must be 3 characters ")
        .max(4, "Code must be 4 characters or less."),
      VName: Yup.string()
        .required("Title is required.")
        .min(3, "Title at least must be 3 characters "),
      CatID: Yup.string().required("Category is required."),
      GroupID: Yup.string().required(" Group is required."),

      SortOrder: Yup.number()
        .typeError("Sort Order must be a number.")
        .required("Sort Order is required."),
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
          updateAllowanceDeductionType({
            ...transformedValues,
            VID: editingGroup.VID,
          })
        );
        setEditingGroup(null); // Reset after submission
      } else {
        dispatch(submitAllowanceDeductionType(transformedValues));
      }
      formik.resetForm();
    },
  });
  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteAllowanceDeductionType(deleteId));
    }
    setDeleteModal(false);
  };
  const handleEditClick = (group) => {
    setEditingGroup(group);
    formik.setValues({
      VType: group.VType,
      CatID: group.CatID,
      GroupID: group.GroupID,
      AmountType: "amount",
      VCode: group.VCode,
      VName: group.VName,
      VNameUrdu: group.VNameUrdu,
      SortOrder: group.SortOrder,
      UID: group.UID,
      CompanyID: group.CompanyID,
      IsActive: group.IsActive === 1,
    });
  };

  // Filter categories based on VType
  const filteredCategories =
    formik.values.VType === "Allowance"
      ? allowanceDeductionCategory?.data?.filter(
          (category) => category.VType === "Allowance"
        )
      : allowanceDeductionCategory?.data?.filter(
          (category) => category.VType === "Deduction"
        ) || [];
  document.title = "Allowance/Deduction | EMS";
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
                    title="Allowance/Deduction"
                    onCancel={formik.resetForm}
                  />
                  <CardBody className="card-body">
                    <div className="live-preview">
                      <Row className="gy-4">
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="VCode" className="form-label">
                              Code
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VCode"
                              placeholder="Code"
                              {...formik.getFieldProps("VCode")}
                            />
                            {formik.touched.VCode && formik.errors.VCode ? (
                              <div className="text-danger">
                                {formik.errors.VCode}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
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
                          <div className="mb-3">
                            <Label htmlFor="VType" className="form-label">
                              Type
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="VType"
                              name="VType"
                              value={formik.values.VType} // Bind to Formik state
                              onChange={formik.handleChange}
                            >
                              <option value="Allowance">Allowance</option>
                              <option value="Deduction">Deduction</option>
                            </select>
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="CatID" className="form-label">
                              Category
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="CatID"
                              name="CatID"
                              value={formik.values.CatID} // Bind to Formik state
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="" disabled>
                                ---Select---
                              </option>
                              {filteredCategories.length > 0 ? (
                                filteredCategories.map((group) => (
                                  <option key={group.VID} value={group.CatID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>
                                  No categories available
                                </option>
                              )}
                            </select>
                            {formik.touched.CatID && formik.errors.CatID ? (
                              <div className="text-danger">
                                {formik.errors.CatID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="CatID" className="form-label">
                              Category
                            </Label>
                            <select
                              className="form-select form-select-sm"
                              id="CatID"
                              name="CatID"
                              value={formik.values.CatID} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="" disabled>
                                ---Select---{" "}
                              </option>
                              {allowanceDeductionCategory?.data?.length > 0 ? (
                                allowanceDeductionCategory.data.map((group) => (
                                  <option key={group.VID} value={group.CatID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>
                                  No category available
                                </option>
                              )}
                            </select>
                            {formik.touched.CatID && formik.errors.CatID ? (
                              <div className="text-danger">
                                {formik.errors.CatID}
                              </div>
                            ) : null}
                          </div>
                        </Col> */}
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="GroupID" className="form-label">
                              Group
                            </Label>

                            <select
                              className="form-select form-select-sm"
                              id="GroupID"
                              name="GroupID"
                              value={formik.values.GroupID} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="" disabled>
                                ---Select---{" "}
                              </option>
                              {allowanceDeductionGroup?.data?.length > 0 ? (
                                allowanceDeductionGroup.data.map((group) => (
                                  <option key={group.VID} value={group.VID}>
                                    {group.VName}
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>
                                  No groups available
                                </option>
                              )}
                            </select>
                            {formik.touched.GroupID && formik.errors.GroupID ? (
                              <div className="text-danger">
                                {formik.errors.GroupID}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="SortOrder" className="form-label">
                              Sort Order
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="SortOrder"
                              placeholder="Sort Order"
                              {...formik.getFieldProps("SortOrder")}
                            />
                            {formik.touched.SortOrder &&
                            formik.errors.SortOrder ? (
                              <div className="text-danger">
                                {formik.errors.SortOrder}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* <Col xxl={2} md={1} className="mt-4">
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="Deduction"
                              name="VType"
                              value="Deduction"
                              checked={formik.values.VType === "Deduction"}
                              onChange={formik.handleChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="Deduction"
                            >
                              Deduction
                            </Label>
                          </div>
                        </Col>

                        <Col xxl={2} md={1} className="mt-4">
                          <div className="form-check mt-3" dir="ltr">
                            <Input
                              type="radio"
                              className="form-check-input"
                              id="Allowance"
                              name="VType"
                              value="Allowance"
                              checked={formik.values.VType === "Allowance"}
                              onChange={formik.handleChange}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="Allowance"
                            >
                              Allowance
                            </Label>
                          </div>
                        </Col> */}

                        <Col xxl={2} md={2} className="mt-4">
                          <div
                            className="form-check form-switch mt-3"
                            dir="ltr"
                          >
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="IsActive"
                              {...formik.getFieldProps("IsActive")}
                              checked={formik.values.IsActive}
                            />
                            <Label className="form-check-label" for="IsActive">
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
                            <th className="" data-sort="code">
                              Code
                            </th>
                            <th className="" data-sort="title">
                              Title
                            </th>
                            <th>Type</th>
                            <th className="" data-sort="deptGroup">
                              Category
                            </th>
                            <th className="" data-sort="deptGroup">
                              Group
                            </th>
                            
                            <th className="" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {allowanceDeductionType?.length > 0 ? (
                            allowanceDeductionType.map((group, index) => (
                              <tr key={group.VID}>
                                <td>{group.VCode}</td>
                                <td>{group.VName}</td>
                                <td>{group.VType}</td>
                                <td>
                                  {allowanceDeductionCategory?.data?.find(
                                    (groupItem) => groupItem.VID === group.CatID
                                  )?.VName || "N/A"}
                                </td>
                                <td>
                                  {allowanceDeductionGroup?.data?.find(
                                    (groupItem) =>
                                      groupItem.VID === group.GroupID
                                  )?.VName || "N/A"}
                                </td>
                                

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
                                No allowance Deduction found.
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

export default AllowanceDeductionTypes;
