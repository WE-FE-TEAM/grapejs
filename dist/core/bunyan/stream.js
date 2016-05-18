/**
 * 提供给 bunyan 库的 stream
 * Created by jess on 16/5/18.
 */

'use strict';

var EventEitter = require('events').EventEmitter;
var util = require('util');

function DevStream() {}

util.inherits(DevStream, EventEitter);

DevStream.prototype.write = function (record) {
    var str = util.inspect(record);
    console.log(str);
};

var singleton = {

    dev: new DevStream()

};

module.exports = singleton;