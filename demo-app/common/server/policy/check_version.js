/**
 * 测试policy的执行
 * Created by jess on 16/4/21.
 */


'use strict';


class CheckVersionPolicy extends weDemo.PolicyBase {

    execute(data){

        grape.console.log(`check_version policy: `, data);

        return Promise.resolve();
    }
}


module.exports = CheckVersionPolicy;