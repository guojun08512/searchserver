
import Router from 'koa-router';
import SearchApi from './search';
import DataApi from './data';

const router = Router();
router.use('/search', SearchApi.routes(), SearchApi.allowedMethods());
router.use('/data', DataApi.routes(), DataApi.allowedMethods());
export default router;
