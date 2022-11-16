import { Controller, UseInterceptors, UseGuards, Get, Post, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';
import { UsersService, User } from './users.service';
import { Auth } from 'src/app/user.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) { }

  @Get()
  async find() {
    const users = await this.usersService.list()
    return { users }
  }

  @Post()
  async create(@Body() body: any) {
    const user = await this.usersService.create(body)
    return { user }
  }

  @Post(':id')
  async update(@Body() body: any, @Param('id') userId: string, @Auth() operator: User) {
    // TODO 检查权限
    const user = await this.usersService.update(body, userId, operator)
    return { user }
  }

  @Post(':id/profile')
  async profile(@Body() body: any, @Param('id') userId: string, @Auth() operator: User) {
    // TODO 检查权限
    const user = await this.usersService.update(body, userId, operator)
    return { user }
  }

  @Post(':id/delete')
  async remove(@Param('id') userId: string) {
    const user = await this.usersService.remove(userId)
    return { user }
  }
}
