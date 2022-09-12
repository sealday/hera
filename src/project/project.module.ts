import { Module } from '@nestjs/common';
import { EmployeesModule } from './employees/employees.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [EmployeesModule, AttendanceModule]
})
export class ProjectModule {}
