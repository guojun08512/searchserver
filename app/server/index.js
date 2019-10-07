
import Koa from 'koa';
import views from 'koa-views';
import json from 'koa-json';
import jwt from 'koa-jwt';
import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import cors from 'koa2-cors';
import indexRoute from 'modules/routes';
import { koaLogger } from 'modules/logger';
import config from 'modules/config';
import responseData from 'modules/middleware/responsedata';
import errorRouteCatch from 'modules/middleware/errorroutescatch';
import userAuth from 'modules/middleware/userauth';

const logger = require('modules/logger').default;
const koaStatic = require('koa-static')(`${__dirname}/../../public`);

const app = new Koa();
// error handler
onerror(app);

// middlewares
app.use(koaLogger);
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
app.use(cors({
  origin: () => '*',
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app
  .use(responseData)
  .use(errorRouteCatch())
  .use(koaStatic)
  .use(views(`${__dirname}/../../views`, { extension: 'pug' }))
  .use(jwt({ secret: config.get('PUBLIC_KEY') }).unless({ path: [/^\/public|\/login|\/assets|\/version/] }))
  .use(bodyparser({
    enableTypes: ['json', 'form'],
    formLimit: '10mb',
    jsonLimit: '10mb',
  }))
  .use(userAuth)
  .use(json())
  .use(indexRoute.routes())
  .use(indexRoute.allowedMethods());

app.use(async (ctx, next) => {
  if (ctx.status) {
    ctx.body = 'not found - 404';
  }
  return next();
});

// error-handling
app.on('error', (err, ctx) => {
  logger.error('server error', err, ctx);
});

export default app;
