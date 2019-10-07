
import config from 'modules/pkg/config';

export default async (ctx, next) => {
  const version = config.get('VERSION');
  ctx.error = (message = '', errMsg = '', data = {}, code = 500) => {
    ctx.body = {
      version,
      code,
      message,
      errMsg: `${errMsg}`,
      data,
    };
  };

  ctx.notFound = (message, data = {}) => {
    ctx.body = {
      version,
      code: 404,
      message,
      data,
    };
  };

  ctx.success = (data, message = 'ok') => {
    ctx.body = {
      version,
      code: 200,
      message,
      data,
    };
  };

  await next();
};
