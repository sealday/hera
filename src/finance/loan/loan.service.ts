import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loan, LoanDocument} from 'src/schemas/loan.schema';

@Injectable()
export class LoanService {
  constructor(@InjectModel(Loan.name) private loanModel: Model<LoanDocument>) { }

  async create(loan: Loan) {
    return await (await this.loanModel.create(loan)).save()
  }

  async findAll() {
    return await this.loanModel.find()
  }

  async findOne(id: string) {
    return await this.loanModel.findById(id)
  }

  async update(id: string, loan: Loan) {
    return await this.loanModel.findByIdAndUpdate(id, { $set: loan })
  }

  async remove(id: string) {
    return await this.loanModel.findByIdAndDelete(id)
  }
}