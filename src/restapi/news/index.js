import KoaRouter from 'koa-router';

import news from './news';

const router = new KoaRouter();

router.use('/news', news.routes(), news.allowedMethods());

export default router;