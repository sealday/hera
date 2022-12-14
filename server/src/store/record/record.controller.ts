import { Controller, UseGuards, Body, Post, Param, Get, UseInterceptors, Res, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RecordService } from './record.service';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { Auth } from 'src/app/user.decorator';
import { User } from 'src/users/users.service';
import { renderIt } from './record.document';
import type { Response } from 'express';


@Controller('record')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class RecordController {
  constructor(private recordService: RecordService) { }
  @Post()
  async create(@Auth() user: User, @Body() body: any) {
    // TODO 处理 body 参数
    const record = await this.recordService.create(body, user)
    return { record }
  }

  @Get('all_payer')
  async payers() {
    const payers = await this.recordService.findPayer()
    return { payers }
  }

  @Post(':id/transport')
  async updateTransport(@Param('id') recordId: string, @Body() body: any, @Auth() user: User) {
    const record = await this.recordService.updateTransport(body, recordId, user)
    return { record }
  }

  @Get(':id/preview')
  async preview(@Param('id') recordId: string, @Auth() user: User, @Res() res: Response) {
    const file = await renderIt()
    file.pipe(res)
  }

  @Post(':id/transport_paid')
  async updateTransportPaidStatus(@Body('paid') isPaid: boolean, @Param('id') recordId: string) {
    const paid = await this.recordService.updateTransportPaidStatus(isPaid, recordId)
    return { paid }
  }

  @Post(':id/transport_checked')
  async updateTransportCheckedStatus(@Body('checked') isChecked: boolean, @Param('id') recordId: string) {
    const checked = await this.recordService.updateTransportCheckedStatus(isChecked, recordId)
    return { checked }
  }

  @Post(':id/delete')
  async delete(@Param('id') recordId: string) {
    await this.recordService.delete(recordId)
    return {}
  }

  @Post(':id/recover')
  async recover(@Param('id') recordId: string) {
    await this.recordService.recover(recordId)
    return {}
  }

  @Post(':id/counterfoil')
  async counterfoil(@Param('id') recordId: string) {
    const record = await this.recordService.counterfoil(recordId)
    return { record }
  }

  @Post(':id/receipt')
  async receipt(@Param('id') recordId: string) {
    const record = await this.recordService.receipt(recordId)
    return { record }
  }

  @Get(':id')
  async detail(@Param('id') recordId: string) {
    const record = await this.recordService.findById(recordId)
    return { record }
  }

  @Post(':id')
  async update(@Param('id') recordId: string, @Body() body: any, @Auth() user: User) {
    const record = await this.recordService.update(body, recordId, user)
    return { record }
  }

  @Post(':id/appendix')
  async uploadAppendix(@Param('id') recordId: string, @Body() body: any) {
    const record = await this.recordService.uploadAppendix(recordId, body)
    return { record }
  }

  @Delete(':id/appendix')
  async deleteAppendix(@Param('id') recordId: string, @Body() body: any) {
    const record = await this.recordService.deleteAppendix(recordId, body)
    return { record }
  }
}
