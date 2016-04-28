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

        files.forEach( (file) => {

            if( /\.js$/.test(file) ){
                let filePath = path.resolve( controllerPath, file);
                let controllerKey = file.replace(/\.js$/, '');

                //处理windows下目录分隔符问题, resolve 居然没有自动处理!!!
                controllerKey = controllerKey.replace( /\//g, sep );

                map[controllerKey] = require(filePath);
            }

        });

    } );

};

/**
 * 获取module下的指定controller
 * @param module {string} 模块名
 * @param controllerKey {string} controller在该模块下的key
 * @return {ControllerBase}
 */
singleton.getControllerClass = function(module, controllerKey){
    let moduleConf = grapeData.controller[module] || {};
    return moduleConf[controllerKey];
};


module.exports = singleton;