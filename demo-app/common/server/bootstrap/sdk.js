/**
 * Created by jess on 16/4/19.
 */



'use strict';


const path = require('path');

const sep = path.sep;

const weSDK = require( path.normalize( grape.path.APP_PATH + sep + '../we-sdk/index.js' ) );



weSDK.init();

