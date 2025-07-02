import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { TaskStatus } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * Map a task entity to TaskResponseDto, converting nulls to undefined
   */
  private toResponseDto(task: any): TaskResponseDto {
    if (!task) return task;
    return {
      ...task,
      description: task.description ?? undefined,
      dueDate: task.dueDate ?? undefined,
    };
  }

  /**
   * Create a new task for a user
   */
  async createTask(userId: string, data: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.taskRepository.createTask({ ...data, userId });
    return this.toResponseDto(task);
  }

  /**
   * Get all tasks for a user
   */
  async findAllTasks(userId: string): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.findAllTasks(userId);
    return tasks.map(this.toResponseDto);
  }

  /**
   * Get a single task by id for a user
   */
  async findTaskById(id: string, userId: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findTaskById(id, userId);
    if (!task) throw new NotFoundException('Task not found');
    return this.toResponseDto(task);
  }

  /**
   * Update a task by id for a user
   */
  async updateTask(id: string, userId: string, data: UpdateTaskDto): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findTaskById(id, userId);
    if (!task) throw new NotFoundException('Task not found');
    const updated = await this.taskRepository.updateTask(id, userId, data);
    return this.toResponseDto(updated);
  }

  /**
   * Delete a task by id for a user
   */
  async deleteTask(id: string, userId: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findTaskById(id, userId);
    if (!task) throw new NotFoundException('Task not found');
    const deleted = await this.taskRepository.deleteTask(id, userId);
    return this.toResponseDto(deleted);
  }
}
