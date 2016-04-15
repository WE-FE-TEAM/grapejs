/**
 * 提供grape全局对象,注册grape上的各种loader等方法
 * Created by jess on 16/4/13.
 */


'use strict';

const path = require('path');

const GrapeBase = require('./base.js');
const MiddlewareBase = require('./middleware_base.js');
const grapeUtil = require('./util.js');
const grapePath = require('./path.js');

require('./data.js');

const configLoader = require('./config_manager.js');
const middlewareManager = require('./middleware_manager.js');
const grapeHttp = require('./http.js');

let grape = {};


//注册全局的 grape 对象
Object.defineProperty(global, 'grape', {
    value : grape,
    writable : false,
    enumerable : false
} );


//base class
grape.Base = GrapeBase;

//middleware base class
grape.MiddlewareBase = MiddlewareBase;

grape.util = grapeUtil;

grape.path = grapePath;

grape.configManager = configLoader;

grape.middlewareManager = middlewareManager;

grape.Http = grapeHttp;

/**
 * 尝试加载给定JS的绝对路径, 找不到则报错
 * @param absolutePath {String} 要加载的JS文件的绝对路径
 */
grape.tryRequire = function(absolutePath){

    try{
        if( ! path.isAbsolute(absolutePath) ){
            return null;
        }
        return require(absolutePath);
    }catch(e){
        //TODO 记录下
        return null;
    }
};



module.exports = grape;



