
import Elasticsearch from 'elasticsearch';
import config from 'modules/pkg/config';
import logger from 'modules/pkg/logger';

const client = new Elasticsearch.Client({
  host: config.get('ES_HOST'),
  log: config.get('ES_LOG_LEVEL'),
});

export function pingEs() {
  return new Promise((resolve, reject) => {
    client.ping({
      requestTimeout: 1000,
    }, (error) => {
      if (error) {
        logger.error(`error: ${error}`);
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}

export function msearch(options) {
  return new Promise((resolve, reject) => {
    client.msearch(options).then((resp) => {
      resolve(resp);
    }, (err) => {
      reject(err);
    });
  });
}

export function search(options) {
  return new Promise((resolve, reject) => {
    client.search(options).then((resp) => {
      resolve(resp);
    }, (err) => {
      reject(err);
    });
  });
}

export function count(options) {
  return new Promise((resolve, reject) => {
    client.count(options).then((resp) => {
      resolve(resp);
    }, (err) => {
      reject(err);
    });
  });
}

export function explain(options) {
  return new Promise((resolve, reject) => {
    client.explain(options).then((resp) => {
      resolve(resp);
    }, (err) => {
      reject(err);
    });
  });
}

export function indicesDelete(indexName) {
  return new Promise((resolve) => {
    client.indices.delete({
      index: indexName,
    }).then((info) => {
      resolve(info);
    }).catch((err) => {
      if (err) {
        logger.debug(`indicesDelete: ${err.message}`);
      }
      resolve(true);
    });
  });
}

export function indicesCreate(indexName, settings) {
  return new Promise((resolve, reject) => {
    client.indices.create({
      index: indexName,
      body: { ...settings },
    }).then((info) => {
      resolve(info);
    }).catch((err) => {
      if (err) {
        logger.error(`indicesCreate: ${err.message}`);
        reject(err.message);
      }
    });
  });
}

export function indicesPutMapping(indexName, indexType, mapping) {
  return new Promise((resolve, reject) => {
    client.indices.putMapping({
      index: indexName,
      type: indexType,
      include_type_name: true,
      body: { ...mapping },
    }).then((info) => {
      resolve(info);
    }).catch((err) => {
      if (err) {
        logger.error(`indicesPutMapping: ${err.message}`);
        reject(err.message);
      }
    });
  });
}

export function indicesAnalyze(indexName, analyzer, searchWord) {
  return new Promise((resolve, reject) => {
    client.indices.analyze({
      index: indexName,
      tokenizer: 'first_pinyin_letter',
      filter: ['NGram_filter'],
      attributes: ['patientname.*'],
      text: searchWord,
    }).then((info) => {
      resolve(info);
    }).catch((err) => {
      if (err) {
        logger.error(`indicesAnalyze: ${err.message}`);
        reject(err.message);
      }
    });
  });
}

export function bulk(indexName, indexType, obj) {
  return new Promise((resolve, reject) => {
    client.bulk({
      index: indexName,
      type: indexType,
      refresh: true,
      body: obj,
    }).then((info) => {
      resolve(info);
    }).catch((err) => {
      reject(err);
    });
  });
}

export function updateByQuery(obj) {
  return new Promise((resolve, reject) => {
    client.updateByQuery(obj).then((info) => {
      resolve(info);
    }).catch((err) => {
      reject(err);
    });
  });
}
