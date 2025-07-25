
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import avatar1 from "../../assets/images/users/avatar-1.jpg";

const ProfileDropdown = () => {
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const [userName, setUserName] = useState("Unknown User");
  const [locationName, setLocationName] = useState("Unknown Location");

  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const authUser = JSON.parse(sessionStorage.getItem("authUser"));
      const userData = authUser?.data || {};
      setUserName(userData.Userfullname || "Unknown User");
      setLocationName(userData.LocationName || "Unknown Location");
    }
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  return (
    <React.Fragment>
      <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img className="rounded-circle header-profile-user" src={avatar1} alt="Header Avatar" />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{userName}</span>
              {/* <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{locationName}</span> */}
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Location: {locationName}!</h6>
          <DropdownItem className="p-0">
            <Link to="/profile" className="dropdown-item">
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Profile</span>
            </Link>
          </DropdownItem>
          <DropdownItem className="p-0">
            <Link to="/pages-profile-settings" className="dropdown-item">
              <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Settings</span>
            </Link>
          </DropdownItem>
          <DropdownItem className="p-0">
            <Link to="/logout" className="dropdown-item">
              <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle" data-key="t-logout">Logout</span>
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
