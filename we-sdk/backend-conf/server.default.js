/**
 * 所有环境下,相同的配置,放在这里,避免
 * Created by jess on 16/1/26.
 */

'use strict';


const SERVICE_ONLINE = 'api.we.com:80';

var temp = SERVICE_ONLINE.split(':');

//默认的后端service配置
let defaultServer = [
    {
        host : temp[0],
        port : parseInt( temp[1] )
    }
];


////////////////  !!! 只能 研发 修改 !!! //////////////////////////////////

/////////////////  QA(测试) 请修改  server.qa.js  /////////////////////

//配置说明
/*
 *  config = {
 *               serviceName : {
 *                       server : [ { host : '', port : 80 } ],
 *                       we_use_mock === true,则会使用下面的 we_mock_data 字段假数据
 *                       we_use_mock : true,
 *                       we_mock_data : { body : { 这里是要mock的API返回的content }, js_file : 'someFileInMockDirectory.js' }
 *                   }
 *           }
 * */
var config = {

    //如果配置中找不到对应的API name,则使用这个默认的
    DEFAULT_API : {
        server : defaultServer
    },

    WX_SIGNATURE_API : {
        server : [
            {
                host : '127.0.0.1',
                port : 9100
            }
        ]
    }


};


module.exports = config;
