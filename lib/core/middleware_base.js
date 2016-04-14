/**
 * middleware 基类
 * Created by jess on 16/4/14.
 */


'use strict';

let Http = require('./http.js');


class Middleware extends Http {

    init(req, res){
        super.init(req, res)
    }

}



module.exports = Middleware;