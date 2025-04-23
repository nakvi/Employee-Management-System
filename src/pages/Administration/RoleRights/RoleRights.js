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

  useEffect(() => {
    dispatch(getRole());
    dispatch(getRoleRight());
    dispatch(getPagePermission());
  }, [dispatch]);

  useEffect(() => {
    if (role.length > 0 && !selectedRoleId) {
      setSelectedRoleId(role[0].VID);
    }
  }, [role]);

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
