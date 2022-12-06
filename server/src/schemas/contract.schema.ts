import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document, Types } from 'mongoose'

export type ContractDocument = Contract & Document;

@Schema()
export class Item {
  @Prop()
  _id: Types.ObjectId;
  @Prop()
  category: string;
  @Prop()
  plan: Types.ObjectId;
  @Prop()
  weight: Types.ObjectId;
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
  @Prop()
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
}

@Schema({ timestamps: true })
export class Contract {
  @Prop()
  name: string;

  @Prop()
  code: string;

  @Prop()
  date: Date;

  @Prop()
  project: Types.ObjectId;

  @Prop()
  address: string;

  @Prop()
  comments: string;

  // 合同状态：完结、进行、已删除
  @Prop()
  status: string;

  @Prop([Item])
  items: Item[];

  @Prop([Calc])
  calcs: Calc[];
}

export const ContractSchema = SchemaFactory.createForClass(Contract)