/**
 * 所有类的基类
 * Created by jess on 16/4/13.
 */


'use strict';

class GrapeBase {

    constructor(...args){
        this.init(...args);
    }

    init(){
        //应该在 子类 中覆盖, 在构造函数中,会自动调用
    }
}


module.exports = GrapeBase;