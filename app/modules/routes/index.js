
import Router from 'koa-router';
import apiV1 from './v1';

const router = Router();

router.use('/v1', apiV1.routes(), apiV1.allowedMethods());

router.get('/version', async (ctx) => {
  ctx.success({}, 'dataCenter server version');
});

module.exports = router;
