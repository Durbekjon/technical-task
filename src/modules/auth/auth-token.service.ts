import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createTokens(userId: string) {
    const access_token = await this.createAccessToken(userId);
    const refresh_token = await this.createRefreshToken(userId);

    return {
      access_token,
      refresh_token,
    };
  }

  private async createAccessToken(userId: string) {
    return this.jwtService.signAsync({ id: userId });
  }

  private async createRefreshToken(userId: string) {
    const expiresIn =
      await this.configService.get<string>('REFRESH_EXPIRES_IN');

    return this.jwtService.signAsync(
      {
        id: userId,
      },
      {
        secret: this.configService.get<string>('REFRESH_SECRET'),
        expiresIn,
      },
    );
  }

  /**
   * Validate a refresh token and return the userId if valid
   * @param refreshToken The refresh token
   * @returns userId if valid, otherwise null
   */
  async validateRefreshToken(refreshToken: string): Promise<string | null> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
      });
      return payload.id;
    } catch (e) {
      return null;
    }
  }
}
