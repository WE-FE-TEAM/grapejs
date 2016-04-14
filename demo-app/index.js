/**
 * demo app的入口
 * Created by jess on 16/4/14.
 */


'use strict';


let Entrance = require('../lib/index.js');


let app = new Entrance({
    appPath : __dirname
});


app.run();

