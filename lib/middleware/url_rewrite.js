/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

let grape = global.grape;

class UrlRewrite extends grape.MiddlewareBase{

    execute(http){
        console.log(`[url_rewrite]: ${this.http.m1}`);
    }

}


module.exports = UrlRewrite;