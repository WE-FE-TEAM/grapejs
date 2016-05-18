/**
 * 提供给 bunyan 库的 stream
 * Created by jess on 16/5/18.
 */


'use strict';

const EventEitter = require('events').EventEmitter;
const util = require('util');

function DevStream(){}

util.inherits( DevStream, EventEitter );

DevStream.prototype.write = function( record ){
    let str = util.inspect( record );
    console.log( str );
};



let singleton = {

    dev : new DevStream()

};



module.exports = singleton;

