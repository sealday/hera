import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { MongoConfigModule } from '../configs/mongo.module';
import { OperationSchema } from '../schemas/operation.schema';
import { ProductSchema } from '../schemas/product.schema';
import { ProjectSchema } from '../schemas/project.schema';
import { RecordSchema } from '../schemas/record.schema';
import { SettingSchema } from '../schemas/setting.schema';
import { UsersSchema } from '../schemas/users.schema';
import { UsersController } from '../users/users.controller';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule, 
    UsersModule,
    MongoConfigModule,
    EventsModule,
    MongooseModule.forFeature([
      { name: 'Users', schema: UsersSchema },
      { name: 'Record', schema: RecordSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Setting', schema: SettingSchema },
      { name: 'Operation', schema: OperationSchema },
    ]),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
