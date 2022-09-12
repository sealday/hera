import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, Put } from '@nestjs/common';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Loan } from 'src/schemas/loan.schema';
import { LoanService } from './loan.service';

@Controller('loan')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  async create(@Body() body: Loan) {
    return await this.loanService.create(body);
  }

  @Get()
  async findAll() {
    return await this.loanService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.loanService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Loan) {
    return await this.loanService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.loanService.remove(id);
  }
}
