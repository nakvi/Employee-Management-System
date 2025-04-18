import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isReports, setIsReports] = useState(false);
  const [isAdministration, setIsAdministration] = useState(false);

  const [isAuth, setIsAuth] = useState(false);
  // Authentication
  const [isSignIn, setIsSignIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isPasswordCreate, setIsPasswordCreate] = useState(false);
  const [isLockScreen, setIsLockScreen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [isError, setIsError] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    // my work
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Setup") {
      setIsSetup(false);
    }
    if (iscurrentState !== "Employee") {
      setIsEmployee(false);
    }
    if (iscurrentState !== "Attendance") {
      setIsAttendance(false);
    }
    if (iscurrentState !== "Posting") {
      setIsPosting(false);
    }
    if (iscurrentState !== "Reports") {
      setIsReports(false);
    }
    if (iscurrentState !== "Administration") {
      setIsAdministration(false);
    }

    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isSetup,
    isEmployee,
    isAttendance,
    isPosting,
    isReports,
    isAdministration,
    isAuth,
  ]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/dashboard",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    // setUp form
    {
      id: "setup",
      label: "Setup",
      icon: "ri-file-settings-line",
      link: "/#",
      stateVariables: isSetup,
      click: function (e) {
        e.preventDefault();
        setIsSetup(!isSetup);
        setIscurrentState("Setup");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "company",
          label: "Company",
          link: "/company",
          parentId: "setup",
        },
        {
          id: "location",
          label: "Location",
          link: "/location",
          parentId: "setup",
        },
        {
          id: "departmentGroup",
          label: "Department Group",
          link: "/department-group",
          parentId: "setup",
        },
        {
          id: "department",
          label: "Department",
          link: "/department",
          parentId: "setup",
        },
        {
          id: "designation",
          label: "Designation",
          link: "/designation",
          parentId: "setup",
        },
        {
          id: "shift",
          label: "Shift",
          link: "/shift",
          parentId: "setup",
        },
        {
          id: "grades",
          label: "Grades",
          link: "/grades",
          parentId: "setup",
        },
        {
          id: "salaryBank",
          label: "Salary Bank",
          link: "/salary-bank",
          parentId: "setup",
        },
        {
          id: "allowDeductionTypes",
          label: "Allowance/Deduction",
          link: "/allow-deduction-types",
          parentId: "setup",
        },
        {
          id: "attendanceCodes",
          label: "Attendance Codes",
          link: "/attendance-codes",
          parentId: "setup",
        },
        {
          id: "ramazanDates",
          label: "Ramazan Dates",
          link: "/ramazan-dates",
          parentId: "setup",
        },
        {
          id: "holiday",
          label: "Holiday",
          link: "/holiday",
          parentId: "setup",
        },
        {
          id: "leaveBalances",
          label: "Leave Balances",
          link: "/leave-balances",
          parentId: "setup",
        },
      ],
    },
    // Employee form
    {
      id: "employees",
      label: "Employee",
      icon: "ri-user-2-line",
      link: "/#",
      stateVariables: isEmployee,
      click: function (e) {
        e.preventDefault();
        setIsEmployee(!isEmployee);
        setIscurrentState("Employee");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "employee",
          label: "Employee",
          link: "/employee",
          parentId: "employees",
        },
        // {
        //   id: "employeeAccounts",
        //   label: "Employee Accounts",
        //   link: "/employee-accounts",
        //   parentId: "employees",
        // },
        {
          id: "cardPrinting",
          label: "Card Printing",
          link: "/card-printing",
          parentId: "employees",
        },
        {
          id: "employeeTransfer",
          label: "Employee Transfer",
          link: "/employee-transfer",
          parentId: "employees",
        },
        {
          id: "increment",
          label: "Increment",
          link: "/increment",
          parentId: "employees",
        },
        {
          id: "advance",
          label: "Advance",
          link: "/advance",
          parentId: "employees",
        },
        {
          id: "localSales",
          label: "Local Sales",
          link: "/local-sales",
          parentId: "employees",
        },
        {
          id: "allowanceDeduction",
          label: "Allowance Deduction",
          link: "/allowance-deduction",
          parentId: "employees",
        },
        {
          id: "loanDisbursement",
          label: "Loan Disbursement",
          link: "/loan-disbursement",
          parentId: "employees",
        },
      
        {
          id: "paymentPlan",
          label: "Payment Plan",
          link: "/payment-plan",
          parentId: "employees",
        },
        {
          id: "gratuity",
          label: "Gratuity",
          link: "/gratuity",
          parentId: "employees",
        },
        {
          id: "reports",
          label: "Reports",
          link: "/employee-report",
          parentId: "employees",
        },
        {
          id: "letters",
          label: "Letters",
          link: "/employee-letter",
          parentId: "employees",
        },
        {
          id: "trialEmployee",
          label: "Trial Employee",
          link: "/trial-employee",
          parentId: "employees",
        },
      ],
    },
    // Attendance form
    {
      id: "attendance",
      label: "Attendance",
      icon: "ri-apps-line",
      link: "/#",
      stateVariables: isAttendance,
      click: function (e) {
        e.preventDefault();
        setIsAttendance(!isAttendance);
        setIscurrentState("Attendance");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "attendanceEntry",
          label: "Attendance Entry",
          link: "/attendance-entry",
          parentId: "attendance",
        },
        {
          id: "changeAttendance",
          label: "Change Attendance",
          link: "/change-attendance",
          parentId: "attendance",
        },
        {
          id: "attendanceEmployee",
          label: "Attendance Employee",
          link: "/attendance-employee",
          parentId: "attendance",
        },
        {
          id: "leaves",
          label: "Leaves",
          link: "/leaves",
          parentId: "attendance",
        },
        {
          id: "specialLeaveEntry",
          label: "Special Leave Entry",
          link: "/special-leave-entry",
          parentId: "attendance",
        },
        {
          id: "leaveEntryDepartment",
          label: "Leave Entry Department",
          link: "/leave-entry-department",
          parentId: "attendance",
        },
        {
          id: "lateComingExemptAttendance",
          label: "Late Coming",
          link: "/late-coming-exempt-attendance",
          parentId: "attendance",
        },
        // {
        //   id: "oTEntry",
        //   label: "O/T Entry",
        //   link: "/ot-entry",
        //   parentId: "attendance",
        // },
        {
          id: "oTDaily",
          label: "O/T Daily",
          link: "/ot-daily",
          parentId: "attendance",
        },
        {
          id: "oTMonthly",
          label: "O/T Monthly",
          link: "/ot-monthly",
          parentId: "attendance",
        },
        {
          id: "roster",
          label: "Roster",
          link: "/roster",
          parentId: "attendance",
        },
        {
          id: "Backdate Entry",
          label: "Backdate Entry",
          link: "/backdate-entry",
          parentId: "attendance",
        },
      ],
    },
    // Posting form
    {
      id: "posting",
      label: "Posting",
      icon: "ri-file-history-line",
      link: "/#",
      stateVariables: isPosting,
      click: function (e) {
        e.preventDefault();
        setIsPosting(!isPosting);
        setIscurrentState("Posting");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "dailyAttendance",
          label: "Daily Attendance",
          link: "/daily-attendance-posting",
          parentId: "posting",
        },
        // {
        //   id: "salaryProcessing",
        //   label: "Salary Processing",
        //   link: "/salary-processing-posting",
        //   parentId: "posting",
        // },
        {
          id: "salaryPosting",
          label: "Salary Posting",
          link: "/salary-posting",
          parentId: "posting",
        },
      ],
    },
    // Reports form
    {
      id: "reports",
      label: "Reports",
      icon: "ri-file-chart-line",
      link: "/#",
      stateVariables: isReports,
      click: function (e) {
        e.preventDefault();
        setIsReports(!isReports);
        setIscurrentState("Reports");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "dailyAttendanceReports",
          label: "Daily Attendance",
          link: "/daily-attendance-reports",
          parentId: "reports",
        },
        {
          id: "MonthlyAttendanceReports",
          label: "Monthly Attendance",
          link: "/monthly-attendance-reports",
          parentId: "reports",
        },
        {
          id: "Salary Reports",
          label: "Salary Reports",
          link: "/salary-reports",
          parentId: "reports",
        },
        {
          id: "summaries",
          label: "Summaries",
          link: "/summaries",
          parentId: "reports",
        },
        {
          id: "deductionReports",
          label: "Deduction Reports",
          link: "/deduction-reports",
          parentId: "reports",
        },
      ],
    },
    // Reports form
    {
      id: "administration",
      label: "Administration",
      icon: "ri-user-settings-line",
      link: "/#",
      stateVariables: isAdministration,
      click: function (e) {
        e.preventDefault();
        setIsAdministration(!isAdministration);
        setIscurrentState("Administration");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "roleManagement",
          label: "Role Management",
          link: "/role-management",
          parentId: "administration",
        },
        {
          id: "roleRights",
          label: "Role Rights",
          link: "/role-rights",
          parentId: "administration",
        },
        {
          id: "userManagement",
          label: "User Management",
          link: "/user-management",
          parentId: "administration",
        },
        {
          id: "userRights",
          label: "User Rights",
          link: "/user-rights",
          parentId: "administration",
        },
        {
          id: "Permissions",
          label: "Permission Management",
          link: "/permission-management",
          parentId: "administration",
        },
        {
          id: "configuration",
          label: "Configuration",
          link: "/configuration",
          parentId: "administration",
        },
      ],
    },
    //  other code here
    // {
    //   id: "authentication",
    //   label: "Authentication",
    //   icon: "ri-account-circle-line",
    //   link: "/#",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsAuth(!isAuth);
    //     setIscurrentState("Auth");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isAuth,
    //   subItems: [
    //     {
    //       id: "signIn",
    //       label: "Sign In",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsSignIn(!isSignIn);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isSignIn,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-signin-basic" },
    //         { id: 2, label: "Cover", link: "/auth-signin-cover" },
    //       ],
    //     },
    //     {
    //       id: "signUp",
    //       label: "Sign Up",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsSignUp(!isSignUp);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isSignUp,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-signup-basic" },
    //         { id: 2, label: "Cover", link: "/auth-signup-cover" },
    //       ],
    //     },
    //     {
    //       id: "passwordReset",
    //       label: "Password Reset",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsPasswordReset(!isPasswordReset);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isPasswordReset,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-pass-reset-basic" },
    //         { id: 2, label: "Cover", link: "/auth-pass-reset-cover" },
    //       ],
    //     },
    //     {
    //       id: "passwordCreate",
    //       label: "Password Create",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsPasswordCreate(!isPasswordCreate);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isPasswordCreate,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-pass-change-basic" },
    //         { id: 2, label: "Cover", link: "/auth-pass-change-cover" },
    //       ],
    //     },
    //     {
    //       id: "lockScreen",
    //       label: "Lock Screen",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsLockScreen(!isLockScreen);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isLockScreen,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-lockscreen-basic" },
    //         { id: 2, label: "Cover", link: "/auth-lockscreen-cover" },
    //       ],
    //     },
    //     {
    //       id: "logout",
    //       label: "Logout",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsLogout(!isLogout);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isLogout,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-logout-basic" },
    //         { id: 2, label: "Cover", link: "/auth-logout-cover" },
    //       ],
    //     },
    //     {
    //       id: "successMessage",
    //       label: "Success Message",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsSuccessMessage(!isSuccessMessage);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isSuccessMessage,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-success-msg-basic" },
    //         { id: 2, label: "Cover", link: "/auth-success-msg-cover" },
    //       ],
    //     },
    //     {
    //       id: "twoStepVerification",
    //       label: "Two Step Verification",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsVerification(!isVerification);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isVerification,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-twostep-basic" },
    //         { id: 2, label: "Cover", link: "/auth-twostep-cover" },
    //       ],
    //     },
    //     {
    //       id: "errors",
    //       label: "Errors",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsError(!isError);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isError,
    //       childItems: [
    //         { id: 1, label: "404 Basic", link: "/auth-404-basic" },
    //         { id: 2, label: "404 Cover", link: "/auth-404-cover" },
    //         { id: 3, label: "404 Alt", link: "/auth-404-alt" },
    //         { id: 4, label: "500", link: "/auth-500" },
    //         { id: 5, label: "Offline Page", link: "/auth-offline" },
    //       ],
    //     },
    //   ],
    // },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
