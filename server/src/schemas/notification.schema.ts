import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Mixed } from 'mongoose'

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop()
  username: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop([String])
  tags: string[];

  @Prop()
  read: boolean;

  @Prop()
  extra: Map<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)