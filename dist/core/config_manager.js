/**
 * config模块,负责load配置文件, 提供获取接口
 * Created by jess on 16/4/13.
 */

'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');

var sep = path.sep;

var config = {};

//加载 path 目录下的所有.js文件, 忽略目录
function loadDirFile(dir) {

    if (!grape.util.isDir(dir)) {
        return {};
    }

    var out = {};

    var files = fs.readdirSync(dir);
    files.forEach(function (file) {
        var filePath = dir + sep + file;
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            var obj = path.parse(filePath);
            var fileName = obj.name;
            var data = require(filePath);
            out[fileName] = data;
        }
    });

    return out;
}

//加载框架的配置, 以及APP下各个module的配置
config.load = function () {

    var util = grape.util;

    var grapeData = global.grapeData;

    var globalConfig = grapeData.config;

    var modules = grapeData.modules;

    //当前执行环境
    var env = util.getNodeEnv();

    var frameDefaultPath = grape.path.GRAPE_CONFIG_PATH;
    var APP_PATH = grape.path.APP_PATH;

    //加载框架下的普通配置
    var frameNormalConfig = loadDirFile(frameDefaultPath);
    //加载框架下, 当前执行NODE_ENV对应的JS
    var frameEnvConfig = grape.tryRequire('' + frameDefaultPath + sep + 'env' + sep + env + '.js') || {};
    //合并框架级别的配置信息
    var frameFinalConfig = (0, _assign2.default)({}, frameNormalConfig, frameEnvConfig);

    //加载APP下各个module的配置
    var appCommonPath = util.getAppModulePath(APP_PATH, 'common');

    //先尝试加载APP下的common模块
    var appCommonConfig = loadDirFile('' + appCommonPath + sep + 'config');
    var appCommonEnvConfig = grape.tryRequire('' + appCommonPath + sep + 'config' + sep + 'env' + sep + env + '.js') || {};
    var appCommonFinalConfig = (0, _assign2.default)({}, frameFinalConfig, appCommonConfig, appCommonEnvConfig);

    //加载APP的其他模块config
    modules.forEach(function (moduleName) {
        if (moduleName === 'common') {
            return;
        }
        var modulePath = util.getAppModulePath(APP_PATH, moduleName);
        var moduleConfig = loadDirFile('' + modulePath + sep + 'config');
        var moduleEnvConfig = grape.tryRequire('' + modulePath + sep + 'config' + sep + 'env' + sep + env + '.js') || {};

        globalConfig[moduleName] = (0, _assign2.default)({}, appCommonFinalConfig, moduleConfig, moduleEnvConfig);
    });

    globalConfig.grapeDefault = frameNormalConfig;
    globalConfig.grapeEnv = frameEnvConfig;
    globalConfig.grapeFinal = frameFinalConfig;

    //存储APP 的common级别的config, hook等只能在common中配置
    globalConfig.common = appCommonFinalConfig;
};

/**
 * 获取某个模块下的某个配置项
 * @param module {string} 模块名
 * @param name {string} 配置项名
 */
config.getModuleConfig = function (module, name) {
    if (arguments.length === 1) {
        name = module;
        //如果只传了一个参数, 则module默认为 common
        module = global.grapeData.defaultConfigModule;
    }
    if (module) {
        var moduleConfig = grapeData.config[module] || {};
        if (name) {
            return moduleConfig[name] || {};
        }
        return moduleConfig;
    }

    return {};
};

config.getConfig = config.getModuleConfig;

module.exports = config;