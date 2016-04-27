/**
 * 提供grape全局对象,注册grape上的各种loader等方法
 * Created by jess on 16/4/13.
 */

'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var grape = {};

//注册全局的 grape 对象
Object.defineProperty(global, 'grape', {
    value: grape,
    writable: false,
    enumerable: false
});

var fs = require('fs');
var path = require('path');

var GrapeBase = require('./base.js');
var ControllerBase = require('./controller/base.js');
var MiddlewareBase = require('./middleware_base.js');
var grapeUtil = require('./util.js');
var grapePath = require('./path.js');

require('./data.js');

var grapeConsole = require('./grape_console.js');
var configLoader = require('./config_manager.js');
var middlewareManager = require('./middleware_manager.js');
var hookManager = require('./hook_manager.js');
var policyManager = require('./policy_manager.js');
var controllerManager = require('./controller_manager');
var routerManager = require('./router_manager.js');
var grapeHttp = require('./http.js');
var viewManager = require('./view/view_manager.js');

var App = require('./app.js');

var logFactory = require('./grape_log.js');

//开发时,不直接使用 console, 使用 grape.console
grape.console = grapeConsole;

//base class
grape.Base = GrapeBase;

//controller base class
grape.ControllerBase = ControllerBase;

//middleware base class
grape.MiddlewareBase = MiddlewareBase;

grape.util = grapeUtil;

grape.path = grapePath;

grape.configManager = configLoader;

grape.middlewareManager = middlewareManager;

grape.hookManager = hookManager;

grape.policyManager = policyManager;

grape.controllerManager = controllerManager;

grape.routerManager = routerManager;

grape.viewManager = viewManager;

grape.Http = grapeHttp;

grape.App = App;

grape.logFactory = logFactory;

//全局唯一的日志对象
grape.log = null;

/**
 * 尝试加载给定JS的绝对路径, 找不到则报错
 * @param absolutePath {String} 要加载的JS文件的绝对路径
 */
grape.tryRequire = function (absolutePath) {

    try {
        if (!path.isAbsolute(absolutePath)) {
            return null;
        }
        return require(absolutePath);
    } catch (e) {
        //TODO 记录下
        return null;
    }
};

/**
 * 加载 path 目录下的所有.js文件, 忽略目录
 * @param dir {string} 包含要加载JS的目录的绝对路径
 * @returns {object} 以JS文件名作为key, JS的export作为value的JSON
 */
grape.loadJSInDir = function (dir) {

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
};

var TERMINATE_EXECUTE_FLAG = 'GRAPE_TERMINATE_REQUEST_EXECUTE_FLAG';

//主要用在 policy 中,如果已经返回了response,需要结束掉后续的所有执行动作, 返回特殊的promise, 便于错误处理识别
grape.prevent = function () {
    return _promise2.default.reject(new Error(TERMINATE_EXECUTE_FLAG));
};

/**
 * 判断错误对象, 是否是上面 terminateRequest 生成的
 * @param err
 * @returns {boolean}
 */
grape.isPrevent = function (err) {
    return grape.util.isError(err) && err.message === TERMINATE_EXECUTE_FLAG;
};

module.exports = grape;