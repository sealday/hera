import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [EventsGateway]
})
export class EventsModule {}
