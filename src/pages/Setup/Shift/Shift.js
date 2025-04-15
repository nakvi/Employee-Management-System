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
import { deleteShift, getShift, submitShift, updateShift } from "../../../slices/setup/shift/thunk";
const Shift = () => {
const dispatch = useDispatch();
const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null); // Track the group being edited
  // Access Redux state
  const { loading, error, shift } = useSelector(
    (state) => state.Shift
  );
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getShift());
  }, [dispatch]);
    // Formik form setup
    const formik = useFormik({
      initialValues: {
        VCode: "",
        VName: "",
        TimeIn: "",
        TimeOut: "",
        RestTimeFrom: "",
        RestTimeTo: "",
        WorkingHrs: "",
        RelaxTime: "",
        MinAttTime: "",
        MinHDTime: "",
        TimeInRamazan: "",
        TimeOutRamazan: "",
        RestTimeFromRamazan: "",
        RestTimeToRamazan: "",
        WorkingHrsRamazan: "",
        RelaxTimeRamazan: "",
        MinAttTimeRamazan: "",
        MinHDTimeRamazan: "",
        IsDayLight: true,
        DayLightFrom: "2024-06-01T05:00:00Z",
        DayLightTo: "2024-09-01T20:00:00Z",
        TimeInDayLight: 8.30,
        TimeOutDayLight: 19.00,
        RestTimeFromDayLight:13.30,
        RestTimeToDayLight:14.30,
        IsRoster: false,
        IsSecurity: false,
        SaturdayHalfTime: false,
        LocationID: "1",
        IsActive: false,
        UID: "1",
        CompanyID: "1",
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
                  updateShift({ ...transformedValues, VID: editingGroup.VID })
                );
                setEditingGroup(null); // Reset after submission
              } else {
                dispatch(submitShift(transformedValues));
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
          dispatch(deleteShift(deleteId));
        }
        setDeleteModal(false);
      };
      const handleEditClick = (group) => {
        setEditingGroup(group);
        formik.setValues({
          VCode:group.VCode,
          VName: group.VName,
          TimeIn: group.TimeIn,
          TimeOut: group.TimeOut,
          RestTimeFrom: group.RestTimeFrom,
          RestTimeTo: group.RestTimeTo,
          WorkingHrs: group.WorkingHrs,
          RelaxTime: group.RelaxTime,
          MinAttTime: group.MinAttTime,
          MinHDTime: group.MinHDTime,
          TimeInRamazan: group.TimeInRamazan,
          TimeOutRamazan: group.TimeOutRamazan,
          RestTimeFromRamazan: group.RestTimeFromRamazan,
          RestTimeToRamazan: group.RestTimeToRamazan,
          WorkingHrsRamazan: group.WorkingHrsRamazan,
          RelaxTimeRamazan: group.RelaxTimeRamazan,
          MinAttTimeRamazan: group.MinAttTimeRamazan,
          MinHDTimeRamazan: group.MinHDTimeRamazan,
          IsDayLight: true,
          DayLightFrom: "2024-06-01T05:00:00Z",
          DayLightTo: "2024-09-01T20:00:00Z",
          TimeInDayLight: 8.30,
          TimeOutDayLight: 19.00,
          RestTimeFromDayLight:13.30,
          RestTimeToDayLight:14.30,
          IsRoster: group.IsRoster === true,
          IsSecurity: group.IsSecurity === true,
          SaturdayHalfTime: group.SaturdayHalfTime === true,
          LocationID: "1",
          IsActive: group.IsActive === true,
          UID: "1",
          CompanyID: "1",
        });
      }
  document.title = "Shift | EMS";
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
                <PreviewCardHeader title="Shift Management" onCancel={formik.resetForm} />
                <CardBody className="card-body">
                  <div className="live-preview">
                    <Row className="gy-4">
                      <Col xxl={2} md={2}>
                        <div>
                          <Label htmlFor="codeInput" className="form-label">
                            Code
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="codeInput"
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
                      <Col xxl={2} md={2}>
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

                      <Col xxl={2} md={2}>
                        <div className="mb-3">
                          <Label
                            htmlFor="LocationGroupInput"
                            className="form-label"
                          >
                            Location
                          </Label>
                          <select className="form-select  form-select-sm mb-3">
                          <option value="-1" >
                                ---Select---
                              </option>
                            <option value="Choices1" >
                              Lahore
                            </option>
                            <option value="Choices2" >
                              Gujranwala
                            </option>
                          </select>
                        </div>
                      </Col>
                      {/* <Col xxl={2} md={2}>
                        <div>
                          <Label htmlFor="titleInput" className="form-label">
                            Sat-Half Time
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="titleInput"
                            placeholder="Saturday Half Time"
                          />
                        </div>
                      </Col> */}
                      <Col xxl={2} md={2} className="mt-4">
                        <div className="form-check mb-2 mt-2 ">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            id="SaturdayHalfTime"
                            {...formik.getFieldProps("SaturdayHalfTime")}
                              checked={formik.values.SaturdayHalfTime}
                          />
                          <Label className="form-check-label" for="SaturdayHalfTime">
                          Sat-Half Time
                          </Label>
                        </div>
                      </Col>
                      <Col xxl={2} md={1} className="mt-4">
                        <div className="form-check mb-2 mt-2 ">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            id="IsRoster"
                            {...formik.getFieldProps("IsRoster")}
                              checked={formik.values.IsRoster}
                          />
                          <Label className="form-check-label" for="IsRoster">
                            IsRoster
                          </Label>
                        </div>
                      </Col>
                      <Col xxl={2} md={1} className="mt-4">
                        <div className="form-check mb-2 mt-2 ">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            id="IsSecurity"
                            {...formik.getFieldProps("IsSecurity")}
                              checked={formik.values.IsSecurity}
                          />
                          <Label className="form-check-label" for="IsSecurity">
                            IsSecurity
                          </Label>
                        </div>
                      </Col>
                      <Col xxl={2} md={2} className="mt-4">
                        <div className="form-check form-switch mt-2 " dir="ltr">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="IsActive"
                            defaultChecked=""
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
                      {/* first set */}
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="TimeIn"
                            className="form-label"
                          >
                            Time In
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="TimeIn"
                            placeholder="Time In"
                            {...formik.getFieldProps("TimeIn")}
                          />
                          {formik.touched.TimeIn && formik.errors.TimeIn ? (
                            <div className="text-danger">
                              {formik.errors.TimeIn}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="TimeOut"
                            className="form-label"
                          >
                            Time Out
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="TimeOut"
                            placeholder="Time Out"
                            {...formik.getFieldProps("TimeOut")}
                          />
                          {formik.touched.TimeOut && formik.errors.TimeOut ? (
                            <div className="text-danger">
                              {formik.errors.TimeOut}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="RestTimeFrom"
                            className="form-label"
                          >
                            Rest From
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="RestTimeFrom"
                            placeholder="Rest From"
                            {...formik.getFieldProps("RestTimeFrom")}
                          />
                          {formik.touched.RestTimeFrom && formik.errors.RestTimeFrom ? (
                            <div className="text-danger">
                              {formik.errors.RestTimeFrom}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="RestTimeTo"
                            className="form-label"
                          >
                            Rest To
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="RestTimeTo"
                            placeholder="Rest To"
                            {...formik.getFieldProps("RestTimeTo")}
                          />
                          {formik.touched.RestTimeTo && formik.errors.RestTimeTo ? (
                            <div className="text-danger">
                              {formik.errors.RestTimeTo}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="WorkingHrs"
                            className="form-label"
                          >
                            Working Hrs
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="WorkingHrs"
                            placeholder="Working Hrs"
                            {...formik.getFieldProps("WorkingHrs")}
                          />
                          {formik.touched.WorkingHrs && formik.errors.WorkingHrs ? (
                            <div className="text-danger">
                              {formik.errors.WorkingHrs}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="RelaxTime"
                            className="form-label"
                          >
                            Relax Time
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="RelaxTime"
                            placeholder="Relax Time"
                            {...formik.getFieldProps("RelaxTime")}
                          />
                          {formik.touched.RelaxTime && formik.errors.RelaxTime ? (
                            <div className="text-danger">
                              {formik.errors.RelaxTime}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="MinAttTime"
                            className="form-label"
                          >
                            MinAtt Time
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="MinAttTime"
                            placeholder="MinAtt Time"
                            {...formik.getFieldProps("MinAttTime")}
                          />
                          {formik.touched.MinAttTime && formik.errors.MinAttTime ? (
                            <div className="text-danger">
                              {formik.errors.MinAttTime}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="MinHDTime"
                            className="form-label"
                          >
                            MinHD Time
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="MinHDTime"
                            placeholder="MinHD Time"
                            {...formik.getFieldProps("MinHDTime")}
                          />
                          {formik.touched.MinHDTime && formik.errors.MinHDTime ? (
                            <div className="text-danger">
                              {formik.errors.MinHDTime}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: 8,
                          marginBottom: 0,
                        }}
                      >
                        <span>Ramazan</span>
                        <div
                          style={{
                            flex: 1,
                            borderBottom: "1px solid",
                            margin: "0 10px",
                            color: "#E9EBEC",
                          }}
                        ></div>
                      </div>
                     {/* ramazan */}
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="TimeInRamazan"
                            className="form-label"
                          >
                            Time In
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="TimeInRamazan"
                            placeholder="Time In"
                            {...formik.getFieldProps("TimeInRamazan")}
                          />
                          {formik.touched.TimeInRamazan && formik.errors.TimeInRamazan ? (
                            <div className="text-danger">
                              {formik.errors.TimeInRamazan}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="TimeOutRamazan"
                            className="form-label"
                          >
                            Time Out
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="TimeOutRamazan"
                            placeholder="Time Out"
                            {...formik.getFieldProps("TimeOutRamazan")}
                          />
                          {formik.touched.TimeOutRamazan && formik.errors.TimeOutRamazan ? (
                            <div className="text-danger">
                              {formik.errors.TimeOutRamazan}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="RestTimeFromRamazan"
                            className="form-label"
                          >
                            Rest From
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="RestTimeFromRamazan"
                            placeholder="Rest From"
                            {...formik.getFieldProps("RestTimeFromRamazan")}
                          />
                           {formik.touched.RestTimeFromRamazan && formik.errors.RestTimeFromRamazan ? (
                            <div className="text-danger">
                              {formik.errors.RestTimeFromRamazan}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="RestTimeToRamazan"
                            className="form-label"
                          >
                            Rest To
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="RestTimeToRamazan"
                            placeholder="Rest To"
                            {...formik.getFieldProps("RestTimeToRamazan")}
                          />
                          {formik.touched.RestTimeToRamazan && formik.errors.RestTimeToRamazan ? (
                            <div className="text-danger">
                              {formik.errors.RestTimeToRamazan}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="WorkingHrsRamazan"
                            className="form-label"
                          >
                            Working Hrs
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="WorkingHrsRamazan"
                            placeholder="Working Hrs"
                            {...formik.getFieldProps("WorkingHrsRamazan")}
                          />
                          {formik.touched.WorkingHrsRamazan && formik.errors.WorkingHrsRamazan ? (
                            <div className="text-danger">
                              {formik.errors.WorkingHrsRamazan}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="RelaxTimeRamazan"
                            className="form-label"
                          >
                            Relax Time
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="RelaxTimeRamazan"
                            placeholder="Relax Time"
                            {...formik.getFieldProps("RelaxTimeRamazan")}
                          />
                          {formik.touched.RelaxTimeRamazan && formik.errors.RelaxTimeRamazan ? (
                            <div className="text-danger">
                              {formik.errors.RelaxTimeRamazan}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="MinAttTimeRamazan"
                            className="form-label"
                          >
                            MinAtt Time
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="MinAttTimeRamazan"
                            placeholder="MinAtt Time"
                            {...formik.getFieldProps("MinAttTimeRamazan")}
                          />
                          {formik.touched.MinAttTimeRamazan && formik.errors.MinAttTimeRamazan ? (
                            <div className="text-danger">
                              {formik.errors.MinAttTimeRamazan}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col xxl={2} md={2}>
                        <div>
                          <Label
                            htmlFor="MinHDTimeRamazan"
                            className="form-label"
                          >
                            MinHD Time
                          </Label>
                          <Input
                            type="number"
                            className="form-control-sm "
                            id="MinHDTimeRamazan"
                            placeholder="MinHD Time"
                            {...formik.getFieldProps("MinHDTimeRamazan")}
                          />
                          {formik.touched.MinHDTimeRamazan && formik.errors.MinHDTimeRamazan ? (
                            <div className="text-danger">
                              {formik.errors.MinHDTimeRamazan}
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
                            <th className="" data-sort="code">
                              Code
                            </th>
                            <th className="" data-sort="title">
                              Title
                            </th>
                            <th className="" data-sort="titleUrdu">
                              Location
                            </th>
                            <th className="" data-sort="titleUrdu">
                              Sat-H-Time
                            </th>
                            <th className="" data-sort="IsRoster">
                            IsRoster
                            </th>
                            <th className="" data-sort="IsSecurity">
                            IsSecurity
                            </th>
                            <th className="" data-sort="titleUrdu">
                              Shift
                            </th>
                            <th className="" data-sort="titleUrdu">
                              Rest
                            </th>
                            <th className="" data-sort="titleUrdu">
                              W-Hrs
                            </th>
                            <th className="" data-sort="titleUrdu">
                              Relax
                            </th>
                            <th className="" data-sort="titleUrdu">
                              Min Time
                            </th>
                            <th className="" data-sort="titleUrdu">
                              HD Time
                            </th>
                            <th className="" data-sort="titleUrdu">
                             Ramazan Shift
                            </th>
                            <th className="" data-sort="titleUrdu">
                              Rest
                            </th>
                            <th className="" data-sort="titleUrdu">
                              W-Hrs
                            </th>
                            <th className="" data-sort="titleUrdu">
                              Relax
                            </th>
                            <th className="" data-sort="titleUrdu">
                              Min Time
                            </th>
                            <th className="" data-sort="titleUrdu">
                              HD Time
                            </th>
                            <th className="" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                        {shift?.length > 0 ? (
                            shift.map((group, index) => (
                              <tr key={group.VID}>
                            <td >{group.VCode}</td>
                            <td >{group.VName}</td>
                            <td >Lahore</td>
                            <td>{group.SaturdayHalfTime ? "Yes" : "No"}</td>
                            <td>{group.IsRoster ? "Yes" : "No"}</td>
                            <td>{group.IsSecurity ? "Yes" : "No"}</td>
                            <td>({group.TimeIn} - {group.TimeOut})</td>
                            <td>({group.RestTimeFrom} - {group.RestTimeTo})</td>
                            <td>{group.WorkingHrs}</td>
                            <td>{group.RelaxTime}</td>
                            <td>{group.MinAttTime}</td>
                            <td>{group.MinHDTime}</td>
                            <td>({group.TimeInRamazan} - {group.TimeOutRamazan})</td>
                            <td>({group.RestTimeFromRamazan} - {group.RestTimeToRamazan})</td>
                            <td>{group.WorkingHrsRamazan}</td>
                            <td>{group.RelaxTimeRamazan}</td>
                            <td>{group.MinAttTimeRamazan}</td>
                            <td>{group.MinHDTimeRamazan}</td>
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
                                  No shift found.
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

export default Shift;
