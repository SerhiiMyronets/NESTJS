import { Injectable } from '@nestjs/common';
import { UserDocument } from '../users/domain/user.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDocument) {
    const url = `example.com/auth/confirm?token=${user.emailConfirmation.confirmationCode}`;

    await this.mailerService.sendMail({
      to: user.accountData.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Social Network! Confirm your Email',
      template: './confirmation',
      context: {
        name: user.accountData.login,
        url,
      },
    });
  }
}
