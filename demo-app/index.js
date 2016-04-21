/**
 * demo app的入口
 * Created by jess on 16/4/14.
 */


'use strict';


let Entrance = require('../lib/index.js');


//应用内的全局变量
let weDemo = {};

Object.defineProperty(global, 'weDemo', {
    value : weDemo,
    writable : false,
    enumerable : false
});


let app = new Entrance({
    APP_PATH : __dirname,
    APP_URL_PREFIX : '/n'
});


app.run();

