import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import * as _ from 'lodash';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PlanService } from './plan.service';


@Controller('plan')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class PlanController {
  constructor(private planService: PlanService) { }

  @Get('all')
  async listAll(@Query('returnType') returnType) {
    const pricePlans = await this.planService.find('price')
    const weightPlans = await this.planService.find('weight')
    const lossPlans = await this.planService.find('loss')
    const servicePlans = await this.planService.find('service')
    if (returnType === 'tree') {
      return {
        plans: {
          price: pricePlans,
          weight: weightPlans,
          loss: lossPlans,
          service: servicePlans,
        }
      }
    } else if (returnType === 'flat') {
      const plans = [...pricePlans, ...weightPlans, ...lossPlans, ...servicePlans]
      const result = plans.map(plan => ({
        ...plan.toObject(),
        type: plan.type ? plan.type : 'price', // 兼容
        status: '在用',
      }))
      return { plans: result }
    }
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const plan = await this.planService.findById(id)
    return { plan }
  }

  @Get(':type/list')
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
