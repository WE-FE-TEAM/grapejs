/**
 * Created by wangcheng on 16/4/13.
 */


'use strict';

const path = require('path');

const sep = path.sep;

//框架lib目录
const grapeLibPath = path.dirname( __dirname );
//框架根目录
const grapeFrameworkPath = path.dirname( grapeLibPath );

module.exports = {
    GRAPE_FRAMEWORK_PATH : grapeFrameworkPath,
    GRAPE_LIB_PATH : grapeLibPath,
    //框架的配置文件目录
    GRAPE_CONFIG_PATH : path.normalize( `${grapeLibPath}${sep}config`)
};
