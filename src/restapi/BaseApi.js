import KoaRouter from 'koa-router';
import Response from "../utils/Response";
import postParse from '../utils/postParse';

export default class BaseApi extends KoaRouter{

    constructor(dao, baseApiOptions = {
        getList: true,
        getCount: true,
        getById: true,
        insert: true,
        update: true,
        remove: false,  //默认禁止条件删除
        removeById: true,
    }){
        super();
        this.dao = dao;
        this.baseApiOptions = baseApiOptions;

        this.initExtendsApi();
        this._initBaseApi(dao);
    }

    async parsePostData(ctx){
        return await postParse.parsePostData(ctx);
    }

    initExtendsApi(){

    }

    getBaseApiOptions(){
        return this.baseApiOptions;
    }

    _initBaseApi(dao){
        if(!dao) return;

        //列表
        const options = this.getBaseApiOptions();
        if(options.getList) {
            this.get('/', async ctx => {
                const query = ctx.query;
                const currentPage = parseInt(query.currentPage);
                const pageSize = parseInt(query.pageSize);
                const skipNum = pageSize * (currentPage - 1);

                const conditions = this.getDefaultConditions(query);

                const sortOrder = this.getDefaultSortOrder(query);

                const promise = dao.getList(conditions);
                if (skipNum) promise.skip(skipNum);
                if (pageSize) promise.limit(pageSize);
                if (sortOrder) promise.sort(sortOrder);

                ctx.body = await Response.fromPromise(promise.exec());
            });
        }

        //计数
        if(options.getCount) {
            this.get('/count', async ctx => {
                const conditions = this.getDefaultConditions(ctx.query);
                ctx.body = await Response.fromPromise(dao.getCount(conditions).exec());
            });
        }

        //id查找
        if(options.getById) {
            this.get('/:id', async ctx => {
                const _id = ctx.params.id;
                // console.log(this.getTableName() + ' getById ' + _id);
                ctx.body = await Response.fromPromise(dao.getById(_id).exec());
            });
        }

        //插入
        if(options.insert) {
            this.post('/', async ctx => {
                const data = await this.parsePostData(ctx);
                //自动填入创建时间和更新时间
                if (data && !data.createtime) {
                    data.createtime = '' + new Date().getTime();
                }
                if (data && !data.updatetime) {
                    data.updatetime = '' + new Date().getTime();
                }
                ctx.body = await Response.fromPromise(dao.insert(data));
            });
        }

        //id更新
        if(options.update) {
            this.put('/', async ctx => {
                const data = await this.parsePostData(ctx);
                //自动填入更新时间
                if (data && !data.updatetime) {
                    data.updatetime = '' + new Date().getTime();
                }
                ctx.body = await Response.fromPromise(dao.update(data).exec());
            });
        }

        //条件删除
        if(options.remove) {
            this.delete('/', async ctx => {
                const query = ctx.query;
                const conditions = this.getDefaultConditions(query);
                ctx.body = await Response.fromPromise(dao.remove(conditions).exec());
            });
        }

        //id删除
        if(options.removeById) {
            this.delete('/:id', async ctx => {
                const _id = ctx.params.id;
                ctx.body = await Response.fromPromise(dao.removeById(_id).exec());
            });
        }
    }

    /**
     * 获得默认列表的query conditions
     * @param query
     * @returns {{}}
     */
    getDefaultConditions(query){
        let c = {};
        if(query){
            if(query.conditions){
                c = query.conditions;
            }
            else{
                c = Object.assign({}, query);
                //TODO
                delete c.pageSize;
                delete c.currentPage;
                delete c.sort;
            }
        }
        c.enable = true;
        return c;
    }

    /**
     * 获得默认列表的query sortOrder
     * @param query
     * @returns {{_id: number}}
     */
    getDefaultSortOrder(query){
        if(query && query.sort){
            if(typeof query.sort === 'string'){
                query.sort = JSON.parse(query.sort);
                console.log(query);
            }
            return query.sort;
        }
        return {_id: -1};
    }
}