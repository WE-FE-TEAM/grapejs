/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

let grape = global.grape,
    util = grape.util;

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
        let http = this.http,
            req = http.req;
        if(!req.path){
            //this.http.module = configManager.getConf();
            return ;
        }
        let routers = this.getRouter();
        let rewritePath = req.path;
        if(!util.isEmpty(routers)){
            rewritePath = this.parseRouter(routers);
        }
        this.parseUrlPath(rewritePath);
    }

    /**
     * 使用path, 使用正则match
     */
    parseRouter(routers){
        let path = this.http.path;
        for(let module in routers){
            let rules = routers[module],
                length = rules.length;
            for(let i = 0; i < length; i++){
                let rule = rules[i],
                    matchRule = rule.match,
                    matchRewrite = rule.rewrite;
                if(util.isRegExp(matchRule)){
                    let match = path.match(matchRule);
                    if(match){
                        matchRewrite = matchRewrite.replace(/$(\d+)/g, (num) => {
                            return match[num];
                        });
                        return matchRewrite;
                    }
                }else if(util.isString(matchRule)){
                    if(path.indexOf(matchRule) == 0){
                        return matchRewrite;
                    }
                }
            }
        }
    }

    /**
     * 1. 获取所有的router
     * 2.
     */
    parseUrlPath(){


    }



}

module.exports = UrlParser;