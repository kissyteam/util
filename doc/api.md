### 概览
`util`是一个常用的工具集。

### 属性

#### _debug: "@DEBUG@"

没用的东西

#### version: "1.1.6"

版本号

#### 库与框架必备工具

##### ready(fn)

用于注册DOMReady的监听事件，若DOM已然ready，直接指定回调的方法。所有的JS库和框架必备的神器。

**参数**

* fn:Function DOMReady的回调函数。

**demo**

```
modulex.use("util", function(util) {
	util.ready(function() {
		alert("dom ready now");
	});
});
```

##### noop()

一个空方法。可以用作默认的callback填充方法，这样就不需要到处创建空的默认方法了。jQuery、angular等都配备了这个实际上没用的方法。

**demo**

定义某接口的默认回调。

```javascript
modulex.add(function(require) {
	var util = require("util");
	// ...
	return function(callback) {
		callback = callback || util.noop;
		// ...
		callback();
	};
});
```

#### 类型判断工具

##### type(o)

通用类型判断，输出`o`的类型，为全小写的字符串，适合于`switch`语句的选择因子。类似于`typeof`，但比后者更为精确。

**参数**

* o:* 任意类型数据

**demo**

与`typeof`的对比：

o | util.type(o) | typeof o | 说明
-- | -- | -- | --
undefined | "undefined" | "undefined" | -
null | "null" | "object" | 修正了JS的歧义
"" | "string" | "string" | -
0 | "number" | "number" | -
NaN | "number" | "number" | 未修正JS的歧义，仍可能产生问题；`jQuery.isNumeric(NaN)`为`false`，`angular.isNumber(NaN)`为`true`
Infinity | "number" | "number" | `jQuery.isNumeric(Infinity)`为`false`，`angular.isNumber(Infinity)`为`true`
true/false | "boolean" | "boolean" | -
{} | "object" | "object" | -
[] | "array" | "object" | 更明确
/\w+/ | "regexp" | "object" | 更明确
function() {} | "function" | "function" | -
new Date | "date" | "object" | 更明确
new String | "string" | "object" | 其实`if (new String(""))`跟`if ("")`是完全不一样的，但因为很少用`new String`，所以...还OK
new Number | "number" | "object" | 类上
new Boolean | "boolean" | "object" | 类上
new RegExp | "regexp" | "object" | 更明确
window | "object" | "object" | 最好能明确成"window"，因为有`isWindow`的判断式
document | "object" | "object" | 最好能明确成"document"

以上结论，可通过以下代码验证：

```javascript
modulex.use("util", function(util) {
	var arr = [undefined, null, "", 0, NaN, Infinity, true, false, {}, [], /\w+/, function() {}, new Date, new String, new Number, new Boolean, new RegExp, window, document];
	util.each(arr, function(v) {
		console.info(v, "\t", util.type(v), "\t", typeof v);
	});
});
```

##### isArray(o)

判断类型否为数组。ECMA-5的[`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)的替身。

**参数**

* o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isArray(what));
	}
	output([]);// true
	output(new Array);// true
	output({ length: 1 });// false
	output(arguments);// false
});
```
##### isUndefined(o)

判断是否为`undefined`。

**参数**

* o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isUndefined(what));
	}
	output();// true
	output(undefined);// true
	output(null);// false
});
```

##### isNull(o)

判断是否为`null`。

**参数**

* o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isNull(what));
	}
	output(null);// true
	output();// false
});
```

##### isNumber(o)

判断类型是否为数字（注意`NaN`也为`true`，这跟`typeof NaN`为`"number"`一样）。

**参数**

* o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isNumber(what));
	}
	output(1);// true
	output(new Number);// true
	output(NaN);// true
	output(Infinity);// true
	output("1");// false
});
```

##### is类型Boolean(o)

判断是否为布尔值，只有`true/false`时为`true`。

**参数**

* o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isBoolean(what));
	}
	output(true);// true
	output(false);// true
	output();// false
	output(0);// false
	output(1);// false
});
```

##### isDate(o)

判断类型是否为`Date`类型。

**参数**

o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isDate(what));
	}
	output(new Date);// true
	output(util.now());// false
});
```

##### isFunction(o)

判断类型是否为`Function`。

**参数**

o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isFunction(what));
	}
	output(util.isFunction);// true
	output(function() {});// true
	output(new Function);// true
	output(123);// false
});
```

##### isObject(o)

_BUGGY_ `isObject`对`window`、`document`也判定为`true`。

判断是否为对象（注意`null`时为`false`，这跟`typeof null`为`object`相悖，处理了JS的歧义）。

**参数**

* o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isObject(what));
	}
	output({});// true
	output(new Object);// true
	output([]);// false
	output(null);// false
	output(undefined);// false
	output(window);// true
	output(document);// true
});
```

##### isEmptyObject(o)

_BUGGY_ 这个方法有问题 {}, true, false, 0, 1234, "", undefined... 很多都返回true

判断是否为空对象，即含有可枚举的属性的对象。

**参数**

* o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isEmptyObject(what));
	}
	output({});// true
	output(new Object);// true
	output([]);// true
	output(null);// true
	output(undefined);// true
	output(1);// true
	output(false);// true
	output(Object.create(null, { xx: { value: "you cannot see me", enumerable: false } }));// true
	output({a: 1});// false
	output([1, 2, 3]);// false
});
```

##### isPlainObject(obj)

判断是否为简单对象，即它的`__proto__.constructor`是`Object`而非其他类的对象。

**参数**

* o:* 任意类型数据

**demo**

```javascript
modulex.use("util, json", function(util, JSON) {
	function output(what) {
		console.info(util.isPlainObject(what));
	}
	output({});// true
	output({ a: 1 });// true
	output(new Object);// true
	output(eval("({})"));// true
	output(util.parseJson("{}"));// true
	output(JSON.parse("{}"));// true
	output(Object.create(null, { o: { value: "you can see me", enumerable: true } }));// true
	output(Math);// true
	output(window);// false
	output(document);// false
	output([1, 2, 3]);// false
	output(new Date);// false
	output(new (function() {})());// false
});
```

##### isRegExp(o)

判断是否为正则表达式。

**参数**

* o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isRegExp(what));
	}
	output(/\w+/);// true
	output(new RegExp);// true
	output("i'm no regexp");// false
});
```

##### isString(o)

判断是否为字符串字面量（`"string"`），或字符串对象（`new String("string")`）。

**参数**

* o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isString(what));
	}
	output("i'm a string");// true
	output(new String);// true
	output();// false
});
```

##### isWindow(obj)

判断是否为`window`对象。

**参数**

* o:* 任意类型数据

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.isWindow(what));
	}
	output(window);// true
	output(this);// false - 这里的this是modulex
	~function() {
		console.info(util.isWindow(this));// 严格模式下为false；非严格模式为true
	}();
	output(self);// true
	output(top);// true
	output(document);// false
});
```

#### 字符串工具

##### guid([prefix])

每次调用创建一个唯一的字符串（其实就是递增一个数值）。

该方法没什么实际用处。

**参数**

* prefix:String 可选前缀

```javascript
modulex.use("util", function(util) {
	function output(prefix) {
		console.info(util.guid(prefix));
	}
	output();// 1 - 假设第一次调用
	output("shit");// shit2
	output();// 3
});
```

##### camelCase(str)

_NEW since Version 5_ _DEPRECATED_

将字符串由蛇型（snake-case）转成骆驼型（camelCase）。

注意：没有反方法`snakeCase`。

**参数**

* str:String

```javascript
modulex.use("util", function(util) {
	function output(str) {
		console.info(util.camelCase(str));
	}
	output("useless-at-all and should never-be_used");// uselessAtAll and should neverBe_used
});
```

##### escapeHTML(str)|escapeHtml(str)

_TODO_ make escapeHTML deprecated

将字符``& > < ` / " '``替换成对应的HTML的实体``&amp; &gt; &lt; &#x60; &#x2F; &quot; &#x27;``，以便安全地展示在HTML页面中。

**参数**

* str:String 可能含有HTML敏感的字符。

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.escapeHtml(what));
	}
	output("code `<input type='input' value=\"shit\" />` is stupid & useless");// code &#x60;&lt;input type=&#x27;input&#x27; value=&quot;shit&quot; &#x2F;&gt;&#x60; is stupid &amp; useless
});
```

##### unEscapeHTML(str)|unEscapeHtml(str)

_TODE_ make unEscapeHTML deprecated, and maybe "unescape"?

顾名思义，与`escapeHTML`反向的动作。

**参数**

* str:String HTML片段。

**demo**

```javascript
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.unEscapeHtml(what));
	}
	output("code &#x60;&lt;input type=&#x27;input&#x27; value=&quot;shit&quot; &#x2F;&gt;&#x60; is stupid &amp; useless");// code `<input type='input' value=\"shit\" />` is stupid & useless
});
```

##### escapeRegExp(str)

将字符串中的正则敏感的元字符`{ } [ ] ( ) . \ / + - ? * |`以及空白字符进行转义。适用于`new RegExp(input)`，`input`为用户输入的不可控字符串时，比如在当然文档中搜索用户指定的字符串。

**参数**

* str:String 用户输入的字符串，可能含有正则的元字符和空白字符。

**demo**

```javascript
modulex.use("util", function(util) {
	var userInput = "nothing (else) matters [metallica]{the black album? | metallica*同名专辑}",
		userInputEscaped = util.escapeRegExp(userInput);
	console.info(userInputEscaped);// nothing\ \(else\)\ matters\ \[metallica\]\{the\ black\ album\?\ \|\ metallica\*同名专辑\}
	console.info(new RegExp(userInputEscaped).toString());// /nothing\ \(else\)\ matters\ \[metallica\]\{the\ black\ album\?\ \|\ metallica\*同名专辑\}/
});
```

##### startsWith(str, prefix)

判断字符串`str`是否以`prefix`打头。ECMA-6原生[`String.prototype.startsWith(prefix)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)的替代，但没有可选的`position`参数。

**参数**

* str:String 待测试的字符串
* prefix:String 是否以此打头

**demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.startsWith("firefox", "fire"));// true
	console.info(util.startsWith("chrome", "fire"));// false
});
```
##### endsWith(str, suffix)

判断字符串`str`是否以`suffix`打头。ECMA-6原生[`String.prototype.endsWith(suffix)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)的替代，但没有可选的`position`参数。

**参数**

* str:String 待测试的字符串
* suffix:String 是否以此结尾

**demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.endsWith("firefox", "fox"));// true
	console.info(util.endsWith("chrome", "fox"));// false
});
```

##### trim(str)

去除字符串头尾空格。ECMA-5原生[`String.prototype.trim()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim)的替代。

**参数**

* str:String

**demo**

```javascript
modulex.use("util", function(util) {
	function output(str) {
		console.info("\"" + util.trim(str) + "\"");
	}
	output("  \t\n   全角半角space tab  回车换行   \r\n ");// "全角半角space tab  回车换行"
});
```

##### substitute(str, o[, regexp])

使用对象`o`中对应的属性值替换`str`中的`{key}`子串，这个方法最早出现在[prototype.js](http://prototypejs.org/)中。可选参数`regexp `用于自定义用于替换的子串的模式。

**参数**

* str:String 包含替换点的字符串
* o:Object key-value对象
* regexp:RegExp 可选的正则表达式 默认为`/{\w+}/`

**demo**

```javascript
modulex.use("util", function(util) {
	function output(str, o, regexp) {
		console.info(util.substitute(str, o, regexp));
	}
	var o = {
		what: "matters"
	};
	output("nothing else {what}.", o);// nothing else matters.
	output("nothing else \\{what}.", o);// nothing else {what}.
	output("nothing else $[what].", o, /\$\[\w+\]/);// nothing else .
	output("nothing else $[what].", o, /\$\[(\w+)\]/);// nothing else matters.
});
```

##### urlEncode(str)

实际上就是调用了`encodeURIComponent`。

**参数**

* str:String

**demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.urlEncode("哥特 金属"));// %E5%93%A5%E7%89%B9%20%E9%87%91%E5%B1%9E
});
```

##### urlDecode(str)

调用`decodeURIComponent`，但会先把字符串中的`+`号转成空格。_这种进出不能完全反过来的做法，其实实不可取的。_

**参数**

* str:String

**demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.urlDecode("%E5%93%A5%E7%89%B9%20%E9%87%91%E5%B1%9E"));// 哥特 金属
	console.info(util.urlDecode("%E5%93%A5%E7%89%B9+%E9%87%91%E5%B1%9E"));// 哥特 金属
});
```

##### fromUnicode(str)

把字符串中含有的`\u0123`这样的字符转换成人可读的字符。

注意：没有反方法`toUnicode`。

**参数**

* str:String 含有`\u####`的字符串。

**demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.fromUnicode("\u7acb\u82b1\u91cc\u5b50"));// 立花里子
});
```

##### param(o\[, sep\[, eq\[, serializeArray\]\]\])

序列化对象或数组，生成HTML可用的参数`a=a&b=b`的形式，也可以通过参数定制的方式生成所需的格式。

**参数**

* o:* 待序列化的数据
* sep:String 可选，参数对与参数之对间的分隔符，默认`&`
* eq:String 可选，参数对中名字与值的连接符，默认`=`
* serializeArray:Boolean 可选

**demo**

`util.param()`与`jQuery.param()`对比：

o | util.param(o) | jQuery.param(o) | 说明
-- | -- | -- | --
true | "" | "" | -
123 | "" | "" | -
"hello" | "0=h&1=e&2=l&3=l&4=o" | "0=h&1=e&2=l&3=l&4=o" | -
[1, 2, 3] | 0=1&1=2&2=3" | "undefined=&undefined=&undefined=" | jQuery似乎更不知所措一些
{ "a shit": "some thing" } | "a%20shit=some%20thing" | "a+shit=some+thing" | 处理空格的不同 KISSY用`%20`而jQuery的是`+`
{ a: ["a", "b"], "b b": 3,
		ignored: {
			reason: "object ignored"
		}
	} | "a%5B%5D=a&a%5B%5D=b&b%20b=3"	"a%5B%5D=a&a%5B%5D=b&b+b=3&ignored%5Breason%5D=object+ignored"

"a=1&b=the%20%E9%80%BC"	"a=1&b=the+%E9%80%BC"

注意：一下代码需要在有KISSY和jQuery的环境下测试。

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info("\"" + util.param.apply(util, arguments) + "\"");
	}
	util.each([true, 123, "hello", [1, 2, 3], {
		a: 1,
		b: "the 逼"
	}, {
		"a shit": "some thing"
	}, {
		a: ["a", "b"],
		"b b": 3,
		ignored: {
			reason: "object ignored"
		}
	}], function(v) {
		console.info("\"" + util.param(v) + "\"\t\"" + jQuery.param(v) + "\"");
	});
});
```

#### 数组|对象混合工具

广义上讲，数组或类数组是一种以数字作为属性名的特殊对象。所以很多方法，既可以用于数组，也可以用于对象。

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### each(object, fn, context)

用来遍历对象的属性键值（v-k，对数组或类数组来说，k是index）对，并对每个属性执行一次`fn(v, k)`，`context`用以指定`fn`中的`this`。当应用于数组是，“类似”于ECMA-5的[`Array.prototype.forEach(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)，不同的是，这里可以以`return false`的方式提前结束。

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

#### 对象工具

##### keys(o)

获取对象`o`中的所有属性值，并返回为一个数组。ECMA-5的`Object.keys(o)`的替换，实际上KISSY在实现的时候，如果判断存在`Object.keys(o)`，则直接使用这个方法。

**参数**

o:Object

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.keys(what));
	}
	output({a: 1, b: 2, c: 3});// ["a", "b", "c"]
});
```

##### merge(varArgs)

创建一个新的对象，并将传入的参数逐个合并到该对象，后面的参数中含有的属性将覆盖之前的属性。如果只传一个参数，相当于对其做一次浅拷贝。

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### mix(r, s, ov, wl, deep)

将对象中`s`的属性拷贝到`r`中。此方法有三个“重载”：最简单的`mix(r, s)`，平铺式的额外参数：mix(r, s, /** overwrite 是否覆盖已有属性 默认true */ov, /** Function[]|Function 属性白名单 */wl, /** 是否深拷贝 默认false */deep)，集成参数`##### r, s, { overwrite: true, whitelist: null, deep: false, structured: true })`。

是的，你又看到了，当传集成参数的时候，可以传入额外的参数`structured`，平铺式参数无法传。

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

#### 数组工具

##### makeArray(o)

创建数组，若传入的参数为`undefined`或`null`，返回一个新德空数组；若传入的是数组，直接返回；传入的对象含有`length`属性时，尝试转成数组并返回。

该方法纯属鸡肋，只有在将类数组（如`arguments`）转换成真正的数组的时候有用。而且，无法转换如`options`这样类数组的HTML集合。

**参数**

o:* 任意类型数据

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.makeArray(what));
	}
	output();// []
	output(null);
	output(3);// //[3]
	output({});// [{}]
	output([1, 2, 3]);// [1, 2, 3]
});
```

##### indexOf(item, arr\[, fromIndex\])

查找`item`在`arr`中第一次出现的位置，`fromIndex`用以指定从哪个位置开始找起，默认为0。

注意：`util.indexOf("1", "1234")`也能返回正确的`0`，但这并不说明这么用是正确的，它能正确返回的原因是`String`的下标访问方式。所以`util.indexOf("12", "1234") = -1`。对于字符串，请使用`string.indexOf(substr)`。

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### lastIndexOf(item, arr\[, fromIndex\])

与`indexOf`类似，查找`item`在`arr`中最后一次出现的位置，`fromIndex`默认为`arr.length - 1`。同样注意，不要用在`String`上。

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### inArray(item, arr)

判断`item`是否在`arr`中。跟`jQuery`的`inArray`返回的结果是数字（jQuery的`inArray`其实是`indexOf`）不同，这里返回布尔值`true/false`。

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### every(arr, fn\[, context\])

遍历数组，若每个元素`fn(v, k)`都返回真值（不一定要`true`），则整个表达式返回`true`；否则提前结束遍历，表达式返回`false`。`context`指代`fn`中的`this`。ECMA-5中[`Array.protoype.every(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)的替代品。

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### some(arr, fn\[, context\])

遍历数组，若某个元素`fn(v, k)`返回真值（不一定要`true`），则提前结束遍历，表达式返回`true`；若所有元素都不返回真值，返回`false`。`context`同上。ECMA-5中[`Array.protoype.some(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)的替代品。

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### filter(arr, fn\[, context\])

遍历数组，将`fn(v, k)`返回`true`的`v`组成一个新的数组，新数组的长度小于等于原数组，用于将`arr`中符合条件的值过滤出来。`context`同上。ECMA-5中[`Array.protoype.filter(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)的替代品。

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### map(arr, fn\[, context\])

遍历数组，把`fn(v, k)`的返回值组成一个新的数组，用于将数组“映射”成一个等长的新数组。ECMA-5中[`Array.protoype.map(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)的替代品。

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### reduce(arr, fn\[, initialValue\])

TODO：代码中其他地方都叫fn，这里叫callback

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### 数组，`fn(previousValue/** 上一次调用回调返回的值，或者是提供的初始值 */, currentValue/** 当前被处理的元素 */, index/** 当前元素索引 */, arr/** 数组本身 */)`作为累加器把数组中的每个值（从左到右）开始缩减，最终为一个值。ECMA-5`Array.protoype.reduce(fn, initialValue)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)的替代品。

用于求和：

```javascript
modulex.use("util", function(util) {
	console.info(util.reduce([0, 1, 2, 3, 4], function(previousValue, currentValue, index, array) {// 110
		return previousValue + currentValue;
	}, 100));
});
```

用于扁平化数组：

```javascript
modulex.use("util", function(util) {
	console.info(util.reduce([[1, 2], [3, 4, 5]], function(previousValue, currentValue, index, array) {// [1, 2, 3, 4, 5]
		return previousValue.concat(currentValue);
	}));
});
```

#### 函数工具

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### bind()

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

##### rbind()

**参数**

str:String

**demo**

```
modulex.use("util", function(util) {
	function output(what) {
		console.info(util.XXX(what));
	}
});
```

#### 时间工具

##### now()

返回当前客户端的时间毫秒数（当前时间与1970-01-01 00:00:00 UTC的毫秒差），相当于`new Date().getTime()`。ECMA-5中[`Date.now()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now)的替代品。

**参数**

无

**demo**

```
modulex.use("util", function(util) {
	console.info(util.now());// 1429023937128 - 与计算机当前时间有关
	if (Date.now) {
		console.info(Date.now());// 1429023937130
	}
});
```

##### 通用工具

##### equals(a, b)

_BUGGY_ 所有的正则式，不论是字面量还是new出来的都等价。

判断`a`与`b`是否等价。一般的`==`或`===`，对于简单类型的数据比较还行，但对于引用类型则无能为力，因为它只能简单地判断两者的引用是否相等，即只能判定两则是否是同一个东西。`util.equals(a, b)`提供了真正判断两个对象是否“内容上相等”的能力。

**参数**

* a:* 任意类型数据
* b:* 任意类型数据

**demo**

`==`、`===`及`equals`的对比：

o1, o2 | o1 == o2 | o1 === o2 | util.equals(o1, o2) | 说明
-- | -- | -- | -- | --
undefined, undefined | true | true | true | -
null, null | true | true | true | -
undefined, null | true | false | true | 未处理JS的不足，易出错，`angular.equals`返回`false`
NaN, NaN | false | false | false | 未处理JS的不足，`angular.equals`返回`true`
"", "" | true | true | true | -
"", new String("") | true | false | false | 包裹对象确实与字面量应该不同
new String(""), new String("") | false | false | true | 对象等价
0, 0 | true | true | true | -
0, new Number(0) | true | false | false | 包裹对象确实与字面量应该不同
new Number(0), new Number(0) | false | false | true | 对象等价
false, false | true | true | true | -
false, Boolean {} | true | false | false | 包裹对象确实与字面量应该不同
new Boolean(false), new Boolean(false) | false | false | true | 对象等价
{}, {} | false | false | true | 对象等价
{}, new Object | false | false | true | 对象等价
new Object, new Object | false | false | true | 对象等价
new Object, new Object | false | false | true | 对象等价
{}, new (function() {})() | false | false | true | 对象等价
[], [] | false | false | true | 数组等价
[], new Array | false | false | true | 数组等价
new Array, new Array | false | false | true | 数组等价
/\w+/, /\w+/ | false | false | true | ECMA-5之前同一个正则字面量可能共享一个实例，故前两个判断可能也为true
/\w{1,4}/, /\d+/ | false | false | true | <strong style="color: #C00;">BUG</strong> 所有的正则式都等价了，angular.equals是OK的
/\w+/, new RegExp("\\w\+")] | false | false | true | 对象等价，正则字面量也是对象
new RegExp("\\w\+"), new RegExp("\\w\+") | false | false | true | 对象等价
function(), function() | false | false | false | 方法没有等价性
function(), new Function | false | false | false | 方法没有等价性
new Function, new Function | false | false | false | 方法没有等价性
new Date, new Date | false | false | true | 连续调用的new Date很少有可能不同，因为时间不太可能超过1ms
window, window | true | true | true | -
document, document | true | true | true | -

以上结论，可通过以下代码验证：

```javascript
modulex.use("util", function(util) {
	var arr = [
		[undefined, undefined],
		[null, null],
		[undefined, null],
		[NaN, NaN],
		["", ""],
		["", new String("")],
		[new String(""), new String("")],
		[0, 0],
		[0, new Number(0)],
		[new Number(0), new Number(0)],
		[false, false],
		[false, new Boolean(false)],
		[new Boolean(false), new Boolean(false)],
		[{}, {}],
		[{}, new Object],
		[new Object, new Object],
		[{}, new (function() {})()],
		[new (function() {})(), new (function() {})()],
		[[], []],
		[[], new Array],
		[new Array, new Array],
		[/\w+/, /\w+/],
		[/\w{1,4}/, /\d+/],
		[/\w+/, new RegExp("\\w\+")],
		[new RegExp("\\w\+"), new RegExp("\\w\+")],
		[function() {}, function() {}],
		[function() {}, new Function],
		[new Function, new Function],
		[new Date, new Date],
		[window, window],
		[document, document]
	];
	console.info("v[0] == v[1]\tv[0] === v[1]\tutil.equals(v[0], v[1])\tv");
	util.each(arr, function(v) {
		console.info(v[0] == v[1], "\t\t", v[0] === v[1], "\t\t", util.equals(v[0], v[1]), "\t\t", v);
	});
});
```

##### clone(input[, filter\])

_BUGGY_ `filter`在没有返回值的情况下，对数组和非数组处理不一致，数组因为内部调用了`util.filter`所以会返回空数组。

将`input`克隆一份等价（在不指定`filter`的情况下）但物理上完全隔离的数据，如果`input`是对象或数组，将进行深度拷贝，若`input`为简单值，则直接返回。`filter(v, k)`用以过滤出想留下的属性和值。

**参数**

* input:* 任意类型数据
* filter:Function 过滤器

```
modulex.use("util", function(util) {
	var source = {
		o: {
			a: 1, b: 2
		},
		arr: [1, 2, 3, { o: 1234 }]
	};
	
	function output(filter) {
		var cloned = util.clone(source, filter);
		console.info(cloned, util.equals(cloned, source));
	}
	
	output();// 对象等价
	output(function(v, k) {// cloned中的数组变成了空数组
		console.log(v, k);// 没有返回值，即返回undefined
	});
	output(function(v, k) {// 对象等价
		return true;
	});
	output(function(v, k) {// cloned变成了一个空对象
		return false;
	});
});
```

#### 数据解析工具

##### parseJson(data)

将字符串`data`转成JavaScript值。一定程度上它是`JSON.parse`的替代品，只是没有后者的`reviver`回调。然而`JSON.parse(1)`可以工作，而`util.parseJson(1)`抛错。`data`为`null`的时候返回`null`。

##### parseXml(data)|parseXML(data)

将格式完好的XML字符串转换成XML文档。

##### globalEval(data)

提供一个“安全”的方式来调用evil的`eval`。

#### 其他工具

##### namespace(name, holder)

_DEPRECATED_ 这个方法其实已经很古老了，调用者之间容易产生各种各样的冲突，在模块化模式已经十分成熟的情况下，这个方法已经不再需要。

根据给定的`name`（以`.`分隔的属性路径）在`holder`（默认global对象）上依次查找对象，若路径上任何对象不存在，则创建之。最终返回创建或找到的对象。

```
modulex.use("util", function(util) {
	var c = util.namespace("a.b.c");// window.a.b.c = {}
	util.namespace("d.e", c);// window.a.b.c.d.e = {}
});
```





##### augment(r, varArgs)

##### available(id, fn)

##### buffer(fn, ms, context)

##### extend(r, s, px, sx)

##### later(fn, when, periodic, context, data)

##### stamp(o, readOnly, marker)

##### throttle(fn, ms, context)

##### ucfirst(s)

##### unique(a, override)

##### unparam(str, sep, eq)
