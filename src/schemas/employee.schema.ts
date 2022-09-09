import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop()
  employeeID: string;

  @Prop()
  name: string;

  @Prop({ enum: ['男', '女'] })
  gendor: string;

  @Prop()
  id: string;
  
  @Prop()
  phone: string;

  @Prop()
  mail: string;

  @Prop()
  comments: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee)