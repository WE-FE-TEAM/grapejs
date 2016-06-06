/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var GrapeBase = require('./base.js');

var Http = function (_GrapeBase) {
    (0, _inherits3.default)(Http, _GrapeBase);

    function Http() {
        (0, _classCallCheck3.default)(this, Http);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Http).apply(this, arguments));
    }

    (0, _createClass3.default)(Http, [{
        key: 'init',
        value: function init(req, res) {
            this.req = req;
            this.res = res;
            //当前请求对应的module
            this.module = '';
            this.controller = '';
            this.action = '';
            this.query = req.query;
            this.originalUrl = req.originalUrl;
            this.path = req.path;

            //该请求的response是否已返回
            this._isEnd = false;

            //赋值给模板的字段
            this.locals = {
                '$request': req
            };

            //默认输出 html, utf-8
            res.set('Content-Type', 'text/html; charset=utf-8');
        }
    }, {
        key: 'isEnd',
        value: function isEnd() {
            return this._isEnd;
        }
    }, {
        key: 'assign',
        value: function assign(key, value) {
            this.locals[key] = value;
            return this;
        }
    }, {
        key: 'set',
        value: function set(field, value) {
            this.res.set(field, value);
        }
    }, {
        key: 'render',
        value: function render(tplPath, data) {
            if (!this._isEnd) {
                this._isEnd = true;
                data = (0, _assign2.default)({}, this.locals, data || {});
                this.res.render(tplPath, data);
            }
        }
    }, {
        key: 'end',
        value: function end() {
            this._isEnd = true;
            this.res.end();
        }
    }, {
        key: 'sendStatus',
        value: function sendStatus() {
            var httpStatus = arguments.length <= 0 || arguments[0] === undefined ? '500' : arguments[0];
            var data = arguments[1];

            if (!this._isEnd) {

                httpStatus += '';

                this.res.status(httpStatus);
                //如果连module都没找到, 需要读取 common 下的配置
                var moduleConf = (0, _get3.default)((0, _getPrototypeOf2.default)(Http.prototype), 'getConfig', this).call(this, this.module || 'common', 'page') || {};
                var tplPath = moduleConf[httpStatus];
                if (tplPath) {

                    //允许用户配置两种情况: 1. 配置模板的路径 2. 配置函数, 框架会调用
                    var type = typeof tplPath === 'undefined' ? 'undefined' : (0, _typeof3.default)(tplPath);
                    if (type === 'string') {
                        //字符串, 代表模板路径, 直接渲染
                        this.render(tplPath, data);
                    } else if (type === 'function') {
                        //函数, 调用函数, 传入 http 对象
                        try {
                            tplPath(this, httpStatus, data);
                        } catch (e) {
                            grape.log.error(e);
                            this.res.sendStatus(httpStatus);
                            this.end();
                        }
                    } else {
                        this.res.sendStatus(httpStatus);
                        this.end();
                    }
                } else {
                    this.res.sendStatus(httpStatus);
                    this.end();
                }
            }
            return grape.prevent();
        }
    }, {
        key: 'redirect',
        value: function redirect(status, path) {
            if (arguments.length < 2) {
                path = status;
                status = 302;
            }
            this.res.redirect(status, path);
        }
    }, {
        key: 'json',
        value: function json(data) {
            if (!this._isEnd) {
                this._isEnd = true;
                this.res.json(data);
            }
        }
    }, {
        key: 'e404',
        value: function e404(data) {
            this.sendStatus(404, data);
        }
    }, {
        key: 'e500',
        value: function e500(err) {
            this.assign('grape_error', err);
            this.sendStatus(500);
        }
    }]);
    return Http;
}(GrapeBase);

module.exports = Http;