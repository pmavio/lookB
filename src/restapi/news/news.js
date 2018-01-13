import BaseApi from '../BaseApi';
import {newsDao} from '../../dao'

class News extends BaseApi{

    initExtendsApi(){
        //
    }
}

export default new News(newsDao);