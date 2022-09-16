import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type RuleDocument = Rule & Document;

@Schema()
export class Rule {
  @Prop({ unique: true })
  name: string;

  @Prop()
  date: Date;

  @Prop({ enum: ['租金', '计重', '非租'] })
  category: string;
  
  @Prop()
  comments: string;

  @Prop([raw({
    level: {
      type: String,
      enum: ['产品', '规格', '按单'],
    },
    product: {
      type: { type: String },
      name: String,
      size: String,
    },
    unitPrice: Number, // 价格
    weight: Number, // 计重
    countType: {
      type: String,
      enum: ['数量', '换算数量', '重量', '实际重量'],
    },
    comments: String,
  })])
  items: Record<string, any>[]
}

export const RuleSchema = SchemaFactory.createForClass(Rule)