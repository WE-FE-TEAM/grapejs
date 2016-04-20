/**
 * 所有API类的基类
 * Created by jess on 16/4/19.
 */


'use strict';


class APIBase {

    /**
     * 调用 RAL 请求后端服务
     * @param apiName {string} 服务名
     * @param options {object} 该服务需要的参数
     * @param extraOptions {object} 包含额外参数的对象, 比如 headers/ 版本信息等
     * @returns {*}
     */
    request(apiName, options, extraOptions = {}){

        //合并版本信息
        options.data = Object.assign( {}, extraOptions.data || {}, options.data);
        //合并请求头信息
        options.headers = Object.assign({}, extraOptions.headers || {}, options.headers);

        
        return weSDK.request(apiName, options);
    }
}


module.exports = APIBase;