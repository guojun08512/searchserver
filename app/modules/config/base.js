
import config from './config';

const baseConfig = {
  debug: config.get('NODE_ENV') === 'development',
  host_url: config.get('HOST_URL'),
};

export default baseConfig;
