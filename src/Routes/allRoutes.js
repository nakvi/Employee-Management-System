import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardCrm from "../pages/DashboardCrm";
import DashboardEcommerce from "../pages/DashboardEcommerce";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";
import DashboardBlog from "../pages/DashboardBlog";
// My setup form
import Location from "../pages/Setup/Location/Location";
import DepartmentGroup from "../pages/Setup/DepartmentGroup/DepartmentGroup";
import Company from "../pages/Setup/Company/Company";
import Department from "../pages/Setup/Department/Department";
import Designation from "../pages/Setup/Designation/Designation";
import Grade from "../pages/Setup/Grade/Grade";
import Shift from "../pages/Setup/Shift/Shift";
import Ramazan from "../pages/Setup/Ramazan/Ramazan";
import LeaveBalance from "../pages/Setup/LeaveBalance/LeaveBalance";
import SalaryBank from "../pages/Setup/SalaryBank/SalaryBank";
import AttendanceCode from "../pages/Setup/AttendanceCode/AttendanceCode";
import Holiday from "../pages/Setup/Holiday/Holiday";
import AllowanceDeductionTypes from "../pages/Setup/AllowanceDeductionTypes/AllowanceDeductionTypes";
import Leave from "../pages/Attendance/Leaves/Leaves";
import LoanDisbursement from "../pages/Employee/LoanDisbursement/LoanDisbursement";
import AllowanceDeduction from "../pages/Employee/AllowanceDeduction/AllowanceDeduction";
import LocalSale from "../pages/Employee/LocalSale/LocalSale";
import Advance from "../pages/Employee/Advance/Advance";
import EmployeeTransfer from "../pages/Employee/EmployeeTransfer/EmployeeTransfer";
import PaymentPlan from "../pages/Employee/PaymentPlan/PaymentPlan";
import Employee from "../pages/Employee/Employee/Employee";
import Increment from "../pages/Employee/Increment/Increment";
import AttendanceEntry from "../pages/Attendance/AttendanceEntry/AttendanceEntry";
import ChangeAttendance from "../pages/Attendance/ChangeAttendance/ChangeAttendance";
import AttendanceEmployee from "../pages/Attendance/AttendanceEmployee/AttendanceEmployee";
import OTEntry from "../pages/Attendance/OTEntry/OTEntry";
import DailyAttendanceReport from "../pages/Reports/DailyAttendanceReport/DailyAttendanceReport";
import MonthlyAttendanceReport from "../pages/Reports/MonthlyAttendanceReport/MonthlyAttendanceReport";
import SalaryReport from "../pages/Reports/SalaryReport/SalaryReport";
import EmployeeReport from "../pages/Employee/Reports/EmployeeReport";
import DailyAttendancePosting from "../pages/Posting/DailyAttendance/DailyAttendance";
import EmployeeLetter from "../pages/Employee/Letters/EmployeeLetter";
import Roster from "../pages/Attendance/Roster/Roster";
import SalaryPosting from "../pages/Posting/SalaryPosting/SalaryPosting";
import Summaries from "../pages/Reports/Summaries/Summaries";
import DeductionReport from "../pages/Reports/DeductionReport/DeductionReport";
import Gratuity from "../pages/Employee/Gratuity/Gratuity";
import TrialEmployee from "../pages/Employee/TrialEmployee/TrialEmployee";
import BackdateEntry from "../pages/Attendance/BackdateEntry/BackdateEntry";
import RoleManagement from "../pages/Administration/RoleManagement/RoleManagement";
import RoleRights from "../pages/Administration/RoleRights/RoleRights";
import UserManagement from "../pages/Administration/UserManagement/UserManagement";
import UserRights from "../pages/Administration/UserRights/UserRights";
import PermissionManagement from "../pages/Administration/Permissions/PermissionManagement";
import OTMonthly from "../pages/Attendance/OTMonthly/OTMonthly";
import SpecialLeaveEntry from "../pages/Attendance/SpecialLeaveEntry/SpecialLeaveEntry";
import LeaveEntryDepartment from "../pages/Attendance/LeaveEntryDepartment/LeaveEntryDepartment";
import OTDaily from "../pages/Attendance/OTDaily/OTDaily";
import LateComingExemptAttendance from "../pages/Attendance/LateComingExemptAttendance/LateComingExemptAttendance";
import Configuration from "../pages/Administration/Configuration/Configuration";
import EmployeeList from "../pages/Employee/Employee/EmployeeList";
import EmployeeProfile from "../pages/Employee/Employee/EmployeeProfile";
const authProtectedRoutes = [
  // my routes setup
  { path: "/company", component: <Company /> },
  { path: "/location", component: <Location /> },
  { path: "/department-group", component: <DepartmentGroup /> },
  { path: "/department", component: <Department /> },
  { path: "/designation", component: <Designation /> },
  { path: "/shift", component: <Shift /> },
  { path: "/grades", component: <Grade /> },
  { path: "/salary-bank", component: <SalaryBank /> },
  { path: "/attendance-codes", component: <AttendanceCode /> },
  { path: "/holiday", component: <Holiday /> },
  { path: "/allow-deduction-types", component: <AllowanceDeductionTypes /> },
  { path: "/ramazan-dates", component: <Ramazan /> },
  { path: "/leave-balances", component: <LeaveBalance /> },
  // Employee routes 
  { path: "/employee", component: <Employee /> },
  { path: "/employee/:id", component: <EmployeeProfile /> },
  { path: "/employee-list", component: <EmployeeList /> },
  { path: "/increment", component: <Increment /> },
  { path: "/loan-disbursement", component: <LoanDisbursement /> },
  { path: "/allowance-deduction", component: <AllowanceDeduction /> },
  { path: "/local-sales", component: <LocalSale /> },
  { path: "/advance", component: <Advance /> },
  { path: "/employee-transfer", component: <EmployeeTransfer /> },
  { path: "/payment-plan", component: <PaymentPlan /> },
  { path:"/gratuity", component:<Gratuity/>},
  { path: "/employee-report", component: <EmployeeReport /> },
  { path: "/employee-letter", component: <EmployeeLetter /> },
  { path: "/trial-employee", component: <TrialEmployee /> },

  // Attendance routes 
  { path: "/attendance-entry", component: <AttendanceEntry /> },
  { path: "/change-attendance", component: <ChangeAttendance /> },
  { path: "/attendance-employee", component: <AttendanceEmployee /> },
  { path: "/leaves", component: <Leave /> },
  { path: "/special-leave-entry", component: <SpecialLeaveEntry /> },
  { path: "/leave-entry-department", component:<LeaveEntryDepartment/>},
  { path: "/late-coming-exempt-attendance", component:<LateComingExemptAttendance/>},
  // { path: "/ot-entry", component: <OTEntry /> },
  { path: "/ot-daily", component: <OTDaily /> },
  { path: "/ot-monthly", component: <OTMonthly/>},
  { path: "/roster", component: <Roster/>},
  { path: "/backdate-entry", component: <BackdateEntry/>},
  // Posting
  { path: "/daily-attendance-posting", component: <DailyAttendancePosting /> },
  { path: "/salary-posting", component: <SalaryPosting /> },


  // Reports routes
  { path: "/daily-attendance-reports", component: <DailyAttendanceReport /> },
  { path: "/monthly-attendance-reports", component: <MonthlyAttendanceReport /> },
  { path: "/salary-reports", component: <SalaryReport /> },
  { path: "/summaries", component: <Summaries /> },
  { path: "/deduction-reports", component: <DeductionReport /> },


// Administration routes
{ path: "/role-management", component: <RoleManagement /> },
{ path: "/role-rights", component: <RoleRights /> },
{ path: "/user-management", component: <UserManagement /> },
{ path: "/user-rights", component: <UserRights /> },
{ path: "/permission-management", component: <PermissionManagement /> },
{ path: "/configuration", component:<Configuration/>},










  // Attendance routes setup

  { path: "/dashboard-crm", component: <DashboardCrm /> },
  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/index", component: <DashboardEcommerce /> },
  { path: "/dashboard-blog", component: <DashboardBlog /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };
