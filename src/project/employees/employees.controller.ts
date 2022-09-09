import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Put } from '@nestjs/common';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Employee } from 'src/schemas/employee.schema';
import { EmployeesService } from './employees.service';

@Controller('employees')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(@Body() body: Employee) {
    return { employee: await this.employeesService.create(body) };
  }

  @Get()
  async findAll() {
    return { employee: await this.employeesService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { employee: await this.employeesService.findOne(id) };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Employee) {
    return { employee: await this.employeesService.update(id, body) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return { employee: await this.employeesService.remove(id) };
  }
}
