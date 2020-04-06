import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { Product, Record } from 'src/app/app.service';

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
    const product = await new this.productModel(body)
    return product
  }

  async delete(number: string) {
    await this.productModel.remove({ number })
  }

  /**
   * 更新产品信息
   * @param number 编号
   * @param body 
   */
  async update(number: string, body: Product) {
    const newProduct = _.omit(body, ['_id'])
    const product = await this.productModel.findOne({ number })
    const shouldUpdate = !_.isEqual(
        _.pick(newProduct, ['type', 'name', 'size']),
        _.pick(product, ['type', 'name', 'size']))
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
        // FIXME 检查这里是否有问题
        // multi: true,
        arrayFilters: [{ 'e.number': Number(product.number) }]
      })
    }
    return updatedProduct
  }
}