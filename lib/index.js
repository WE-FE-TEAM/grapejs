/**
 * 框架入口, 加载各种config/rewrite/router/controller
 * Created by jess on 16/4/13.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const grape = require('./core/grape.js');

const util = grape.util;

class GrapeIndex extends grape.Base {

    init(options){
        super.init();
        if(options.appPath){
            grape.path.GRAPE_APP_PATH = options.appPath;
            this.getModules();
        }
    }

    getModules(appPath){
        let modules = [];
        if(util.isDir(appPath)){
            let modules = fs.readdirSync(appPath);
            modules = modules.filter( (module) => {
                if(module[0] != '.'){
                    return module;
                }
            });
            grapeData.modules = modules;
        }

        return modules;
    }

    loadController(){

    }

    load(){
        this.loadController();
    }

    run(){

    }
}


module.exports = GrapeIndex;

