import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.adminRepository.getAllUsers();
    return users.map(({ password, ...user }) => user);
  }

  /**
   * Get a user by id
   */
  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.adminRepository.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update a user by id
   */
  async updateUser(id: string, data: any): Promise<UserResponseDto> {
    const user = await this.adminRepository.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    const updated = await this.adminRepository.updateUser(id, data);
    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  /**
   * Delete a user by id
   */
  async deleteUser(id: string): Promise<{ success: boolean }> {
    const user = await this.adminRepository.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    const deleted = await this.adminRepository.deleteUser(id);
    const { password, ...userWithoutPassword } = deleted;
    return { success: true };
  }
}
