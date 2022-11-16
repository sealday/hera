import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, Put } from '@nestjs/common';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Invoice } from 'src/schemas/invoice.schema';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() body: Invoice) {
    return await this.invoiceService.create(body);
  }

  @Get()
  async findAll() {
    return await this.invoiceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.invoiceService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Invoice) {
    return await this.invoiceService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.invoiceService.remove(id);
  }
}
