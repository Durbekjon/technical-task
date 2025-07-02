import {
  Controller,
  UseGuards,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { User } from '@decorators/user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Task created',
    type: TaskResponseDto,
  })
  create(
    @User() user: any,
    @Body() body: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.createTask(user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of tasks',
    type: [TaskResponseDto],
  })
  findAll(@User() user: any): Promise<TaskResponseDto[]> {
    return this.taskService.findAllTasks(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Task found',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(
    @User() user: any,
    @Param('id') id: string,
  ): Promise<TaskResponseDto> {
    return this.taskService.findTaskById(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @User() user: any,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.updateTask(id, user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Task deleted',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@User() user: any, @Param('id') id: string): Promise<TaskResponseDto> {
    return this.taskService.deleteTask(id, user.id);
  }
}
