/**
 * 框架入口, 加载各种config/rewrite/router/controller
 * Created by jess on 16/4/13.
 */

'use strict';

let grape = require('./core/grape.js');

class GrapeIndex extends grape.Base {

    init(){
        super.init();

    }


    run(options){

    }

    loadController(){

    }
}


module.exports = GrapeIndex;

