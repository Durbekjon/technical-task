import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CoreModule } from '@corecore.module';
import { TaskRepository } from './task.repository';

@Module({
  imports: [CoreModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TasksModule {}
