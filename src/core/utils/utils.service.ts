import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UtilsService {
  async generateHash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }

  generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
  compareHash(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
