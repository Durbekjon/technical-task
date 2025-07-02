import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: Number(this.configService.get<string>('EMAIL_PORT', '465')),
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  sendForgetPasswordOtp = async (email: string, otp: number) => {
    const OTP_VALID_DURATION_MINUTES = await this.configService.get<string>(
      'OTP_VALID_DURATION_MINUTES',
    );
    return this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: 'Verify Your APP account to reset your password',
      html: `<body><p>Your OTP to reset password: <b>${otp}</b></p><p>It expires in ${OTP_VALID_DURATION_MINUTES} minutes.</p></body>`,
    });
  };
}
