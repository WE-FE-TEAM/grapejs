/**
 * Created by wangcheng on 16/4/13.
 */

'use strict';

const HttpBase = require('../http_base.js');

class ControllerBase extends HttpBase{

    init(http){
        super.init(http);

        let serverConf = grape.configManager.getModuleConfig('common', 'server');
        let sdkConf = serverConf.sdk;
        this.sdkConf = {
            version : sdkConf.version,
            clientVersion : sdkConf.clientVersion,
            platform : sdkConf.platform
        };
    }

    _addVersionData(options){
        if(!options.data){
            options.data = {};
        }
        options.data.version = this.sdkConf.version;
        options.data.clientVersion = this.sdkConf.clientVersion;
        options.data.platform = this.sdkConf.platform;
        return options;
    }

    _addCookie(options){

        let req = this.http.req;

        if(!options){
            options = {};
        }
        if(!options.headers){
            options.headers = {};
        }

        let cookieStr = '';
        for(let key in req.cookies){
            cookieStr += `${key}=${req.cookies[key]};`;
        }

        options.headers.Cookie = cookieStr;

        return options;
    }

    request( apiNameMethod, data, options = {}){
        
        let arr = apiNameMethod.split('.');
        let apiName = arr[0];
        let methodName = arr[1];

        options = this._addVersionData(options);
        options = this._addCookie(options);

        return weSDK.api[apiName][methodName](data, options);
    }
}

module.exports = ControllerBase;