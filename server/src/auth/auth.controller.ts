import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Auth } from 'src/app/user.decorator';
import { User } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'login api' })
  @ApiResponse({ status: 401, description: '账号或者密码错误' })
  @ApiResponse({ status: 201, description: '登录成功' })
  async login(@Body() @Auth() user: User) {
    return this.authService.login(user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout() {
    return { message: '成功登出' }
  }
}
