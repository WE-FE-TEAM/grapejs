/**
 * 框架入口, 加载各种config/rewrite/router/controller
 * Created by jess on 16/4/13.
 */

'use strict';

const fs = require('fs');
const path = require('path');

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

        grape.path.APP_URL_PREFIX = options.APP_URL_PREFIX;

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
        modules.forEach(function(moduleName){
            let tempName = moduleName.toLowerCase();
            if( tempName.indexOf(RESERVE_WORD) === 0 ){
                console.error(`模块名不能以${RESERVE_WORD}打头!! 模块名 ${moduleName} 非法!!`);
                process.exit(0);
            }
        });
    }

    loadConfig(){
        grape.configManager.load();
    }

    loadMiddleware(){
        grape.middlewareManager.load();
    }

    loadController(){
        grape.controllerManager.load();
    }

    loadRouter(){
        grape.routerManager.parse();
    }

    load(){
        this.loadConfig();
        this.loadRouter();
        this.loadMiddleware();
        this.loadController();
    }

    run(){
        console.log( grapeData.modules );
        console.log( grapeData.config );
        console.log( grapeData.middleware );
        console.log( grapeData.controller );
        console.log( grapeData.router );
        grape.App.run();
    }
}


module.exports = GrapeIndex;

