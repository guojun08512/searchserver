import nconf from 'nconf';
import path from 'path';

nconf.argv();
nconf.env();
nconf.defaults({
  NODE_ENV: 'development',
  NODE_PORT: 7003,
  CPU_NUM: 2,
  VERSION: 'V0.2.1',
  HOST_URL: 'http://127.0.0.1:7003',

  SMTP_HOST: 'email-smtp.us-east-1.amazonaws.com',
  SMTP_PORT: 587,
  SMTP_USER: 'AKIAJDAWDGCOXA5YKBGA',
  SMTP_PASSWORD: 'Arr0GxBGQKm9Z63f5kAf0xmLFx2hFX1Kqn1ZPXt6woeu',
  SMTP_REQUIRE_TLS: true,

  NOTIFICATION_RECEVIEVR: 'jung@keyayun.com',
  NOTIFICATION_SENDER: 'test.dev@curacloudplatform.com',

  PUBLIC_KEY: 'Xingchao2018',

  ES_HOST: '127.0.0.1:9200',
  ES_LOG_LEVEL: 'error',
  ES_INDEX_NAME: 'dev',

  REDIS_DB_URL: 'redis://127.0.0.1:6379/0',
  LOG_DIR: path.join(process.cwd(), '..', 'logs'),

  // GRANT ALL ON image_server.* TO server@'10.10.0.103' IDENTIFIED BY 'CuraCloud123!';
  // flush privileges;
});

export default {
  get: key => nconf.get(key),
  getBoolean: (key) => {
    let val = nconf.get(key);
    if (typeof val === 'string') {
      val = val.toLowerCase();
      return val === 'true' || val === 'yes';
    }
    return Boolean(val);
  },
  getNumber: key => Number(nconf.get(key)),
};
