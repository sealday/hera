import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WrapperInterceptor } from 'src/app/wrapper.interceptor';

@Controller('product')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WrapperInterceptor)
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
