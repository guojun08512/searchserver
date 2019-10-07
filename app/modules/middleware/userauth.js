
import logger from 'modules/logger';
import jwt from 'jsonwebtoken';
import config from 'modules/config';

const getClientIp = req => (req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress);

const getAuthInfo = token => jwt.verify(token.substr(7), config.get('PUBLIC_KEY'));

export default async (ctx, next) => {
  const token = ctx.request.header.authorization;
  if (token) {
    try {
      ctx.userInfo = getAuthInfo(token);
      logger.info(`login User: ${JSON.stringify(ctx.userInfo)}  login IP: ${getClientIp(ctx.req)}`);
    } catch (error) {
      throw error;
    }
  }
  await next();
};
