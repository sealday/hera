import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type OtherDocument = Other & Document;

@Schema()
export class Other {
  @Prop({ unique: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  parentId: string;

  @Prop()
  comments: string;

  @Prop()
  isAssociated: boolean;

  @Prop()
  unit: string;

  @Prop()
  display: string;

  @Prop()
  prefix: string;

  @Prop()
  suffix: string;
}

export const OtherSchema = SchemaFactory.createForClass(Other)