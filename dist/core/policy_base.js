/**
 * 所有policy 的基类, 具体应用中, 可以覆盖掉
 * Created by jess on 16/5/4.
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

var ControllerBase = require('./controller/base');

var PolicyBase = function (_ControllerBase) {
  (0, _inherits3.default)(PolicyBase, _ControllerBase);

  function PolicyBase() {
    (0, _classCallCheck3.default)(this, PolicyBase);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PolicyBase).apply(this, arguments));
  }

  (0, _createClass3.default)(PolicyBase, [{
    key: 'execute',


    /**
     * 所有policy 都执行 execute 方法
     * @param data {any} 可以在执行policy时,传入额外参数
     * @return {promise}
     */
    value: function execute(data) {
      return _promise2.default.reject(new Error('policy[' + this.constructor.name + ']必须覆盖基类提供的[execute]方法!!'));
    }
  }]);
  return PolicyBase;
}(ControllerBase);

module.exports = PolicyBase;