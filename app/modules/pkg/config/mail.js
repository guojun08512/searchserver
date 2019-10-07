
import config from './config';

const mailConfig = {
  smtp: {
    host: config.get('SMTP_HOST'),
    port: config.get('SMTP_PORT'),
    auth: {
      user: config.get('SMTP_USER'),
      pass: config.get('SMTP_PASSWORD'),
    },
    requireTLS: config.getBoolean('SMTP_REQUIRE_TLS'),
  },
  sender: config.get('NOTIFICATION_SENDER'),
  receiver: config.get('NOTIFICATION_RECEVIEVR'),
};

export default mailConfig;
