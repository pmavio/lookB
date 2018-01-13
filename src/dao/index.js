import DB from '../utils/DB';
import config from '../../config/basic.config';

import NewsDao from './NewsDao';

const daoTypes = [
    NewsDao,


];
const db = new DB(config.mongodb_url);

const daos = {};
daoTypes.forEach(daoType => {
    const dao = new daoType(db);
    daos[dao.getTableName() + 'Dao'] = dao;
});

console.log('all daos =', Object.keys(daos));

export default daos;
