// src/users/users.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() body: { name: string; email: string }) {
    return this.prisma.user.create({ data: body });
  }
}
