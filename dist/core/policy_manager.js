/**
 * 负责加载和执行 policy
 * Created by jess on 16/4/20.
 */

'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');

var sep = path.sep;

var policyManager = {};

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
        if (stat.isFile() && /\.js$/.test(file)) {
            var obj = path.parse(filePath);
            var fileName = obj.name.toLowerCase();
            var data = require(filePath);
            out[fileName] = data;
        }
    });

    return out;
}

//加载框架的配置, 以及APP下各个common的policy
policyManager.load = function () {

    var util = grape.util;

    var grapeData = global.grapeData;

    var globalConfig = grapeData.policy;

    var modules = grapeData.modules;

    //当前执行环境
    var env = util.getNodeEnv();

    // const frameDefaultPath = grape.path.GRAPE_MIDDLEWARE_PATH;
    var APP_PATH = grape.path.APP_PATH;

    //加载框架下的普通配置
    var frameNormalConfig = {};

    //加载APP下各个module的配置
    var appCommonPath = util.getAppModulePath(APP_PATH, 'common');

    //先尝试加载APP下的common模块
    var appCommonConfig = loadDirFile('' + appCommonPath + sep + 'policy');
    appCommonConfig = util.extend({}, frameNormalConfig, appCommonConfig);

    globalConfig.common = appCommonConfig;

    // 加载APP的其他模块config
    modules.forEach(function (moduleName) {
        if (moduleName === 'common') {
            return;
        }
        var modulePath = util.getAppModulePath(APP_PATH, moduleName);
        var moduleConfig = loadDirFile('' + modulePath + sep + 'policy');

        globalConfig[moduleName] = util.extend({}, appCommonConfig, moduleConfig);
    });

    grapeData.policy = globalConfig;
};

/**
 * 获取某个模块下某个action对应的某个policy项
 * @param moduleName {string} 模块名
 * @param controllerName {string} controller的key
 * @param actionName {string} action名字
 * @return {Array} 配置文件中, 定义好的要执行的 policy 数组
 */
policyManager.getActionPolicyConfig = function (moduleName, controllerName, actionName) {
    var out = [];
    var moduleConf = grape.configManager.getModuleConfig(moduleName, 'policy');
    if (moduleConf) {
        out = moduleConf['*'] || out;
        var controllerConf = moduleConf[controllerName];
        if (controllerConf) {
            out = controllerConf['*'] || out;
            var actionConf = controllerConf[actionName];
            if (actionConf) {
                out = actionConf;
            }
        }
    }

    return out;
};

/**
 * 获取某个module下的某个policy定义
 * @param moduleName {string} 模块名
 * @param policyName {string} policy名
 */
policyManager.getPolicy = function (moduleName, policyName) {
    var moduleConf = grapeData.policy[moduleName];
    return moduleConf[policyName];
};

/**
 * 执行某个module下,某个controller的action对应的policy
 * @param moduleName {string} 模块名
 * @param controllerName {string} controller的路径
 * @param actionName {string}  action名
 * @param httpObj {Http} http对象
 * @returns {Promise}
 */
policyManager.executePolicyOfAction = function (moduleName, controllerName, actionName, httpObj) {
    var policyArray = policyManager.getActionPolicyConfig(moduleName, controllerName, actionName);
    return policyArray.reduce(function (promise, obj) {

        var data = null;
        var policyName = obj;

        //如果policyName是JSON, 则包含了执行policy时,要传递的参数
        if (grape.util.isObject(obj)) {
            policyName = obj.name;
            data = obj.data;
        } else if (grape.util.isString(obj)) {
            policyName = obj;
        } else {
            return _promise2.default.reject('[' + moduleName + '][' + controllerName + '][' + actionName + ']配置的policy[' + obj + ']非法!!只能是JSON或string');
        }

        var policyClass = policyManager.getPolicy(moduleName, policyName);
        return promise.then(function () {
            return new policyClass(httpObj).execute(data);
        });
    }, _promise2.default.resolve());
};

module.exports = policyManager;