
import Router from 'koa-router';
import * as Data from 'modules/pkg/data';

async function insertData(ctx) {
  const info = await Data.insertData(ctx.body.data);
  ctx.success({ info }, 'insert data success!');
}

const router = Router();
const routers = router
  .post('/', insertData);

module.exports = routers;
