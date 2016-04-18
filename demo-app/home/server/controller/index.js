/**
 * Created by jess on 16/4/15.
 */


'use strict';


class IndexController extends grape.ControllerBase {

    init(http){
        super.init(http);
    }

    listAction(){
        grape.log.info(`log file test`);
        this.http.res.end('IndexController.list');
    }

    detailAction(){
        this.warn(`warn log in IndexController.detailAction`);
        this.http.res.end('IndexController.detail');
    }

}

module.exports = IndexController;