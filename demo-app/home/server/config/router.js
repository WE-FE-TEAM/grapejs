/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

module.exports = [
    {
        reg : "^p2p\/uplan\/(\w+)",
        rewrite : "p2p/uplan/detail?id=$1"
    },
    {
        reg : "^p2p\/uplan$",
        rewrite : "p2p/uplan/list"
    }
];
