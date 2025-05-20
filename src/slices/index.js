import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";

//Calendar
import CalendarReducer from "./calendar/reducer";
//Chat
import chatReducer from "./chat/reducer";
//Ecommerce
import EcommerceReducer from "./ecommerce/reducer";

//Project
import ProjectsReducer from "./projects/reducer";

// Tasks
import TasksReducer from "./tasks/reducer";

//Crypto
import CryptoReducer from "./crypto/reducer";

//TicketsList
import TicketsReducer from "./tickets/reducer";
//Crm
import CrmReducer from "./crm/reducer";

//Invoice
import InvoiceReducer from "./invoice/reducer";

//Mailbox
import MailboxReducer from "./mailbox/reducer";

// Dashboard Analytics
import DashboardAnalyticsReducer from "./dashboardAnalytics/reducer";

// Dashboard CRM
import DashboardCRMReducer from "./dashboardCRM/reducer";

// Dashboard Ecommerce
import DashboardEcommerceReducer from "./dashboardEcommerce/reducer";

// Dashboard Cryto
import DashboardCryptoReducer from "./dashboardCrypto/reducer";

// Dashboard Cryto
import DashboardProjectReducer from "./dashboardProject/reducer";

// Dashboard NFT
import DashboardNFTReducer from "./dashboardNFT/reducer";

// Pages > Team
import TeamDataReducer from "./team/reducer";

// File Manager
import FileManagerReducer from "./fileManager/reducer";

// To do
import TodosReducer from "./todos/reducer";

// Job
import JobReducer from "./jobs/reducer";

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
import HolidayTypeReducer from "./setup/holidayType/reducer"; 
// employee
import EmployeeReducer from "./employee/employee/reducer";
import LoanDisbursementReducer from "./employee/loanDisbursement/reducer";
import SalaryIncrementReducer from "./employee/salaryIncrement/reducer";
import EmployeeLocationTransferReducer from "./employee/employeeTransfer/reducer";
import EmployeeTypeReducer from "./employee/employeeType/reducer";
import ReligionReducer from "./employee/religion/reducer";
import GenderReducer from "./employee/gender/reducer";

// Administration
import RolesReducer from "./administration/roles/reducer";
import RolesRightReducer from "./administration/rolesRight/reducer";
import PagePermissionReducer from "./administration/pagePermission/reducer";
import UserReducer  from "./administration/userManagement/reducer";
import SecUserCompanyReducer from "./administration/secUserCompany/reducer";
import SecUserLocationReducer from "./administration/secUserLocation/reducer";
import SecUserRoleReducer from "./administration/secUserRole/reducer";




const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Login: LoginReducer,
    Account: AccountReducer,
    ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    Calendar: CalendarReducer,
    Chat: chatReducer,
    Projects: ProjectsReducer,
    Ecommerce: EcommerceReducer,
    Tasks: TasksReducer,
    Crypto: CryptoReducer,
    Tickets: TicketsReducer,
    Crm: CrmReducer,
    Invoice: InvoiceReducer,
    Mailbox: MailboxReducer,
    DashboardAnalytics: DashboardAnalyticsReducer,
    DashboardCRM: DashboardCRMReducer,
    DashboardEcommerce: DashboardEcommerceReducer,
    DashboardCrypto: DashboardCryptoReducer,
    DashboardProject: DashboardProjectReducer,
    DashboardNFT: DashboardNFTReducer,
    Team: TeamDataReducer,
    FileManager: FileManagerReducer,
    Todos: TodosReducer,
    Jobs: JobReducer,
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
    EmployeeType:EmployeeTypeReducer,
    Religion:ReligionReducer,
    Gender:GenderReducer,
    Role: RolesReducer, // Here is my work 01/23/2025
    RoleRight: RolesRightReducer, // Here is my work 01/23/2025
    PagePermission: PagePermissionReducer, // Here is my work 01/23/2025
    User: UserReducer, // Here is my work 01/23/2025
    SecUserCompany: SecUserCompanyReducer, // Here is my work 01/23/2025
    SecUserLocation: SecUserLocationReducer, // Here is my work 01/23/2025
    SecUserRole: SecUserRoleReducer, // Here is my work 01/23/2025
});

export default rootReducer;