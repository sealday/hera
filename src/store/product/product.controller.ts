import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) { }
  @Get()
  async list() {
    const products = await this.productService.find()
    return { products }
  }

  @Post()
  async create(@Body() body: any) {
    const product = await this.productService.create(body)
    return { product }
  }

  @Post(':number')
  async update(@Body() body: any, @Param('number') number: string) {
    const product = await this.productService.update(number, body)
    return { product }
  }

  @Post(':number/delete')
  async delete(@Param('number') number: string) {
    await this.productService.delete(number)
    return {}
  }
}
