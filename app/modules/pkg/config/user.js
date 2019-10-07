
import config from './config';

const userConfig = {
  adminAccountName: config.get('ADMIN_ACCOUNT_NAME'),
  adminAccountPassword: config.get('ADMIN_ACCOUNT_PASSWORD'),
  adminAccountEmail: config.get('ADMIN_ACCOUNT_EMAIL'),
};

export default userConfig;
