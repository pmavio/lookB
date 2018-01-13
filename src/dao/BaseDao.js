export default class BaseDao {

    constructor(db, tableName = '', tableStructure = {}) {
        this.db = db;
        this.tableName = tableName;
        this.tableStructure = tableStructure;

        //拼表结构
        const finalStructure = Object.assign(this.getTableStructure(), this.getBaseTableStructure());
        this.dbModel = db.getDbModel(this.getTableName(), finalStructure);
    }

    /**
     * 返回表名
     * @returns {string}
     */
    getTableName() {
        return this.tableName;
    }

    /**
     * 返回表结构
     * @returns {{}}
     */
    getTableStructure() {
        return this.tableStructure;
    }

    getBaseTableStructure(){
        return {
            createtime: {
                type: Date,
                default: Date.now
            },
            updatetime: {
                type: Date,
                default: Date.now
            },
            enable: {
                type: Boolean,
                default: true
            },
        }
    }


    //全真七子
    getList(conditions) {
        return this.dbModel.find(conditions);
    }

    getCount(conditions) {
        return this.dbModel.count(conditions);
    }

    getById(_id) {
        return this.dbModel.findOne({_id});
    }

    insert(data) {
        return new this.dbModel(data).save();
    }

    update(data) {
        const _id = data._id;
        return this.dbModel.findOneAndUpdate({_id}, {$set: data});
    }

    remove(conditions) {
        return this.dbModel.update(conditions, {$set: {enable: false}});
    }

    removeById(_id) {
        return this.dbModel.findOneAndUpdate({_id}, {$set: {enable: false}});
    }

}