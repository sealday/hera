import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type RuleDocument = Rule & Document;

@Schema()
export class Rule {
  @Prop({ unique: true })
  name: string;

  @Prop()
  date: Date;

  @Prop({ enum: ['租金', '计重', '非租', '装卸运费'] })
  category: string;
  
  @Prop()
  comments: string;

  @Prop([raw({
    level: {
      type: String,
      enum: ['产品', '规格', '按单'],
    },
    associate: {
      type: { type: String },
      name: String,
      size: String,
    },
    product: {
      type: { type: String },
      name: String,
      size: String,
    },
    other: [String],
    unitPrice: Number, // 价格
    weight: Number, // 计重
    condition: String, // 按单算的条件
    countType: {
      type: String,
      enum: ['数量', '换算数量', '重量', '实际重量'],
    },
    countSource: {
      type: String,
      enum: ['手动输入', '出库数量', '入库数量', '出入库数量', '合同运费'],
    },
    comments: String,
  })])
  items: Record<string, any>[]
}

export const RuleSchema = SchemaFactory.createForClass(Rule)