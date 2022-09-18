import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, Put } from '@nestjs/common';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Other } from 'src/schemas/other.schema';
import { OtherService } from './other.service';

@Controller('other')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class OtherController {
  constructor(private readonly otherService: OtherService) {}

  @Post()
  async create(@Body() body: Other) {
    return await this.otherService.create(body);
  }

  @Get()
  async findAll() {
    return await this.otherService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.otherService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Other) {
    console.log(body)
    return await this.otherService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.otherService.remove(id);
  }
}
