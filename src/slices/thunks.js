// Front
export * from "./layouts/thunk";

// Authentication
export * from "./auth/login/thunk";
// export * from "./auth/register/thunk";
export * from "./auth/forgetpwd/thunk";
export * from "./auth/profile/thunk";

// API Key
export * from "./apiKey/thunk";

// Here is my workflow
export * from "./setup/company/thunk";
export * from "./setup/location/thunk";
// DepartmentGroup
export * from "./setup/departmentGroup/thunk";
// Designation
export * from "./setup/designation/thunk";
// Grade
export * from "./setup/grade/thunk";
// Salary Banks
export * from "./setup/salaryBank/thunk";
export * from "./setup/allowanceDeductionType/thunk";
export * from "./setup/attendanceCode/thunk";
export * from "./setup/ramazan/thunk";
export * from "./setup/holiday/thunk";
export * from "./setup/leaveBalance/thunk";
export * from "./setup/shift/thunk";
export * from "./setup/attendanceGroup/thunk";
export * from "./setup/allowanceDeductionGroup/thunk";
export * from "./setup/allowanceDeductionCategory/thunk";
export * from "./setup/allowanceDeductionCategoryByName/thunk";
export * from "./setup/holidayType/thunk";
// Employee
export * from "./employee/employee/thunk";
export * from "./employee/loanDisbursement/thunk";
export * from "./employee/salaryIncrement/thunk";
export * from "./employee/salaryAllowanceDeduction/thunk";
export * from "./employee/allowanceDeductionDetails/thunk";
export * from "./employee/employeeTransfer/thunk";
export * from "./employee/employeeType/thunk";
export * from "./employee/religion/thunk";
export * from "./employee/gender/thunk";
export * from "./employee/advance/thunk";
export * from "./employee/localSales/thunk";
export * from "./employee/employeeTrial/thunk";
export * from "./employee/gratuity/thunk";
export * from "./employee/paymentPlan/thunk";
// Administration
export * from "./administration/roles/thunk";
export * from "./administration/rolesRight/thunk";
export * from "./administration/pagePermission/thunk";
export * from "./administration/userManagement/thunk";
export * from "./administration/secUserCompany/thunk";
export * from "./administration/secUserLocation/thunk";
export * from "./administration/secUserRole/thunk";


// Attendance
export * from "./Attendance/AttendanceEntry/thunk";
export * from "./Attendance/AttendanceChange/thunk";
export * from "./Attendance/AttendanceEmployee/thunk";
export * from "./Attendance/leaveType/thunk";
export * from "./Attendance/leave/thunk";
export * from "./Attendance/specialLeaveEntry/thunk";
export * from "./Attendance/leaveEntryDepartment/thunk";
export * from "./Attendance/lateComingExemptAttendance/thunk";
// OTDaily
export * from "./Attendance/OTDaily/thunk";
// OTMonthly
export * from "./Attendance/OTMonthly/thunk";
// Roaster
export * from "./Attendance/Roster/thunk";