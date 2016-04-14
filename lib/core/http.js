/**
 * Created by wangcheng on 16/4/14.
 */


const GrapeBase = require('./base.js');

class Http extends GrapeBase{

    init(req, res){
        this.req = req;
        this.res = res;
        this.module = this.getModule();
    }

    getModule(){
        return 'common';
    }


}

module.exports = Http;