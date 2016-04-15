/**
 * Created by wangcheng on 16/4/14.
 */


'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const Base = require('./base.js');

let grape = global.grape;

class App extends Base{

    init(req, res){
        this.http = new grape.Http(req, res);
    }

    execHook(hookName, args){
        return super.execHook( hookName, this.http, args);
    }

    async exec(){
        console.log( 'begin exec');
        await this.execHook('request_start');
        await this.execHook('request_parse');
        await this.execHook('filter_start');
        await this.execFilter();
        await this.execHook('filter_end');
        await this.execHook('controller_start');
        await this.execController();
        await this.execHook('controller_end');
        console.log('end exec');
    }

    execFilter(){
        return Promise.resolve();
    }

    execController(){
        //this.http.res.end('hello, grape');

        let module = 'home';
        let controllerKey = 'user/setting';
        let action = 'list';

        let controllerClass = this.getControllerClass(module, controllerKey);

        if( controllerClass ){
            let method = action + 'Action';
            let obj = new controllerClass( this.http );
            if( typeof obj[method] === 'function' ){
                return obj[method]();
            }
        }

        return Promise.resolve();
    }

    static run(){

        const app = express();
        const serverConf = grape.configManager.getConfig('server');
        const port = serverConf.port;

        //禁止输出 x-powered-by
        app.disable('x-powered-by');
        app.disable('etag');

        app.use( cookieParser() );
        app.use(bodyParser.json()); // for parsing application/json
        app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


        function requestReceive(req, res, next){
            let obj = new App(req, res);
            obj.exec().catch( (err) => {
                //TODO 执行出错
                res.end(err.stack);
                console.log(`出错: ${err.message}`);
            });
        }

        app.use( grape.path.APP_URL_PREFIX, requestReceive);

        app.listen(port);
    }
}


module.exports = App;