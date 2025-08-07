import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";







// API Key
import APIKeyReducer from "./apiKey/reducer";

// Here is my work 01/23/2025
import CompanyReducer from "./setup/company/reducer";
import LocationReducer from "./setup/location/reducer";
import DepartmentGroupReducer from "./setup/departmentGroup/reducer";
import DepartmentReducer from "./setup/department/reducer";
import DesignationReducer from "./setup/designation/reducer"; 
import GradeReducer from "./setup/grade/reducer"; 
import SalaryBankReducer from "./setup/salaryBank/reducer"; 
import AllowanceDeductionTypeReducer from "./setup/allowanceDeductionType/reducer";
import AttendanceCodeReducer from "./setup/attendanceCode/reducer"; 
import RamazanReducer from "./setup/ramazan/reducer"; 
import HolidayReducer from "./setup/holiday/reducer"; 
import LeaveBalanceReducer from "./setup/leaveBalance/reducer"; 
import ShiftReducer from "./setup/shift/reducer"; 
import AttendanceGroupReducer from "./setup/attendanceGroup/reducer"; 
import AllowanceDeductionGroupReducer from "./setup/allowanceDeductionGroup/reducer"; 
import AllowanceDeductionCategoryReducer from "./setup/allowanceDeductionCategory/reducer"; 
import AllowanceDeductionCategoryByNameReducer from "./setup/allowanceDeductionCategoryByName/reducer";
import HolidayTypeReducer from "./setup/holidayType/reducer"; 
// employee
import EmployeeReducer from "./employee/employee/reducer";
import LoanDisbursementReducer from "./employee/loanDisbursement/reducer";
import SalaryIncrementReducer from "./employee/salaryIncrement/reducer";
import EmployeeLocationTransferReducer from "./employee/employeeTransfer/reducer";
import SalaryAllowanceDeductionReducer from "./employee/salaryAllowanceDeduction/reducer";
import AllowanceDeductionDetailsSlice from "./employee/allowanceDeductionDetails/reducer";
import EmployeeTypeReducer from "./employee/employeeType/reducer";
import ReligionReducer from "./employee/religion/reducer";
import GenderReducer from "./employee/gender/reducer";
import AdvanceReducer from "./employee/advance/reducer"
import LocalSaleReducer from "./employee/localSales/reducer"
import EmployeeTrialReducer from "./employee/employeeTrial/reducer"
import GratuityReducer from "./employee/gratuity/reducer"
import PaymentPlanReducer from "./employee/paymentPlan/reducer"

// Administration
import RolesReducer from "./administration/roles/reducer";
import RolesRightReducer from "./administration/rolesRight/reducer";
import PagePermissionReducer from "./administration/pagePermission/reducer";
import UserReducer  from "./administration/userManagement/reducer";
import SecUserCompanyReducer from "./administration/secUserCompany/reducer";
import SecUserLocationReducer from "./administration/secUserLocation/reducer";
import SecUserRoleReducer from "./administration/secUserRole/reducer";
// Attendance
import AttendanceEntryReducer from "./Attendance/AttendanceEntry/reducer"; // Correct import
import AttendanceChangeReducer from "./Attendance/AttendanceChange/reducer";
import AttendanceEmployeeReducer from "./Attendance/AttendanceEmployee/reducer";
import LeaveTypeReducer from "./Attendance/leaveType/reducer";
import LeaveReducer from "./Attendance/leave/reducer";
import SpecialLeaveEntryReducer from "./Attendance/specialLeaveEntry/reducer";
import LeaveEntryDepartmentReducer from "./Attendance/leaveEntryDepartment/reducer";
import LateComingExemptAttendanceReducer from "./Attendance/lateComingExemptAttendance/reducer";
// OTDaily
import OTDailyReducer from "./Attendance/OTDaily/reducer"; 
// OTMonthly
import OTMonthlyReducer from "./Attendance/OTMonthly/reducer"; 
// Roaster
import RosterReducer from "./Attendance/Roster/reducer"; 
// Posting
import AttendancePostingReducer from "./posting/attendancePosting/reducer";



const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Login: LoginReducer,
    ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    APIKey: APIKeyReducer,
    Company: CompanyReducer, // Here is my work 01/23/2025
    Location: LocationReducer,
    DepartmentGroup: DepartmentGroupReducer, // Here is my work 01/23/2025,
    Department: DepartmentReducer,
    Designation:DesignationReducer,
    Grade:GradeReducer, 
    SalaryBank:SalaryBankReducer,
    AllowanceDeductionType:AllowanceDeductionTypeReducer,
    AllowanceDeductionGroup: AllowanceDeductionGroupReducer, 
    AllowanceDeductionCategory: AllowanceDeductionCategoryReducer,
    AllowanceDeductionCategoryByName:AllowanceDeductionCategoryByNameReducer,
    AttendanceCode:AttendanceCodeReducer,
    Ramazan:RamazanReducer,
    Holiday: HolidayReducer, 
    LeaveBalance: LeaveBalanceReducer,
    Shift: ShiftReducer,
    AttendanceGroup:AttendanceGroupReducer,
    HolidayType: HolidayTypeReducer, 
    // Employee
    Employee: EmployeeReducer,
    LoanDisbursement: LoanDisbursementReducer, 
    SalaryIncrement: SalaryIncrementReducer,  
    EmployeeLocationTransfer:EmployeeLocationTransferReducer,
    SalaryAllowanceDeduction:SalaryAllowanceDeductionReducer,
    AllowanceDeductionDetails:AllowanceDeductionDetailsSlice,
    EmployeeType:EmployeeTypeReducer,
    Religion:ReligionReducer,
    Advance:AdvanceReducer,
    Gender:GenderReducer,
    LocalSale:LocalSaleReducer,
    EmployeeTrial:EmployeeTrialReducer,
    Gratuity:GratuityReducer,
    PaymentPlan:PaymentPlanReducer,
    // Roles And Permission
    Role: RolesReducer, 
    RoleRight: RolesRightReducer, 
    PagePermission: PagePermissionReducer, // Here is my work 01/23/2025
    User: UserReducer, // Here is my work 01/23/2025
    SecUserCompany: SecUserCompanyReducer, // Here is my work 01/23/2025
    SecUserLocation: SecUserLocationReducer, // Here is my work 01/23/2025
    SecUserRole: SecUserRoleReducer, 

    // Add Attendance Entry Reducer
    AttendanceEntry: AttendanceEntryReducer, // Uncomment this line if you have an AttendanceEntry reducer
    AttendanceChange: AttendanceChangeReducer,
    AttendanceEmployee : AttendanceEmployeeReducer,
    LeaveType: LeaveTypeReducer,
    Leave:LeaveReducer,
    SpecialLeaveEntry:SpecialLeaveEntryReducer,
    LeaveEntryDepartment:LeaveEntryDepartmentReducer,
    LateComingExemptAttendance:LateComingExemptAttendanceReducer,
    OTDaily: OTDailyReducer, 
    OTMonthly: OTMonthlyReducer, 
    Roster: RosterReducer, 
    // Posting
    AttendancePosting:AttendancePostingReducer,
});

export default rootReducer;