/**
 * Created by wangcheng on 16/4/22.
 */

var fs = require('fs');
var path = require('path');
var idr = /^([\w0-9_\-]+):(?!(\/|\\))[^:]+$/i;

function ResourceApi(config_dir) {
    this.config_dir = config_dir;
    this.maps = {};
}

/**
 * Conver source map id to source url.
 * @see /config/ns-map.json file.
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
ResourceApi.prototype.resolve = function (id) {
    var info = this.getInfo(id);
    return info ? info.uri : '';
};

ResourceApi.prototype.getInfo = function (id, ignorePkg) {
    if (!id || !idr.exec(id)) {
        return null;
    }

    var ns = this.getNS(id);
    var info;

    if (this.maps[ns] || this.lazyload(ns)) {
        info = this.maps[ns]['res'][id];
        if (!ignorePkg && info && info['pkg']) {
            info = this.maps[ns]['pkg'][info['pkg']];
        }
    }

    if (info) {
        info.id = id;
    }

    return info;
};

ResourceApi.prototype.getPkgInfo = function (id) {
    if (!id || !idr.exec(id)) {
        return null;
    }

    var ns = this.getNS(id);
    var info;

    if (this.maps[ns] || this.lazyload(ns)) {
        info = this.maps[ns]['pkg'][id];
    }

    return info;
};

ResourceApi.prototype.getNS = function (id) {
    var p = id.indexOf(':');
    if (p != -1) {
        return id.substr(0, p);
    }
    else {
        return '__global__';
    }
};

ResourceApi.prototype.lazyload = function (ns) {
    var map_json = ns + '-map.json';
    var stat;

    if (ns == '__global__') {
        map_json = 'map.json';
    }
    map_json = path.join(this.config_dir, map_json);

    try {
        stat = fs.statSync(map_json);
    }
    catch (e) {
        //yog.log.fatal(map_json + ' not exist');
        console.log(map_json + ' not exist');
        return false;
    }

    if (stat && stat.isFile()) {
        try {
            this.maps[ns] = JSON.parse(fs.readFileSync(map_json));
        }
        catch (e) {
            // yog.log.fatal(map_json + ' parse failed');
            console.log(map_json + ' parse failed');
            return false;
        }
    }
    else {
        return false;
    }
    return true;
};

ResourceApi.prototype.destroy = function (id) {
    this.maps = null;
};


module.exports = function (options) {
    options = options || {};

    var config_dir = options['config_dir'];
    var cache = options.cache;
    var singlon = new ResourceApi(config_dir);

    return function (req, res, next) {
        var destroy;

        res.fis = cache ? singlon : new ResourceApi(config_dir);

        destroy = function () {
            res.removeListener('finish', destroy);
            //res.removeListener('close', destroy);

            cache && res.fis.destroy();
            res.fis = null;
        };

        res.on('finish', destroy);
        //res.on('close', destroy);

        next();
    };
};

module.exports.ResourceApi = ResourceApi;
