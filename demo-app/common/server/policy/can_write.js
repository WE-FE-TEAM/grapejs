/**
 * Created by jess on 16/4/21.
 */


'use strict';



class CanWritePolicy extends weDemo.PolicyBase{

    execute(data){

        grape.console.log(`can_write policy:` , data);

        return Promise.resolve();
    }
}


module.exports = CanWritePolicy;