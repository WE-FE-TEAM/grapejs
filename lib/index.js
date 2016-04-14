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

        const APP_PATH = path.normalize(options.appPath);

        grape.path.APP_PATH = APP_PATH;

        if( ! util.isDir(APP_PATH) ){
            console.error(`[appPath] 必须是app目录的绝对路径!`);
            process.exit(1);
        }

        this.getModules( APP_PATH );

        this.load();
    }

    getModules(appPath){

        let modules = util.getSubDirectory(appPath);

        grapeData.modules = modules;

        return modules;
    }

    loadConfig(){
        grape.config.load();
    }

    loadController(){

    }

    load(){
        this.loadConfig();
        this.loadController();
    }

    run(){
        console.log( grapeData.modules );
        console.log( grapeData.config );
    }
}


module.exports = GrapeIndex;

