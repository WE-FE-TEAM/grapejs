/**
 * Created by jess on 16/4/15.
 */


'use strict';


class UserSetting extends grape.ControllerBase {


    lists(){
        this.http.res.end('UserSetting.list');
    }

    detail(){
        this.http.res.end('UserSetting.detail');
    }
}



module.exports = UserSetting;