/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

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

var GrapeBase = require('./base.js');

var HttpBase = function (_GrapeBase) {
    (0, _inherits3.default)(HttpBase, _GrapeBase);

    function HttpBase() {
        (0, _classCallCheck3.default)(this, HttpBase);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HttpBase).apply(this, arguments));
    }

    (0, _createClass3.default)(HttpBase, [{
        key: 'init',
        value: function init(http) {
            this.http = http;
        }
    }, {
        key: 'getModule',
        value: function getModule() {
            return 'common';
        }
    }]);
    return HttpBase;
}(GrapeBase);

module.exports = HttpBase;