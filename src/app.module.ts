import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { AdminModule } from '@admin/admin.module';
import { TasksModule } from '@tasks/tasks.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { UtilsModule } from './common/utils/utils.module';
import { EmailModule } from './common/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AdminModule,
    TasksModule,
    PrismaModule,
    PrismaModule,
    UtilsModule,
    EmailModule,
  ],
})
export class AppModule {}
