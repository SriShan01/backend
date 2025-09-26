import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

@Injectable()
export class OrdersService {
  private redis = new Redis(redisUrl);
  
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, items: { productId: number, quantity: number }[]) {
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          items: {
            create: items,
          },
        },
        include: { items: true },
      });

      // Invalidate cache
      await this.redis.del('orders_cache');

      return newOrder;
    });

    // Mock async confirmation
    setTimeout(() => console.log('Order confirmed:', order.id), 1000);

    return order;
  }

  async getOrders(search?: string, page = 1, limit = 10) {
    const cacheKey = `orders_cache_${search || ''}_${page}_${limit}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    let where = {};

    if (search) {
      const id = parseInt(search, 10);
      if (!isNaN(id)) {
        // If search is a number, search by order ID or user ID
        where = {
          OR: [
            { id },
            { userId: id }
          ]
        };
      } else {
        // If search is a string (e.g., product name), search in items
        where = {
          items: {
            some: {
              product: {
                name: { contains: search, mode: 'insensitive' } // assumes product relation exists
              }
            }
          }
        };
      }
    }

    const orders = await this.prisma.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      include: { items: { include: { product: true } } },
    });

    await this.redis.set(cacheKey, JSON.stringify(orders), 'EX', 30); // 30 sec TTL
    return orders;
  }
}
