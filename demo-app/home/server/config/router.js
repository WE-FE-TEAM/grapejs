/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

module.exports = [
    {
        match : "^p2p\/uplan\/(\w+)",
        rewrite : "p2p/uplan/detail?id=$1"
    },
    {
        match : "^p2p\/uplan$",
        rewrite : "p2p/uplan/list"
    }
];
