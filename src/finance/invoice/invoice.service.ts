import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument} from 'src/schemas/invoice.schema';

@Injectable()
export class InvoiceService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>) { }

  async create(invoice: Invoice) {
    return await (await this.invoiceModel.create(invoice)).save()
  }

  async findAll() {
    return await this.invoiceModel.find()
  }

  async findOne(id: string) {
    return await this.invoiceModel.findById(id)
  }

  async update(id: string, invoice: Invoice) {
    console.log(invoice)
    return await this.invoiceModel.findByIdAndUpdate(id, { $set: invoice })
  }

  async remove(id: string) {
    return await this.invoiceModel.findByIdAndDelete(id)
  }
}