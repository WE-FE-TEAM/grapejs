/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var grape = global.grape,
    grapeData = global.grapeData,
    util = grape.util;

var UrlParser = function (_grape$MiddlewareBase) {
    (0, _inherits3.default)(UrlParser, _grape$MiddlewareBase);

    function UrlParser() {
        (0, _classCallCheck3.default)(this, UrlParser);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(UrlParser).apply(this, arguments));
    }

    (0, _createClass3.default)(UrlParser, [{
        key: 'execute',


        /**
         * 分析步骤 :
         *
         *    获取是否有配置有rewrite配置
         *      case1) 有
         *          parseRewrite, 遍历router,是否match
         *              case1) match
         *                  利用rewrite匹配替换后的
         *              case2) not match
         *
         *      case2) 没有
         *          parseUrl()
         *              getModule
         *              getController
         *              getAction
         *              getQuery
         *              设置到http对象中
         *  Todo : 提供默认module controller action配置
         *  Todo : url错误, module Controller等不存在的异常情况处理
         */
        value: function execute(options) {
            //console.log('UrlParser execute start');
            var http = this.http,
                req = http.req;
            if (!req.path) {
                //this.http.module = configManager.getConf();
                return;
            }
            var routers = this.getRouter();
            var rewritePath = req.path;
            if (!util.isEmpty(routers)) {
                rewritePath = this.parseRouter(routers);
                http.path = rewritePath;
            }

            return this.parseUrlPath();
        }

        /**
         * 使用path, 使用正则match
         */

    }, {
        key: 'parseRouter',
        value: function parseRouter(routers) {
            //console.log('UrlParser parseRouter start');
            var http = this.http,
                path = http.path;
            for (var _module in routers) {
                var rules = routers[_module],
                    length = rules.length;
                for (var i = 0; i < length; i++) {
                    var rule = rules[i],
                        matchRule = rule.match,
                        matchRewrite = rule.rewrite;
                    if (util.isRegExp(matchRule)) {
                        (function () {
                            var match = path.match(matchRule);
                            if (match) {
                                path = matchRewrite.replace(/\$(\d+)/g, function (all, token1) {
                                    return match[token1];
                                });
                            }
                        })();
                    } else if (util.isString(matchRule)) {
                        if (path.indexOf(matchRule) == 0) {
                            path = matchRewrite;
                        }
                    }
                }
            }
            var pos = path.indexOf('?');
            if (pos > 0) {
                var querys = {},
                    queryStr = path.substr(pos + 1),
                    queryTokens = queryStr.split('&');
                for (var _i = 0; _i < queryTokens.length; _i++) {
                    var queryParams = queryTokens[_i];
                    var parasTokens = queryParams.split('=');
                    querys[parasTokens[0]] = parasTokens[1];
                }
                path = path.substr(0, pos);
                http.query = util.extend(http.query, querys);
            }
            return path;
        }

        /**
         * 1. 获取所有的router
         * 2.
         */

    }, {
        key: 'parseUrlPath',
        value: function parseUrlPath() {
            //console.log('UrlParser parseUrlPath start');

            this._stripSlash();

            var http = this.http;

            var module = this.getModule();
            var controller = this.getController();
            var action = this.getAction();
            var querys = this.getQuery();
            //console.log(http.path);
            //console.log(module, controller, action, querys);
            http.module = module;
            http.controller = controller;
            http.action = action;
            http.query = util.extend(http.query, querys);

            if (!controller || !action) {
                grape.log.warn('[url_parser]找不到URL[' + http.originalUrl + ']对应的controller[' + controller + ']或action[' + action + ']');
            }

            return _promise2.default.resolve();
        }
    }, {
        key: 'getModule',
        value: function getModule() {
            var http = this.http;
            var urlPath = http.path;
            var pos = urlPath.indexOf('/');
            var module = pos === -1 ? urlPath : urlPath.substr(0, pos);
            if (util.isEmpty(http.module)) {
                http.path = http.path.substr(module.length + 1);
                return module;
            }
            return http.module;
        }
    }, {
        key: 'getController',
        value: function getController() {
            var http = this.http,
                urlPath = http.path;
            if (urlPath.length < 1) {
                return '';
            }
            var moduleControllers = grapeData.controller;
            for (var _module2 in moduleControllers) {
                var controllers = moduleControllers[_module2];
                for (var controllerKey in controllers) {
                    if (urlPath == controllerKey || urlPath.indexOf(controllerKey + '/') == 0) {
                        http.path = http.path.substr(controllerKey.length + 1);
                        return controllerKey;
                    }
                }
            }
            return '';
        }
    }, {
        key: 'getAction',
        value: function getAction() {
            var http = this.http,
                urlPath = http.path;
            var action = '';
            if (urlPath.length < 1) {
                action = '';
            }
            var pos = urlPath.indexOf('/');
            if (pos === -1) {
                http.path = '';
                action = urlPath;
            } else {
                action = urlPath.substr(0, pos);
                http.path = urlPath.substr(pos + 1);
            }
            return action;
        }
    }, {
        key: 'getQuery',
        value: function getQuery() {
            var http = this.http,
                urlPath = http.path;
            var params = this._getQuery(urlPath);
            http.path = '';
            return params;
        }
    }, {
        key: '_getQuery',
        value: function _getQuery(path) {
            //console.log('UrlParser _getQuery start');
            var params = {},
                urlTokens = path.split('/');
            if (!util.isEmpty(path)) {
                for (var i = 0; i < Math.ceil(urlTokens.length / 2); i++) {
                    params[urlTokens[i * 2]] = decodeURIComponent(urlTokens[i * 2 + 1] || '');
                }
            }
            return params;
        }
    }, {
        key: '_stripSlash',
        value: function _stripSlash() {
            var http = this.http,
                urlPath = http.path;
            if (urlPath.startsWith('/')) {
                http.path = urlPath.substr(1);
            }
        }
    }]);
    return UrlParser;
}(grape.MiddlewareBase);

module.exports = UrlParser;