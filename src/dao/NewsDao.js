import BaseDao from './BaseDao';

export default class NewsDao extends BaseDao{
    getTableName(){
        return 'news';
    }

    getTableStructure(){
        return {
            publishtime: {
                type: Date,
                default: Date.now
            },
            content: String,

        }
    }
}