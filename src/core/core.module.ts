import { EmailModule } from '@email/email.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@prisma/prisma.module';
import { UtilsModule } from '@utils/utils.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    PrismaModule,
    UtilsModule,
    EmailModule,
  ],
  exports: [PrismaModule, JwtModule, UtilsModule, EmailModule],
})
export class CoreModule {}
