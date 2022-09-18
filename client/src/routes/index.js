import { Routes, Route, Navigate } from 'react-router-dom'

import App from '../pages/App'
import Home from '../pages/common/Home'
import {
  Operator,
  OperatorCreate,
  OperatorEdit,
  Project,
  ProjectCreate,
  ProjectEdit,
  Product,
  Price,
  PriceEdit,
  Settings,
  Company,
} from '../pages/system'
import * as store from '../pages/store'
import {
  Store,
  SimpleSearch,
  TransportSearch,
} from '../pages/report'
import * as company from '../pages/finance'
import Profile from '../pages/common/Profile'
import Login from '../pages/common/Login'
import Employee from '../pages/project/employee.page'
import Attendance from '../pages/project/attendance.page'
import EmployeeCreatePage from '../pages/project/employee-create.page'
import EmployeeEditPage from '../pages/project/employee-edit.page'
import SubjectPage from '../pages/finance/subject/subject.page'
import InvoicePage from '../pages/finance/invoice/invoice.page'
import LoanPage from '../pages/finance/loan/loan.page'
import VoucherPage from '../pages/finance/voucher/voucher.page'
import RulePage from '../pages/project/rule/rule.page'
import RuleCreatePage from '../pages/project/rule/rule.create.page'
import RuleEditPage from '../pages/project/rule/rule.edit.page'
import RuleClonePage from '../pages/project/rule/rule.clone.page'
import OtherPage from '../pages/system/other/other.page'
import DetailSearchPage from '../pages/report/detail-search.page'

export default ({ onLogin, onLogout }) => <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<App onEnter={onLogin} onLeave={onLogout} />}>
    <Route path="" element={<Navigate to='/dashboard' replace />} />
    <Route path="*" element={<Navigate to='/dashboard' replace />} />
    <Route path="dashboard" element={<Home />} />
    <Route path="operator" element={<Operator />} />
    <Route path="operator/create" element={<OperatorCreate />} />
    <Route path="operator/:id/edit" element={<OperatorEdit />} />
    <Route path="project" element={<Project />} />
    <Route path="project/create" element={<ProjectCreate />} />
    <Route path="project/:id/edit" element={<ProjectEdit />} />
    <Route path="simple_search" element={<SimpleSearch />} />
    <Route path="simple_search_company" element={<company.SimpleSearch />} />
    {/* system */}
    <Route path="product" element={<Product />} />
    <Route path="price" element={<Price />} />
    <Route path="price/:id" element={<PriceEdit />} />
    {/* 仓库 start */}
    <Route path="record/create" element={<store.RecordCreate />} />
    <Route path="record/:id" element={<store.Record />} />
    <Route path="record/:id/preview" element={<store.RecordPreview />} />
    <Route path='record/:id/edit' element={<store.RecordEdit />} />
    <Route path="transport/:id" element={<store.TransportOrder />} />
    <Route path="transport/:id/edit" element={<store.TransportOrderEdit />} />
    {/* 仓库 end */}
    <Route path="company_record/:id" element={<company.Record />} />
    <Route path="rent_calc" element={<company.RentCalc />} />
    <Route path="contract" element={<company.Contract />} />
    <Route path="contract/create" element={<company.ContractCreate />} />
    <Route path="contract/:id" element={<company.ContractDetails />} />
    <Route path="contract/:id/calc/:calcId" element={<company.ContractDetailsCalc />} />
    <Route path="plan" element={<company.Plan />} />
    <Route path="plan/create" element={<company.PlanCreate />} />
    <Route path="plan/:id/edit" element={<company.PlanEdit />} />
    <Route path="rule" element={<RulePage />} />
    <Route path="rule/create" element={<RuleCreatePage />} />
    <Route path="rule/:id" element={<RuleEditPage />} />
    <Route path="rule/:id/clone" element={<RuleClonePage />} />
    <Route path="store" element={<Store />} />
    <Route path="transport_table" element={<TransportSearch />} />
    <Route path="detail_search" element={<DetailSearchPage />} />
    <Route path="transport_table_company" element={<company.TransportSearch />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
    <Route path="other" element={<OtherPage />} />
    <Route path='company' element={<Company />} />
    <Route path='employee' element={<Employee />} />
    <Route path='employee/create' element={<EmployeeCreatePage />} />
    <Route path='employee/:id/edit' element={<EmployeeEditPage />} />
    <Route path='invoice/:direction' element={<InvoicePage />} />
    <Route path='loan' element={<LoanPage />} />
    <Route path='voucher' element={<VoucherPage />} />
    <Route path='subject' element={<SubjectPage />} />
    <Route path='attendance' element={<Attendance />} />
  </Route>
</Routes>