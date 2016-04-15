/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

const GrapeBase = require('./base.js');

class Http extends GrapeBase{

    init(req, res){
        this.req = req;
        this.res = res;
        //当前请求对应的module
        this.module = '';
        this.controller = '';
        this.action = '';
        this.query = req.query;
    }

    //从URL中解析出当前module
    parseModule(){
        //let url =
    }
}

module.exports = Http;