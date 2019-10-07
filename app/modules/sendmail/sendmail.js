
import nodemailer from 'nodemailer';

import logger from 'modules/logger';
import { mail as MailConfig } from 'modules/config';

export default class SendMails {
  constructor(content, subject) {
    this.content = content;
    this.subject = subject;
    this.transport = nodemailer.createTransport(MailConfig.smtp);
  }

  sendMail() {
    const mailOptions = {
      from: MailConfig.sender,
      to: MailConfig.receiver,
      subject: this.subject,
      text: 'test',
      html: this.content,
    };
    const transport = this.transport;
    return new Promise((resolve, reject) => {
      transport.sendMail(mailOptions, (err, info) => {
        logger.info('send mail task', err, info);
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }
}
