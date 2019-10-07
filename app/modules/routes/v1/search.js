
import Router from 'koa-router';
import * as Search from 'modules/pkg/search';

async function getSearchSuggestion(ctx) {
  const data = ctx.request.body;
  const hitInfo = await Search.searchSuggestion({ ...data });
  ctx.success({ ...hitInfo }, 'search suggestion success!');
}

async function getSearchAll(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.request.headers.authorization;
  const hitInfo = await Search.searchAll({ ...data, authorization });
  ctx.success({ ...hitInfo }, 'search All Data success!');
}

async function getExplainSearchResult(ctx) {
  const id = ctx.request.param;
  const search = ctx.request.body;
  const hitInfo = await Search.explainSearchResult(search, id);
  ctx.success({ hitInfo }, 'search explain success!');
}

const router = Router();
const routers = router
  .post('/suggestion', getSearchSuggestion)
  .post('/all', getSearchAll)
  .post('/explain/:id', getExplainSearchResult);

module.exports = routers;
