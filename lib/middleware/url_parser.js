/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

let grape = global.grape;

class UrlParser extends grape.MiddlewareBase{

    /**
     * 分析步骤 :
     *
     *    获取是否有配置有rewrite配置
     *      case1) 有
     *          parseRewrite, 遍历router,是否match
     *              case1) match
     *                  利用rewrite匹配替换后的
     *              case2) not match
     *
     *      case2) 没有
     *          parseUrl()
     *              getModule
     *              getController
     *              getAction
     *              getQuery
     *              设置到http对象中
     */
    execute(options){

    }

    /**
     *
     */
    parseUrlPath(){
        let http = this.http,
            req = http.req;
        if(!req.path){
            //this.http.module = configManager.getConf();
            return ;
        }
        let routers = grape.getRouter();

    }



}

module.exports = UrlParser;