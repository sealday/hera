import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterSchema } from 'src/schemas/counter.schema';
import { RecycleSchema } from 'src/schemas/recycle.schema';
import { StoreModule } from 'src/store/store.module';

import { AuthModule } from '../auth/auth.module';
import { MongoConfigModule } from '../configs/mongo.module';
import { EventsModule } from '../events/events.module';
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
import { LoggerService } from './logger/logger.service';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule, 
    UsersModule,
    MongoConfigModule,
    EventsModule,
    StoreModule,
    MongooseModule.forFeature([
      { name: 'Users', schema: UsersSchema },
      { name: 'Record', schema: RecordSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Setting', schema: SettingSchema },
      { name: 'Operation', schema: OperationSchema },
      { name: 'Counter', schema: CounterSchema },
      { name: 'Recycle', schema: RecycleSchema },
    ]),
  ],
  controllers: [AppController, UsersController, SettingsController],
  providers: [AppService, LoggerService, SettingsService],
  exports: [AppService, LoggerService],
})
export class AppModule {}
