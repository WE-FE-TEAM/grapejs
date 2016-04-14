/**
 * Created by wangcheng on 16/4/13.
 */

const GrapeHttp = require('../http.js');

class ControllerBase extends GrapeHttp{

    init(req, res){
        super.init(req, res);
    }
}

module.exports = ControllerBase;