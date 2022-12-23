import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  // 系统名称
  @Prop()
  systemName: string;

  // 对外公司名称
  @Prop([String])
  externalNames: string[];

  @Prop()
  address: string;

  // 运输单打印侧边说明
  @Prop()
  printSideComment: string;

  // 出入库打印侧边说明
  @Prop()
  orderPrintSideComment: string;

  // 职务列表
  @Prop([String])
  posts: string[];

  @Prop([String])
  receiptUsers: string[];

  @Prop()
  receiptTimeout: number;

  @Prop([String])
  counterfoilUsers: string[];
  
  @Prop()
  counterfoilTimeout: number;

}

export const SettingSchema = SchemaFactory.createForClass(Setting)