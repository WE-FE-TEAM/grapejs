/**
 * config模块,负责load配置文件, 提供获取接口
 * Created by jess on 16/4/13.
 */


'use strict';


const fs = require('fs');
const path = require('path');


let config = {};


config.load = function(  ){

    const frameDefaultPath = grape.path.GRAPE_CONFIG_PATH;
    const appPath = grape.path.GRAPE_APP_PATH;
};



module.exports = config;