import { Controller, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller()
export class UsersController {
  constructor(
    private authService: AuthService,
  ) { }

  @UseGuards(LocalAuthGuard )
  @Post ('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard )
  @Post('logout')
  logout() {
    return { message: '成功登出' }
  }
}
