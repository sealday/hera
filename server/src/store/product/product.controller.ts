import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, Delete, Put } from '@nestjs/common';
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
    return await this.productService.find()
  }

  @Post()
  async create(@Body() body: any) {
    return await this.productService.create(body)
  }

  @Put(':id')
  async update(@Body() body: any, @Param('id') id: string) {
    return await this.productService.update(id, body)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id)
  }
}
