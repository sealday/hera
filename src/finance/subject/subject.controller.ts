import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Put } from '@nestjs/common';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Subject } from 'src/schemas/subject.schema';
import { SubjectService } from './subject.service';

@Controller('subject')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  async create(@Body() body: Subject) {
    return await this.subjectService.create(body);
  }

  @Get()
  async findAll() {
    return await this.subjectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.subjectService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Subject) {
    console.log(body)
    return await this.subjectService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.subjectService.remove(id);
  }
}
