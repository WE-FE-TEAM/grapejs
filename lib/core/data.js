/**
 * 应用启动时,读取到的所有配置信息/controller匹配等信息的全局存储
 * Created by jess on 16/4/13.
 */


'use strict';


let grapeData = {};


Object.defineProperty(global, 'grapeData', {
    value : grapeData,
    writable : false,
    enumerable : false
} );


//配置信息
grapeData.config = {};

//路由
grapeData.router = {};

//所有注册的controller
grapeData.controller = {};



module.exports = grapeData;

