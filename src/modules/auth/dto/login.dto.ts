import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserDto } from './user.dto';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'The password of the user',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class LoginResponseDto {
  user: UserDto;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}
