import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<any[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: string, data: any): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
