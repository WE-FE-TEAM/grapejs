/**
 * 负责load所有的controller
 * Created by jess on 16/4/15.
 */


'use strict';

const path = require('path');

const sep = path.sep;


let singleton = {};


singleton.load = function(){

    const grapeData = global.grapeData;

    const grape = global.grape;

    const util = grape.util;

    const APP_PATH = grape.path.APP_PATH;

    const modules = grapeData.modules;

    let controllerMap = grapeData.controller;

    //加载各个module下的所有controller, 挂载到module下
    modules.forEach( (module) => {

        let map = controllerMap[module] = {};

        let controllerPath = util.getAppModulePath(APP_PATH, module) + sep + 'controller';

        //取到module下的所有JS文件
        let files = util.getFiles(controllerPath );

        console.log( files );

        files.forEach( (file) => {

            if( /\.js$/.test(file) ){
                let filePath = path.resolve( controllerPath, file);
                let controllerKey = file.replace(/\.js$/, '');
                map[controllerKey] = require(filePath);
            }

        });

    } );

};



module.exports = singleton;