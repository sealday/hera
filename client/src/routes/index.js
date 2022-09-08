import { Routes, Route } from 'react-router-dom'

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
  PriceCreate,
  Settings,
  Weight,
  WeightEdit,
  WeightCreate,
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

export default ({ onLogin, onLogout }) => <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<App onEnter={onLogin} onLeave={onLogout} />}>
    <Route path="*" element={<Home />} />
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
    <Route path="price/create" element={<PriceCreate />} />
    <Route path="price/:id" element={<PriceEdit />} />
    <Route path="price/create/:id" element={<PriceCreate />} />
    <Route path="weight" element={<Weight />} />
    <Route path="weight/create" element={<WeightCreate />} />
    <Route path="weight/:id" element={<WeightEdit />} />
    <Route path="weight/create/:id" element={<WeightCreate />} />
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
    <Route path="rent_calc_preview" element={<company.RentCalcPreview />} />
    <Route path="contract" element={<company.Contract />} />
    <Route path="contract/create" element={<company.ContractCreate />} />
    <Route path="contract/:id" element={<company.ContractDetails />} />
    <Route path="contract/:id/calc/:calcId" element={<company.ContractDetailsCalc />} />
    <Route path="plan" element={<company.Plan />} />
    <Route path="plan/create" element={<company.PlanCreate />} />
    <Route path="plan/:id/edit" element={<company.PlanEdit />} />
    <Route path="store" element={<Store />} />
    <Route path="transport_table" element={<TransportSearch />} />
    <Route path="transport_table_company" element={<company.TransportSearch />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
    <Route path='company' element={<Company />} />
    <Route path='employee' element={<Employee />} />
    <Route path='employee/create' element={<EmployeeCreatePage />} />
    <Route path='employee/:id/edit' element={<EmployeeEditPage />} />
    <Route path='attendance' element={<Attendance />} />
  </Route>
</Routes>