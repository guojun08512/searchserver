
import Router from 'koa-router';

async function insertData(ctx) {
  ctx.success({}, 'insert data success!');
}

const router = Router();
const routers = router
  .post('/', insertData);

module.exports = routers;
