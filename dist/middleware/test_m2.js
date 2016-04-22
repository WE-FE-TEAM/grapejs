/**
 * Created by jess on 16/4/15.
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

var Middle = function (_grape$MiddlewareBase) {
    (0, _inherits3.default)(Middle, _grape$MiddlewareBase);

    function Middle() {
        (0, _classCallCheck3.default)(this, Middle);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Middle).apply(this, arguments));
    }

    (0, _createClass3.default)(Middle, [{
        key: 'execute',
        value: function execute(http) {
            //console.log(`[hook]:test_m2`);
            return _promise2.default.resolve();
        }
    }]);
    return Middle;
}(grape.MiddlewareBase);

module.exports = Middle;