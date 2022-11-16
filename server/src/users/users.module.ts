import { Module, forwardRef } from '@nestjs/common';

import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from '../schemas/users.schema';
import { AppModule } from 'src/app/app.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Users', schema: UsersSchema },
    ]),
    forwardRef(() => AppModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
