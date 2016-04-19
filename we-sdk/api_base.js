/**
 * 所有API类的基类
 * Created by jess on 16/4/19.
 */


'use strict';


class APIBase {

    request(apiName, options, extraOptions = {}){

        //合并版本信息
        options.data = Object.assign( {}, extraOptions.data || {}, options.data);
        //合并请求头信息
        options.headers = Object.assign({}, extraOptions.headers || {}, options.headers);

        console.log( options );
        return weSDK.request(apiName, options);
    }
}


module.exports = APIBase;