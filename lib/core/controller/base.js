/**
 * Created by wangcheng on 16/4/13.
 */

const HttpBase = require('../http_base.js');

class ControllerBase extends HttpBase{

    init(http){
        super.init(http);
    }
}

module.exports = ControllerBase;