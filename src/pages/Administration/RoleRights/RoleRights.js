import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
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
  createPagePermission,
  updatePagePermission,
} from "../../../slices/administration/pagePermission/thunk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RoleRights = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const { loading, error, role } = useSelector((state) => state.Role);
  const { roleRight } = useSelector((state) => state.RoleRight);
  const { pagePermission } = useSelector((state) => state.PagePermission);

  const permissionTypes = ["view", "insert", "update", "delete", "backdate", "print"];
  const [permissions, setPermissions] = useState({});

  // Fetch roles and role rights on mount
  useEffect(() => {
    dispatch(getRole());
    dispatch(getRoleRight());
  }, [dispatch]);

  // Set the first role as default
  useEffect(() => {
    if (role.length > 0 && !selectedRoleId) {
      setSelectedRoleId(role[0].VID);
    }
  }, [role]);

  // Fetch permissions whenever the selected role changes
  useEffect(() => {
    if (selectedRoleId) {
      dispatch(getPagePermission(selectedRoleId));
    }
  }, [dispatch, selectedRoleId]);

  // Update permissions state based on fetched data
  useEffect(() => {
    console.log("pagePermission:", pagePermission);
    const permissionData = pagePermission?.data || [];
    if (selectedRoleId && roleRight?.length > 0 && Array.isArray(permissionData)) {
      const rolePermissions = {};
      roleRight.forEach((page) => {
        const pageId = page.VID;
        // Ensure type consistency by converting to numbers
        const matchingPerm = permissionData.find(
          (perm) =>
            Number(perm.PageID) === Number(pageId) &&
            Number(perm.RoleID) === Number(selectedRoleId)
        );
        rolePermissions[pageId] = {
          view: matchingPerm?.IsView === 1 || false,
          insert: matchingPerm?.IsInsert === 1 || false,
          update: matchingPerm?.IsUpdate === 1 || false,
          delete: matchingPerm?.IsDelete === 1 || false,
          backdate: matchingPerm?.IsBackdate === 1 || false,
          print: matchingPerm?.IsPrint === 1 || false,
        };
      });
      console.log("Updated permissions state after role change:", rolePermissions);
      setPermissions(rolePermissions);
    } else {
      // Initialize permissions for all pages as unchecked if no data exists
      const rolePermissions = {};
      if (roleRight?.length > 0) {
        roleRight.forEach((page) => {
          rolePermissions[page.VID] = {
            view: false,
            insert: false,
            update: false,
            delete: false,
            backdate: false,
            print: false,
          };
        });
      }
      console.log("Initialized permissions state (no data):", rolePermissions);
      setPermissions(rolePermissions);
    }
  }, [selectedRoleId, roleRight, pagePermission]);

  const handleRoleSelect = (e) => {
    setSelectedRoleId(e.target.value);
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
      console.log("Permissions after change:", updatedPermissions);
      return updatedPermissions;
    });
  };

  const handleSave = async (event) => {
    event?.preventDefault();
    try {
      console.log("pagePermission in handleSave:", pagePermission);
      const permissionData = pagePermission?.data || [];
      if (!Array.isArray(permissionData)) {
        console.warn("permissionData is not an array:", permissionData);
        toast.warn("Permission data is invalid. Saving with default IDs.");
      }

      const permissionsToSave = Object.keys(permissions).map((pageId) => {
        const perm = permissions[pageId];
        const existingPerm = Array.isArray(permissionData)
          ? permissionData.find(
              (p) =>
                Number(p.PageID) === Number(pageId) &&
                Number(p.RoleID) === Number(selectedRoleId)
            )
          : null;
        return {
          id: existingPerm?.VID || 0, // Rename VID to id to match backend expectation
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

      console.log("permissionsToSave:", permissionsToSave);

      const savePromises = permissionsToSave.map(async (perm) => {
        try {
          const action = perm.id === 0 ? createPagePermission : updatePagePermission;
          const payload = { ...perm };
          if (perm.id === 0) {
            delete payload.id;
          }
          const result = await dispatch(action(payload)).unwrap();
          return { success: true, pageId: perm.PageID, result };
        } catch (error) {
          console.error("Failed to save permission for PageID", perm.PageID, ":", error);
          return { success: false, pageId: perm.PageID, error };
        }
      });

      const results = await Promise.all(savePromises);
      const failedSaves = results.filter((r) => !r.success);
      if (failedSaves.length > 0) {
        toast.error(`Failed to save permissions for ${failedSaves.length} pages.`);
      } else {
        toast.success("All permissions saved successfully!");
      }

      // Refetch permissions for the selected role after saving
      await dispatch(getPagePermission(selectedRoleId));
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save permissions. Please try again!");
    }
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

  document.title = "Roles with Permissions | EMS";

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <ToastContainer />
          <form onSubmit={handleSave}>
            <Row>
              <Col lg={12}>
                <Card>
                  <PreviewCardHeader title="Roles with Permissions" onCancel={props.onCancel} />
                  <CardBody>
                    <FormGroup className="mb-5 col-3">
                      <Label for="roleSelect">Role</Label>
                      <Input
                        type="select"
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
                    </FormGroup>
                    {Object.keys(permissions).length === 0 && selectedRoleId && (
                      <div className="text-center mb-3">No permissions found for this role.</div>
                    )}
                    <div className="table-responsive table-card mb-1">
                      <table className="table align-middle table-nowrap table-striped table-sm">
                        <thead className="table-light">
                          <tr>
                            <th>Menu</th>
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
              </Col>
            </Row>
          </form>
        </Container>
      </div>
    </React.Fragment>
  );
});

export default RoleRights;