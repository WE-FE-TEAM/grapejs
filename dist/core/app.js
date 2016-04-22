/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var cluster = require('cluster');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var Base = require('./base.js');

var grape = global.grape;

var App = function (_Base) {
    (0, _inherits3.default)(App, _Base);

    function App() {
        (0, _classCallCheck3.default)(this, App);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(App).apply(this, arguments));
    }

    (0, _createClass3.default)(App, [{
        key: 'init',
        value: function init(http) {
            this.http = http;
        }
    }, {
        key: 'execHook',
        value: function execHook(hookName, args) {
            return (0, _get3.default)((0, _getPrototypeOf2.default)(App.prototype), 'execHook', this).call(this, hookName, this.http, args);
        }
    }, {
        key: 'exec',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.execHook('request_start');

                            case 2:
                                _context.next = 4;
                                return this.execHook('request_parse');

                            case 4:
                                _context.next = 6;
                                return this.execHook('policy_start');

                            case 6:
                                _context.next = 8;
                                return this.execPolicy();

                            case 8:
                                _context.next = 10;
                                return this.execHook('policy_end');

                            case 10:
                                _context.next = 12;
                                return this.execHook('controller_start');

                            case 12:
                                _context.next = 14;
                                return this.execController();

                            case 14:
                                _context.next = 16;
                                return this.execHook('controller_end');

                            case 16:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function exec() {
                return ref.apply(this, arguments);
            }

            return exec;
        }()
    }, {
        key: 'execPolicy',
        value: function execPolicy() {
            var http = this.http;

            var module = http.module;
            var controllerKey = http.controller;
            var action = http.action;

            return grape.policyManager.executePolicyOfAction(module, controllerKey, action, http);
        }
    }, {
        key: 'execController',
        value: function execController() {
            //this.http.res.end('hello, grape');

            var http = this.http;

            var module = http.module;
            var controllerKey = http.controller;
            var action = http.action;

            var controllerClass = this.getControllerClass(module, controllerKey);

            if (controllerClass) {
                var method = action + 'Action';
                var obj = new controllerClass(this.http);
                if (typeof obj[method] === 'function') {
                    return obj[method]();
                }
            }

            return _promise2.default.resolve();
        }
    }], [{
        key: 'run',
        value: function run() {

            var app = express();
            var serverConf = grape.configManager.getConfig('server');
            var port = serverConf.port;

            //禁止输出 x-powered-by
            app.disable('x-powered-by');
            app.disable('etag');

            if (serverConf['x-powered-by']) {
                app.use(function (req, res, next) {
                    res.set('x-powered-by', serverConf['x-powered-by']);
                    next();
                });
            }

            var swigConf = grape.configManager.getConfig('swig');

            grape.viewManager.setViewEngine(app);

            var staticPrefix = grape.path.APP_URL_PREFIX + '/static';
            app.use(staticPrefix, express.static(grape.path.APP_STATIC_PATH));

            app.use(cookieParser());
            app.use(bodyParser.json()); // for parsing application/json
            app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

            function requestReceive(req, res, next) {

                var http = new grape.Http(req, res);
                var obj = new App(http);
                obj.exec().catch(function (err) {

                    if (grape.isPrevent(err)) {
                        grape.console.log('receive prevent error');
                        return;
                    }
                    if (!grape.util.isDev()) {
                        //线上环境,记录到日志
                        grape.log.error(err);
                    } else {
                        //开发环境, 直接打印输出 执行出错
                        res.end(err.stack);
                        // grape.console.log(`出错: ${err.message}`);
                    }
                });
            }
            app.use(grape.path.APP_URL_PREFIX, requestReceive);

            var server = app.listen(port);

            process.on('uncaughtException', function uncaughtException(err) {

                var timer = setTimeout(function () {
                    process.exit(1);
                }, 30000);

                timer.unref();

                server.close();

                if (cluster.worker) {
                    //console.info('server is worker');
                    cluster.worker.disconnect();
                }
                //process.exit(1);
            });
        }
    }]);
    return App;
}(Base);

module.exports = App;