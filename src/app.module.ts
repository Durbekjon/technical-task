import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { AdminModule } from '@admin/admin.module';
import { TasksModule } from '@tasks/tasks.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AdminModule,
    TasksModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
