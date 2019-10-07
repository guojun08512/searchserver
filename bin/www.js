
import config from 'modules/config';
import app from 'server';
import cluster from 'cluster';
import logger from 'modules/logger';
import { initServerData } from 'modules/search';

async function initMater() {
  await initServerData();
}

if (cluster.isMaster) {
  initMater()
    .then(() => {
      const cpu = config.get('CPU_NUM');
      for (let i = 0; i < cpu; i += 1) {
        cluster.fork();
      }
      cluster.on('exit', (worker) => {
        logger.error(`${worker.process.pid} died`);
        cluster.fork();
      });
    });
} else {
  app.listen(config.get('NODE_PORT'));
  logger.debug(`worker(${cluster.worker.id}) Listening on ${config.get('NODE_PORT')}`);
}

