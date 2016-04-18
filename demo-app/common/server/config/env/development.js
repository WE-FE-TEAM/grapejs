/**
 * Created by jess on 16/4/14.
 */


'use strict';


module.exports = {

    k1 : '这是来自demo-app/common/config/development',

    redis : {
        kk1 : 'from demo-app/common/config/development'
    },

    log : {
        streams : [
            {
                level : 'trace',
                stream : process.stdout
            }
        ]
    }

};