/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

module.exports = [
    {
        reg : "^common\/uplan\/(\w+)",
        rewrite : "common/uplan/detail?id=$1"
    },
    {
        reg : "^common\/uplan$",
        rewrite : "common/uplan/list"
    }
];
