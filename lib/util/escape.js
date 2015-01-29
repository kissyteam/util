/**
 * @ignore
 * escape of lang
 * @author yiminghe@gmail.com
 */

var util = require('./base');
// IE doesn't include non-breaking-space (0xa0) in their \s character
// class (as required by section 7.2 of the ECMAScript spec), we explicitly
// include it in the regexp to enforce consistent cross-browser behavior.
var SEP = '&';
var EQ = '=';
var TRUE = true;
var HEX_BASE = 16;

var EMPTY = '',
// FALSE = false,
// http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
// http://wonko.com/post/html-escaping
    htmlEntities = {
        '&amp;': '&',
        '&gt;': '>',
        '&lt;': '<',
        '&#x60;': '`',
        '&#x2F;': '/',
        '&quot;': '"',
        /*jshint quotmark:false*/
        '&#x27;': "'"
    },
    reverseEntities = {},
    escapeHtmlReg,
    unEscapeHtmlReg,
    possibleEscapeHtmlReg = /[&<>"'`]/,
// - # $ ^ * ( ) + [ ] { } | \ , . ?
    escapeRegExp = /[\-#$\^*()+\[\]{}|\\,.?\s]/g;
(function () {
    for (var k in htmlEntities) {
        reverseEntities[htmlEntities[k]] = k;
    }
})();

escapeHtmlReg = getEscapeReg();
unEscapeHtmlReg = getUnEscapeReg();

function isValidParamValue(val) {
	var t = typeof val;
	// If the type of val is null, undefined, number, string, boolean, return TRUE.
	return val == null || (t !== 'object' && t !== 'function');
}

function getEscapeReg() {
    var str = EMPTY;
    for (var e in htmlEntities) {
        var entity = htmlEntities[e];
        str += entity + '|';
    }
    str = str.slice(0, -1);
    escapeHtmlReg = new RegExp(str, 'g');
    return escapeHtmlReg;
}

function getUnEscapeReg() {
    var str = EMPTY;
    for (var e in reverseEntities) {
        var entity = reverseEntities[e];
        str += entity + '|';
    }
    str += '&#(\\d{1,5});';
    unEscapeHtmlReg = new RegExp(str, 'g');
    return unEscapeHtmlReg;
}

util.mix(util, {
    /**
     * get escaped string from html.
     * only escape
     *      & > < ` / " '
     * refer:
     *
     * [http://yiminghe.javaeye.com/blog/788929](http://yiminghe.javaeye.com/blog/788929)
     *
     * [http://wonko.com/post/html-escaping](http://wonko.com/post/html-escaping)
     * @param str {string} text2html show
     * @member util
     * @return {String} escaped html
     */
    escapeHtml: function (str) {
        if (!str && str !== 0) {
            return '';
        }
        str = '' + str;
        if (!possibleEscapeHtmlReg.test(str)) {
            return str;
        }
        return (str + '').replace(escapeHtmlReg, function (m) {
            return reverseEntities[m];
        });
    },

    /**
     * get escaped regexp string for construct regexp.
     * @param str
     * @member util
     * @return {String} escaped regexp
     */
    escapeRegExp: function (str) {
        return str.replace(escapeRegExp, '\\$&');
    },

    /**
     * un-escape html to string.
     * only unescape
     *      &amp; &lt; &gt; &#x60; &#x2F; &quot; &#x27; &#\d{1,5}
     * @param str {string} html2text
     * @member util
     * @return {String} un-escaped html
     */
    unEscapeHtml: function (str) {
        return str.replace(unEscapeHtmlReg, function (m, n) {
            return htmlEntities[m] || String.fromCharCode(+n);
        });
    },
	/**
	 * Creates a serialized string of an array or object.
	 *
	 * for example:
	 *     @example
	 *     {foo: 1, bar: 2}    // -> 'foo=1&bar=2'
	 *     {foo: 1, bar: [2, 3]}    // -> 'foo=1&bar=2&bar=3'
	 *     {foo: '', bar: 2}    // -> 'foo=&bar=2'
	 *     {foo: undefined, bar: 2}    // -> 'foo=undefined&bar=2'
	 *     {foo: TRUE, bar: 2}    // -> 'foo=TRUE&bar=2'
	 *
	 * @param {Object} o json data
	 * @param {String} [sep='&'] separator between each pair of data
	 * @param {String} [eq='='] separator between key and value of data
	 * @param {Boolean} [serializeArray=true] whether add '[]' to array key of data
	 * @return {String}
	 * @member KISSY
	 */
	param: function (o, sep, eq, serializeArray) {
		sep = sep || SEP;
		eq = eq || EQ;
		if (serializeArray === undefined) {
			serializeArray = TRUE;
		}
		var buf = [], key, i, v, len, val,
			encode = util.urlEncode;
		for (key in o) {

			val = o[key];
			key = encode(key);

			// val is valid non-array value
			if (isValidParamValue(val)) {
				buf.push(key);
				if (val !== undefined) {
					buf.push(eq, encode(val + EMPTY));
				}
				buf.push(sep);
			} else if (util.isArray(val) && val.length) {
			// val is not empty array
				for (i = 0, len = val.length; i < len; ++i) {
					v = val[i];
					if (isValidParamValue(v)) {
						buf.push(key, (serializeArray ? encode('[]') : EMPTY));
						if (v !== undefined) {
							buf.push(eq, encode(v + EMPTY));
						}
						buf.push(sep);
					}
				}
			}
			// ignore other cases, including empty array, Function, RegExp, Date etc.

		}
		buf.pop();
		return buf.join(EMPTY);
	},

	/**
	 * Parses a URI-like query string and returns an object composed of parameter/value pairs.
	 *
	 * for example:
	 *      @example
	 *      'section=blog&id=45'        // -> {section: 'blog', id: '45'}
	 *      'section=blog&tag=js&tag=doc' // -> {section: 'blog', tag: ['js', 'doc']}
	 *      'tag=ruby%20on%20rails'        // -> {tag: 'ruby on rails'}
	 *      'id=45&raw'        // -> {id: '45', raw: ''}
	 * @param {String} str param string
	 * @param {String} [sep='&'] separator between each pair of data
	 * @param {String} [eq='='] separator between key and value of data
	 * @return {Object} json data
	 * @member KISSY
	 */
	unparam: function (str, sep, eq) {
		if (typeof str !== 'string' || !(str = util.trim(str))) {
			return {};
		}
		sep = sep || SEP;
		eq = eq || EQ;
		var ret = {},
			eqIndex,
			decode = util.urlDecode,
			pairs = str.split(sep),
			key, val,
			i = 0, len = pairs.length;

		for (; i < len; ++i) {
			eqIndex = pairs[i].indexOf(eq);
			if (eqIndex === -1) {
				key = decode(pairs[i]);
				val = undefined;
			} else {
				// remember to decode key!
				key = decode(pairs[i].substring(0, eqIndex));
				val = pairs[i].substring(eqIndex + 1);
				try {
					val = decode(val);
				} catch (e) {
					//logger.error('decodeURIComponent error : ' + val);
					//logger.error(e);
				}
				if (util.endsWith(key, '[]')) {
					key = key.substring(0, key.length - 2);
				}
			}
			if (key in ret) {
				if (util.isArray(ret[key])) {
					ret[key].push(val);
				} else {
					ret[key] = [ret[key], val];
				}
			} else {
				ret[key] = val;
			}
		}
		return ret;
	},
    /**
	 * frequently used in taobao cookie about nick
	 * @member KISSY
	 * @return {String} un-unicode string.
	 */
	fromUnicode: function (str) {
		return str.replace(/\\u([a-f\d]{4})/ig, function (m, u) {
			return String.fromCharCode(parseInt(u, HEX_BASE));
		});
	}
});

util.escapeHTML = util.escapeHtml;
util.unEscapeHTML = util.unEscapeHtml;
