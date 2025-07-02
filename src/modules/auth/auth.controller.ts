import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { IUser, UserDto } from './dto/user.dto';
import { User } from '@decorators/user.decorator';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'User already exists' })
  register(@Body() body: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and get tokens' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  getMe(@User() user: IUser): Promise<UserDto> {
    return this.authService.getUserById(user.id);
  }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update current user' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated', type: UserDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  updateUser(
    @User() user: IUser,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    return this.authService.updateUser(user.id, body);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiBody({ schema: { example: { refreshToken: 'your_refresh_token' } } })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed',
    schema: { example: { accessToken: '...', refreshToken: '...' } },
  })
  @ApiResponse({ status: 400, description: 'Invalid refresh token' })
  refreshTokens(
    @Body() body: { refreshToken: string },
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.refreshTokens(body.refreshToken);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiBody({ schema: { example: { email: 'user@example.com' } } })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  forgotPassword(
    @Body() body: { email: string },
  ): Promise<{ success: boolean }> {
    return this.authService.forgetPassword(body.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({
    schema: { example: { otp: '123456', newPassword: 'newpassword123' } },
  })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  resetPassword(
    @Body() body: { otp: string; newPassword: string },
  ): Promise<{ success: boolean }> {
    return this.authService.resetPassword(body.otp, body.newPassword);
  }
}
