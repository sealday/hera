import { Module } from '@nestjs/common';
import { OtherModule } from './other/other.module';

@Module({
  imports: [OtherModule]
})
export class SystemModule {}
