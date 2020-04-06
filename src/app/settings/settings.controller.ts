import { Body, Controller, UseGuards, UseInterceptors, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { WrapperInterceptor } from '../wrapper.interceptor';
import { SettingsService } from './settings.service';

@Controller('system/settings')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
export class SettingsController {
  constructor(private settingsService: SettingsService) { }

  @Post()
  async update(@Body() body: any) {
    const settings = await this.settingsService.update(body)
    return { settings }
  }
}
