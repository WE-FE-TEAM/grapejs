/**
 * Created by wangcheng on 16/4/13.
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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HttpBase = require('../http_base.js');

var ControllerBase = function (_HttpBase) {
    (0, _inherits3.default)(ControllerBase, _HttpBase);

    function ControllerBase() {
        (0, _classCallCheck3.default)(this, ControllerBase);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ControllerBase).apply(this, arguments));
    }

    (0, _createClass3.default)(ControllerBase, [{
        key: 'init',
        value: function init(http) {
            (0, _get3.default)((0, _getPrototypeOf2.default)(ControllerBase.prototype), 'init', this).call(this, http);
        }
    }, {
        key: 'sendStatus',
        value: function sendStatus(status, data) {
            return this.http.sendStatus(status, data);
        }
    }]);
    return ControllerBase;
}(HttpBase);

module.exports = ControllerBase;