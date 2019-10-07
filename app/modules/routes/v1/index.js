
import Router from 'koa-router';
import searchApi from './search';

const router = Router();
router.use('/searchs', searchApi.routes(), searchApi.allowedMethods());
export default router;
