import { Body, Controller, Get, Param, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ContractService } from './contract.service';
import { Auth } from 'src/app/user.decorator';
import { User } from 'src/users/users.service';
import { Types } from 'mongoose';
import type { Response } from 'express';
import { renderIt } from 'src/store/record/record.document';

@Controller('contract')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class ContractController {
  constructor(private contractService: ContractService) { }

  @Get(':id')
  async details(@Param('id') id: string) {
    const contract = await this.contractService.findById(id)
    return { contract }
  }

  @Post(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const contract = await this.contractService.update(id, body)
    return { contract }
  }

  @Get()
  async list() {
    const contract = await this.contractService.find()
    return { contract }
  }
  
  @Post(':id/delete')
  async delete(@Param('id') id: string) {
    const contract = await this.contractService.updateStatus(id, '已删除')
    return { contract }
  }

  @Post(':id/finish')
  async finish(@Param('id') id: string) {
    const contract = await this.contractService.updateStatus(id, '完结')
    return { contract }
  }

  @Post(':id/add_item')
  async addItem(@Param('id') id: string, @Body() body: any) {
    const contract = await this.contractService.addItem(id, body)
    return { contract }
  }

  @Post(':id/add_calc')
  async addCalc(@Param('id') id: string, @Body() body: any,  @Auth() user: User) {
    const contract = await this.contractService.addCalc(id, body, user)
    return { contract }
  }

  @Post(':id/calc/:calcId/restart')
  async restartCalc(@Param('id') id: string, @Body() body: any,  @Auth() user: User) {
    const contract = await this.contractService.restartCalc(id, body, user)
    return { contract }
  }

  @Get(':id/calc/:calcId/preview')
  async previewCalc(@Param('id') id: string, @Param('calcId') calcId: string, @Auth() user: User, @Res() res: Response) {
    const file = await this.contractService.calcPreview(id, calcId)
    file.pipe(res)
  }

  @Post(':id/item/:itemId/delete')
  async deleteItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    const contract = await this.contractService.deleteItem(id, itemId);
    return { contract }
  }

  @Post(':id/calc/:calcId/delete')
  async deleteCalc(@Param('id') id: string, @Param('calcId') calcId: string) {
    const contract = await this.contractService.deleteCalc(id, calcId);
    return { contract }
  }

  @Post(':id/unfinish')
  async unfinish(@Param('id') id: string) {
    const contract = await this.contractService.updateStatus(id, '进行')
    return { contract }
  }

  @Post()
  async create(@Body() body: any) {
    const contract = await this.contractService.create(body)
    return { contract }
  }
}
