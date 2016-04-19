/**
 * 封装请求后端service服务的 RAL , 负责加载配置/提供service生成的工厂方法
 * Created by jess on 16/4/18.
 */


'use strict';


const fs = require('fs');
const path = require('path');
const RAL = require('node-ral').RAL;

const PromiseResult = require('./promise_result.js');

const sep = path.sep;


//合并了环境相关配置之后的后端服务地址
let finalConfig = {};

//默认的后端服务请求地址
let DEFAULT_SERVER_LIST = [];

//本地开发时,使用的mock数据目录
let DEV_MOCK_DATA_DIR = path.normalize( __dirname + sep + 'mock-data' );


let singleton = {};



singleton.load = function(){

    const CONF_DIR = path.normalize( __dirname + sep + 'backend-conf' );

    const APP_RAL_CONF_PATH = path.normalize( __dirname + sep + 'ral-conf' );

    const defaultConfig = grape.tryRequire( `${CONF_DIR}${sep}server.default.js`) || {};

    const envName = grape.util.getNodeEnv();

    const envConfigFile = `${CONF_DIR}${sep}server.${envName}.js`;

    let envConfig = grape.tryRequire(envConfigFile);


    Object.assign( finalConfig, defaultConfig, envConfig );

    if( finalConfig.DEFAULT_API && finalConfig.DEFAULT_API.server ){
        DEFAULT_SERVER_LIST =  finalConfig.DEFAULT_API.server;
    }else{
        grape.console.error(`未找到环境[${envName}]下的后端服务配置默认server`);
    }


    //初始化 RAL

    RAL.init({
        confDir : path.join( APP_RAL_CONF_PATH),
        logger : {
            log_path : grape.path.APP_LOG_PATH,
            app : 'grape-ral-log'
        }
    });

};


singleton.generateRalService = function( serviceName, extraConf ){

    var ralBase = {
        protocol : 'http',
        pack : 'querystring',
        unpack : 'json',
        encoding : 'utf-8',
        balance : 'roundrobin',
        timeout : 5000,
        retry : 1,
        headers : {
            'x-client' : 'grape-ral'
        }
    };

    var serviceConfDefault = finalConfig[serviceName] || {};

    var service = {};
    var temp = service[serviceName] = Object.assign(ralBase, serviceConfDefault , extraConf );

    if( ! temp.server ){
        //如果没有server字段,使用默认值
        temp.server = DEFAULT_SERVER_LIST.slice();
    }

    return service;

};



/**
 *
 * @param serviceName   服务名,在config/ral中定义
 * @param options      ral的配置, 参考https://github.com/fex-team/node-ral/wiki/RAL%E6%8E%A5%E5%8F%A3
 * @returns {Promise}
 * @resolve {PromiseResult} promise resolve状态时返回的result对象
 */
singleton.request = function(serviceName, options){

    let weLog = grape.log;

    let ralResult = new PromiseResult();

    let serviceConfig = RAL.getConf(serviceName);

    if( grape.util.isDev() && serviceConfig.grape_use_mock ){
        //本地开发环境,允许针对某些API使用 mock 假数据
        weLog.warn(`服务${serviceName}使用的本地假数据!!`);
        let config = serviceConfig.we_mock_data || {};
        let mockData = config.body || {};
        if( config.js_file ){
            // let DEV_MOCK_DATA_DIR = grape.path.APP_MOCK_DATA_PATH;
            //假数据存在mock目录下的JS文件,需要require进来
            try{
                mockData = require( DEV_MOCK_DATA_DIR + sep + config.js_file );
            }catch(e){
                weLog.error(`服务${serviceName}的假数据文件[${config.js_file}]加载出错!!!`);
                weLog.error(e);
            }
        }
        ralResult.data = mockData.data;
        ralResult.msg = mockData.message;
        ralResult.status = mockData.status;
        return Promise.resolve( ralResult );
    }

    weLog.info(`调用服务${serviceName}`);

    return new Promise( (resolve, reject) => {

        RAL(serviceName, options)
            .on('data', (data, extras) => {

                weLog.info( data );

                ralResult.extras = extras;
                ralResult.data = data.data;
                ralResult.msg  = data.message;
                ralResult.status = data.status;

                resolve(ralResult);
            })
            .on('error', (error) => {

                weLog.error( error );

                ralResult.status = 1;
                ralResult.msg  = '失败';
                ralResult.error = error;
                resolve(ralResult);
            });
    });
};



module.exports = singleton;