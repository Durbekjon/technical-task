import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './auth.repository';
import { HTTP_MESSAGES } from '@exceptions/http-exceptions';
import { UtilsService } from '@utils/utils.service';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { TokensService } from './auth-token.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '@email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authRepository: AuthRepository,
    private readonly utilsService: UtilsService,
    private readonly tokensService: TokensService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Register a new user
   * @param data Registration data (email, password, fullName)
   * @returns The created user and tokens
   */
  async register(data: RegisterDto): Promise<RegisterResponseDto> {
    const isUserExists = await this.authRepository.findByEmail(data.email);
    if (isUserExists)
      throw new ForbiddenException(HTTP_MESSAGES.AUTH.USER_EXIST);

    data.password = await this.utilsService.generateHash(data.password);

    const { password, ...user } = await this.authRepository.createUser(data);
    const tokens = await this.tokensService.createTokens(user.id);
    return {
      user,
      tokens,
    };
  }

  /**
   * Login a user
   * @param data Login credentials (email, password)
   * @returns The user and tokens
   */
  async login(data: LoginDto) {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) throw new NotFoundException(HTTP_MESSAGES.AUTH.USER_NOT_FOUND);

    const isPasswordMatches = this.utilsService.compareHash(
      data.password,
      user.password,
    );
    if (!isPasswordMatches)
      throw new BadRequestException(HTTP_MESSAGES.AUTH.INVALID_PASSWORD);
    const { password, ...userData } = user;
    const tokens = await this.tokensService.createTokens(user.id);

    return {
      user: userData,
      tokens,
    };
  }

  /**
   * Get user data by user id
   * @param id User id
   * @returns User data
   */
  async getUserById(id: string): Promise<UserDto> {
    const user = await this.authRepository.findById(id);
    if (!user) throw new ForbiddenException(HTTP_MESSAGES.AUTH.USER_NOT_FOUND);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user data
   * @param id User id
   * @param dto Update data (partial user fields)
   * @returns Updated user data
   */
  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDto> {
    // If password is being updated, hash it
    if (dto.password) {
      dto.password = await this.utilsService.generateHash(dto.password);
    }
    const { password, ...updated } = await this.authRepository.updateUser(
      id,
      dto,
    );
    return updated;
  }

  /**
   * Send a password reset OTP to the user's email
   * @param email User's email address
   * @returns Success status
   */
  async forgetPassword(email: string): Promise<{ success: boolean }> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new NotFoundException(HTTP_MESSAGES.AUTH.USER_NOT_FOUND);

    const otp = this.utilsService.generateOtp();
    await Promise.all([
      this.prisma.verificationCodes.create({
        data: {
          user: { connect: { id: user.id } },
          otp: String(otp),
        },
      }),
      this.emailService.sendForgetPasswordOtp(email, otp),
    ]);

    return { success: true };
  }

  /**
   * Reset user password using OTP
   * @param otp OTP code
   * @param newPassword New password
   * @returns Success status
   */
  async resetPassword(
    otp: string,
    newPassword: string,
  ): Promise<{ success: boolean }> {
    const code = await this.authRepository.findVerificationCode(otp);
    if (!code) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    const now = new Date();
    const createdAt = new Date(code.createdAt);
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    if (diffMinutes > 10) {
      await this.authRepository.deleteVerificationCode(code.id);
      throw new BadRequestException('OTP expired');
    }
    const hashed = await this.utilsService.generateHash(newPassword);
    await this.authRepository.updateUserPassword(code.userId, hashed);
    await this.authRepository.deleteVerificationCode(code.id);
    return { success: true };
  }

  /**
   * Refresh access and refresh tokens
   * @param refreshToken The refresh token
   * @returns New access and refresh tokens
   */
  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const userId = await this.tokensService.validateRefreshToken(refreshToken);
    if (!userId) {
      throw new BadRequestException('Invalid refresh token');
    }
    return this.tokensService.createTokens(userId);
  }
}
