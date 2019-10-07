
import * as esClient from 'modules/pkg/elastic';
import { IndexName, IndexTypeCases } from 'modules/pkg/const';

export async function insertData(data) {
  const info = await esClient.bulk(IndexName, IndexTypeCases, data);
  console.log(info);
  return info;
}
