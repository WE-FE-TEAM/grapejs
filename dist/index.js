/**
 * 框架入口, 加载各种config/rewrite/router/controller
 * Created by jess on 16/4/13.
 */

'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var bunyan = require('bunyan');

var sep = path.sep;

//在运行时加载babel,支持ES6/7
// require('babel-register')({
//     presets : ['es2015','react']
// });

var grape = require('./core/grape.js');

var grapeData = global.grapeData;

var util = grape.util;

var GrapeIndex = function (_grape$Base) {
    (0, _inherits3.default)(GrapeIndex, _grape$Base);

    function GrapeIndex() {
        (0, _classCallCheck3.default)(this, GrapeIndex);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(GrapeIndex).apply(this, arguments));
    }

    (0, _createClass3.default)(GrapeIndex, [{
        key: 'init',
        value: function init(options) {

            (0, _get3.default)((0, _getPrototypeOf2.default)(GrapeIndex.prototype), 'init', this).call(this);

            var APP_PATH = path.normalize(options.APP_PATH);

            grape.path.APP_PATH = APP_PATH;

            grape.path.APP_STATIC_PATH = path.normalize(options.APP_STATIC_PATH);

            grape.path.APP_VIEW_PATH = path.normalize(options.APP_VIEW_PATH);

            grape.path.APP_MAP_PATH = path.normalize(options.APP_MAP_PATH);

            //页面URL的前缀
            grape.path.APP_URL_PREFIX = options.APP_URL_PREFIX || '/';

            //静态资源的URL访问前缀
            grape.path.APP_STATIC_URL_PREFIX = options.APP_STATIC_URL_PREFIX || grape.path.APP_URL_PREFIX;

            grape.path.APP_COMMON_MODULE_PATH = util.getAppModulePath(APP_PATH, 'common');

            if (!util.isDir(APP_PATH)) {
                console.error('[appPath] 必须是app目录的绝对路径!');
                process.exit(0);
            }

            this.getModules(APP_PATH);

            this.validateModules(grapeData.modules);

            this.load();
        }
    }, {
        key: 'getModules',
        value: function getModules(appPath) {

            var modules = util.getSubDirectory(appPath);

            //直接忽略掉 log 目录, 不能作为模块目录
            var index = modules.indexOf('log');
            if (index >= 0) {
                modules.splice(index, 1);
            }

            grapeData.modules = modules;

            return modules;
        }

        /**
         * 检查APP的module命名是否合法, 必须满足以下条件:
         * 1. APP内不能使用 grape 开头的module名
         * 2.
         * @param modules {array} APP内的所有模块名的数组
         */

    }, {
        key: 'validateModules',
        value: function validateModules(modules) {
            var RESERVE_WORD = 'grape';
            //系统要使用的目录, 不能作为 module 使用
            var SYS_MODULE = ['log'];
            modules.forEach(function (moduleName) {
                var tempName = moduleName.toLowerCase();
                if (tempName.indexOf(RESERVE_WORD) === 0) {
                    console.error('模块名不能以' + RESERVE_WORD + '打头!! 模块名 ' + moduleName + ' 非法!!');
                    process.exit(0);
                } else if (SYS_MODULE.indexOf(tempName) >= 0) {
                    console.error('模块名不能是以下模块: ' + SYS_MODULE + '打头!! 模块名 ' + moduleName + ' 非法!!');
                    process.exit(0);
                }
            });
        }
    }, {
        key: 'loadConfig',
        value: function loadConfig() {
            grape.configManager.load();
        }

        //初始化全局log

    }, {
        key: 'initLog',
        value: function initLog() {

            var APP_PATH = grape.path.APP_PATH;

            var logConfig = grape.configManager.getConfig('common', 'log') || {};
            var logDir = path.normalize(logConfig.log_dir || APP_PATH + sep + 'log');
            var finalStreams = [];
            var streams = logConfig.streams || [];
            streams.forEach(function (obj) {

                if (obj.stream) {
                    finalStreams.push(obj);
                } else if (obj.level) {
                    var filePath = obj.path || path.normalize(logDir + sep + obj.level);
                    //如果文件不存在, 先创建
                    fse.ensureFileSync(filePath);
                    finalStreams.push({
                        level: obj.level,
                        path: filePath
                    });
                }
            });

            grape.path.APP_LOG_PATH = logDir;

            grape.log = grape.logFactory.getLog({
                name: logConfig.name || 'grape-log',
                streams: finalStreams,
                serializers: bunyan.stdSerializers
            });
        }

        //加载bootstrap目录下的所有JS

    }, {
        key: 'loadBootstrap',
        value: function loadBootstrap() {
            var appCommonDir = grape.util.getAppModulePath(grape.path.APP_PATH, 'common');
            var bootstrapDir = path.normalize(appCommonDir + sep + 'bootstrap');
            //只提取 非. _ 开头的 JS 文件
            var arr = grape.util.getFiles(bootstrapDir, bootstrapDir + sep, function (file, isDir) {

                return file[0] !== '.' && file[0] !== '_' && (!isDir && /\.js$/.test(file) || isDir);
            });

            arr.forEach(function (fileAboslutePath) {
                require(fileAboslutePath);
            });
        }

        //加载系统和应用的 swig filter 目录

    }, {
        key: 'loadSwigFilter',
        value: function loadSwigFilter() {
            var SWIG_FILTER_PATH = '' + grape.path.GRAPE_LIB_PATH + sep + 'swig-filter';
            var systemFilter = grape.loadJSInDir(SWIG_FILTER_PATH);
            var appCommonDir = grape.util.getAppModulePath(grape.path.APP_PATH, 'common');
            var appFilterDir = '' + appCommonDir + sep + 'swig-filter';
            var appFilter = grape.loadJSInDir(appFilterDir);
            var finalFilter = (0, _assign2.default)({}, systemFilter, appFilter);
            grapeData.swigFilter = finalFilter;
        }
    }, {
        key: 'loadMiddleware',
        value: function loadMiddleware() {
            grape.middlewareManager.load();
        }
    }, {
        key: 'loadPolicy',
        value: function loadPolicy() {
            grape.policyManager.load();
        }
    }, {
        key: 'loadController',
        value: function loadController() {
            grape.controllerManager.load();
        }
    }, {
        key: 'loadRouter',
        value: function loadRouter() {
            grape.routerManager.parse();
        }
    }, {
        key: 'load',
        value: function load() {
            this.loadConfig();
            this.initLog();
            this.loadBootstrap();
            this.loadSwigFilter();
            this.loadMiddleware();
            this.loadPolicy();
            this.loadRouter();
            this.loadController();
        }
    }, {
        key: 'run',
        value: function run() {

            grape.App.run();
        }
    }]);
    return GrapeIndex;
}(grape.Base);

module.exports = GrapeIndex;