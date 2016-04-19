/**
 * we sdk 入口
 * Created by jess on 16/4/19.
 */


'use strict';


const PromiseResult = require('./promise_result.js');
const ralManager = require('./ral_manager.js');
const ApiBase = require('./api_base.js');



const grape = global.grape;

let weSDK = {};

weSDK.generateRalService = ralManager.generateRalService;
weSDK.request = ralManager.request;
weSDK.ApiBase = ApiBase;

//全局对象
Object.defineProperty(global, 'weSDK', {
   value : weSDK,
    writable : false,
    enumerable : false
});




let singleton = {};


singleton.init = function(){
    
    ralManager.load();

    let api = require('./api/index.js');

    weSDK.api = api;
    
};




module.exports =  singleton;

