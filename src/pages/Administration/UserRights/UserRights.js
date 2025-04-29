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
import {
  getUser,
} from "../../../slices/administration/userManagement/thunk";
import {
  getSecUserRole,
  submitSecUserRole,
  deleteSecUserRole,
} from "../../../slices/administration/secUserRole/thunk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../../Components/Common/DeleteModal";

const UserRights = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null); // This is UserID
  const [checkedRoles, setCheckedRoles] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const { loading, error, role } = useSelector((state) => state.Role);
  const { users = [] } = useSelector((state) => state.User || {});
  const { roleRight } = useSelector((state) => state.RoleRight);
  const { pagePermission } = useSelector((state) => state.PagePermission);
  const { secUserRole } = useSelector((state) => state.SecUserRole || {});

  const permissionTypes = ['view', 'insert', 'update', 'delete', 'backdate', 'print'];
  const [permissions, setPermissions] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      await dispatch(getRole());
      await dispatch(getUser());
      await dispatch(getRoleRight());
      await dispatch(getSecUserRole());
    };
    fetchInitialData();
  }, [dispatch]);

  // Set default user and fetch permissions when data is loaded
  useEffect(() => {
    if (isInitialLoad && users.length > 0) {
      const firstUserId = users[0].UserID;
      setSelectedRoleId(firstUserId);
      dispatch(getPagePermission(firstUserId));
      setIsInitialLoad(false);
    }
  }, [users, dispatch, isInitialLoad]);

  // Fetch permissions when selectedRoleId changes
  useEffect(() => {
    if (selectedRoleId && !isInitialLoad) {
      dispatch(getPagePermission(selectedRoleId));
    }
  }, [selectedRoleId, dispatch, isInitialLoad]);

  // Initialize checkedRoles based on selected user and secUserRole
  useEffect(() => {
    if (role.length > 0 && secUserRole?.length > 0 && selectedRoleId) {
      const initialCheckedRoles = role.reduce((acc, r) => {
        const isRoleAssigned = secUserRole.some(
          (userRole) =>
            String(userRole.UserID) === String(selectedRoleId) &&
            String(userRole.RoleID) === String(r.VID)
        );
        acc[r.VID] = isRoleAssigned;
        return acc;
      }, {});
      setCheckedRoles(initialCheckedRoles);
    } else if (role.length > 0) {
      const initialCheckedRoles = role.reduce((acc, r) => {
        acc[r.VID] = false;
        return acc;
      }, {});
      setCheckedRoles(initialCheckedRoles);
    }
  }, [role, secUserRole, selectedRoleId]);

  // Update permissions based on selected user and their roles
  useEffect(() => {
    if (selectedRoleId && roleRight?.length > 0 && pagePermission?.length > 0 && secUserRole?.length > 0) {
      const userRoles = secUserRole
        .filter((ur) => String(ur.UserID) === String(selectedRoleId))
        .map((ur) => String(ur.RoleID));

      const rolePermissions = {};

      roleRight.forEach((page) => {
        const pageId = page.VID;
        const pagePerms = { view: false, insert: false, update: false, delete: false, backdate: false, print: false };

        userRoles.forEach((roleId) => {
          const matchingPerm = pagePermission.find(
            (perm) => String(perm.PageID) === String(pageId) && String(perm.RoleID) === String(roleId)
          );
          if (matchingPerm) {
            pagePerms.view = pagePerms.view || matchingPerm.IsView === 1;
            pagePerms.insert = pagePerms.insert || matchingPerm.IsInsert === 1;
            pagePerms.update = pagePerms.update || matchingPerm.IsUpdate === 1;
            pagePerms.delete = pagePerms.delete || matchingPerm.IsDelete === 1;
            pagePerms.backdate = pagePerms.backdate || matchingPerm.IsBackdate === 1;
            pagePerms.print = pagePerms.print || matchingPerm.IsPrint === 1;
          }
        });

        rolePermissions[pageId] = pagePerms;
      });

      setPermissions(rolePermissions);
    } else {
      setPermissions({});
    }
  }, [selectedRoleId, roleRight, pagePermission, secUserRole]);

  const handleRoleSelect = (e) => {
    const newRoleId = e.target.value;
    setSelectedRoleId(newRoleId);
  };

  const handleCheckboxChange = async (roleId) => {
    const isChecked = !checkedRoles[roleId];
    setCheckedRoles((prev) => ({
      ...prev,
      [roleId]: isChecked,
    }));

    try {
      if (isChecked) {
        const userRoleData = {
          UserID: parseInt(selectedRoleId),
          RoleID: parseInt(roleId),
          IsActive: 1,
          UID: "1",
          CompanyID: "1",
        };
        await dispatch(submitSecUserRole(userRoleData)).unwrap();
        toast.success("Role assigned successfully!");
      } else {
        const userRole = secUserRole.find(
          (ur) =>
            String(ur.UserID) === String(selectedRoleId) &&
            String(ur.RoleID) === String(roleId)
        );
        if (userRole) {
          await dispatch(deleteSecUserRole(userRole.VID)).unwrap();
          toast.success("Role removed successfully!");
        }
      }
      dispatch(getSecUserRole());
    } catch (error) {
      console.error("Failed to update role assignment:", error);
      toast.error("Failed to update role. Please try again!");
      setCheckedRoles((prev) => ({
        ...prev,
        [roleId]: !isChecked,
      }));
    }
  };

  const handlePermissionChange = (pageId, permission) => {
    setPermissions((prev) => {
      const updatedPermissions = { ...prev };
      const pagePermissions = updatedPermissions[pageId] || {};

      if (permission === 'view') {
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
    if (!selectedRoleId) {
      toast.error("Please select a user first");
      return;
    }

    setIsSaving(true);
    try {
      const userRoles = secUserRole
        .filter((ur) => String(ur.UserID) === String(selectedRoleId))
        .map((ur) => String(ur.RoleID));

      if (userRoles.length === 0) {
        toast.error("No roles assigned to this user");
        return;
      }

      const permissionsToSave = [];
      Object.keys(permissions).forEach((pageId) => {
        const perm = permissions[pageId];
        userRoles.forEach((roleId) => {
          const existingPerm = pagePermission.find(
            (p) => String(p.PageID) === String(pageId) && String(p.RoleID) === String(roleId)
          );

          permissionsToSave.push({
            VID: existingPerm?.VID || 0,
            RoleID: parseInt(roleId),
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
          });
        });
      });

      const changedPermissions = permissionsToSave.filter((perm) => {
        const existing = pagePermission.find(
          (p) => String(p.PageID) === String(perm.PageID) && String(p.RoleID) === String(perm.RoleID)
        );
        if (!existing) return true;
        return (
          existing.IsView !== perm.IsView ||
          existing.IsInsert !== perm.IsInsert ||
          existing.IsUpdate !== perm.IsUpdate ||
          existing.IsDelete !== perm.IsDelete ||
          existing.IsBackdate !== perm.IsBackdate ||
          existing.IsPrint !== perm.IsPrint
        );
      });

      if (changedPermissions.length === 0) {
        toast.info("No changes to save");
        return;
      }

      const updatePromises = changedPermissions.map((perm) => dispatch(updatePagePermission(perm)).unwrap());
      await Promise.all(updatePromises);

      dispatch(getPagePermission(selectedRoleId));
      toast.success(`${changedPermissions.length} permission(s) updated successfully!`);

      if (props.onCancel) props.onCancel();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(error.message || "Failed to save permissions. Please try again!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await dispatch(deleteSecUserRole(deleteId)).unwrap();
        toast.success("User role deleted successfully!");
        dispatch(getSecUserRole());
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete user role. Please try again!");
      }
    }
    setDeleteModal(false);
    setDeleteId(null);
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

  const filteredRoleRight = roleRight.filter((page) =>
    ["MFileChangePassword", "MSetupSP1", "MSetupLocation"].includes(page.VName)
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <ToastContainer />
          <form onSubmit={handleSave}>
            <Row className="mb-3">
              <Col md={3}>
                <Label htmlFor="roleSelect" className="form-label">
                  Select User
                </Label>
                <Input
                  type="select"
                  className="form-select form-select-sm"
                  id="roleSelect"
                  value={selectedRoleId || ""}
                  onChange={handleRoleSelect}
                  disabled={users.length === 0}
                >
                  {users.length === 0 ? (
                    <option value="">Loading users...</option>
                  ) : (
                    users.map((u) => (
                      <option key={u.UserID} value={u.UserID}>
                        {u.Userfullname}
                      </option>
                    ))
                  )}
                </Input>
              </Col>
            </Row>

            <Row>
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
                          {role.length > 0 ? (
                            role.map((r) => (
                              <tr key={r.VID}>
                                <td>
                                  <Button
                                    color={checkedRoles[r.VID] ? "primary" : "light"}
                                    className="w-100 text-start"
                                    onClick={() => handleCheckboxChange(r.VID)}
                                    disabled={!selectedRoleId}
                                  >
                                    {r.VName}
                                  </Button>
                                </td>
                                <td className="text-center">
                                  <Input
                                    type="checkbox"
                                    checked={checkedRoles[r.VID] || false}
                                    onChange={() => handleCheckboxChange(r.VID)}
                                    disabled={!selectedRoleId}
                                  />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={2} className="text-center">
                                {loading ? "Loading roles..." : "No roles available"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col md={8} lg={9}>
                <Card>
                  <PreviewCardHeader
                    title="User Rights"
                    onCancel={props.onCancel}
                  />
                </Card>

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
                                      disabled={!selectedRoleId || isSaving}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center">
                                {loading ? "Loading menu items..." : "No menu items available"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

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
                                      disabled={!selectedRoleId || isSaving}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center">
                                {loading ? "Loading filtered menu items..." : "No filtered menu items available"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

                <div className="text-end mb-3">
                  <Button 
                    type="submit" 
                    color="primary" 
                    disabled={isSaving || !selectedRoleId}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Saving...
                      </>
                    ) : (
                      "Save Permissions"
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </form>
        </Container>
      </div>
      <DeleteModal
        show={deleteModal}
        onCloseClick={() => setDeleteModal(false)}
        onDeleteClick={handleDeleteConfirm}
      />
    </React.Fragment>
  );
});

export default UserRights;