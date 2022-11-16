import { Controller, UseGuards, Post } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Auth } from 'src/app/user.decorator';
import { User } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Auth() user: User) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout() {
    return { message: '成功登出' }
  }
}
