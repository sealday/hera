import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FinanceModule } from 'src/finance/finance.module';
import { ProjectModule } from 'src/project/project.module';
import { ContractSchema } from 'src/schemas/contract.schema';
import { CounterSchema } from 'src/schemas/counter.schema';
import { RecycleSchema } from 'src/schemas/recycle.schema';
import { StoreSchema } from 'src/schemas/store.schema';
import { Upload, UploadSchema } from 'src/schemas/upload.schema';
import { StoreModule } from 'src/store/store.module';
import { SystemModule } from 'src/system/system.module';
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
import { HookController } from './hook.controller';
import { LoggerService } from './logger/logger.service';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';
import { StoreService } from './store.service';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'client/system'),
      serveRoot: '/system', 
      renderPath: '*',
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot(),
    AuthModule, 
    UsersModule,
    MongoConfigModule,
    EventsModule,
    StoreModule,
    FinanceModule,
    ProjectModule,
    SystemModule,
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forFeature([
      { name: 'Users', schema: UsersSchema },
      { name: 'Record', schema: RecordSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Setting', schema: SettingSchema },
      { name: 'Operation', schema: OperationSchema },
      { name: 'Counter', schema: CounterSchema },
      { name: 'Recycle', schema: RecycleSchema },
      { name: 'Store', schema: StoreSchema },
      { name: 'Contract', schema: ContractSchema },
      { name: Upload.name, schema: UploadSchema },
    ]),
  ],
  controllers: [AppController, UsersController, SettingsController, HookController],
  providers: [AppService, LoggerService, SettingsService, StoreService],
  exports: [AppService, LoggerService],
})
export class AppModule {}
