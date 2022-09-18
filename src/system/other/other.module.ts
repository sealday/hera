import { Module } from '@nestjs/common';
import { OtherService } from './other.service';
import { OtherController } from './other.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Other, OtherSchema } from 'src/schemas/other.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Other.name, schema: OtherSchema }])],
  controllers: [OtherController],
  providers: [OtherService]
})
export class OtherModule {}
