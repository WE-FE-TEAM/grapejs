/**
 * home模块下的policy配置
 * Created by jess on 16/4/21.
 */


'use strict';


module.exports = {

    '*' : [ 'check_version' ],

    index : {

        '*' : [
            {
                name : 'check_version',
                data : 'data from policy config'
            }
        ],

        list : [
            'can_write',
            'check_version'
        ],

        detail : []
    },

    'user/setting' : {
        list : [
            {
                name : 'check_version',
                data : 'setting-list-check-version'
            },
            'can_write'
        ]
    }

};


