import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}

  // try to use nodemailer to send email with mailgun
  private readonly transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_REFRESH_TOKEN'),
    },
  }
  );
  notifyEmail({ email }: NotifyEmailDto) {
    this.transport.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Reservation Confirmation',
      text: 'Your reservation has been confirmed',
    });
  }
}
