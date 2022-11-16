import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, Put } from '@nestjs/common';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Attendance } from 'src/schemas/attendance.schema';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async create(@Body() body: Attendance) {
    return await this.attendanceService.create(body);
  }

  @Get()
  async findAll() {
    return await this.attendanceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.attendanceService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Attendance) {
    return await this.attendanceService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.attendanceService.remove(id);
  }
}
