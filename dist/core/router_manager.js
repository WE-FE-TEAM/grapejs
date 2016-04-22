/**
 * Created by wangcheng on 16/4/15.
 */

'use strict';

var routerManager = {};

/**
 *
 * router的存贮格式 :
 *
 *  grapeData['router'] = {
 *      p2p : [
 *          {
 *              reg : ^p2p\/uplan\/(\w+),
 *              rewrite : p2p/uplan/detail?id=$1
 *          },
 *          {
 *              reg : ^p2p\/uplan$,
 *              rewrite : p2p/uplan/list
 *          }
 *      ]
 *      home : [
 *          {
 *              reg : '',
 *              rewrite : ''
 *          }
 *      ]
 *  }
 */
routerManager.parse = function () {

  var grape = global.grape;
  var configManager = grape.configManager;
  var grapeData = global.grapeData;

  var modules = grapeData.modules;
  modules.forEach(function (module) {

    grapeData.router[module] = configManager.getConfig(module, 'router');
  });
};

module.exports = routerManager;