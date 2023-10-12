import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document, Types, SchemaTypes } from 'mongoose'

export type ContractDocument = Contract & Document;

@Schema()
export class Item {
  _id: Types.ObjectId;
  @Prop()
  category: string;
  @Prop({ type: SchemaTypes.ObjectId })
  plan: Types.ObjectId | string;
  @Prop({ type: SchemaTypes.ObjectId })
  weight: Types.ObjectId | string;
  @Prop()
  start: Date;
  @Prop()
  end: Date;
}

class CalcItem {
  name: string;
  count: number;
  days: number;
  price: number;
  unit: string;
  category: string;
  unitPrice: number;
  outDate?: Date;
  inOut: string;
}

@Schema()
export class Calc {
  _id: Types.ObjectId;
  @Prop()
  name: string;
  @Prop()
  start: Date;
  @Prop()
  end: Date;
  @Prop()
  status: string;
  @Prop([CalcItem])
  history: CalcItem[];
  @Prop([CalcItem])
  list: CalcItem[];
  @Prop()
  group: mongoose.Schema.Types.Mixed;
  @Prop([CalcItem])
  nameGroup: CalcItem[];
  @Prop()
  freightGroup: mongoose.Schema.Types.Mixed;
  @Prop()
  debug: mongoose.Schema.Types.Mixed;
  // 1%、3%、6%、9%、13%
  @Prop()
  taxRate: number;
  // 是否含税
  @Prop()
  includesTax: boolean;
}

@Schema({ timestamps: true })
export class Contract {
  @Prop()
  name: string;

  @Prop()
  code: string;

  @Prop()
  date: Date;

  @Prop({ type: SchemaTypes.ObjectId })
  project: Types.ObjectId | string;

  @Prop()
  address: string;

  @Prop()
  comments: string;

  // 1%、3%、6%、9%、13%
  @Prop()
  taxRate: number;

  // 是否含税
  @Prop()
  includesTax: boolean;

  // 合同状态：完结、进行、已删除
  @Prop()
  status: string;

  @Prop([Item])
  items: Item[];

  @Prop([Calc])
  calcs: Calc[];

  @Prop([String])
  tags: string[];

  @Prop()
  isScheduled: boolean;

  @Prop()
  scheduledAt: number;

  /**
   * 租金天数计算方式
   * 0：正常结束时间减去开始时间
   * 1：记头记尾
   * 2：不记头不记尾
   */
  @Prop({ default: 0 })
  rentCalculation: number;
}

export const ContractSchema = SchemaFactory.createForClass(Contract)