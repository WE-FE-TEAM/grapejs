/**
 * Created by wangcheng on 16/4/14.
 */


const GrapeBase = require('./base.js');

class HttpBase extends GrapeBase{

    init(http){
        this.http = http;
    }

    getModule(){
        return 'common';
    }


}

module.exports = Http;