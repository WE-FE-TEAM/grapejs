/**
 * Created by wangcheng on 16/4/14.
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
            this.path = req.path;

            //该请求的response是否已返回
            this._isEnd = false;

            //赋值给模板的字段
            this.locals = {
                '$request': req
            };
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

                this.res.status(httpStatus);
                var moduleConf = (0, _get3.default)((0, _getPrototypeOf2.default)(Http.prototype), 'getConfig', this).call(this, this.module, 'error') || {};
                var tplPath = moduleConf[httpStatus];
                if (tplPath) {
                    this.render(tplPath, data);
                } else {
                    this.res.sendStatus(httpStatus);
                    this.end();
                }
            }
            return grape.prevent();
        }
    }]);
    return Http;
}(GrapeBase);

module.exports = Http;