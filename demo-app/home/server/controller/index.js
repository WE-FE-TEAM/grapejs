/**
 * Created by jess on 16/4/15.
 */


'use strict';


class IndexController extends grape.ControllerBase {

    init(http){
        super.init(http);
    }

    listAction(){
        this.http.res.end('IndexController.list');
    }

    detailAction(){
        this.http.res.end('IndexController.detail');
    }

}

module.exports = IndexController;