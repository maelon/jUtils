/*===================================================================
#    FileName: jUtils.js
#      Author: Maelon.J
#       Email: maelon.j@gmail.com
#  CreateTime: 2016-04-21 22:31
# Description: jUtils
===================================================================*/

(function (scope) {

    var Utils = function () {
        if (Utils._instance)
            throw new Error('Utils is singleton, please use Utils.getInstance()');
    };
    Utils.prototype = {
        /**************** debug ****************/
        'isDebug': false,
        'useDebug': function (use) {
            this.isDebug = !!use;
        },
        'debugAlert': function (content, delay) {
            if (this.isDebug) {
                setTimeout(function (msg) {
                    window.alert(msg);
                }, delay || 0, content);
            }
        },

        /**************** time ****************/
        'transTime': function (time) {
            var timeArr = [];
            var day = parseInt(time / 36E5 / 24, 10);
            var hour = parseInt((time - day * 24 * 36E5) / 36E5 % 24, 10);
            var minute = parseInt((time - day * 24 * 36E5 - hour * 36E5) / 6E4 % 60, 10);
            var second = parseInt((time - day * 24 * 36E5 - hour * 36E5 - minute * 6E4) / 1E3, 10);
            timeArr.push(day > 0 ? day : '');
            timeArr.push(hour > 0 ? hour : '');
            timeArr.push(minute > 0 ? minute : '');
            timeArr.push(second > 0 ? second : '');
            return timeArr;
        },

        /**************** apptype ****************/
        'appTypeEnum': {},
        'getAppType': function () {
            var ua = window.navigator.userAgent.toLowerCase();
            var match = ua.match(/MicroMessenger/i);
            if (match && match[0] === 'micromessenger') {
                return 'weixin';
            } else {
                for(var s in this.appTypeEnum) {
                    match = ua.match(new RegExp(s, 'i'));
                    if (match && match[0] === s.toLowerCase()) {
                        return this.appTypeEnum[s];
                    }
                }
            }
            return 'app';
        },

        /**************** class ****************/
        'extendClass': function (child, parent) {
            if(typeof child !== 'function')
                throw new TypeError('extendClass child must be function type');
            if(typeof parent !== 'function')
                throw new TypeError('extendClass parent must be function type');

            if(child === parent)
                return ;
            var Transitive = new Function();
            Transitive.prototype = parent.prototype;
            child.prototype = new Transitive();
            return child.prototype.constructor = child;
        }

        /**************** object ****************/
        'decorate': function (target, source) {
            for (var s in source) {
                target[s] = source[s];
            }
            return target;
        },

        /**************** GUID ****************/
        /**
        * GUID静态属性
        * Added by maelon 2015-07-24 14:37
        */
        'jGUID' = {
            '__version': '0.1.0',
            'callCount': 0
        },
        /**
        * GUID(hex):
        *    xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        */
        'makeSimpleGUID': function () {
            var guid = '00000000000000000000000000000000';
            var count = this.jGUID['callCount']++;
            var count16 = count.toString(16);
            guid = (guid + count16).slice(count16.length);
            return guid.slice(0, 8) + '-' + guid.slice(8, 12) + '-' + guid.slice(12, 16) + '-' + guid.slice(16, 20) + '-' + guid.slice(20);
        },

        /**************** url ****************/
        'queryList': undefined,
        'parseURL': function (url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                href: url,
                protocol: a.protocol,
                host: a.host,
                hostname: a.hostname,
                port: a.port,
                search: a.search,
                hash: a.hash,
                pathname: a.pathname
            };
        },
        'getQueryList': function (url) {
            var search = url ? this.parseURL(url).search : window.location.search;
            var result = search.match(new RegExp('[?&][^?&]+=?[^?&]*', 'g'));
            if (result === null) {
                if (url) {
                    return [];
                }!this._queryList && (this._queryList = []);
                return this._queryList;
            }
            for (var i = 0; i < result.length; i++) {
                result[i] = result[i].substring(1);
            }
            var names = [];
            var arr = [];
            var name;
            var qs;
            for (i = 0; i < result.length; i++) {
                qs = result[i].split('=');
                name = qs[0];
                if (names.indexOf(name) > -1) {
                    for (var j = 0; j < arr.length; j++) {
                        if ((arr[j].split('='))[0] === name) {
                            arr[j] = name + '=' + qs[1];
                        }
                    }
                }
                else {
                    names.push(name);
                    arr.push(name + '=' + qs[1]);
                }
            }
            if (url)
                return arr;
            !this._queryList && (this._queryList = arr);
            return this._queryList;
        },
        'getQueryString': function (name, ignore, url) {
            var arr = [];
            var ig = !!ignore;
            var queryName = ig ? name.toLowerCase() : name;
            var qs = (function (scope) {
                if (!url && scope._queryList && scope._queryList.length > 0) {
                    return scope._queryList;
                }
                return scope.getQueryList(url);
            })(this);
            var q;
            var isTrue;
            for (var i = 0; i < qs.length; i++) {
                q = qs[i].split('=');
                isTrue = ((ig ? q[0].toLowerCase() : q[0]) === queryName);
                if (isTrue) {
                    arr.push(q[1]);
                }
            }
            return arr;
        },
        'setQueryString': function (query, url, allignore) {
            var qs = url ? this.getQueryList(url).concat() : this._queryList.concat();
            var q;
            var qNamep;
            var namep;
            var qName;
            var qValue;
            var add = [];
            for (var name in query) {
                var has = false;
                if (qs.length) {
                    for (var i = 0; i < qs.length; i++) {
                        q = qs[i].split('=');
                        qName = q[0];
                        qValue = query[name];
                        if (allignore) {
                            qNamep = qName.toLowerCase();
                            namep = name.toLowerCase();
                        }
                        else {
                            qNamep = qName;
                            namep = name;
                        }
                        if (qNamep === namep) {
                            has = true;
                            if (qValue === null)
                                qs[i] = '';
                            else
                                qs[i] = qName + '=' + qValue;
                        }
                    }
                }
                if (!has) {
                    if (query[name] !== null)
                        add.push(name);
                }
            }
            for (var i = 0; i < qs.length; i++) {
                if (qs[i] === '') {
                    qs.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < add.length; i++) {
                qs.push(add[i] + '=' + query[add[i]]);
            }
            return '?' + qs.join('&');
        },
        'setQueryStringURL': function (queryObj, url) {
            var urlLoc = url ? this.parseURL(url) : window.location;
            return urlLoc.protocol + '//' + urlLoc.host + urlLoc.pathname + this.setQueryString(queryObj) + urlLoc.hash;
        },
        'setCookie': function (name, value, expires) {
            hui.util.setCookie(name, value, expires);
        },
        'getCookie': function (name) {
            var value = hui.util.getCookie(name);
            return value;
        },
        'removeCookie': function (name) {
            hui.util.removeCookie(name);
        },
        'validatePhoneNumberFormat': function (phoneNumber) {
            var phoneReg = /^(1((3[0-9])|(5[0-3|5-9])|(8[0-9])|(45|47|7[6-8]|70))\d{8})$/;
            if (phoneReg.test(phoneNumber)) {
                return true;
            }
            else {
                return false;
            }
            return false;
        },
        'validatePhoneCodeFormat': function (code) {
            var codeReg = /^[\d]{4}$/;
            if (codeReg.test(code)) {
                return true;
            }
            else {
                return false;
            }
            return false;
        },
        'validatePasswordFormat': function (password) {
            var passReg = /^[\w]{6,16}$/;
            if (passReg.test(password)) {
                return true;
            }
            else {
                return false;
            }
            return false;
        }
    };
    Utils.getInstance = function () {
        if (!Utils._instance)
            Utils._instance = new Utils();
        return Utils._instance;
    };

    scope = new Utils();
})(window.jUtils || (window.jUtils = {}));

