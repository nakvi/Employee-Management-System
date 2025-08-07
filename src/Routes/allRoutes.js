import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard/Index";
//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";
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
import EmployeeReport from "../pages/Employee/Reports/EmployeeReport";
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
import SalaryAllowanceDeduction from "../pages/Employee/SalaryAllowanceDeduction/SalaryAllowanceDeduction";

// daily att reports 
import Invoice from "../Components/pdfsPreviews/invoice";
import ReportsPreview from "../Components/pdfsPreviews/reports";
import UnpostedPreview from "../Components/pdfsPreviews/DailyAttRpts/UnpostedPreview";
import PostedPreview from "../Components/pdfsPreviews/DailyAttRpts/PostedPreview";
import LatecomerPreview from "../Components/pdfsPreviews/DailyAttRpts/LatecomerPreview";
import AbsenteesPreview from "../Components/pdfsPreviews/DailyAttRpts/AbsenteesPreview";
// Monthly att reports 
import MonthlyAttCardPreview from "../Components/pdfsPreviews/MonthlyAttRpts/MonthlyAttCardPreview";
import MonthlyAttSheetPreview from "../Components/pdfsPreviews/MonthlyAttRpts/MonthlyAttSheetPreview";
import MonthlyAttSummaryPreview from "../Components/pdfsPreviews/MonthlyAttRpts/MonthlyAttSummaryPreview";
import MonthlyAttLeaveListPreview from "../Components/pdfsPreviews/MonthlyAttRpts/MonthlyAttLeaveListPreview";
// Salary reports 
// import MonthlyAttSalarySheetPreview from "../Components/pdfsPreviews/MonthlyAttSalarySheetPreview";
import SalaryHistoryPreview from "../Components/pdfsPreviews/SalaryRpts/SalaryHistoryPreview";
import SalaryReportPreview from "../Components/pdfsPreviews/SalaryRpts/SalaryReportPreview";
import SalaryReportTwoPreview from "../Components/pdfsPreviews/SalaryRpts/SalaryReportTwoPreview";
import SalarySummaryReportPreview from "../Components/pdfsPreviews/SalaryRpts/SalarySummaryReportPreview";
import SalarySlipPreview from "../Components/pdfsPreviews/SalaryRpts/SalarySlipPreview";
import SalaryOverTimeSheetPreview from "../Components/pdfsPreviews/SalaryRpts/SalaryOverTimeSheetPreview";
import SalaryOverTimeSummaryReportPreview from "../Components/pdfsPreviews/SalaryRpts/SalaryOverTimeSummaryReportPreview";
import SalaryFinalSettlementPreview from "../Components/pdfsPreviews/SalaryRpts/SalaryFinalSettlementPreview";
import SalaryAllwDedPreview from "../Components/pdfsPreviews/SalaryRpts/SalaryAllwDedPreview";

import AttendancePosting from "../pages/Posting/AttendancePosting/AttendancePosting";
import SalaryReport from "../pages/Reports/SalaryReport/SalaryReport";



const authProtectedRoutes = [
  // my routes setup
  // Monthly att reports
  { path: "/monthly-attendance-card-preview", component: <MonthlyAttCardPreview /> },
  { path: "/monthly-attendance-sheet-preview", component: <MonthlyAttSheetPreview /> },
  { path: "/monthly-attendance-summary-preview", component: <MonthlyAttSummaryPreview /> },
  { path: "/monthly-attendance-leave-list-preview", component: <MonthlyAttLeaveListPreview /> },
  // Salary reports
  // { path: "/monthly-attendance-salary-report-preview", component: <MonthlyAttSalarySheetPreview /> },
  { path: "/salary-history-preview", component: <SalaryHistoryPreview /> },
  { path: "/salary-report-preview", component: <SalaryReportPreview /> },
  { path: "/salary-report-two-preview", component: <SalaryReportTwoPreview /> },
  { path: "/salary-summary-report-preview", component: <SalarySummaryReportPreview /> },
  { path: "/salary-slip-preview", component: <SalarySlipPreview /> },
  { path: "/salary-over-time-sheet-preview", component: <SalaryOverTimeSheetPreview /> },
  { path: "/salary-over-time-summary-report-preview", component: <SalaryOverTimeSummaryReportPreview /> },
  { path: "/salary-final-settlement-preview", component: <SalaryFinalSettlementPreview /> },
  { path: "/salary-allowance-deduction-preview", component: <SalaryAllwDedPreview /> },


  // daily att reports 
  { path: "/report-preview", component: <ReportsPreview /> },
  { path: "/unposted-preview", component: <UnpostedPreview /> },
  { path: "/posted-preview", component: <PostedPreview /> },
  { path: "/latecomer-preview", component: <LatecomerPreview /> },
  { path: "/absentees-preview", component: <AbsenteesPreview /> },
  { path: "/invoice-preview", component: <Invoice /> },
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
  { path: "/salary-allowance-deduction", component: <SalaryAllowanceDeduction /> },
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
  { path: "/attendance-posting", component: <AttendancePosting /> },
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










  // My Dashboard
  { path: "/dashboard",component: <Dashboard/>},


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
