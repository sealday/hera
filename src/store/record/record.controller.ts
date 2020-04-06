import { Controller, UseGuards, Request, Body, Post, Param, Get, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RecordService } from './record.service';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { Auth } from 'src/app/user.decorator';
import { User } from 'src/users/users.service';

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

  @Get(':id')
  async detail(@Param('id') recordId: string) {
    const record = await this.recordService.findById(recordId)
    return { record }
  }

  @Get('all_payer')
  async payers() {
    const payers = await this.recordService.findPayer()
    return { payers }
  }

  @Post(':id')
  async update(@Param('id') recordId: string, @Body() body: any, @Auth() user: User) {
    const record = await this.recordService.update(body, recordId, user)
    return { record }
  }

  @Post('/record/:id/transport')
  async updateTransport(@Param('id') recordId: string, @Body() body: any, @Auth() user: User) {
    const record = await this.recordService.updateTransport(body, recordId, user)
    return { record }
  }

  @Post('/record/:id/transport_paid')
  async updateTransportPaidStatus(@Body('paid') isPaid: boolean, @Param('id') recordId: string) {
    const paid = await this.recordService.updateTransportPaidStatus(isPaid, recordId)
    return { paid }
  }

  @Post('/record/:id/transport_checked')
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
}
