/**
 * 提供grape全局对象,注册grape上的各种loader等方法
 * Created by jess on 16/4/13.
 */


'use strict';

const GrapeBase = require('./base.js');
const grapeUtil = require('./util.js');
const grapePath = require('./path.js');

require('./data.js');

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

grape.path = grapePath;

module.exports = grape;



