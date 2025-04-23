import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  getRoleRight,
} from "../../../slices/administration/rolesRight/thunk";
import {
  getRole,
} from "../../../slices/administration/roles/thunk";
import {
  getPagePermission,
  updatePagePermission,
} from "../../../slices/administration/pagePermission/thunk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../../Components/Common/DeleteModal";

const UserRights = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [checkedRoles, setCheckedRoles] = useState({});
  const { loading, error, role } = useSelector((state) => state.Role);
  const { roleRight } = useSelector((state) => state.RoleRight);
  const { pagePermission } = useSelector((state) => state.PagePermission);

  const permissionTypes = ["view", "insert", "update", "delete", "backdate", "print"];
  const [permissions, setPermissions] = useState({});

  // Fetch roles, role rights, and page permissions
  useEffect(() => {
    dispatch(getRole());
    dispatch(getRoleRight());
    dispatch(getPagePermission());
  }, [dispatch]);

  // Set default role
  useEffect(() => {
    if (role.length > 0 && !selectedRoleId) {
      setSelectedRoleId(role[0].VID);
    }
  }, [role]);

  // Initialize checkedRoles based on roles
  useEffect(() => {
    if (role.length > 0) {
      const initialCheckedRoles = role.reduce((acc, r) => {
        acc[r.VID] = r.VName === "ADMIN"; // Default ADMIN as checked
        return acc;
      }, {});
      setCheckedRoles(initialCheckedRoles);
    }
  }, [role]);

  // Update permissions based on selected role
  useEffect(() => {
    if (selectedRoleId && roleRight?.length > 0 && pagePermission?.length > 0) {
      const rolePermissions = {};

      roleRight.forEach((page) => {
        const pageId = page.VID;
        const matchingPerm = pagePermission.find(
          (perm) =>
            String(perm.PageID) === String(pageId) &&
            String(perm.RoleID) === String(selectedRoleId)
        );

        rolePermissions[pageId] = {
          view: matchingPerm?.IsView === 1,
          insert: matchingPerm?.IsInsert === 1,
          update: matchingPerm?.IsUpdate === 1,
          delete: matchingPerm?.IsDelete === 1,
          backdate: matchingPerm?.IsBackdate === 1,
          print: matchingPerm?.IsPrint === 1,
        };
      });

      setPermissions(rolePermissions);
    } else {
      setPermissions({});
    }
  }, [selectedRoleId, roleRight, pagePermission]);

  const handleRoleSelect = (e) => {
    setSelectedRoleId(e.target.value);
  };

  const handleCheckboxChange = (roleId) => {
    setCheckedRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  const handlePermissionChange = (pageId, permission) => {
    setPermissions((prev) => {
      const updatedPermissions = { ...prev };
      const pagePermissions = updatedPermissions[pageId] || {};

      if (permission === "view") {
        const newValue = !pagePermissions.view;
        updatedPermissions[pageId] = {
          view: newValue,
          insert: newValue,
          update: newValue,
          delete: newValue,
          backdate: newValue,
          print: newValue,
        };
      } else {
        updatedPermissions[pageId] = {
          ...pagePermissions,
          [permission]: !pagePermissions[permission],
        };
      }

      return updatedPermissions;
    });
  };

  const handleSave = async (event) => {
    event?.preventDefault();
    try {
      const permissionsToSave = Object.keys(permissions).map((pageId) => {
        const perm = permissions[pageId];
        return {
          VID: Array.isArray(pagePermission)
            ? pagePermission.find(
                (p) =>
                  String(p.PageID) === String(pageId) &&
                  String(p.RoleID) === String(selectedRoleId)
              )?.VID || 0
            : 0,
          RoleID: parseInt(selectedRoleId),
          PageID: parseInt(pageId),
          IsView: perm.view ? 1 : 0,
          IsInsert: perm.insert ? 1 : 0,
          IsUpdate: perm.update ? 1 : 0,
          IsDelete: perm.delete ? 1 : 0,
          IsBackdate: perm.backdate ? 1 : 0,
          IsPrint: perm.print ? 1 : 0,
          IsActive: 1,
          UID: "1",
          CompanyID: "1",
        };
      });

      const updatePromises = permissionsToSave.map((perm) =>
        dispatch(updatePagePermission(perm)).unwrap()
      );
      await Promise.all(updatePromises);

      dispatch(getPagePermission());
      toast.success("All permissions saved successfully!");

      if (props.onCancel) props.onCancel();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save permissions. Please try again!");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      // Implement delete logic if needed
      // dispatch(deleteUserRights(deleteId));
    }
    setDeleteModal(false);
  };

  useImperativeHandle(ref, () => ({
    handleSave,
    toggle: () => {
      if (props.onCancel) props.onCancel();
    },
  }));

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  document.title = "User Rights | EMS";

  // Filter pages for the second table (example logic, adjust as needed)
  const filteredRoleRight = roleRight.filter((page) =>
    ["MFileChangePassword", "MSetupSP1", "MSetupLocation"].includes(page.VName)
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <ToastContainer />
          <form onSubmit={handleSave}>
            {/* Role Select Box */}
            <Row className="mb-3">
              <Col md={3}>
                <Label htmlFor="roleSelect" className="form-label">
                  Select User
                </Label>
                <Input
                  type="select"
                  className="form-select form-select-sm"
                  id="roleSelect"
                  value={selectedRoleId}
                  onChange={handleRoleSelect}
                >
                  {role.map((r) => (
                    <option key={r.VID} value={r.VID}>
                      {r.VName}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>

            <Row>
              {/* Left Sidebar for Roles with Table Structure */}
              <Col md={4} lg={3}>
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Roles Name</th>
                            <th>Select</th>
                          </tr>
                        </thead>
                        <tbody>
                          {role.map((r) => (
                            <tr key={r.VID}>
                              <td>
                                <Button
                                  color={selectedRoleId === r.VID ? "primary" : "light"}
                                  className="w-100 text-start"
                                  onClick={() => setSelectedRoleId(r.VID)}
                                >
                                  {r.VName}
                                </Button>
                              </td>
                              <td className="text-center">
                                <Input
                                  type="checkbox"
                                  checked={checkedRoles[r.VID] || false}
                                  onChange={() => handleCheckboxChange(r.VID)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {/* Right Section */}
              <Col md={8} lg={9}>
                {/* Top Portion: Role Selection Form */}
                <Card>
                  <PreviewCardHeader
                    title="User Rights"
                    onCancel={props.onCancel}
                  />
                </Card>

                {/* First Table: Permissions for Selected Role */}
                <Card>
                  <CardBody>
                    <div className="table-responsive table-card mb-1">
                      <table className="table align-middle table-nowrap table-striped table-sm">
                        <thead className="table-light">
                          <tr>
                            <th>Page Name</th>
                            {permissionTypes.map((perm) => (
                              <th key={perm}>{perm.charAt(0).toUpperCase() + perm.slice(1)}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {roleRight?.length > 0 ? (
                            Array.from(new Map(roleRight.map((item) => [item.VID, item])).values()).map((page) => (
                              <tr key={page.VID}>
                                <td>{page.VName || `Page ${page.VID}`}</td>
                                {permissionTypes.map((perm) => (
                                  <td key={perm}>
                                    <Input
                                      type="checkbox"
                                      checked={permissions[page.VID]?.[perm] || false}
                                      onChange={() => handlePermissionChange(page.VID, perm)}
                                      disabled={!selectedRoleId}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center">
                                No menu items available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

                {/* Second Table: Filtered Permissions */}
                <Card>
                  <CardBody>
                    <div className="table-responsive table-card mb-1">
                      <table className="table align-middle table-nowrap table-sm">
                        <thead className="table-light">
                          <tr>
                            <th>Page Name</th>
                            {permissionTypes.map((perm) => (
                              <th key={perm}>{perm.charAt(0).toUpperCase() + perm.slice(1)}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRoleRight?.length > 0 ? (
                            filteredRoleRight.map((page) => (
                              <tr key={page.VID}>
                                <td>{page.VName || `Page ${page.VID}`}</td>
                                {permissionTypes.map((perm) => (
                                  <td key={perm}>
                                    <Input
                                      type="checkbox"
                                      checked={permissions[page.VID]?.[perm] || false}
                                      onChange={() => handlePermissionChange(page.VID, perm)}
                                      disabled={!selectedRoleId}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center">
                                No filtered menu items available
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
          </form>
        </Container>
      </div>
      <DeleteModal
        show={deleteModal}
        onCloseClick={() => setDeleteModal(!deleteModal)}
        onDeleteClick={handleDeleteConfirm}
      />
    </React.Fragment>
  );
});

export default UserRights;