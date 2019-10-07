
import config from 'modules/config';
import redis from 'redis';
import logger from 'modules/logger';

const client = redis.createClient(config.get('REDIS_DB_URL'));

client.on('error', (error) => {
  logger.error(error);
});

export const multiClient = async (job) => {
  const multi = client.multi(job);
  return new Promise((resolve, reject) => {
    multi.exec((error, res) => {
      if (error) {
        reject(new Error(`redis multiClient error:${error}`));
      } else {
        resolve(res[1]);
      }
    });
  });
};

const createRedisJobs = (dbIndex, cmd, options) => {
  const jobSelect = [];
  jobSelect.push('select');
  jobSelect.push(dbIndex);

  const job2 = [];
  job2.push(cmd);
  options.map(option => job2.push(option));

  const jobs = [];
  jobs.push(jobSelect);
  jobs.push(job2);
  return jobs;
};

/**
 * redis Transaction action
 * @param dbIndex
 * @param cmd
 * @param options value array
 * @returns {Promise<void>}
 */
export const multiJobs = async (cmd, options, dbIndex = 0) => {
  const jobs = await createRedisJobs(dbIndex, cmd, options);
  return multiClient(jobs);
};
