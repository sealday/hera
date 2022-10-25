import { Navigate, useRoutes } from 'react-router-dom'
import App from '../pages/App'
import Home from '../pages/common/Home'
import Login from '../pages/common/Login'
import Profile from '../pages/common/Profile'
import * as company from '../pages/finance'
import InvoicePage from '../pages/finance/invoice/invoice.page'
import LoanPage from '../pages/finance/loan/loan.page'
import SubjectPage from '../pages/finance/subject/subject.page'
import VoucherPage from '../pages/finance/voucher/voucher.page'
import Attendance from '../pages/project/attendance.page'
import EmployeeCreatePage from '../pages/project/employee-create.page'
import EmployeeEditPage from '../pages/project/employee-edit.page'
import Employee from '../pages/project/employee.page'
import RuleClonePage from '../pages/project/rule/rule.clone.page'
import RuleCreatePage from '../pages/project/rule/rule.create.page'
import RuleEditPage from '../pages/project/rule/rule.edit.page'
import RulePage from '../pages/project/rule/rule.page'
import {
  SimpleSearch, Store, TransportSearch
} from '../pages/report'
import DetailSearchPage from '../pages/report/detail-search.page'
import * as store from '../pages/store'
import {
  Company, Operator,
  OperatorCreate,
  OperatorEdit, Product, Project,
  ProjectCreate,
  ProjectEdit, Settings
} from '../pages/system'
import OtherPage from '../pages/system/other/other.page'

export const config = [
  { path: "dashboard", element: <Home /> },
  { path: "operator", element: <Operator /> },
  { path: "operator/create", element: <OperatorCreate /> },
  { path: "operator/:id/edit", element: <OperatorEdit /> },
  { path: "project", element: <Project /> },
  { path: "project/create", element: <ProjectCreate /> },
  { path: "project/:id/edit", element: <ProjectEdit /> },
  { path: "simple_search", element: <SimpleSearch /> },
  { path: "simple_search_company", element: <company.SimpleSearch /> },
  { path: "product", element: <Product /> },
  { path: "record/create/:type/:direction", element: <store.RecordCreate /> },
  { path: "record/:id", element: <store.Record /> },
  { path: "record/:id/preview", element: <store.RecordPreview /> },
  { path: 'record/:id/edit', element: <store.RecordEdit /> },
  { path: "transport/:id", element: <store.TransportOrder /> },
  { path: "transport/:id/edit", element: <store.TransportOrderEdit /> },
  { path: "company_record/:id", element: <store.Record isFinace={true} /> },
  { path: "rent_calc", element: <company.RentCalc /> },
  { path: "contract", element: <company.Contract /> },
  { path: "contract/create", element: <company.ContractCreate /> },
  { path: "contract/:id", element: <company.ContractDetails /> },
  { path: "contract/:id/calc/:calcId", element: <company.ContractDetailsCalc /> },
  { path: "plan", element: <company.Plan /> },
  { path: "plan/create", element: <company.PlanCreate /> },
  { path: "plan/:id/edit", element: <company.PlanEdit /> },
  { path: "rule", element: <RulePage /> },
  { path: "rule/create/:category", element: <RuleCreatePage /> },
  { path: "rule/:id", element: <RuleEditPage /> },
  { path: "rule/:id/clone", element: <RuleClonePage /> },
  { path: "store", element: <Store /> },
  { path: "transport_table", element: <TransportSearch /> },
  { path: "detail_search", element: <DetailSearchPage /> },
  { path: "transport_table_company", element: <company.TransportSearch /> },
  { path: "profile", element: <Profile /> },
  { path: "settings", element: <Settings /> },
  { path: "other", element: <OtherPage /> },
  { path: 'company', element: <Company /> },
  { path: 'employee', element: <Employee /> },
  { path: 'employee/create', element: <EmployeeCreatePage /> },
  { path: 'employee/:id/edit', element: <EmployeeEditPage /> },
  { path: 'invoice/:direction', element: <InvoicePage /> },
  { path: 'loan', element: <LoanPage /> },
  { path: 'voucher', element: <VoucherPage /> },
  { path: 'subject', element: <SubjectPage /> },
  { path: 'attendance', element: <Attendance /> },
]

export default ({ onLogin, onLogout }) => useRoutes([
  { path: '/login', element: <Login /> },
  {
    path: '/tab',
    element: <App onEnter={onLogin} onLeave={onLogout} type='tab' />,
  },
  {
    path: '/',
    element: <App onEnter={onLogin} onLeave={onLogout} type='base' />,
    children: config.concat([
      { path: "", element: <Navigate to='/dashboard' replace /> },
      { path: "*", element: <Navigate to='/dashboard' replace /> },
    ]),
  }
])
