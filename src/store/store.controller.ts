import { Controller, Get, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/app/user.decorator';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.service';

import { StoreService } from './store.service';

@Controller('store')
@UseInterceptors(WrapperInterceptor)
@UseGuards(JwtAuthGuard)
export class StoreController {

  constructor(private storeService: StoreService) { }

  @Get(':id')
  async summary(
    @Param('id') projectId: string, 
    @Query('condition') condition: string,
    @Auth() user: User,
  ) {
    // TODO 参数校验
    const params = JSON.parse(condition)
    const { inRecords, outRecords } = await this.storeService.summary(projectId, params, user)
    return { inRecords, outRecords }
  }

  @Get('rent')
  async rent(@Query('condition') condition: string, @Auth() user: User) {
    // TODO 参数检查
    const params = JSON.parse(condition)
    // 解析
    condition = JSON.parse(condition)
    const startDate = new Date(params.startDate)
    const endDate = new Date(params.endDate)
    const project = Types.ObjectId(params.project)
    const pricePlanId = Types.ObjectId(params.planId)
    const rent = await this.storeService.calculate({
      startDate,
      endDate,
      project,
      pricePlanId,
      user,
    })
    return { rent }
  }

  @Get('simple_search')
  async search(@Query('condition') condition: string, @Auth() user: User) {
    // TODO 检查参数
    const params = JSON.parse(condition)
    const search = await this.storeService.search(params, user)
    return { search }
  }
}