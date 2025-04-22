import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row, Input, Label, FormGroup } from "reactstrap";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";

// Dummy data for roles and sidebar menus
const initialRoles = [
  {
    id: 1,
    name: "Admin",
    permissions: {
      dashboard: { add: true, edit: true, delete: false },
      users: { add: true, edit: true, delete: false },
    },
  },
  {
    id: 2,
    name: "User",
    permissions: {
      dashboard: { add: false, edit: true, delete: false },
      users: { add: false, edit: false, delete: false },
    },
  },
  {
    id: 3,
    name: "Guest",
    permissions: {
      dashboard: { add: false, edit: false, delete: false },
      users: { add: false, edit: false, delete: false },
    },
  },
];

const sidebarMenus = ["Dashboard", "Users"];

const RoleRights = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState(initialRoles[0]);
  const [selectAll, setSelectAll] = useState(
    sidebarMenus.every((menu) =>
      Object.values(initialRoles[0].permissions[menu.toLowerCase()]).every(Boolean)
    )
  );

  // Handle role selection
  const handleRoleSelect = (event) => {
    const roleId = parseInt(event.target.value);
    const role = roles.find((r) => r.id === roleId);
    setSelectedRole(role);
    setSelectAll(
      sidebarMenus.every((menu) =>
        Object.values(role.permissions[menu.toLowerCase()]).every(Boolean)
      )
    );
  };

  // Toggle individual permission
  const handlePermissionChange = (menu, permission) => {
    const updatedRoles = roles.map((role) =>
      role.id === selectedRole.id
        ? {
            ...role,
            permissions: {
              ...role.permissions,
              [menu]: {
                ...role.permissions[menu],
                [permission]: !role.permissions[menu][permission],
              },
            },
          }
        : role
    );
    setRoles(updatedRoles);
    const updatedRole = updatedRoles.find((role) => role.id === selectedRole.id);
    setSelectedRole(updatedRole);
    setSelectAll(
      sidebarMenus.every((m) =>
        Object.values(updatedRole.permissions[m.toLowerCase()]).every(Boolean)
      )
    );
  };

  // Toggle all permissions for a specific menu
  const handleSelectAllForMenu = (menu) => {
    const allChecked = Object.values(selectedRole.permissions[menu]).every(Boolean);
    const updatedRoles = roles.map((role) =>
      role.id === selectedRole.id
        ? {
            ...role,
            permissions: {
              ...role.permissions,
              [menu]: {
                add: !allChecked,
                edit: !allChecked,
                delete: !allChecked,
              },
            },
          }
        : role
    );
    setRoles(updatedRoles);
    const updatedRole = updatedRoles.find((role) => role.id === selectedRole.id);
    setSelectedRole(updatedRole);
    setSelectAll(
      sidebarMenus.every((m) =>
        Object.values(updatedRole.permissions[m.toLowerCase()]).every(Boolean)
      )
    );
  };

  // Toggle all permissions for all menus
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedRoles = roles.map((role) =>
      role.id === selectedRole.id
        ? {
            ...role,
            permissions: sidebarMenus.reduce(
              (acc, menu) => ({
                ...acc,
                [menu.toLowerCase()]: {
                  add: newSelectAll,
                  edit: newSelectAll,
                  delete: newSelectAll,
                },
              }),
              {}
            ),
          }
        : role
    );
    setRoles(updatedRoles);
    const updatedRole = updatedRoles.find((role) => role.id === selectedRole.id);
    setSelectedRole(updatedRole);
  };

  document.title = "Roles with Permissions | EMS";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <PreviewCardHeader title="Roles with Permissions" />
                <CardBody className="card-body">
                  <FormGroup className="mb-5 col-3">
                    <Label for="roleSelect">Select Role</Label>
                    <Input
                      type="select"
                      id="roleSelect"
                      value={selectedRole.id}
                      onChange={handleRoleSelect}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                  <div className="table-responsive table-card mb-1">
                    <table
                      className="table align-middle table-nowrap table-striped table-sm"
                      id="rolePermissionsTable"
                    >
                      <thead className="table-light">
                        <tr>
                          <th>Menu</th>
                          <th>Add</th>
                          <th>Edit</th>
                          <th>Delete</th>
                          <th>
                            <div className="form-check" dir="ltr">
                              <Input
                                type="checkbox"
                                className="form-check-input"
                                id="selectAllPermissions"
                                checked={selectAll}
                                onChange={handleSelectAll}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="selectAllPermissions"
                                style={{ marginLeft: "8px" }}
                              >
                                Select All
                              </Label>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="list form-check-all">
                        {sidebarMenus.map((menu) => (
                          <tr key={menu}>
                            <td>{menu}</td>
                            <td>
                              <Input
                                type="checkbox"
                                checked={selectedRole.permissions[menu.toLowerCase()].add}
                                onChange={() =>
                                  handlePermissionChange(menu.toLowerCase(), "add")
                                }
                              />
                            </td>
                            <td>
                              <Input
                                type="checkbox"
                                checked={selectedRole.permissions[menu.toLowerCase()].edit}
                                onChange={() =>
                                  handlePermissionChange(menu.toLowerCase(), "edit")
                                }
                              />
                            </td>
                            <td>
                              <Input
                                type="checkbox"
                                checked={selectedRole.permissions[menu.toLowerCase()].delete}
                                onChange={() =>
                                  handlePermissionChange(menu.toLowerCase(), "delete")
                                }
                              />
                            </td>
                            <td>
                              <div className="form-check" dir="ltr">
                                <Input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={Object.values(
                                    selectedRole.permissions[menu.toLowerCase()]
                                  ).every(Boolean)}
                                  onChange={() =>
                                    handleSelectAllForMenu(menu.toLowerCase())
                                  }
                                />
                                <Label
                                  className="form-check-label"
                                  style={{ marginLeft: "8px" }}
                                >
                                  Select All
                                </Label>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default RoleRights;