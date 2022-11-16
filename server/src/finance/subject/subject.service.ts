import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument} from 'src/schemas/subject.schema';

@Injectable()
export class SubjectService {
  constructor(@InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>) { }

  async create(subject: Subject) {
    return await (await this.subjectModel.create(subject)).save()
  }

  async findAll() {
    return await this.subjectModel.find()
  }

  async findOne(id: string) {
    return await this.subjectModel.findById(id)
  }

  async update(id: string, subject: Subject) {
    console.log(subject)
    return await this.subjectModel.findByIdAndUpdate(id, { $set: subject })
  }

  async remove(id: string) {
    return await this.subjectModel.findByIdAndDelete(id)
  }
}