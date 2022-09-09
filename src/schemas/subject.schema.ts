import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type SubjectDocument = Subject & Document;

@Schema()
export class Subject {
  @Prop({ enum: ['资产', '负债', '成本', '损益'] })
  type: string;

  @Prop({ unique: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  parentId: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject)