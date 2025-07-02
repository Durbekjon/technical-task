import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminGuard } from '@guards/admin.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@ApiBearerAuth('access-token')
@Controller('admin/users')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get all users
   * @returns List of all users
   */
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all users in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserResponseDto],
  })
  getAllUsers(): Promise<UserResponseDto[]> {
    return this.adminService.getAllUsers();
  }

  /**
   * Get a user by id
   * @param id User ID
   * @returns User data
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Returns a user by their unique ID.',
  })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.adminService.getUserById(id);
  }

  /**
   * Update a user by id
   * @param id User ID
   * @param body Update data
   * @returns Updated user data
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Update user by id',
    description: 'Updates a user by their unique ID.',
  })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiBody({
    schema: {
      example: { fullName: 'New Name', email: 'new@email.com', isAdmin: false },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUser(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<UserResponseDto> {
    return this.adminService.updateUser(id, body);
  }

  /**
   * Delete a user by id
   * @param id User ID
   * @returns Deleted user data
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user by id',
    description: 'Deletes a user by their unique ID.',
  })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.adminService.deleteUser(id);
  }
}
