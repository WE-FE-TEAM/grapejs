/**
 * 提供grape全局对象,注册grape上的各种loader等方法
 * Created by jess on 16/4/13.
 */


'use strict';

const path = require('path');

const GrapeBase = require('./base.js');
const grapeUtil = require('./util.js');



const sep = path.sep;


let grape = {};


//注册全局的 grape 对象
Object.defineProperty(global, 'grape', {
    value : grape,
    writable : false,
    enumerable : false
} );


//base class
grape.Base = GrapeBase;

grape.util = grapeUtil;


//框架lib目录
const grapeLibPath = path.dirname( __dirname );
//框架根目录
const grapeFrameworkPath = path.dirname( grapeLibPath );

grape.path = {
    GRAPE_FRAMEWORK_PATH : grapeFrameworkPath,
    GRAPE_LIB_PATH : grapeLibPath,
    //框架的配置文件目录
    GRAPE_CONFIG_PATH : path.normalize( `${grapeLibPath}${sep}config`)
};




module.exports = grape;



