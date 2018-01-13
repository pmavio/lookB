var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mongoConnections = {};
const mongoClients = {};

class DB{
    get dbUrl() {
        return this._dbUrl;
    }

    set dbUrl(value) {
        this._dbUrl = value;
    }

    constructor(dbUrl){
        this._dbUrl = dbUrl;

        let connection = null;
        if(!mongoConnections[dbUrl]) {
            connection = mongoose.createConnection(dbUrl, {useMongoClient: true});

            connection.on('connected', function (err) {
                if (err)
                    return err;
            });

            connection.on('error', function (err) {
                return err;
            });

            connection.on('disconnected', function () {
                return "Mongoose disconnected";
            });

            process.on('SIGINT', function () {
                connection.close(function () {
                    process.exit(0);
                });
            });

            mongoConnections[dbUrl] = connection;
        }else{
            connection = mongoConnections[dbUrl];
        }

        this.connection = connection;
    }

    getDbModel(tableName, tableStructure){
        if(!tableName || typeof tableName !== 'string') throw 'DB.getDbModel tableName不能为空，且必须是字符串';
        else if(!tableStructure || typeof tableStructure !== 'object') throw 'DB.getDbModel tableStructure不能为空，且必须是对象';

        let client = mongoClients[tableName];

        if (!client) {
            //构建用户信息表结构
            const schema = new mongoose.Schema(tableStructure);

            //构建model
            client = mongoose.model(tableName, schema, tableName, {connection: this.connection});
            if(this.connection){
                //根据mongoose.model方法的源码，若传入的connection不为空，需要手动执行init
                client.init();
            }

            mongoClients[tableName] = client;
        }
        return client;
    }

}

export default DB;