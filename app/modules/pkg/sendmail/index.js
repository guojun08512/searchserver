
import logger from 'modules/pkg/logger';
import SendMails from './sendmail';

export async function reSendMail(mail) {
  try {
    await mail.sendMail();
  } catch (error) {
    logger.debug(`${mail.subject} sendMail error:${error},resend mail...`);
    setTimeout(() => {
      reSendMail(mail);
    }, 10000);
  }
}

export const sendMailToDeveloper = async (content, subject, attachmentContent, attachmentfilename, receiver) => {
  if (content && subject) {
    const mail = new SendMails(content, subject, attachmentContent, attachmentfilename, receiver);
    await reSendMail(mail);
  } else {
    throw new Error('mail title or content is null');
  }
};
