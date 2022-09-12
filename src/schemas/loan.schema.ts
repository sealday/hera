import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type LoanDocument = Loan & Document;

@Schema()
export class Loan {
  @Prop({ unique: true })
  id: string;

  @Prop()
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop()
  date: Date;

  @Prop()
  money: number;

  @Prop()
  rate: number;

  @Prop({ enum: ['借出', '借入'] })
  type: string;

  @Prop()
  comments: string;

}

export const LoanSchema = SchemaFactory.createForClass(Loan)