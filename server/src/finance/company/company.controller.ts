import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CompanyService } from './company.service';

@Controller('company')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class CompanyController {
  constructor(private companyService: CompanyService) { }

  @Get(':id')
  async details(@Param('id') id: string) {
    const company = await this.companyService.findById(id)
    return { company }
  }

  @Post(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const company = await this.companyService.update(id, body)
    return { company }
  }

  @Get()
  async list() {
    const company = await this.companyService.find()
    return { company }
  }
  
  @Post(':id/delete')
  async delete(@Param('id') id: string) {
    const company = await this.companyService.delete(id)
    return { company }
  }

  @Post()
  async create(@Body() body: any) {
    const company = await this.companyService.create(body)
    return { company }
  }
}
