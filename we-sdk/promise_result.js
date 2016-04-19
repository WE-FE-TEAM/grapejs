/**
 * Created by wangcheng on 16/2/23.
 */

"use strict";

/**
 * Class we-ral promise对象返回的结果类
 */
class PromiseResult {

    __hackfix(){
        rrd.console.log("空class,babel无缓存情况下会出错");
    }

    constructor(status = 0, msg = '', data = {}, extras = {}, error = null){
        this.status = status;
        this.msg = msg;
        this.data = data;
        this.error = error;
        this.extras = extras;
    }

    /**
     * 获取promise结果json对象
     * @returns {{status: Number, msg: String, data: JSON, error: Error}}
     */
    getResult(){
        return {
            status : this.status,
            msg : this.msg,
            data : this.data,
            error : this.error
        };
    }

}

module.exports = PromiseResult;