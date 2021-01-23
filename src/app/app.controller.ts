import { BadRequestException, Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppService } from './app.service';


@Controller()
@UseGuards(JwtAuthGuard)
export class AppController {
  constructor(
    private appService: AppService,
  ) { }

  /**
   * 加载系统数据
   * @param req 
   */
  @Get('load')
  async load(@Request() req: any) {
    const res = await this.appService.load()
    return {
      message: '加载成功！',
      data: {
        ...res,
        user: req.user,
      }
    }
  }

  /**
   * topk 操作数据
   * @param req 
   */
  @Get('operation/top_k')
  async topK(@Request() req: any) {
    const operations = await this.appService.queryTopKLog(req.user)
    return {
      data: {
        operations,
      }
    }
  }

  /**
   * nextk 操作数据
   * @param req 
   */
  @Get('operation/next_k')
  async nextK(@Request() req: any, @Query('id') id: string) {
    const operations = await this.appService.queryNextKLog(req.user, id)
    return {
      data: {
        operations,
      }
    }
  }

  /**
   * 查询仓库状态
   * @param type 状态类型
   * @param storeId 待查询仓库 ID
   */
  @Get('status/:type')
  async status(@Param('type') type: string, @Query('store') storeId: string) {
    switch (type) {
      case 'new_in_records':
        return {
          data: {
            num: await this.appService.recordCount(storeId, 'inStock', 'createdAt')
          }
        };
      case 'new_out_records':
        return {
          data: {
            num: await this.appService.recordCount(storeId, 'outStock', 'createdAt')
          }
        };
      case 'update_records':
        return {
          data: {
            num: await this.appService.recordCount(storeId, null, 'updatedAt')
          }
        };
      default:
        throw new BadRequestException()
    }
  }
}
