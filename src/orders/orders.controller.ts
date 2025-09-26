import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@Body() body: { userId: number, items: { productId: number, quantity: number }[] }) {
    return this.ordersService.createOrder(body.userId, body.items);
  }

  @Get()
  get(@Query('search') search: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.ordersService.getOrders(search, page, limit);
  }
}
