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
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { deleteRamazan, getRamazan, submitRamazan, updateRamazan } from "../../../slices/thunks";

const Ramazan = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Redux state
  const { loading, error, ramazan } = useSelector(
    (state) => state.Ramazan
  );

  // Fetch data on mount
  useEffect(() => {
    dispatch(getRamazan());
  }, [dispatch]);

  // Filtered DataTable data
  useEffect(() => {
    if (ramazan) {
      const filtered = ramazan.filter((item) =>
        [
          item.VName,
          formatDate(item.DateFrom),
          formatDate(item.DateTo),
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, ramazan]);

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
      const transformedValues = {
        ...values,
        IsActive: values.IsActive ? 1 : 0,
      };
      if (editingGroup) {
        dispatch(
          updateRamazan({ ...transformedValues, VID: editingGroup.VID })
        );
        setEditingGroup(null);
      } else {
        dispatch(submitRamazan(transformedValues));
      }
      formik.resetForm();
    },
  });

  const handleEditClick = (group) => {
    setEditingGroup(group);
    const formatDateForInput = (dateString) => {
      return dateString ? dateString.split("T")[0] : "";
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

  // Format date for display
  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "";
  };

  const isEditMode = editingGroup !== null;
  const handleCancel = () => {
    formik.resetForm();
    setEditingGroup(null);
  };

  // DataTable columns
  const columns = [
    { name: "Title", selector: (row) => row.VName, sortable: true },
    { name: "Date From", selector: (row) => formatDate(row.DateFrom), sortable: true },
    { name: "To", selector: (row) => formatDate(row.DateTo), sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button
            className="btn btn-soft-info btn-sm"
            onClick={() => handleEditClick(row)}
          >
            <i className="bx bx-edit"></i>
          </Button>
          <Button
            className="btn btn-soft-danger btn-sm"
            onClick={() => handleDeleteClick(row.VID)}
          >
            <i className="ri-delete-bin-2-line"></i>
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customStyles = {
    table: {
      style: {
        border: '1px solid #dee2e6',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        fontWeight: '600',
      },
    },
    rows: {
      style: {
        minHeight: '48px',
        borderBottom: '1px solid #dee2e6',
      },
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
        borderRight: '1px solid #dee2e6',
      },
    },
  };

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
                  <PreviewCardHeader
                    title={isEditMode ? "Edit Ramazan Date" : "Add Ramazan Date"}
                    onCancel={handleCancel}
                    isEditMode={isEditMode}
                  />
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
                              {...formik.getFieldProps("DateTo")}
                            />
                            {formik.touched.DateTo && formik.errors.DateTo ? (
                              <div className="text-danger">
                                {formik.errors.DateTo}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xxl={2} md={2} className="mt-4">
                          <div className="form-check form-switch mt-3" dir="ltr">
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
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                    <div></div>
                    <div>
                      <input
                        type="text"
                        placeholder="Search"
                        className="form-control form-control-sm"
                        style={{ width: '200px' }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                  <DataTable
                    title="Ramazan Dates"
                    columns={columns}
                    data={filteredData}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={100}
                    paginationRowsPerPageOptions={[100, 200, 500]}
                    highlightOnHover
                    responsive
                  />
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