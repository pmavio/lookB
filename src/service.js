import Koa from 'koa2';
import KoaRouter from 'koa-router';
import restapi from './restapi';

const service = new Koa();



service.use(restapi.routes(), restapi.allowedMethods())

export default service;