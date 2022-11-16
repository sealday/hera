import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, Put } from '@nestjs/common';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Rule } from 'src/schemas/rule.schema';
import { RuleService } from './rule.service';

@Controller('rule')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  async create(@Body() body: Rule) {
    return await this.ruleService.create(body);
  }

  @Get()
  async findAll() {
    return await this.ruleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ruleService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Rule) {
    return await this.ruleService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ruleService.remove(id);
  }
}
