

import _ from 'lodash';
import logger from 'modules/pkg/logger';
// import * as Redis from 'modules/redis';
import * as Utils from 'modules/utils';
import * as esClient from '../elastic';
import settings from './settings';
import mapping from './mapping';

const indexName = 'node_server_userinfo';
const indexTypeCases = 'node_server_userinfo';

function buildUserNameQuery(search) {
  const queries = [
    {
      match:
      {
        'username.keyword_ik_pinyin_first_letter':
        {
          analyzer: 'id_search_analyzer',
          query: search,
        },
      },
    },
    {
      match:
      {
        'username.keyword_ik_pinyin':
        {
          analyzer: 'id_search_analyzer',
          query: search,
        },
      },
    },
    {
      match:
      {
        'username.keyword_ik':
        {
          analyzer: 'id_search_analyzer',
          query: search,
        },
      },
    },
    {
      match:
      {
        'username.keyword_map':
        {
          analyzer: 'id_search_analyzer',
          query: search,
        },
      },
    },
    {
      match:
      {
        'username.keyword':
        {
          analyzer: 'id_search_analyzer',
          query: search,
        },
      },
    },
  ];
  return queries;
}

function buildCellphoneQuery(search) {
  return [
    {
      match: {
        'cellphone.keyword': {
          analyzer: 'id_search_analyzer',
          query: search,
        },
      },
    },
  ];
}

function buildIdCardQuery(search) {
  return [
    {
      match: {
        'idcard.keyword': {
          analyzer: 'id_search_analyzer',
          query: search,
        },
      },
    },
  ];
}

export const initServerData = async () => {
  try {
    await esClient.pingEs();
    await esClient.indicesDelete(indexName);
    await esClient.indicesCreate(indexName, settings);
    // console.log(JSON.stringify(settings));
    // console.log(JSON.stringify(mapping));
    await esClient.indicesPutMapping(indexName, indexTypeCases, mapping);
  } catch (err) {
    throw new Error(err);
  }
};

export const searchSuggestion = async (options) => {
  const search = options.search || '';
  if (search === '') {
    Utils.invalidParams();
  }
  const limit = options.limit || 10;

  const userNameSuggestion = {
    fieldName: 'username',
    queries: buildUserNameQuery(search),
    stored_fields: ['username'],
    highlight: {
      pre_tags: [''],
      post_tags: [''],
      fields: {
        'username.*': {},
      },
    },
  };

  const cellPhoneSuggestion = {
    fieldName: 'cellphone',
    queries: buildCellphoneQuery(search),
    stored_fields: ['cellphone'],
    highlight: {
      pre_tags: [''],
      post_tags: [''],
      fields: {
        'cellphone.*': {},
      },
    },
  };

  const idCardSuggestion = {
    fieldName: 'idcard',
    queries: buildIdCardQuery(search),
    stored_fields: ['idcard'],
    highlight: {
      pre_tags: [''],
      post_tags: [''],
      fields: {
        'idcard.*': {},
      },
    },
  };

  const searchQueries = [userNameSuggestion, cellPhoneSuggestion, idCardSuggestion];
  const msearchBody = [];

  searchQueries.map((searchQuery) => {
    msearchBody.push({});
    msearchBody.push({
      query: {
        bool: {
          should: {
            dis_max: { queries: searchQuery.queries },
          },
        },
      },
      size: limit,
      highlight: searchQuery.highlight,
    });
    return true;
  });

  const result = await esClient.msearch({
    index: indexName,
    type: indexTypeCases,
    body: msearchBody,
  });
  logger.debug(`hits result === ${JSON.stringify(result)}`);
  const hits = _.map(result.responses, response => _.get(response, 'hits.hits'));
  const suggestions = [];
  try {
    while (suggestions.length < limit) {
      const maxScore = 0;
      let maxFieldIndex = -1;
      for (let i = 0; i < searchQueries.length; i += 1) {
        const hitsLen = hits[i] ? hits[i].length : 0;
        if (hitsLen > 0 && hits[i][0] && hits[i][0]._score > maxScore) { // eslint-disable-line
          maxFieldIndex = i;
        }
      }
      if (maxFieldIndex === -1) {
        break;
      }
      const item = hits[maxFieldIndex].splice(0, 1)[0];
      // const suggestion = _.get(_.values(item.heightline), '0.0'); // eslint-disable-line
      const suggestion = item._source; // eslint-disable-line
      if (suggestion && suggestions.indexOf(suggestion) === -1) {
        suggestions.push({
          uid: suggestion.uid,
          idcard: suggestion.idcard,
          cellphone: suggestion.cellphone,
          username: suggestion.username,
        });
      }
    }
  } catch (err) {
    logger.error(`suggestions error: ${err.message}`);
  }

  return { suggestions };
};

const convertTime = (inputSearch) => {
  let searchTime = inputSearch;
  const pos = searchTime.indexOf('time:');
  const createdAt = [];
  if (pos !== -1) {
    searchTime = searchTime.substr(5, searchTime.length);
    searchTime = searchTime.trim();
    const times = searchTime.split(' ');
    for (let i = 0; i < times.length; i += 1) {
      const t = times[i];
      const tInfo = t.split('.');
      let ti = null;
      if (tInfo[0].length >= 4) {
        ti = new Date(t);
      } else {
        const time = new Date();
        ti = new Date(`${time.getFullYear()}.${t}`);
      }

      if (ti.getTime()) {
        if (i === 1) {
          createdAt.push(new Date(ti.getTime() + 86400000));
        } else {
          createdAt.push(ti);
        }
      }
    }
  }
  return createdAt;
};

function buildQuery(search) {
  const createdAt = convertTime(search);
  let query = {};
  if (createdAt.length) {
    const range = { createdat: {} };
    if (createdAt[0]) {
      range.createdat.gte = createdAt[0].toISOString();
    }
    if (createdAt[1]) {
      range.createdat.lte = createdAt[1].toISOString();
    }

    if (createdAt.length === 1) {
      range.createdat.gte = createdAt[0].toISOString();
      const endTime = new Date(createdAt[0].getTime() + 86400000);
      range.createdat.lte = endTime.toISOString();
    }
    query = {
      range,
    };
  } else {
    const subQueries = _.concat(
      buildUserNameQuery(search),
      buildCellphoneQuery(search),
      buildIdCardQuery(search),
    );
    query = {
      function_score: {
        query: {
          bool: {
            should: subQueries,
          },
        },
        score_mode: 'sum',
      },
    };
  }
  return query;
}

export const explainSearchResult = async (search, tokenizer, filter) => {
  const analyze = await esClient.indicesAnalyze(indexName, { tokenizer, filter }, search);
  logger.debug(analyze);
};

const countSearchResult = async (search) => {
  const result = await esClient.count({
    index: indexName,
    type: indexTypeCases,
    body: {
      query: buildQuery(search),
    },
  });
  return _.get(result, 'count', 0);
};

// const getHighlightObj = (h) => {
//   let hospital = null;
//   let patientId = null;
//   let patientName = null;
//   for (const key in h) { // eslint-disable-line
//     if (key === 'institutionname.keyword') {
//       hospital = h['institutionname.keyword'][0];
//     }
//     if (key === 'patientid.keyword') {
//       patientId = h['patientid.keyword'][0];
//     }
//     if (key === 'patientname.keyword_ik') {
//       patientName = h['patientname.keyword_ik'][0];
//     }
//   }

//   return { hospital, patientId, patientName };
// };

// const responseClient = async (result, explain, authorization) => {
//   console.log('result.hits.hits ===>', result.hits.hits);
//   const searchRes = _.map(result.hits.hits, '_id');
//   let hitInfo = []; // eslint-disable-line
//   if (searchRes.length > 0) {
//     console.log('searchRes ===>', searchRes);
//     console.log('hitInfo ==>', hitInfo);
//     console.log('explain ==>', explain);
//     console.log('authorization ==>', authorization);
//   }
//   return hitInfo;
// };

const searches = async (oldsearch, options) => {
  const startSearch = Date.now();
  // const { search, createdAt } = convertTime(oldsearch);
  const search = oldsearch;
  const createdAt = null;
  // console.log(JSON.stringify(buildQuery(search, createdAt)));
  const result = await esClient.search({
    index: indexName,
    type: indexTypeCases,
    body: {
      query: buildQuery(search, createdAt),
      stored_fields: [],
      highlight: {
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
        fields: {
          'casename.keyword_ik': {
            matched_fields: ['casename.keyword', 'casename.keyword_map'],
            type: 'fvh',
          },
          'hospital.name.keyword': {
            matched_fields: ['hospital.name.keyword', 'hospital.name.keyword_map', 'hospital.name.keyword_ik', 'hospital.name.keyword_ik_pinyin', 'hospital.name.keyword_ik_pinyin_first_letter'],
            type: 'fvh',
          },
          // 'patientid.*': {},
        },
      },
      from: options.offset,
      size: options.limit,
      sort: [{
        _score: 'DESC', // eslint-disable-line
        createdat: 'DESC',
      }],
    },
  });
  const esSearchCost = Date.now() - startSearch;
  // add explain
  // console.log(JSON.stringify(result.hits.hits));
  let explain = {}; // eslint-disable-line
  for(let hit of result.hits.hits) { // eslint-disable-line
    const exp = await esClient.explain({
      index: indexName,
      type: indexTypeCases,
      id: hit._id, // eslint-disable-line
      body: {
        query: buildQuery(search),
      },
    });
    explain[hit._id] = exp.explanation; // eslint-disable-line
    // console.log(JSON.stringify(exp.explanation));
  }
  // await Redis.multiJobs('incr', [`SEARCHWORD:${search}`]);
  const allCount = await countSearchResult(search);
  const hitInfo = _.map(result.hits.hits, '_id'); // await responseClient(result, explain, authorization);
  const allSearchCost = Date.now() - startSearch;
  return {
    hitInfo,
    allCount,
    esSearchCost,
    allSearchCost,
  };
};

export const searchAll = async (options) => {
  const search = options.search || '';
  if (search === '') {
    Utils.invalidParams();
  }
  const offset = options.offset || 0;
  const limit = options.limit || 10;
  return searches(search, { offset, limit }, options.authorization);
};
