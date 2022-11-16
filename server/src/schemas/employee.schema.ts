import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ unique: true })
  employeeID: number;

  @Prop()
  name: string;

  @Prop()
  post: string;

  @Prop({ enum: ['男', '女'] })
  gendor: string;

  @Prop({ unique: true })
  id: string;
  
  @Prop()
  phone: string;

  @Prop()
  mail: string;

  @Prop()
  comments: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee)