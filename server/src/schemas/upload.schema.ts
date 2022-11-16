import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UploadDocument = Upload & Document;

@Schema()
export class Upload {
  @Prop()
  filename: string;

  @Prop()
  mimetype: string;

  @Prop()
  extension: string;

  @Prop()
  size: string;
}

export const UploadSchema = SchemaFactory.createForClass(Upload)