/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

module.exports = [
    {
        match : /^\/home\/user\/listAction\/id\/(\d+)/,
        rewrite : "home/user/setting/listAction/name/we-fe?id=$1"
    },
    {
        match : "/home/listAction/10",
        rewrite : "home/user/setting/listAction?id=10"
    }
];
