/**
 * 封装日志系统
 * Created by jess on 16/4/18.
 */

'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bunyan = require('bunyan');

var GrapeLog = function () {
    function GrapeLog(conf) {
        (0, _classCallCheck3.default)(this, GrapeLog);

        this.log = bunyan.createLogger(conf);
    }

    (0, _createClass3.default)(GrapeLog, [{
        key: 'fatal',
        value: function fatal() {
            this.log.fatal.apply(this.log, arguments);
            return this;
        }
    }, {
        key: 'error',
        value: function error() {
            this.log.error.apply(this.log, arguments);
            return this;
        }
    }, {
        key: 'warn',
        value: function warn() {
            this.log.warn.apply(this.log, arguments);
            return this;
        }
    }, {
        key: 'info',
        value: function info() {
            this.log.info.apply(this.log, arguments);
            return this;
        }
    }, {
        key: 'debug',
        value: function debug() {
            this.log.debug.apply(this.log, arguments);
            return this;
        }
    }, {
        key: 'trace',
        value: function trace() {
            this.log.trace.apply(this.log, arguments);
            return this;
        }
    }]);
    return GrapeLog;
}();

var singleton = {
    getLog: function getLog(conf) {
        return new GrapeLog(conf);
    }
};

module.exports = singleton;