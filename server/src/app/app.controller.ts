import { BadRequestException, Controller, Get, Param, Post, Query, Request, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppService } from './app.service';
import { Express } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('init')
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.appService.upload(file)
  }

  @Get('upload/:filename')
  async upload(@Param('filename') filename: string) {
    const file = createReadStream(join(process.cwd(), 'uploads', filename))
    return new StreamableFile(file)
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

  @Get('notifications')
  async notifications(@Request() req: any) {
    const notifications = await this.appService.getNotifications(req.user)
    return {
      data: {
        notifications,
      }
    }
  }
  
  @Get('notifications/all')
  async notificationsAll(@Request() req: any) {
    const notifications = await this.appService.getNotificationsAll(req.user)
    return {
      data: {
        notifications,
      }
    }
  }

  @Post('notifications/read_all')
  async readAllNotifications(@Request() req: Express.Request) {
    await this.appService.readAllNotifications(req.user)
    return {
      data: {
        result: 'done'
      }
    }
  }

  @Post('notifications/:id')
  async readNotification(@Request() req: Express.Request, @Param('id') id: string) {
    await this.appService.readNotification(req.user, id)
    return {
      data: {
        result: 'done'
      }
    }
  }
}
