/**
 * Created by jess on 16/4/21.
 */


'use strict';



class CanWritePolicy extends weDemo.PolicyBase{

    execute(data){

        let query = this.http.query;

        console.log( query );

        if( query.ok === '1' ){

            grape.console.log(`can_write policy:` , data);

            return Promise.resolve();
        }else{
            return this.sendStatus(401);
        }


    }
}


module.exports = CanWritePolicy;