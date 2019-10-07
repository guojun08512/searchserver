
import request from 'request-promise';
import { lookup } from 'lookup-dns-cache';

export const requestApi = (uri, method, headers, body) => request({
  uri,
  method,
  headers,
  body,
  lookup,
  family: 4,
  forever: true,
  json: true,
});
