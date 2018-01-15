import BaseApi from '../BaseApi';
import {newsDao} from '../../dao';
import Response from '../../utils/Response';
import moment from 'moment';

class News extends BaseApi{

    initExtendsApi(){
        //
        this.get('/getHomeNews', async ctx => {
            const conditions = this.getDefaultConditions(ctx.query);
            const sort = {createtime: -1};
            const promise = newsDao.getList(conditions)
                .sort(sort)
                .exec();
            ctx.body = await Response.fromPromise(promise)
                .then(res => {
                    if(res.code === 0){
                        res.result = res.result.map(item => {
                            return {
                                _id: item._id,
                                content: item.content,
                                publishtime: item.publishtime,
                                time: moment(item.publishtime).format('HH:mm'),
                            };
                        })
                    }
                    console.log(res.result);
                    return res;
                });
        });
    }
}

export default new News(newsDao);