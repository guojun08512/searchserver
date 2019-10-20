
import * as esClient from 'modules/pkg/elastic';
import { IndexName, IndexTypeUserInfo } from 'modules/pkg/const';
import { $checkArray } from 'modules/utils';

// curl -XGET 127.0.0.1:9200/node_server_userinfo/_doc/1?pretty

export async function insertData(data) {
  $checkArray(data);
  const obj = [];
  for (let i = 0; i < data.length; i += 1) {
    const id = data[i].id;
    obj.push({
      index: {
        _index: IndexName,
        _id: id,
      },
    });
    obj.push({
      createdat: new Date(),
      ...data[i],
    });
  }
  if (obj.length > 0) {
    const info = await esClient.bulk(IndexName, IndexTypeUserInfo, obj);
    return info;
  }
  return [];
}

export async function updateData(data) {
  $checkArray(data);
  const errorData = [];
  for (let i = 0; i < data.length; i += 1) {
    const obj = data[i];
    const query = {
      match: {
        username: obj.username,
      },
    };
    const result = await esClient.updateByQuery({
      index: IndexName,
      type: IndexTypeUserInfo,
      body: {
        query,
        script: {
          source: 'ctx._source.node_server_userinfo.username.contains(params.username) ctx._source.node_server_userinfo.cellphone.contains(params.cellphone) ctx._source.node_server_userinfo.idcard.contains(params.idcard)',
          lang: 'painless',
          params: {
            ...obj,
          },
        },
      },
    });
    if (!result.status) {
      errorData.push(obj);
    }
  }
  return errorData;
}
