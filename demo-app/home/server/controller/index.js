/**
 * Created by jess on 16/4/15.
 */


'use strict';


class IndexController extends grape.ControllerBase {

    init(http){
        super.init(http);
    }

    list(){
        this.http.res.end('IndexController.list');
    }

    detail(){
        this.http.res.end('IndexController.detail');
    }

}

module.exports = IndexController;