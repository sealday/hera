import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ = require('lodash');
import { Model } from 'mongoose';
import { AppService } from 'src/app/app.service';
import { Employee, EmployeeDocument, EmployeeSchema } from 'src/schemas/employee.schema';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    private appService: AppService,
  ) { }

  async create(employee: Employee) {
    console.log(Employee.name)
    employee.employeeID = await this.appService.genNextNumber(Employee.name)
    return await (await this.employeeModel.create(employee)).save()
  }

  async findAll() {
    return await this.employeeModel.find()
  }

  async findOne(id: string) {
    return await this.employeeModel.findById(id)
  }

  async update(id: string, employee: Employee) {
    return await this.employeeModel.findByIdAndUpdate(id, { $set: _.omit(employee, ['.employeeID']) })
  }

  async remove(id: string) {
    return await this.employeeModel.findByIdAndDelete(id)
  }
}