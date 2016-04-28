/**
 * Created by wangcheng on 16/4/14.
 */

'use strict';

const GrapeBase = require('./base.js');

class Http extends GrapeBase{

    init(req, res){
        this.req = req;
        this.res = res;
        //当前请求对应的module
        this.module = '';
        this.controller = '';
        this.action = '';
        this.query = req.query;
        this.path = req.path;

        //该请求的response是否已返回
        this._isEnd = false;

        //赋值给模板的字段
        this.locals = {
            '$request' : req
        };

        //默认输出 html, utf-8
        res.set('Content-Type', 'text/html; charset=utf-8');
    }

    isEnd(){
        return this._isEnd;
    }

    assign(key, value){
        this.locals[key] = value;
        return this;
    }

    set( field, value ){
        this.res.set( field, value );
    }

    render(tplPath, data){
        if( ! this._isEnd ){
            this._isEnd = true;
            data = Object.assign({}, this.locals, data || {} );
            this.res.render( tplPath, data);
        }
    }

    end(){
        this._isEnd = true;
        this.res.end();
    }

    sendStatus(httpStatus = '500', data){
        if( ! this._isEnd ){

            this.res.status( httpStatus );
            let moduleConf = super.getConfig(this.module, 'error') || {};
            let tplPath = moduleConf[httpStatus];
            if( tplPath ){
                this.render( tplPath, data );
            }else{
                this.res.sendStatus(httpStatus);
                this.end();
            }

        }
        return grape.prevent();
    }

    redirect(status, path){
        this.res.redirect( status, path );
    }
}

module.exports = Http;