import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(dto: RegisterDto) {
    const { fullName, email, password } = dto;
    return this.prisma.user.create({
      data: { fullName, email, password },
    });
  }

  async updateUser(id: string, dto: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async findVerificationCode(otp: string) {
    return this.prisma.verificationCode.findFirst({
      where: { otp },
      include: { user: true },
    });
  }

  async deleteVerificationCode(id: string) {
    return this.prisma.verificationCode.delete({ where: { id } });
  }

  async updateUserPassword(userId: string, password: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  }
}
