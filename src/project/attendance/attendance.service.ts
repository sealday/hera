import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument} from 'src/schemas/attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(@InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>) { }

  async create(attendance: Attendance) {
    return await (await this.attendanceModel.create(attendance)).save()
  }

  async findAll() {
    return await this.attendanceModel.find()
  }

  async findOne(id: string) {
    return await this.attendanceModel.findById(id)
  }

  async update(id: string, attendance: Attendance) {
    return await this.attendanceModel.findByIdAndUpdate(id, { $set: attendance })
  }

  async remove(id: string) {
    return await this.attendanceModel.findByIdAndDelete(id)
  }
}