import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {
  @Prop({ enum: ['增值税专用发票', '增值税普通发票'] })
  type: string;

  @Prop({ enum: ['进项发票', '销项发票'] })
  direction: string;

  @Prop({ unique: true })
  id: string;

  @Prop()
  date: Date;

  @Prop()
  sale: string;

  @Prop()
  purchase: string;

  @Prop()
  comments: string;

  @Prop([raw({
    projectId: { type: mongoose.Schema.Types.ObjectId },
    content: { type: String },
    amount: { type: Number },
    taxRate: { type: Number },
    tax: { type: Number },
    total: { type: Number },
  })])
  items: Record<string, any>[]
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice)