/**
 * 负责load所有的controller
 * Created by jess on 16/4/15.
 */

'use strict';

var path = require('path');

var sep = path.sep;

var singleton = {};

singleton.load = function () {

    var grapeData = global.grapeData;

    var grape = global.grape;

    var util = grape.util;

    var APP_PATH = grape.path.APP_PATH;

    var modules = grapeData.modules;

    var controllerMap = grapeData.controller;

    //加载各个module下的所有controller, 挂载到module下
    modules.forEach(function (module) {

        var map = controllerMap[module] = {};

        var controllerPath = util.getAppModulePath(APP_PATH, module) + sep + 'controller';

        //取到module下的所有JS文件
        var files = util.getFiles(controllerPath);

        files.forEach(function (file) {

            if (/\.js$/.test(file)) {
                var filePath = path.resolve(controllerPath, file);
                var controllerKey = file.replace(/\.js$/, '');

                //处理windows下目录分隔符问题, resolve 自动把目录分隔符改成 \ 了, 导致URL匹配的时候,找不到, 需要统一改成linux的
                controllerKey = controllerKey.split(sep).join('/');

                map[controllerKey] = require(filePath);
            }
        });
    });
};

/**
 * 获取module下的指定controller
 * @param module {string} 模块名
 * @param controllerKey {string} controller在该模块下的key
 * @return {ControllerBase}
 */
singleton.getControllerClass = function (module, controllerKey) {
    var moduleConf = grapeData.controller[module] || {};
    return moduleConf[controllerKey];
};

module.exports = singleton;