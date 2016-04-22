/**
 * 所有类的基类
 * Created by jess on 16/4/13.
 */

'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GrapeBase = function () {
    function GrapeBase() {
        (0, _classCallCheck3.default)(this, GrapeBase);

        this.init.apply(this, arguments);
    }

    (0, _createClass3.default)(GrapeBase, [{
        key: 'init',
        value: function init() {
            //应该在 子类 中覆盖, 在构造函数中,会自动调用
        }
    }, {
        key: 'getConfig',
        value: function getConfig(module, confName) {
            return grape.configManager.getModuleConfig(module, confName);
        }
    }, {
        key: 'getRouter',
        value: function getRouter() {
            return global.grapeData.router;
        }
    }, {
        key: 'execHook',
        value: function execHook(hookName, httpObj, args) {
            return grape.hookManager.exec(hookName, httpObj, args);
        }
    }, {
        key: 'getControllerClass',
        value: function getControllerClass(module, controllerPath) {
            return grape.controllerManager.getControllerClass(module, controllerPath);
        }
    }, {
        key: 'fatal',
        value: function fatal() {
            this._doLog('fatal', [].slice.call(arguments));
        }
    }, {
        key: 'error',
        value: function error() {
            this._doLog('error', [].slice.call(arguments));
        }
    }, {
        key: 'warn',
        value: function warn() {
            this._doLog('warn', [].slice.call(arguments));
        }
    }, {
        key: 'info',
        value: function info() {
            this._doLog('info', [].slice.call(arguments));
        }
    }, {
        key: 'debug',
        value: function debug() {
            this._doLog('debug', [].slice.call(arguments));
        }
    }, {
        key: 'trace',
        value: function trace() {
            this._doLog('trace', [].slice.call(arguments));
        }
    }, {
        key: '_doLog',
        value: function _doLog(logLevel, args) {
            if (logLevel && args && grape.log && typeof grape.log[logLevel] === 'function') {
                grape.log[logLevel].apply(grape.log, args);
            } else {
                //出问题了, 只能用 console.log 记录下
                grape.console.error('[' + logLevel + '][' + args + ']对应的日志写入方法不支持, 或参数错误!!');
            }
        }
    }]);
    return GrapeBase;
}();

module.exports = GrapeBase;