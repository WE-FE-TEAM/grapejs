/**
 * 提供给 bunyan 库的 stream
 * Created by jess on 16/5/18.
 */

'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventEitter = require('events').EventEmitter;
var util = require('util');

function DevStream(options) {

    this.options = (0, _assign2.default)({

        showHidden: false,
        depth: 4,
        colors: false,
        customInspect: false,
        showProxy: false,
        maxArrayLength: 100

    }, options || {});
}

util.inherits(DevStream, EventEitter);

DevStream.prototype.write = function (record) {
    var str = util.inspect(record, this.options);
    console.log(str);
};

var singleton = {

    dev: function dev(options) {
        return new DevStream(options);
    }

};

module.exports = singleton;