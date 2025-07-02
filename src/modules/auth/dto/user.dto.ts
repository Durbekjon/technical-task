import { ApiProperty } from "@nestjs/swagger";

export interface IUser {
  id: string;
}
export class UserDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique identifier of the registered user',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the registered user',
  })
  fullName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the registered user',
  })
  email: string;
}