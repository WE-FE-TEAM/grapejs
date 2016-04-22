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

var grape = global.grape;

var UrlRewrite = function (_grape$MiddlewareBase) {
    (0, _inherits3.default)(UrlRewrite, _grape$MiddlewareBase);

    function UrlRewrite() {
        (0, _classCallCheck3.default)(this, UrlRewrite);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(UrlRewrite).apply(this, arguments));
    }

    (0, _createClass3.default)(UrlRewrite, [{
        key: 'execute',
        value: function execute() {

            var http = this.http;
            var pos = http.path.indexOf(grape.path.APP_URL_PREFIX);
            //console.log('UrlRewrite execute start ', http.path, grape.path.APP_URL_PREFIX);
            if (pos === 0) {
                http.path = http.path.substr(grape.path.APP_URL_PREFIX.length);
                //console.log(http.path);
            }
            _promise2.default.resolve();
        }
    }]);
    return UrlRewrite;
}(grape.MiddlewareBase);

module.exports = UrlRewrite;