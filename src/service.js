import Koa from 'koa2';
import KoaRouter from 'koa-router';
import cors from 'koa2-cors';
import restapi from './restapi';

const service = new Koa();

service.use(cors({
        credentials: true,   //设置允许跨域
    }
));

service.use(restapi.routes(), restapi.allowedMethods())

export default service;