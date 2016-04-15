/**
 * 请求声明周期的hook执行配置
 * Created by jess on 16/4/15.
 */


'use strict';

module.exports = {

    request_arrive : [],
    request_parse : [ 'url_rewrite'],
    action_start : [],
    action_end : []
};
