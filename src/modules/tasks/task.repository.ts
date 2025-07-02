import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(data: any) {
    return this.prisma.task.create({ data });
  }

  async findAllTasks(userId: string) {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async findTaskById(id: string, userId: string) {
    return this.prisma.task.findFirst({ where: { id, userId } });
  }

  async updateTask(id: string, userId: string, data: any) {
    return this.prisma.task.update({ where: { id }, data });
  }

  async deleteTask(id: string, userId: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
