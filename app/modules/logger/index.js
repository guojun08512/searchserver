import winston from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';
import { logger as koalogger } from 'koa2-winston';
import path from 'path';
import fs from 'fs';

import config from 'modules/config';
import eventType from './logevent';

const timestamp = () => new Date().toISOString();
const formatter = (options) => {
  const message = undefined !== options.message ? options.message : '';
  const meta = options.meta && Object.keys(options.meta).length ? `\n${JSON.stringify(options.meta)}` : '';
  return `${options.timestamp()} - ${options.level.toUpperCase()}:${config.get('VERSION')}:${message}${meta}`;
};

const logdir = config.get('LOG_DIR');
if (!fs.existsSync(logdir)) {
  fs.mkdirSync(logdir);
}

const logger = new winston.Logger({
  level: 'debug',
  transports: [
    // eslint-disable-next-line
    new winston.transports.Console({
      timestamp,
      formatter,
    }),
    // eslint-disable-next-line
    new winstonDailyRotateFile({
      filename: path.join(logdir, 'DataCenterServer.log'),
      timestamp,
    }),
  ],
});
logger.logEvent = (type, description) => {
  logger.info(type, description);
};
logger.eventType = eventType;

export default logger;

const sequelizeLogger = new winston.Logger({
  level: 'debug',
  transports: [
    // eslint-disable-next-line
    new winstonDailyRotateFile({
      filename: path.join(logdir, 'DataCenterServer_db.log'),
      timestamp,
    }),
  ],
});

const koaLogger = koalogger({
  logger,
});

export {
  sequelizeLogger,
  koaLogger,
};
