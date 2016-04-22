/**
 * Created by jess on 16/4/14.
 */

'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var singleton = {};

/**
 * 执行某个hook配置,所对应的所有middleware
 * @param hookName {string} hook名字
 * @param httpObj {Http} http对象
 * @param data {any} 执行时,要传给middleware的数据
 */
singleton.exec = function (hookName, httpObj, data) {

    //hook 的配置只挂载在common下
    var moduleName = 'common';

    var util = grape.util;
    var hookConf = grape.configManager.getModuleConfig(moduleName, 'hook') || {};
    var hookList = hookConf[hookName];
    if (hookList) {
        if (util.isArray(hookList)) {
            var _ret = function () {
                var p = _promise2.default.resolve();
                hookList.forEach(function (middlewareName) {
                    p = p.then(function () {
                        return grape.middlewareManager.executeMiddleware(middlewareName, httpObj, data);
                    });
                });
                return {
                    v: p
                };
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
        } else {
            return _promise2.default.reject(new Error('[' + hookName + '] 对应的hook列表[' + hookList + '] 必须是数组!!'));
        }
    }
    return _promise2.default.resolve();
};

module.exports = singleton;