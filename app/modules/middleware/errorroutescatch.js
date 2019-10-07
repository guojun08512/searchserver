
import config from 'modules/pkg/config';
import logger from 'modules/pkg/logger';
import ERROR from 'modules/utils';

export default () => (ctx, next) => next().catch((err) => {
  if (ERROR.isCCError(err)) {
    logger.error(`Server error: ${err.errMsg}`);
    ctx.error(err.message, err.errMsg, err.data, err.code);
  } else {
    logger.error(`${config.get('HOST_URL')} === Server error: ${err.status} | ${err.message} | ${err.stack}`);
    switch (err.status) {
      case 401:
        ctx.error('Authentication Error', 'Access token is invalid.', null, 1001);
        break;
      default:
        if (config.get('NODE_ENV') === 'development') {
          ctx.error('Server error', err.message, err.stack, 500);
        } else {
          ctx.error('Server error', err.message, null, 500);
        }
    }
  }
});
