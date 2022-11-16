import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ = require('lodash');
import { Model } from 'mongoose';
import { Rule, RuleDocument} from 'src/schemas/rule.schema';

@Injectable()
export class RuleService {
  constructor(@InjectModel(Rule.name) private ruleModel: Model<RuleDocument>) { }

  async create(rule: Rule) {
    return await (await this.ruleModel.create(_.omit(rule, ['_id']))).save()
  }

  async findAll() {
    return await this.ruleModel.find()
  }

  async findOne(id: string) {
    return await this.ruleModel.findById(id)
  }

  async update(id: string, rule: Rule) {
    return await this.ruleModel.findByIdAndUpdate(id, { $set: rule })
  }

  async remove(id: string) {
    return await this.ruleModel.findByIdAndDelete(id)
  }
}