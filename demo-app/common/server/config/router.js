/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

module.exports = [
    {
        match : /^common\/uplan\/(\w+)/,
        rewrite : "common/uplan/detail?id=$1"
    },
    {
        match : "^common\/uplan$",
        rewrite : "common/uplan/list"
    }
];
