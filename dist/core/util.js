/**
 * Created by wangcheng on 16/4/13.
 */

'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');
var util = require('util');
var crypto = require('crypto');
var net = require('net');

var sep = path.sep;

var toString = Object.prototype.toString;
var isArray = Array.isArray;
var isBuffer = Buffer.isBuffer;
var numberReg = /^((\-?\d*\.?\d*(?:e[+-]?\d*(?:\d?\.?|\.?\d?)\d*)?)|(0[0-7]+)|(0x[0-9a-f]+))$/i;

/**
 * make callback function to promise
 * @param  {Function} fn       []
 * @param  {Object}   receiver []
 * @return {Promise}            []
 */
var promisify = function promisify(fn, receiver) {
    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return new _promise2.default(function (resolve, reject) {
            fn.apply(receiver, [].concat(args, [function (err, res) {
                return err ? reject(err) : resolve(res);
            }]));
        });
    };
};

/**
 * check object is function
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
var isFunction = function isFunction(obj) {
    return typeof obj === 'function';
};

/**
 * is arguments
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
var isArguments = function isArguments(obj) {
    return toString.call(obj) === '[object Arguments]';
};

/**
 * create Class in javascript
 * @param {Function} superCtor [super constructor]
 * @param {Object} props     []
 */
function Class(superCtor, props) {
    var cls = function cls() {
        if (!(this instanceof cls)) {
            throw new Error('Class constructors cannot be invoked without \'new\'');
        }
        //extend prototype data to instance
        //avoid instance change data to pullte prototype
        cls.extend(cls.__props__, this);
        if (isFunction(this.init)) {
            this.__initReturn = this.init.apply(this, arguments);
        }
    };
    cls.__props__ = {};
    cls.extend = function (props, target) {
        target = target || cls.prototype;
        var name = void 0,
            value = void 0;
        for (name in props) {
            value = props[name];
            if (isArray(value)) {
                cls.__props__[name] = target[name] = extend([], value);
            } else if (isObject(value)) {
                cls.__props__[name] = target[name] = extend({}, value);
            } else {
                target[name] = value;
            }
        }
        return cls;
    };
    cls.inherits = function (superCtor) {
        cls.super_ = superCtor;
        //if superCtor.prototype is not enumerable
        if ((0, _keys2.default)(superCtor.prototype).length === 0) {
            cls.prototype = (0, _create2.default)(superCtor.prototype, {
                constructor: {
                    value: cls,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
        } else {
            extend(cls.prototype, superCtor.prototype);
        }
        return cls;
    };
    if (!isFunction(superCtor)) {
        props = superCtor;
    } else if (isFunction(superCtor)) {
        cls.inherits(superCtor);
    }
    if (props) {
        cls.extend(props);
    }
    /**
     * invoke super class method
     * @param  {String} name []
     * @param  {Mixed} data []
     * @return {Mixed}      []
     */
    cls.prototype.super = function (name, data) {
        if (!this[name]) {
            this.super_c = null;
            return;
        }
        var super_ = this.super_c ? this.super_c.super_ : this.constructor.super_;
        if (!super_ || !isFunction(super_.prototype[name])) {
            this.super_c = null;
            return;
        }
        while (this[name] === super_.prototype[name] && super_.super_) {
            super_ = super_.super_;
        }
        this.super_c = super_;
        if (!this.super_t) {
            this.super_t = 1;
        }
        if (!isArray(data) && !isArguments(data)) {
            data = arguments.length === 1 ? [] : [data];
        }
        var t = ++this.super_t,
            ret = void 0,
            method = super_.prototype[name];
        ret = method.apply(this, data);
        if (t === this.super_t) {
            this.super_c = null;
            this.super_t = 0;
        }
        return ret;
    };
    return cls;
}
/**
 * extend object
 * @return {Object} []
 */
var extend = function extend(target) {
    target = target || {};
    var i = 0,
        length = arguments.length - 1,
        options = void 0,
        name = void 0,
        src = void 0,
        copy = void 0;
    for (; i < length; i++) {
        options = arguments.length <= i + 1 ? undefined : arguments[i + 1];
        if (!options) {
            continue;
        }
        for (name in options) {
            src = target[name];
            copy = options[name];
            if (src && src === copy) {
                continue;
            }
            if (isObject(copy)) {
                target[name] = extend(src && isObject(src) ? src : {}, copy);
            } else if (isArray(copy)) {
                target[name] = extend([], copy);
            } else {
                target[name] = copy;
            }
        }
    }
    return target;
};

/**
 * camelCase string
 * @param  {String} str []
 * @return {String}     []
 */
var camelCase = function camelCase(str) {
    if (str.indexOf('_') > -1) {
        str = str.replace(/_(\w)/g, function (a, b) {
            return b.toUpperCase();
        });
    }
    return str;
};
/**
 * check object is class
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
var isClass = function isClass(obj) {
    return isFunction(obj) && isFunction(obj.inherits) && isFunction(obj.extend);
};
/**
 * check object is boolean
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
var isBoolean = function isBoolean(obj) {
    return toString.call(obj) === '[object Boolean]';
};
/**
 * check object is number
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
var isNumber = function isNumber(obj) {
    return toString.call(obj) === '[object Number]';
};

/**
 * check object is object
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
var isObject = function isObject(obj) {
    if (isBuffer(obj)) {
        return false;
    }
    return toString.call(obj) === '[object Object]';
};
/**
 * check object is string
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
var isString = function isString(obj) {
    return toString.call(obj) === '[object String]';
};
/**
 * clone data
 * @param  {Mixed} data []
 * @return {Mixed}      []
 */
var clone = function clone(data) {
    if (isObject(data)) {
        return extend({}, data);
    } else if (isArray(data)) {
        return extend([], data);
    }
    return data;
};
/**
 * check path is file
 * @param  {String}  p [filepath]
 * @return {Boolean}   []
 */
var isFile = function isFile(p) {
    try {
        return fs.statSync(p).isFile();
    } catch (e) {}
    return false;
};

/**
 * check path is file in async mode
 * @param  {String} p []
 * @return {Boolean}   []
 */
var isFileAsync = function isFileAsync(p) {
    return promisify(fs.stat, fs)(p).then(function (stat) {
        return stat.isFile();
    }).catch(function () {
        return false;
    });
};

/**
 * check path is directory
 * @param  {String}  p []
 * @return {Boolean}   []
 */
var isDir = function isDir(p) {
    try {
        return fs.statSync(p).isDirectory();
    } catch (e) {}
    return false;
};

/**
 * check path is file in async mode
 * @param  {String} p []
 * @return {Boolean}   []
 */
var isDirAsync = function isDirAsync(p) {
    return promisify(fs.stat, fs)(p).then(function (stat) {
        return stat.isDirectory();
    }).catch(function () {
        return false;
    });
};

/**
 * check object is number string
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
var isNumberString = function isNumberString(obj) {
    return numberReg.test(obj);
};
/**
 * check object is promise
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
var isPromise = function isPromise(obj) {
    return !!(obj && typeof obj.then === 'function' && typeof obj.catch === 'function');
};
/**
 * check path is writable
 * @param  {Mixed}  p []
 * @return {Boolean}   []
 */
var isWritable = function isWritable(p) {
    if (!fs.existsSync(p)) {
        return false;
    }
    var stats = fs.statSync(p);
    var mode = stats.mode;
    var uid = process.getuid ? process.getuid() : 0;
    var gid = process.getgid ? process.getgid() : 0;
    var owner = uid === stats.uid;
    var group = gid === stats.gid;
    return !!(owner && mode & parseInt('00200', 8) || group && mode & parseInt('00020', 8) || mode & parseInt('00002', 8));
};

/**
 * true empty
 * @param  {Mixed} obj []
 * @return {Boolean}     []
 */
var isTrueEmpty = function isTrueEmpty(obj) {
    if (obj === undefined || obj === null || obj === '') {
        return true;
    }
    if (isNumber(obj) && isNaN(obj)) {
        return true;
    }
    return false;
};
/**
 * check object is mepty
 * @param  {[Mixed]}  obj []
 * @return {Boolean}     []
 */
var isEmpty = function isEmpty(obj) {
    if (isTrueEmpty(obj)) {
        return true;
    }

    if (isObject(obj)) {
        for (var key in obj) {
            return !key && !0;
        }
        return true;
    } else if (isArray(obj)) {
        return obj.length === 0;
    } else if (isString(obj)) {
        return obj.length === 0;
    } else if (isNumber(obj)) {
        return obj === 0;
    } else if (isBoolean(obj)) {
        return !obj;
    }
    return false;
};

/**
 * make dir recursive
 * @param  {String} p    [path]
 * @param  {mode} mode [path mode]
 * @return {}      []
 */
var mkdir = function mkdir(p, mode) {
    mode = mode || '0777';
    if (fs.existsSync(p)) {
        chmod(p, mode);
        return true;
    }
    var pp = path.dirname(p);
    if (fs.existsSync(pp)) {
        fs.mkdirSync(p, mode);
    } else {
        mkdir(pp, mode);
        mkdir(p, mode);
    }
    return true;
};

/**
 * get deferred object
 * @return {Object} []
 */
var defer = function defer() {
    var deferred = {};
    deferred.promise = new _promise2.default(function (resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
};

/**
 * remove dir aync
 * @param  {String} p       [path]
 * @param  {Bollean} reserve []
 * @return {Promise}         []
 */
var rmdir = function rmdir(p, reserve) {
    if (!isDir(p)) {
        return _promise2.default.resolve();
    }
    var deferred = defer();
    fs.readdir(p, function (err, files) {
        if (err) {
            return deferred.reject(err);
        }
        var promises = files.map(function (item) {
            var filepath = path.normalize(p + sep + item);
            if (isDir(filepath)) {
                return rmdir(filepath, false);
            } else {
                var _ret = function () {
                    var deferred = defer();
                    fs.unlink(filepath, function (err) {
                        return err ? deferred.reject(err) : deferred.resolve();
                    });
                    return {
                        v: deferred.promise
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
            }
        });
        var promise = files.length === 0 ? _promise2.default.resolve() : _promise2.default.all(promises);
        return promise.then(function () {
            if (!reserve) {
                var _ret2 = function () {
                    var deferred = defer();
                    fs.rmdir(p, function (err) {
                        return err ? deferred.reject(err) : deferred.resolve();
                    });
                    return {
                        v: deferred.promise
                    };
                }();

                if ((typeof _ret2 === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret2)) === "object") return _ret2.v;
            }
        }).then(function () {
            deferred.resolve();
        }).catch(function (err) {
            deferred.reject(err);
        });
    });
    return deferred.promise;
};
/**
 * get files in path
 * @param  {} dir    []
 * @param  {} prefix []
 * @return {}        []
 */
var getFiles = function getFiles(dir, prefix, filter) {
    dir = path.normalize(dir);
    if (!fs.existsSync(dir)) {
        return [];
    }
    if (!isString(prefix)) {
        filter = prefix;
        prefix = '';
    }
    if (filter === true) {
        filter = function filter(item) {
            return item[0] !== '.';
        };
    }
    prefix = prefix || '';
    var files = fs.readdirSync(dir);
    var result = [];
    files.forEach(function (item) {
        var stat = fs.statSync(dir + sep + item);
        if (stat.isFile()) {
            if (!filter || filter(item)) {
                result.push(prefix + item);
            }
        } else if (stat.isDirectory()) {
            if (!filter || filter(item, true)) {
                var cFiles = getFiles(dir + sep + item, prefix + item + sep, filter);
                result = result.concat(cFiles);
            }
        }
    });
    return result;
};
/**
 * change path mode
 * @param  {String} p    [path]
 * @param  {String} mode [path mode]
 * @return {Boolean}      []
 */
var chmod = function chmod(p, mode) {
    mode = mode || '0777';
    if (!fs.existsSync(p)) {
        return true;
    }
    return fs.chmodSync(p, mode);
};
/**
 * get content md5
 * @param  {String} str [content]
 * @return {String}     [content md5]
 */
var md5 = function md5(str) {
    var instance = crypto.createHash('md5');
    instance.update(str + '', 'utf8');
    return instance.digest('hex');
};

var htmlMaps = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quote;',
    '\'': '&#39;'
};
var escapeHtml = function escapeHtml(str) {
    return (str + '').replace(/[<>'"]/g, function (a) {
        return htmlMaps[a];
    });
};

/**
 * get datetime
 * @param  {Date} date []
 * @return {String}      []
 */
var datetime = function datetime(date, format) {
    var fn = function fn(d) {
        return ('0' + d).slice(-2);
    };

    if (date && think.isString(date)) {
        date = new Date(Date.parse(date));
    }
    var d = date || new Date();

    format = format || 'YYYY-MM-DD HH:mm:ss';
    var formats = {
        YYYY: d.getFullYear(),
        MM: fn(d.getMonth() + 1),
        DD: fn(d.getDate()),
        HH: fn(d.getHours()),
        mm: fn(d.getMinutes()),
        ss: fn(d.getSeconds())
    };

    return format.replace(/([a-z])\1+/ig, function (a) {
        return formats[a] || a;
    });
};

/**
 * to fast properties
 * @param  {Object} obj []
 * @return {void}     []
 */
var toFastProperties = function toFastProperties(obj) {
    var f = function f() {};
    f.prototype = obj;
    /*eslint-disable no-new*/
    new f();
};

//线上环境
var ENV_PRODUCTION = 'production';
//预发布环境
var ENV_STAGE = 'stage';
//QA测试环境
var ENV_TEST = 'test';
//本地开发
var ENV_DEV = 'development';

var getNodeEnv = function getNodeEnv() {

    var envName = ENV_DEV;
    var env = process.env.NODE_ENV;

    switch (env) {
        case ENV_DEV:
            envName = ENV_DEV;
            break;
        case ENV_TEST:
            envName = ENV_TEST;
            break;
        case ENV_STAGE:
            envName = ENV_STAGE;
            break;
        case ENV_PRODUCTION:
            envName = ENV_PRODUCTION;
            break;
        default:
            console.warn('未识别的 NODE_ENV[' + env + '], 默认当做 ' + ENV_DEV);
            envName = ENV_DEV;
    }
    return envName;
};

//是否为本地开发环境
function isDev() {
    return getNodeEnv() === ENV_DEV;
}

/**
 * 获取某个绝对路径 absolutePath 下包含的子目录, 排除掉 '.' '..'
 * @param absolutePath {String} 某个目录的绝对路径
 * @return {Array} [ '子目录1', '子目录2' ]
 */
function getSubDirectory(absolutePath) {
    var out = [];
    if (!isDir(absolutePath) || !path.isAbsolute(absolutePath)) {
        return out;
    }
    var files = fs.readdirSync(absolutePath);
    files.forEach(function (file) {
        var filePath = absolutePath + sep + file;
        var stat = fs.statSync(filePath);
        if (stat.isDirectory() && file[0] !== '.') {
            out.push(file);
        }
    });

    return out;
}

/**
 * 获取APP下某个module的根目录
 * @param appPath {String} APP的绝对路径
 * @param moduleName {String}  模块名
 * @returns {string} 模块所在的根目录的绝对路径
 */
function getAppModulePath(appPath, moduleName) {
    return appPath + sep + moduleName + sep + 'server';
}

module.exports = {
    toFastProperties: toFastProperties,
    promisify: promisify,
    sep: sep,
    camelCase: camelCase,
    defer: defer,
    Class: Class,
    extend: extend,
    isClass: isClass,
    isBoolean: isBoolean,
    isNumber: isNumber,
    isObject: isObject,
    isString: isString,
    isArray: isArray,
    isFunction: isFunction,
    isDate: util.isDate,
    isRegExp: util.isRegExp,
    isError: util.isError,
    isIP: net.isIP,
    isIP4: net.isIPv4,
    isIP6: net.isIPv6,
    isFile: isFile,
    isFileAsync: isFileAsync,
    isDir: isDir,
    isDirAsync: isDirAsync,
    isNumberString: isNumberString,
    isPromise: isPromise,
    isWritable: isWritable,
    isBuffer: isBuffer,
    isTrueEmpty: isTrueEmpty,
    isEmpty: isEmpty,
    clone: clone,
    mkdir: mkdir,
    rmdir: rmdir,
    md5: md5,
    chmod: chmod,
    getFiles: getFiles,
    escapeHtml: escapeHtml,
    datetime: datetime,
    getNodeEnv: getNodeEnv,
    isDev: isDev,
    getSubDirectory: getSubDirectory,
    getAppModulePath: getAppModulePath
};