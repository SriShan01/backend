// src/products/products.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('products')
export class ProductsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() body: { name: string; price: number }) {
    return this.prisma.product.create({ data: body });
  }
}
