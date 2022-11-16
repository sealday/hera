import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type AttendanceDocument = Attendance & Document;

@Schema()
export class Attendance {
  @Prop()
  employeeID: string;

  @Prop()
  projectId: mongoose.Schema.Types.ObjectId;

  @Prop()
  date: Date;

  @Prop()
  morning: number;

  @Prop()
  afternoon: number;

  @Prop()
  evening: number;

  @Prop()
  comments: string;

  @Prop([raw({
    type: { type: String },
    content: { type: String },
    count: { type: Number },
    price: { type: Number },
  })])
  quantity: Record<string, any>[]
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance)