import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import * as _ from 'lodash';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { PlanService } from './plan.service';

@Controller('plan')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class PlanController {
  constructor(private planService: PlanService) { }

  @Get(':type')
  async list(@Param('type') type: string) {
    const plans = await this.planService.find(type)
    return { plans }
  }

  @Post(':type')
  async create(@Param('type') type: string, @Body() body: any) {
    if (type === 'price') {
      body = body.weightPlan ? body : _.omit(body, ['weightPlan'])
    }
    const plan = await this.planService.create(type, body)
    return { plan }
  }

  @Post(':type/:id')
  async update(@Param('type') type: string, @Param('id') id: string, @Body() body: any) {
    if (type === 'price') {
      body = body.weightPlan ? body : _.omit(body, ['weightPlan'])
    }
    const plan = await this.planService.update(type, id, body)
    return { plan }
  }

  @Post(':type/:id/delete')
  async delete(@Param('type') type: string, @Param('id') id: string) {
    const plan = await this.planService.remove(type, id)
    return { plan }
  }
}
