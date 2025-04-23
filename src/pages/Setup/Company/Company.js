import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Input,
  Label,
  Form,
  CardHeader,
  Button,
} from "reactstrap";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCompany, updateCompany } from "../../../slices/setup/company/thunk";
const Company = () => {
  document.title = "Company | EMS";
  const dispatch = useDispatch();
  const { loading, error, company } = useSelector((state) => state.Company);
  const [initialValues, setInitialValues] = useState({
    VID: "",
    VCode: "",
    VName: "",
    VNameUrdu: "",
    Address1: "",
    Address2: "",
    AddressUrdu1: "",
    AddressUrdu2: "",
    SortOrder: 0,
    UID: "1",
    IsActive: false,
  });

  // Fetch company data on component mount
  useEffect(() => {
    dispatch(getCompany());
  }, [dispatch]);

  // When company data is available, update form values
  useEffect(() => {
    if (company?.data?.length > 0) {
      const companyData = company.data[0]; // Assuming the first item is the company
      setInitialValues({
        VID: companyData.VID,
        VCode: companyData.VCode || "",
        VName: companyData.VName || "",
        VNameUrdu: companyData.VNameUrdu || "",
        Address1: companyData.Address1 || "",
        Address2: companyData.Address2 || "",
        AddressUrdu1: companyData.AddressUrdu1 || "",
        AddressUrdu2: companyData.AddressUrdu2 || "",
        SortOrder: companyData.SortOrder || 0,
        UID: companyData.UID || "1",
        IsActive: companyData.IsActive == true, // Convert integer to boolean
      });
    }
  }, [company]);
  // Initialize Formik with updated values
  const formik = useFormik({
    enableReinitialize: true, // Allow formik to reset values when `initialValues` change
    initialValues: initialValues,
    validationSchema: Yup.object({
      VCode: Yup.string().required("Code is required.").min(3).max(4),
      VName: Yup.string().required("Title is required.").min(3),
      VNameUrdu: Yup.string().required("Title Urdu is required.").min(3),
      Address1: Yup.string().required("Address is required."),
      Address2: Yup.string().required("Address is required."),
      AddressUrdu1: Yup.string().required("Address Urdu is required."),
      AddressUrdu2: Yup.string().required("Address Urdu is required."),
      IsActive: Yup.boolean(),
    }),
    onSubmit: (values) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer for API
      };
      dispatch(updateCompany(transformedValues));
    },
  });
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
                  {/* <PreviewCardHeader title="Company" /> */}
                  <CardHeader className="align-items-center d-flex py-2">
                    <h4 className="card-title mb-0 flex-grow-1">Company</h4>
                    <div className="flex-shrink-0">
                      <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                        id="create-btn"
                      >
                        <i className="align-bottom me-1"></i>Save
                      </Button>
                      <Button
                        type="reset"
                        color="dark"
                        className="add-btn me-1 py-1"
                      >
                        <i className="align-bottom me-1"></i> Cancel
                      </Button>
                    </div>
                  </CardHeader>
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
                              readOnly="true"
                              {...formik.getFieldProps("VCode")}
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
                            <Label htmlFor="VName" className="form-label">
                              Company Name
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VName"
                              placeholder="Company Name"
                              readOnly="true"
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
                            <Label htmlFor="VNameUrdu" className="form-label">
                              Company Name Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="VNameUrdu"
                              placeholder="Company Name Urdu"
                              {...formik.getFieldProps("VNameUrdu")}
                            />
                            {formik.touched.VNameUrdu &&
                            formik.errors.VNameUrdu ? (
                              <div className="text-danger">
                                {formik.errors.VNameUrdu}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        {/* <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="SortOrder" className="form-label">
                              Sort Order
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="SortOrder"
                              {...formik.getFieldProps("SortOrder")}
                            />
                            {formik.touched.SortOrder &&
                            formik.errors.SortOrder ? (
                              <div className="text-danger">
                                {formik.errors.SortOrder}
                              </div>
                            ) : null}
                          </div>
                        </Col> */}
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="Address1" className="form-label">
                              Address-1
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="Address1"
                              placeholder="Company Address"
                              {...formik.getFieldProps("Address1")}
                            />
                            {formik.touched.Address1 &&
                            formik.errors.Address1 ? (
                              <div className="text-danger">
                                {formik.errors.Address1}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="Address2" className="form-label">
                              Address-2
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="Address2"
                              placeholder="Company Address"
                              {...formik.getFieldProps("Address2")}
                            />
                            {formik.touched.Address2 &&
                            formik.errors.Address2 ? (
                              <div className="text-danger">
                                {formik.errors.Address2}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label
                              htmlFor="AddressUrdu1"
                              className="form-label"
                            >
                              Address-Urdu-1
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="AddressUrdu1"
                              placeholder="Company Address Urdu"
                              {...formik.getFieldProps("AddressUrdu1")}
                            />
                            {formik.touched.AddressUrdu1 &&
                            formik.errors.AddressUrdu1 ? (
                              <div className="text-danger">
                                {formik.errors.AddressUrdu1}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={3}>
                          <div>
                            <Label
                              htmlFor="AddressUrdu2"
                              className="form-label"
                            >
                              Address-Urdu-2
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm"
                              id="AddressUrdu2"
                              placeholder="Company Address Urdu"
                              {...formik.getFieldProps("AddressUrdu2")}
                            />
                            {formik.touched.AddressUrdu2 &&
                            formik.errors.AddressUrdu2 ? (
                              <div className="text-danger">
                                {formik.errors.AddressUrdu2}
                              </div>
                            ) : null}
                          </div>
                        </Col>
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
                            <Label
                              className="form-check-label"
                              htmlFor="IsActive"
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
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Company;
