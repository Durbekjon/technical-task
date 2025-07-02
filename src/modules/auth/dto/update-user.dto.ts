import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: 'strong.password:123',
    description: 'The password of the user',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
