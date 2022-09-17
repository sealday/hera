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

  @Get('simple_search')
  async search(@Query('condition') condition: string, @Auth() user: User) {
    // TODO 检查参数
    const params = JSON.parse(condition)
    const search = await this.storeService.search(params, user)
    return { search }
  }

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
}