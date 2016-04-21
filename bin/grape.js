#!/usr/bin/env node

/**
 * Created by wangcheng on 16/4/20.
 */

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var cli = new Liftoff({
    name: 'grape', // 命令名字
    processTitle: 'grape',
    moduleName: 'grapejs',
    configName: 'fis-conf',

    // only js supported!
    extensions: {
        '.js': null
    }
});

cli.launch({
    cwd: argv.r || argv.root,
    configPath: argv.f || argv.file
}, function(env) {
    var fis;
    if (!env.modulePath) {
        fis = require('../lib/command.js');
    } else {
        fis = require(env.modulePath);
    }
    // fis.set('system.localNPMFolder', path.join(env.cwd, 'node_modules/grapejs'));
    // fis.set('system.globalNPMFolder', path.dirname(__dirname));
    fis.cli.run(argv, env);
});

