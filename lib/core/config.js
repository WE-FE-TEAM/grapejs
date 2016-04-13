/**
 * config模块,负责load配置文件, 提供获取接口
 * Created by jess on 16/4/13.
 */


'use strict';


const fs = require('fs');
const path = require('path');

const sep = path.sep;


let config = {};


//加载 path 目录下的所有.js文件, 忽略目录
function loadDirFile(dir){

    if( ! grape.util.isDir(dir) ){
        return {};
    }

    let out = {};

    let files = fs.readdirSync(dir);
    files.forEach( function(file){
        let filePath = dir + sep + file;
        let stat = fs.statSync( filePath );
        if (stat.isFile()) {
            let obj = path.parse(filePath);
            let fileName = obj.name;
            let data = require( filePath );
            out[ fileName ] = data;
        }
    } );

    return out;
}


config.load = function(){

    const util = grape.util;

    let grapeData = global.grapeData;

    let globalConfig = grapeData.config;

    const modules = grapeData.modules;

    //当前执行环境
    const env = util.getNodeEnv();

    const frameDefaultPath = grape.path.GRAPE_CONFIG_PATH;
    const appPath = grape.path.GRAPE_APP_PATH;

    //加载框架下的普通配置
    let frameNormalConfig = loadDirFile(frameDefaultPath);
    //加载框架下, 当前执行NODE_ENV对应的JS
    let frameEnvConfig = grape.tryRequire(`${frameDefaultPath}${sep}env${sep}${env}.js`) || {};
    //合并框架级别的配置信息
    let frameFinalConfig = util.extend( {}, frameNormalConfig, frameEnvConfig);

    //加载APP下各个module的配置
};



module.exports = config;