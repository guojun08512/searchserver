
import Router from 'koa-router';
import * as Data from 'modules/pkg/data';

async function insertData(ctx) {
  const info = await Data.insertData(ctx.request.body);
  ctx.success({ info }, 'insert data success!');
}

async function updateData(ctx) {
  const info = await Data.updateData(ctx.request.body);
  ctx.success({ info }, 'insert data success!');
}

const router = Router();
const routers = router
  .post('/', insertData)
  .put('/', updateData);

module.exports = routers;
