import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { AuthRepository } from './auth.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoreModule } from '@corecore.module';
import { TokensService } from './auth-token.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PrismaService,
    JwtStrategy,
    TokensService,
  ],
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    CoreModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
