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
  CardHeader,
} from "reactstrap";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { getDepartmentGroup } from "../../../slices/setup/departmentGroup/thunk";
import {
  getDepartment,
  submitDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../slices/setup/department/thunk";
import { getLocation } from "../../../slices/setup/location/thunk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Department = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null); // Track the group being edited

  // Access Redux state
  const { loading, error, department } = useSelector(
    (state) => state.Department
  );
  const { departmentGroup } = useSelector((state) => state.DepartmentGroup);
  const { location } = useSelector((state) => state.Location);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      VCode: "",
      VName: "",
      VNameUrdu: "",
      Strength: 0,
      SortOrder: 0,
      GroupID: "-1",
      CompanyID: "1",
      LocationID: "-1",
      UID: "1",
      IsActive: false,
    },
    validationSchema: Yup.object({
      VCode: Yup.string()
        .required("Code is required.")
        .min(3, "Code must be at least 3 characters ")
        .max(10, "Code must be less then 10 characters"),
      VName: Yup.string()
        .required("Title is required.")
        .min(3, "Title at least must be 3 characters "),
      VNameUrdu: Yup.string()
        .required("Title Urdu is required.")
        .min(3, "Title at least must be 3 characters "),
      SortOrder: Yup.number()
        .typeError("Sort Order must be a number.")
        .required("Sort Order is required."),
      Strength: Yup.number()
        .typeError("Strength  must be a number.")
        .required("Strength  is required."),
      // GroupID: Yup.string().required("Department Group is required."),
      GroupID: Yup.string().test(
        "is-valid-leave-type",
        "Department Group is required.",
        (value) => value !== "-1"
      ),
      IsActive: Yup.boolean(),
    }),
    // onSubmit: (values) => {
    //   console.log(values);
    //   // Add your form submission logic here
    //   const transformedValues = {
    //     ...values,
    //     IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
    //   };
    //         // Remove LocationID if it's "-1" (default/unselected)
    // if (transformedValues.LocationID === -1) {
    //   transformedValues.LocationID === "";
    // }
    //   if (editingGroup) {
    //     dispatch(
    //       updateDepartment({ ...transformedValues, VID: editingGroup.VID })
    //     );
    //     setEditingGroup(null); // Reset after submission
    //   } else {
    //     dispatch(submitDepartment(transformedValues));
    //   }
    //   formik.resetForm();
    // },
    onSubmit: async (values, { resetForm, setErrors }) => {
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0, // Convert boolean to integer
      };

      if (transformedValues.LocationID === "-1") {
        transformedValues.LocationID = "-1"; // Fix incorrect assignment
      }
      try {
        if (editingGroup) {
          await dispatch(
            updateDepartment({ ...transformedValues, VID: editingGroup.VID })
          ).unwrap();
          setEditingGroup(null);
        } else {
          await dispatch(submitDepartment(transformedValues)).unwrap();
        }

        resetForm();
      } catch (error) {
        if (typeof error === "string") {
          const newErrors = {};

          if (error.includes("Duplicate VCode")) {
            newErrors.VCode = error;
          }
          if (error.includes("Duplicate VName")) {
            newErrors.VName = error;
          }
          if (error.includes("Duplicate Urdu Name")) {
            newErrors.VNameUrdu = error;
          }

          setErrors(newErrors); // ✅ Set errors dynamically in Formik
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    },
  });
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getDepartmentGroup());
    dispatch(getLocation());
  }, [dispatch]);
  // Delete Data
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteDepartment(deleteId));
    }
    setDeleteModal(false);
  };
  const handleEditClick = (group) => {
    setEditingGroup(group);
    formik.setValues({
      VCode: group.VCode,
      VName: group.VName,
      VNameUrdu: group.VNameUrdu,
      Strength: group.Strength,
      SortOrder: group.SortOrder,
      GroupID: group.GroupID,
      UID: group.UID,
      CompanyID: group.CompanyID,
      LocationID: group.LocationID,
      IsActive: group.IsActive === 1,
    });
  };
  const expectedHeaders = [
    "Code",
    "Title",
    "Title-Urdu",
    "Default Strength",
    "Sort Order",
    "Department Group",
    "Location",
  ];
  // check file fomat
  const validateExcelFormat = (worksheet) => {
    const headers = [];
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // Get headers from first row
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = { c: C, r: range.s.r };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      const cell = worksheet[cellRef];
      if (cell && cell.t) headers.push(cell.v);
    }

    // Check if all expected headers are present
    const missingHeaders = expectedHeaders.filter(
      (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
      throw new Error(
        `Invalid file format. Missing columns: ${missingHeaders.join(", ")}`
      );
    }

    return true;
  };
  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Check file extension first
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error("Please upload an Excel file (.xlsx or .xls)");
      }
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      validateExcelFormat(worksheet);

      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Find department group and location IDs by name
      const findGroupId = (name) => {
        const group = departmentGroup.data?.find((g) => g.VName === name);
        return group ? group.VID : "-1";
      };

      const findLocationId = (name) => {
        const loc = location?.find((l) => l.VName === name);
        return loc ? loc.VID : "-1";
      };

      // Process all records first
      const uploadPromises = jsonData.map((item) => {
        const transformedValues = {
          VCode: item.Code?.toString() || "",
          VName: item.Title || "",
          VNameUrdu: item["Title-Urdu"] || "",
          Strength: Number(item["Default Strength"]) || 0,
          SortOrder: Number(item["Sort Order"]) || 0,
          GroupID: findGroupId(item["Department Group"]),
          LocationID: findLocationId(item.Location),
          IsActive: 1, // Default to active
          CompanyID: "1",
          UID: "1",
        };

        return dispatch(submitDepartment(transformedValues));
      });

      // Wait for all uploads to complete
      const results = await Promise.allSettled(uploadPromises);

      // Count successful and failed uploads
      const successfulUploads = results.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failedUploads = results.filter(
        (r) => r.status === "rejected"
      ).length;

      // Refresh department data
      dispatch(getDepartment());

      // Show summary notification
      if (failedUploads > 0) {
        toast.warning(
          `Upload completed with ${successfulUploads} successful and ${failedUploads} failed records.`
        );
      } else {
        toast.success(`${successfulUploads} records uploaded successfully!`);
      }
    } catch (error) {
      toast.error("Invalid file format. Please use the correct template.");
      e.target.value = "";
    }
  };
  const handleExportSample = () => {
    const templatePath = `${process.env.PUBLIC_URL}/templates/Department_Import_Template.xlsx`;
    const link = document.createElement("a");
    link.href = templatePath;
    link.download = "Department_Import_Template.xlsx"; // Name when downloaded
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  document.title = "Department | EMS";
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
                  {/* <PreviewCardHeader
                    title="Department"
                    onCancel={formik.resetForm}
                  /> */}
                  <CardHeader className="align-items-center d-flex py-2">
                    <h4 className="card-title mb-0 flex-grow-1">Department</h4>
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
                        color="dark"
                        className="add-btn me-1 py-1"
                        onClick={formik.resetForm}
                      >
                        <i className="align-bottom me-1"></i> Cancel
                      </Button>
                      {/* <Button
                        type="submit"
                        color="success"
                        className="add-btn me-1 py-1"
                        id="upload-btn"
                      >
                        <i className="align-bottom me-1"></i>Upload
                      </Button> */}
                      <div className="d-inline-block position-relative">
                        <Button
                          tag="label"
                          type="submit"
                          color="success"
                          className="add-btn me-1 py-1 mb-0"
                          htmlFor="file-upload"
                        >
                          <i className="align-bottom me-1"></i>Upload
                        </Button>
                        <Input
                          type="file"
                          id="file-upload"
                          accept=".xlsx, .xls"
                          onChange={handleFileUpload}
                          style={{ display: "none" }}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-soft-danger btn-sm"
                        onClick={handleExportSample}
                      >
                        Download Sample
                      </button>
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
                          <div>
                            <Label htmlFor="VNameUrdu" className="form-label">
                              Title-Urdu
                            </Label>
                            <Input
                              type="text"
                              className="form-control-sm "
                              id="VNameUrdu"
                              placeholder="Title Urdu"
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
                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="SortOrder" className="form-label">
                              Sort Order
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="SortOrder"
                              placeholder="Sort Order "
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
                        <Col xxl={2} md={3}>
                          <div className="mb-3">
                            <Label htmlFor="GroupID" className="form-label">
                              Department Group
                            </Label>
                            <select
                              name="GroupID"
                              id="GroupID"
                              className="form-select form-select-sm"
                              value={formik.values.GroupID} // Bind to Formik state
                              onChange={formik.handleChange} // Handle changes
                              onBlur={formik.handleBlur} // Track field blur
                            >
                              <option value="-1">---Select---</option>
                              {departmentGroup?.data?.length > 0 ? (
                                departmentGroup.data.map((group) => (
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
                          <div className="mb-3">
                            <Label htmlFor="LocationID" className="form-label">
                              Location
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
                            {formik.touched.LocationID &&
                            formik.errors.LocationID ? (
                              <div className="text-danger">
                                {formik.errors.LocationID}
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        <Col xxl={2} md={3}>
                          <div>
                            <Label htmlFor="Strength" className="form-label">
                              Default Strength
                            </Label>
                            <Input
                              type="number"
                              className="form-control-sm"
                              id="Strength"
                              placeholder="Strength "
                              {...formik.getFieldProps("Strength")}
                            />
                            {formik.touched.Strength &&
                            formik.errors.Strength ? (
                              <div className="text-danger">
                                {formik.errors.Strength}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2} className="mt-4">
                          <div
                            className="form-check form-switch mt-3 "
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
                            <th className="" data-sort="titleUrdu">
                              Title-Urdu
                            </th>
                            <th className="" data-sort="sorting">
                              Sorting
                            </th>
                            <th className="" data-sort="deptGroup">
                              Dept-Group
                            </th>
                            <th className="" data-sort="location">
                              Location
                            </th>
                            <th className="" data-sort="Strength">
                              Strength
                            </th>
                            <th className="" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {department?.data?.length > 0 ? (
                            department.data.map((group, index) => (
                              <tr key={group.VID}>
                                <td>{group.VCode}</td>
                                <td>{group.VName}</td>
                                <td>{group.VNameUrdu}</td>
                                <td>{group.SortOrder}</td>
                                <td>
                                  {departmentGroup?.data?.find(
                                    (groupItem) =>
                                      groupItem.VID === group.GroupID
                                  )?.VName || ""}
                                </td>
                                <td>
                                  {location?.find(
                                    (groupItem) =>
                                      groupItem.VID === group.LocationID
                                  )?.VName || ""}
                                </td>
                                <td>{group.Strength}</td>
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
                                No department found.
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

export default Department;
