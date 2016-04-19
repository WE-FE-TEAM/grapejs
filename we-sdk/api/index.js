/**
 * Created by jess on 16/4/19.
 */


'use strict';


const fund = require('./fund/fund.js');


class ApiFactory {

    constructor(){
        this.fund = fund;
    }

    _hack(){
        let x = 'get risk of babel compile error';
    }
}

//单例
module.exports = new ApiFactory();