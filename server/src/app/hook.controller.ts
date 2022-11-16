import { Controller, Get, Query } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('hook')
export class HookController {

  constructor(private storeService: StoreService) { }

  @Get('qiqi')
  async from_qiqi(@Query('openid') openId: string, @Query('requestId') requestId: string) {
    await this.storeService.put('qiqi_hook:requestid:' + requestId, openId)
    return { message: 'done', code: 0 }
  }

}
