/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

const GrapeBase = require('./base.js');

class Http extends GrapeBase{

    init(req, res){
        this.req = req;
        this.res = res;
    }
}

module.exports = Http;