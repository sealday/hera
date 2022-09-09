import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from 'src/schemas/employee.schema';

@Injectable()
export class EmployeesService {
  constructor(@InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>) { }

  async create(employee: Employee) {
    return await (await this.employeeModel.create(employee)).save()
  }

  async findAll() {
    return await this.employeeModel.find()
  }

  async findOne(id: string) {
    return await this.employeeModel.findById(id)
  }

  async update(id: string, employee: Employee) {
    return await this.employeeModel.findByIdAndUpdate(id, { $set: employee })
  }

  async remove(id: string) {
    return await this.employeeModel.findByIdAndDelete(id)
  }
}
