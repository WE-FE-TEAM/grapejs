/**
 * 框架入口, 加载各种config/rewrite/router/controller
 * Created by jess on 16/4/13.
 */

'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const bunyan = require('bunyan');

const sep = path.sep;

//在运行时加载babel,支持ES6/7
require('babel-register')({
    presets : ['es2015','react']
});


const grape = require('./core/grape.js');

let grapeData = global.grapeData;

const util = grape.util;

class GrapeIndex extends grape.Base {

    init(options){

        super.init();

        const APP_PATH = path.normalize(options.APP_PATH);

        grape.path.APP_PATH = APP_PATH;

        grape.path.APP_STATIC_PATH = path.normalize(options.APP_STATIC_PATH);

        grape.path.APP_VIEW_PATH = path.normalize(options.APP_VIEW_PATH);

        grape.path.APP_MAP_PATH = path.normalize(options.APP_MAP_PATH);

        grape.path.APP_URL_PREFIX = options.APP_URL_PREFIX || '/';

        grape.path.APP_COMMON_MODULE_PATH = util.getAppModulePath( APP_PATH, 'common');

        grape.path.APP_BACKEND_CONF_PATH = grape.path.APP_COMMON_MODULE_PATH + sep + 'backend-conf';

        grape.path.APP_RAL_CONF_PATH =  grape.path.APP_COMMON_MODULE_PATH + sep + 'ral-conf';

        grape.path.APP_MOCK_DATA_PATH =  grape.path.APP_COMMON_MODULE_PATH + sep + 'mock-data';

        if( ! util.isDir(APP_PATH) ){
            console.error(`[appPath] 必须是app目录的绝对路径!`);
            process.exit(0);
        }

        this.getModules( APP_PATH );

        this.validateModules( grapeData.modules );

        this.load();
    }

    getModules(appPath){

        let modules = util.getSubDirectory(appPath);

        //直接忽略掉 log 目录, 不能作为模块目录
        let index = modules.indexOf('log');
        if( index >=0 ){
            modules.splice(index, 1);
        }

        grapeData.modules = modules;

        return modules;
    }

    /**
     * 检查APP的module命名是否合法, 必须满足以下条件:
     * 1. APP内不能使用 grape 开头的module名
     * 2.
     * @param modules {array} APP内的所有模块名的数组
     */
    validateModules(modules){
        const RESERVE_WORD = 'grape';
        //系统要使用的目录, 不能作为 module 使用
        const SYS_MODULE = [ 'log' ];
        modules.forEach(function(moduleName){
            let tempName = moduleName.toLowerCase();
            if( tempName.indexOf(RESERVE_WORD) === 0 ){
                console.error(`模块名不能以${RESERVE_WORD}打头!! 模块名 ${moduleName} 非法!!`);
                process.exit(0);
            }else if( SYS_MODULE.indexOf(tempName) >= 0 ){
                console.error(`模块名不能是以下模块: ${SYS_MODULE}打头!! 模块名 ${moduleName} 非法!!`);
                process.exit(0);
            }
        });
    }

    loadConfig(){
        grape.configManager.load();
    }

    //初始化全局log
    initLog(){

        const APP_PATH = grape.path.APP_PATH;

        let logConfig = grape.configManager.getConfig('common', 'log') || {};
        let logDir =  path.normalize( logConfig.log_dir || ( APP_PATH + sep + 'log' ));
        let finalStreams = [];
        let streams = logConfig.streams || [];
        streams.forEach( (obj) => {

            if( obj.stream ){
                finalStreams.push(obj);
            }else if( obj.level ){
                let filePath = obj.path || path.normalize( logDir + sep + obj.level);
                //如果文件不存在, 先创建
                fse.ensureFileSync( filePath );
                finalStreams.push({
                    level : obj.level,
                    path : filePath
                });
            }
        } );

        grape.path.APP_LOG_PATH = logDir;

        grape.log = grape.logFactory.getLog({
            name : logConfig.name || 'grape-log',
            streams : finalStreams,
            serializers : bunyan.stdSerializers
        });

    }
    
    //加载bootstrap目录下的所有JS
    loadBootstrap(){
        const appCommonDir = grape.util.getAppModulePath( grape.path.APP_PATH, 'common');
        const bootstrapDir = path.normalize( appCommonDir + sep + 'bootstrap');
        //只提取 非. _ 开头的 JS 文件
        let arr = grape.util.getFiles( bootstrapDir, bootstrapDir + sep, function( file, isDir){

            return file[0] !== '.'
                && file[0] !== '_'
                && ( ! isDir && /\.js$/.test(file) );

        } );

        arr.forEach( ( fileAboslutePath) => {
            require(fileAboslutePath);
        });
    }

    loadMiddleware(){
        grape.middlewareManager.load();
    }

    loadPolicy(){
        grape.policyManager.load();
    }

    loadController(){
        grape.controllerManager.load();
    }

    loadRouter(){
        grape.routerManager.parse();
    }

    load(){
        this.loadConfig();
        this.initLog();
        this.loadBootstrap();
        this.loadMiddleware();
        this.loadPolicy();
        this.loadRouter();
        this.loadController();
    }

    run(){
        //console.log( grapeData.modules );
        //console.log( grapeData.config );
        //console.log( grapeData.middleware );
        //console.log( grapeData.controller );
        //console.log( grapeData.router );
        grape.App.run();
    }
}


module.exports = GrapeIndex;

