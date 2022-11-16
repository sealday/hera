import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { Product, Record } from 'src/app/app.service';
import { convert } from 'src/utils/pinyin';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private productModel: Model<Product>,
    @InjectModel('Record') private recordModel: Model<Record>, 
  ) { }

  async find() {
    const products = await this.productModel.find().sort({ number: 1 })
    return products
  }

  async create(body: Product) {
    body.pinyin = convert(body.name)
    const product = await new this.productModel(body).save()
    return product
  }

  async delete(id: string) {
    await this.productModel.findByIdAndRemove(id)
  }

  /**
   * 更新产品信息
   * @param id
   * @param body 
   */
  async update(id: string, body: Product) {
    const newProduct = _.omit(body, ['_id'])
    newProduct.pinyin = convert(body.name)
    const product = await this.productModel.findById(id)
    const shouldUpdate = !_.isEqual(
        _.pick(newProduct, ['type', 'name', 'size']),
        _.pick(product, ['type', 'name', 'size']))
    const oldProduct = _.pick(product, ['type', 'name', 'size'])
    Object.assign(product, newProduct)
    const updatedProduct = await product.save()
    if (shouldUpdate) {
      await this.recordModel.collection.updateMany({}, {
        $set: {
          "entries.$[e].name": product.name,
          "entries.$[e].size": product.size,
          "entries.$[e].type": product.type,
        }
      }, {
        arrayFilters: [
          {
            'e.name': oldProduct.name,
            'e.size': oldProduct.size,
            'e.type': oldProduct.type
          },
        ]
      })
    }
    return updatedProduct
  }
}