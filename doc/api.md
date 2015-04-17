`util`是一个常用的工具集。

#### _debug: "@DEBUG@"

没用的东西

#### version: "1.1.6"

版本号

### noop()

一个空方法。可以用作默认的callback填充方法，这样就不需要到处创建空的默认方法了。jQuery、angular等都配备了这个实际上没用的方法。

**Demo**

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

### ready(fn)

DOMReady之前注册DOMReady的监听事件，若DOM已然ready，则回调方法将被立即执行。所有的JS库和框架必备的神器。

**Parameters**

* fn:Function DOMReady的回调函数。

**Demo**

```javascript
modulex.use("util", function(util) {
	util.ready(function() {
		alert("dom ready now");
	});
});
```

### available(id, fn)

_DEPRECATED_ 这种机制不可取，完全可以用事件通知的机制来代替。

不断循环检测页面上是否id为指定`id`的元素是否存在，如果存在，则执行回调`fn`，循环取消。

**Parameters**

* id:String HTML元素的id
* fn:Function 回调

**Demo**

```javascript
modulex.use("util", function(util) {
	var id = "fuck";
	util.available(id, function() {
		console.info("element with id \"%s\" found", id);
	});
	util.later(function() {
		var div = document.createElement("div");
		div.id = id;
		div.innerHTML = "here i come";
		document.body.appendChild(div);
	}, 500);
});
```

### type(o)

通用类型判断，输出`o`的类型，为全小写的字符串，适合于`switch`语句的选择因子。类似于`typeof`，但比后者更为精确。

**Parameters**

* o:* 任意类型数据

**Demo**

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

### isArray(o)

判断类型否为数组。ECMA-5的[`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)的替身。

**Parameters**

* o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isArray.apply(util, arguments));
	}
	output([]);// true
	output(new Array);// true
	output({ length: 1 });// false
	output(arguments);// false
});
```
### isUndefined(o)

判断是否为`undefined`。

**Parameters**

* o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isUndefined.apply(util, arguments));
	}
	output();// true
	output(undefined);// true
	output(null);// false
});
```

### isNull(o)

判断是否为`null`。

**Parameters**

* o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isNull.apply(util, arguments));
	}
	output(null);// true
	output();// false
});
```

### isNumber(o)

判断类型是否为数字（注意`NaN`也为`true`，这跟`typeof NaN`为`"number"`一样）。

**Parameters**

* o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isNumber.apply(util, arguments));
	}
	output(1);// true
	output(new Number);// true
	output(NaN);// true
	output(Infinity);// true
	output("1");// false
});
```

### isBoolean(o)

判断是否为布尔值，只有`true/false`时为`true`。

**Parameters**

* o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isBoolean.apply(util, arguments));
	}
	output(true);// true
	output(false);// true
	output();// false
	output(0);// false
	output(1);// false
});
```

### isDate(o)

判断类型是否为`Date`类型。

**Parameters**

o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isDate.apply(util, arguments));
	}
	output(new Date);// true
	output(util.now());// false
});
```

### isFunction(o)

判断类型是否为`Function`。

**Parameters**

o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isFunction.apply(util, arguments));
	}
	output(util.isFunction);// true
	output(function() {});// true
	output(new Function);// true
	output(123);// false
});
```

### isObject(o)

_BUGGY_ `isObject`对`window`、`document`也判定为`true`。

判断是否为对象（注意`null`时为`false`，这跟`typeof null`为`object`相悖，处理了JS的歧义）。

**Parameters**

* o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isObject.apply(util, arguments));
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

### isEmptyObject(o)

_BUGGY_ 这个方法有问题 {}, true, false, 0, 1234, "", undefined... 很多都返回true

判断是否为空对象，即含有可枚举的属性的对象。

**Parameters**

* o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isEmptyObject.apply(util, arguments));
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

### isPlainObject(obj)

判断是否为简单对象，即它的`__proto__.constructor`是`Object`而非其他类的对象。

**Parameters**

* o:* 任意类型数据

**Demo**

```javascript
modulex.use("util, json", function(util, JSON) {
	function output() {
		console.info(util.isPlainObject.apply(util, arguments));
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

### isRegExp(o)

判断是否为正则表达式。

**Parameters**

* o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isRegExp.apply(util, arguments));
	}
	output(/\w+/);// true
	output(new RegExp);// true
	output("i'm no regexp");// false
});
```

### isString(o)

判断是否为字符串字面量（`"string"`），或字符串对象（`new String("string")`）。

**Parameters**

* o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isString.apply(util, arguments));
	}
	output("i'm a string");// true
	output(new String);// true
	output();// false
});
```

### isWindow(o)

判断是否为`window`对象。

**Parameters**

* o:* 任意类型数据

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.isWindow.apply(util, arguments));
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

### guid(\[prefix\])

每次调用创建一个唯一的字符串（其实就是递增一个数值）。

该方法没什么实际用处。

**Parameters**

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

### escapeHTML(str)|escapeHtml(str)

_TODO_ make escapeHTML deprecated

将字符``& > < ` / " '``替换成对应的HTML的实体``&amp; &gt; &lt; &#x60; &#x2F; &quot; &#x27;``，以便安全地展示在HTML页面中。

**Parameters**

* str:String 可能含有HTML敏感的字符。

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.escapeHtml.apply(util, arguments));
	}
	output("code `<input type='input' value=\"shit\" />` is stupid & useless");// code &#x60;&lt;input type=&#x27;input&#x27; value=&quot;shit&quot; &#x2F;&gt;&#x60; is stupid &amp; useless
});
```

### unEscapeHTML(str)|unEscapeHtml(str)

_TODE_ make unEscapeHTML deprecated, and maybe "unescape"?

顾名思义，与`escapeHTML`反向的动作。

**Parameters**

* str:String HTML片段。

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.unEscapeHtml.apply(util, arguments));
	}
	output("code &#x60;&lt;input type=&#x27;input&#x27; value=&quot;shit&quot; &#x2F;&gt;&#x60; is stupid &amp; useless");// code `<input type='input' value=\"shit\" />` is stupid & useless
});
```

### escapeRegExp(str)

将字符串中的正则敏感的元字符`{ } [ ] ( ) . \ / + - ? * |`以及空白字符进行转义。适用于`new RegExp(input)`，`input`为用户输入的不可控字符串时，比如在当然文档中搜索用户指定的字符串。

**Parameters**

* str:String 用户输入的字符串，可能含有正则的元字符和空白字符。

**Demo**

```javascript
modulex.use("util", function(util) {
	var userInput = "nothing (else) matters [metallica]{the black album? | metallica*同名专辑}",
		userInputEscaped = util.escapeRegExp(userInput);
	console.info(userInputEscaped);// nothing\ \(else\)\ matters\ \[metallica\]\{the\ black\ album\?\ \|\ metallica\*同名专辑\}
	console.info(new RegExp(userInputEscaped).toString());// /nothing\ \(else\)\ matters\ \[metallica\]\{the\ black\ album\?\ \|\ metallica\*同名专辑\}/
});
```

### startsWith(str, prefix)

判断字符串`str`是否以`prefix`打头。ECMA-6原生[`String.prototype.startsWith(prefix)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)的替代，但没有可选的`position`参数。

**Parameters**

* str:String 待测试的字符串
* prefix:String 是否以此打头

**Demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.startsWith("firefox", "fire"));// true
	console.info(util.startsWith("chrome", "fire"));// false
});
```
### endsWith(str, suffix)

判断字符串`str`是否以`suffix`打头。ECMA-6原生[`String.prototype.endsWith(suffix)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)的替代，但没有可选的`position`参数。

**Parameters**

* str:String 待测试的字符串
* suffix:String 是否以此结尾

**Demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.endsWith("firefox", "fox"));// true
	console.info(util.endsWith("chrome", "fox"));// false
});
```

### trim(str)

去除字符串头尾空格。ECMA-5原生[`String.prototype.trim()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim)的替代。

**Parameters**

* str:String

**Demo**

```javascript
modulex.use("util", function(util) {
	function output(str) {
		console.info("\"" + util.trim(str) + "\"");
	}
	output("  \t\n   全角半角space tab  回车换行   \r\n ");// "全角半角space tab  回车换行"
});
```

### substitute(str, o[, regexp])

使用对象`o`中对应的属性值替换`str`中的`{key}`子串，这个方法最早出现在[prototype.js](http://prototypejs.org/)中。可选参数`regexp `用于自定义用于替换的子串的模式。

**Parameters**

* str:String 包含替换点的字符串
* o:Object key-value对象
* regexp:RegExp 可选的正则表达式 默认为`/{\w+}/`

**Demo**

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

### urlEncode(str)

实际上就是调用了`encodeURIComponent`。

**Parameters**

* str:String

**Demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.urlEncode("哥特 金属"));// %E5%93%A5%E7%89%B9%20%E9%87%91%E5%B1%9E
});
```

### urlDecode(str)

调用`decodeURIComponent`，但会先把字符串中的`+`号转成空格。_这种进出不能完全反过来的做法，其实实不可取的。_

**Parameters**

* str:String

**Demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.urlDecode("%E5%93%A5%E7%89%B9%20%E9%87%91%E5%B1%9E"));// 哥特 金属
	console.info(util.urlDecode("%E5%93%A5%E7%89%B9+%E9%87%91%E5%B1%9E"));// 哥特 金属
});
```

### fromUnicode(str)

把字符串中含有的`\u0123`这样的字符转换成人可读的字符。

注意：没有反方法`toUnicode`。

**Parameters**

* str:String 含有`\u####`的字符串。

**Demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.fromUnicode("\u7acb\u82b1\u91cc\u5b50"));// 立花里子
});
```

### param(o\[, sep\[, eq\[, serializeArray\]\]\])

序列化对象或数组，生成HTML可用的参数`a=a&b=b`的形式，也可以通过参数定制的方式生成所需的格式。

**Parameters**

* o:* 待序列化的数据
* sep:String 可选，参数对与参数之对间的分隔符，默认`&`
* eq:String 可选，参数对中名字与值的连接符，默认`=`
* serializeArray:Boolean 可选，默认为`true`，将数组序列化成`arr%5B%5D=1&arr%5B%5D=2`的形式，若为`false`，则序列化成`arr=1&arr=2`

**Return**

String 序列化得到的字符串

**Demo**

`util.param()`与`jQuery.param()`对比：

o | util.param(o) | jQuery.param(o) | 说明
-- | -- | -- | --
true | "" | "" | -
123 | "" | "" | -
"hello" | "0=h&1=e&2=l&3=l&4=o" | "0=h&1=e&2=l&3=l&4=o" | -
[1, 2, 3] | 0=1&1=2&2=3" | "undefined=&undefined=&undefined=" | jQuery似乎更不知所措一些
{ "a shit": "some thing" } | "a%20shit=some%20thing" | "a+shit=some+thing" | 处理空格的不同 KISSY用`%20`而jQuery的是`+`
{ a: ["a", "b"], "b b": 3, ignored: { reason: "object ignored" } } | "a%5B%5D=a&a%5B%5D=b&b%20b=3" | "a%5B%5D=a&a%5B%5D=b&b+b=3&ignored%5Breason%5D=object+ignored" | KISSY会忽略二级对象，jQuery不会

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

测试可选参数：

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.param.apply(util, arguments));
	}
	output({ undef: undefined });// undef
	var o = { a: 1, b: 2, c: ["x", "y", "z"]};
	output(o);// a=1&b=2&c%5B%5D=x&c%5B%5D=y&c%5B%5D=z
	output(o, undefined, undefined, false);// a=1&b=2&c=x&c=y&c=z
	output(o, "|", ":");// a:1|b:2|c%5B%5D:x|c%5B%5D:y|c%5B%5D:z
	output(o, "|", ":", false);// a:1|b:2|c:x|c:y|c:z
});
```

### unparam(str, sep, eq)

`util.param`的“反”方法，用于将字符串转成对象，但无法得知原数据中的格式，故所有的基本值都是字符串类型。

**Parameters**

* o:* 待序列化的数据
* sep:String 可选，参数对与参数之对间的分隔符，默认`&`
* eq:String 可选，参数对中名字与值的连接符，默认`=`

**Return**

String 序列化得到的字符串

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.unparam.apply(util, arguments));
	}
	var o = {
		nul: null,
		undef: undefined,
		num: 123,
		bool: false,
		str: "str",
		arr: [1, 2, 3]
	};
	// 以下三个用例下将输出 { arr: ["1", "2", "3"], bool: "false", nul: "null", num: "123", str: "str", undef: undefined }
	// 可以看到，除了undefined都变成了字符串
	output(util.param(o));
	output(util.param(o, undefined, undefined, false));
	output(util.param(o, "|", ":"), "|", ":");
	// “不符合常规”的测试
	output("");// {"": undefined} --> FIXME 最好能返回空对象
	output("fuck");// {fuck: undefined}
	output();// 抛错，算合理吧
});
```

### camelCase(str)

_NEW since Version 5_
_DEPRECATED_ 没什么用

将字符串由蛇型（snake-case）转成骆驼型（camelCase）。

注意：没有反方法`snakeCase`。

**Parameters**

* str:String

```javascript
modulex.use("util", function(util) {
	function output(str) {
		console.info(util.camelCase(str));
	}
	output("useless-at-all and should never-be_used");// uselessAtAll and should neverBe_used
});
```

### ~~ucfirst(str)~~

_DEPRECATED_ 没什么用

乍一看这么名字，好像很吊的样子，但其实..."uc"表示"Upper case"，而"first"指的是第一个字符，所以，该方法做的事情就是把`str`中的第一个字母大写掉。

**Parameters**

* str:String

**Return**

`String` 转换后的字符串

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.ucfirst.apply(util, arguments));
	}
	output("the quick fox fucks around...");// The quick fox fucks around...
	output("对汉字 来说 你 看来 没什么 用啊 亲 useless");// 对汉字 来说 你 看来 没什么 用啊 亲 useless
});
```

### each(object, fn\[, thisArg\])

用来遍历对象的属性键值（v-k，对数组或类数组来说，k是index）对，并对每个属性执行一次`fn(v, k)`，`context`用以指定`fn`中的`this`。当应用于数组是，“类似”于ECMA-5的[`Array.prototype.forEach(fn, thisArg)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)，不同的是，这里可以以`return false`的方式提前结束。

也是JS类库和框架的标配，以下是KISSY、jQuery、angular和ECMA5之间的区别：

- | KISSY | jQuery | angular | ECMA5
-- | -- | -- | --
Function | `util.each(o, fn, thisArg)` | `jQuery.each(o, fn, thisArg)` | `angular.forEach(o, fn, thisArg)` | `[...].forEach(fn, thisArg)`
回调`fn`参数列表 | `v, k` | `k, v` | `v, k` | `v, k`
`fn`中`return false`是否提前结束循环 | 可以 | 可以 | 不 | 不

可以使用以下代码，验证以上结论（需要在“好”的浏览器中，而且页面上需要有KISSY、jQuery和angular的基础代码）：

```javascript
modulex.use("util", function(util) {
	var arr = [3, 6, "9", 12],
		fnVK = function(v, k) {
			console.info("v,k = " + v + "," + k);
			return v % 2 === 0;
		},
		fnKV = function(k, v) {
			console.info("k,v = " + k + "," + v);
			return v % 2 === 0;
		};
	console.log("KISSY");
	util.each(arr, fnVK);
	console.log("jQuery");
	jQuery.each(arr, fnKV);
	console.log("angular");
	angular.forEach(arr, fnVK);
	console.log("ECMA5");
	arr.forEach(fnVK);
});
```

输出如下：

```
KISSY
v,k = 3,0
jQuery
k,v = 0,3
angular
v,k = 3,0
v,k = 6,1
v,k = 9,2
v,k = 12,3
ECMA5
v,k = 3,0
v,k = 6,1
v,k = 9,2
v,k = 12,3
```

**Parameters**

* object:Object 被遍历的对象或数组
* fn:Function 每次遍历到一个元素，执行回调，并将该元素及其索引传入`fn`
* context:Object 可选，作为`fn`中的`this`

**Demo**

```javascript
modulex.use("util", function(util) {
	util.each(["a", "b", "c"], function(v, k) {
		console.info("v=" + v + ", k=" + k);
	});
	util.each({
		x: "X",
		y: "Y",
		z: "Z"
	}, function(v, k) {
		console.info("v=" + v + ", k=" + k);
	});
});
```

输出结果：

```
v=a, k=0
v=b, k=1
v=c, k=2
v=X, k=x
v=Y, k=y
v=Z, k=z
```

### keys(o)

获取对象`o`中的所有属性值，并返回为一个数组。ECMA-5的`Object.keys(o)`的替换，实际上KISSY在实现的时候，如果判断存在`Object.keys(o)`，则直接使用这个方法。

**Parameters**

* o:Object

**Demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.keys({a: 1, b: 2, c: 3}));
});
```

### merge(\[arg1\[, arg2\[, arg3 ...\]\]\])

创建一个新的对象，并将传入的参数逐个合并到该对象，后面的参数中含有的属性将覆盖之前的属性。如果只传一个参数，相当于对其做一次浅拷贝。

**Parameters**

不定长参数

**Return**

Object 混合了所有参数中的属性的一个对象

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.merge.apply(util, arguments));
	}
	output();// {}
	output({a: 1}, {a: 2, b: 2}, {a: 3, c: 3});// {a: 3, b: 2, c: 3}
});
```

### mix(dest, src\[, overwrite\[, whitelist\[, deep\]\]\])

将对象中`src`的属性拷贝到`dest`中。此方法有三个“重载”：最简单的`mix(dest, src)`，平铺式的额外参数：`mix(dest, src, overwrite, whitelist, deep)`，结构化额外参数`mix(dest, src, { overwrite: true, whitelist: null, deep: false, structured: true })`。

是的，你又看到了，当传集成参数的时候，可以传入额外的参数`structured`，平铺式参数无法传。

**Parameters**

* dest:Object 被mix的对象
* src:Object 要被mix进dest的对象
* overwrite:Boolean 对dest中已有的属性，是否覆盖，默认覆盖
* whitelist:String[]|Function 字符串数组的白名单，或`return true/false`的walker。 
* deep:Boolean 对对象是否进行深拷贝，默认只是简单覆盖

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.merge.apply(util, arguments));
	}
	var s = {
		s: 2,
		deep: {
			deep2: 2
		}
	};
	// 最简单的mix
	output({// {r: 1, s: 2, deep: { deep2: 2 }
		r: 1,
		s: 0,
		deep: {
			deep1: 1
		}
	}, s);
	// 平铺参数
	output({// {r: 1, s: 0, deep: { deep1: 1, deep2: 2 }
		r: 1,
		s: 0,
		deep: {
			deep1: 1
		}
	}, s, false, null, true);
	// 结构化参数
	output({// {r: 1, s: 0, deep: { deep1: 1, deep2: 2 }
		r: 1,
		s: 0,
		deep: {
			deep1: 1
		}
	}, s, {
		overwrite: true,
//		whitelist: null,
		deep: true
	});
});
```

### stamp(o, readOnly, marker)

_DEPRECATED_ 这个方法作为KISSY的内部方法可以，但暴露出来...

获取或给对象打一个标记，在`readOnly`为`true`的情况下进行只读。

**Parameters**

* o:Object
* readOnly:Boolean 可选，默认`false`
* marker:String 可选，默认`"__~ks_stamped"`

**Return**

`String` 得到或打上的标记。

**demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(arguments[0], util.stamp.apply(util, arguments));
	}
	var o1 = {}, o2 = {};
	output(o1);
	output(o1, true);
	output(o2, true);
});
```
输出如下：

```
{ __~ks_stamped="__~ks_stamped0"} __~ks_stamped0
{ __~ks_stamped="__~ks_stamped0"} __~ks_stamped0
{} undefined
```

### namespace(name, holder)

_DEPRECATED_ 这个方法其实已经很古老了，调用者之间容易产生各种各样的冲突，在模块化模式已经十分成熟的情况下，这个方法已经不再需要。

根据给定的`name`（以`.`分隔的属性路径）在`holder`（默认global对象）上依次查找对象，若路径上任何对象不存在，则创建之。最终返回创建或找到的对象。

**Parameters**

* name:String 以`.`分隔的对象路径
* holder:Object 可选，默认为global对象，浏览器环境为`window`

**Return**

最终得到或创建的对象。

**demo**

```javascript
modulex.use("util", function(util) {
	var c = util.namespace("a.b.c");// window.a.b.c = {}
	util.namespace("d.e", c);// window.a.b.c.d.e = {}
});
```

### makeArray(o)

_DEPRECATED_

创建数组，若传入的参数为`undefined`或`null`，返回一个新的空数组；若传入的是数组，直接返回；传入的对象含有`length`属性时，尝试转成数组并返回。

该方法纯属鸡肋，只有在将类数组（如`arguments`）转换成真正的数组的时候有用。而且，无法转换如`options`这样类数组的HTML集合。

**Parameters**

* o:* 任意类型数据

**Return**

Array

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.makeArray.apply(util, arguments));
	}
	output();// []
	output(null);// []
	output(3);// //[3]
	output({});// [{}]
	output([1, 2, 3]);// [1, 2, 3]
	output(function() {a, b, c, d});// [function(a, b, c, d) {}]，function的length是其定义的参数列表长度
	output({1: "a", 4: "e", length: 5});// [undefined, "a", undefined, undefined, "e"]，自定义的Number型length属性
	output({length: "2"});// [{length: "2"}]，有自定义的length属性，但不是Number型
});
```

### indexOf(item, arr\[, fromIndex\])

查找`item`在`arr`中第一次出现的位置，`fromIndex`用以指定从哪个位置开始找起，默认为0。

注意：`util.indexOf("1", "1234")`也能返回正确的`0`，但这并不说明这么用是正确的，它能正确返回的原因是`String`的下标访问方式。所以`util.indexOf("12", "1234") = -1`。对于字符串，请使用`string.indexOf(substr)`。

**Parameters**

* item:* 带查找的元素
* arr:Array
* fromIndex:Number 可选，从第几个位置开始往后查找

**Return**

Boolean

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.indexOf.apply(util, arguments));
	}
	var a = { a: 1},
		arr = [1, 2, "a", a, 1, 2];
	output("2", arr);// -1，简单数据必须类型一致
	output(2, arr);// 1
	output({ a: 1 }, arr);// -1，对象只比较引用
	output(a, arr);// 3
	output(1, arr, 2);// 4
});
```

### lastIndexOf(item, arr\[, fromIndex\])

与`indexOf`类似，查找`item`在`arr`中最后一次出现的位置，`fromIndex`默认为`arr.length - 1`。同样注意，不要用在`String`上。

**Parameters**

* item:* 带查找的元素
* arr:Array
* fromIndex:Number 可选，从第几个位置开始往前查找

**Return**

Boolean

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.lastIndexOf.apply(util, arguments));
	}
	var a = { a: 1},
		arr = [1, 2, "a", a, 1, 2];
	output("2", arr);// -1，简单数据必须类型一致
	output(2, arr);// 5
	output({ a: 1 }, arr);// -1，对象只比较引用
	output(a, arr);// 3
	output(1, arr, 3);// 0
});
```

### inArray(item, arr)

判断`item`是否在`arr`中。跟`jQuery`的`inArray`返回的结果是数字（jQuery的`inArray`其实是`indexOf`）不同，这里返回布尔值`true/false`。

**Parameters**

* item:* 带查找的元素
* arr:Array

**Return**

Boolean

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.inArray.apply(util, arguments));
	}
	var a = { a: 1},
		arr = [1, 2, "a", a, 1, 2];
	output("2", arr);// false，简单数据必须类型一致
	output(2, arr);// true
	output({ a: 1 }, arr);// false，对象只比较引用
	output(a, arr);// true
});
```

### every(arr, fn\[, context\])

遍历数组，直到对某个元素，`fn(v, k)`返回假值（`false/null/undefined/NaN/""/0`），则结束遍历，结果为`false`，否则结果为`true`。ECMA-5中[`Array.prototype.every(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)的替代品。

**Parameters**

* arr:Array
* fn(v, k):Function 每次遍历到一个元素，执行回调，并将该元素及其索引传入`fn`，若返回假值则结束遍历，表达式为`false`
* context:Object 可选，作为`fn`中的`this`

**Return**

Boolean

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.every.apply(util, arguments));
	}
	output([1, 2, 3, 4], function(v) {// true，是否所有的都小于5
		return v < 5;
	});
	output([1, 2, 3, 4, 8], function(v, k) {// false，是否奇偶奇偶...的排列
		return (k % 2) ^ (v % 2);
	});
	output([], function() {// true，对于空数组永远是true，注意说明中的“直到”二字；如果意图是非空数组上进行判断，请多加一个`.length`判断
		return false;
	});
});
```

### some(arr, fn\[, context\])

遍历数组，若某个元素`fn(v, k)`返回真值（不一定要`true`），则结束遍历，表达式返回`true`；若所有元素都不返回真值，返回`false`。ECMA-5中[`Array.prototype.some(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)的替代品。

**Parameters**

* arr:Array
* fn(v, k):Function 每次遍历到一个元素，执行回调，并将该元素及其索引传入`fn`，若返回真值则结束遍历，表达式为`true`
* context:Object 可选，作为`fn`中的`this`

**Return**

Boolean

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.some.apply(util, arguments));
	}
	output([1, 2, 3, 4], function(v) {// false，是否有大于4的数
		return v > 4;
	});
	output([], function() {// false，对于空数组永远是false，这个好理解
		return true;
	});
});
```

### filter(arr, fn\[, context\])

遍历数组，将`fn(v, k)`返回`true`的`v`组成一个新的数组，新数组包含的元素为源数组的一个子集，用于将`arr`中符合条件的值过滤出来。ECMA-5中[`Array.prototype.filter(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)的替代品。

**Parameters**

* arr:Array
* fn(v, k):Function 每次遍历到一个元素，执行回调，并将该元素及其索引传入`fn`，若返回真值，该元素将被收纳进新的数组
* context:Object 可选，作为`fn`中的`this`

**Return**

过滤出来的新数组，长度小于等于原数组长度，数组成员一定在源数组中存在（如果是引用类型，则为同一个引用）。

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.filter.apply(util, arguments));
	}
	output([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], function(v) {// [3, 6, 9, 12]，过滤出3的倍数
		return v % 3 === 0;
	});
	output([1, "2", { a: "xx" }, [1, "2"], "end"], function(v) {// ["2", "end"]，过滤出字符串
		return util.isString(v);
	});
});
```

### map(arr, fn\[, context\])

遍历数组，把`fn(v, k)`的返回值组成一个等长的新数组。ECMA-5中[`Array.prototype.map(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)的替代品。

**Parameters**

* arr:Array
* fn(v, k):Function 每次遍历到一个元素，执行回调，并将该元素及其索引传入`fn`，返回值在新的数组中的位置与当前位置相同
* context:Object 可选，作为`fn`中的`this`

**Return**

映射后的新数组，具有源数组相同的长度，成员一般不与原数组中的相同，

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.map.apply(util, arguments));
	}
	output([1, 2, 3, 4], function(v) {// [1, 8, 27, 64]，立方化
		return Math.pow(v, 3);
	});
});
```

### unique(arr\[, override\])

遍历数组，剔除里面相同的元素，返回一个只有不重叠元素的新数组，新数组包含的元素为源数组的一个子集，这有些类似于`filter`。

**Parameters**

* `arr:Array`
* `override:Boolean` 默认为`false`，若找到一个非唯一元素，是否把之前已经放入新数组的元素剔除，并把当前的数组接在新数组的当前末尾；举例来说，`[1, 2, 1]`默认会输出`[1, 2]`，`override`为`true`则输出`[2, 1]`

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.unique.apply(util, arguments));
	}
	output([1, 2, 3, 2, 1]);// [1, 2, 3]
	output([1, 2, 3, 2, 1], true);// [3, 2, 1]
	output([{a: 1}, {a: 1}]);// [{a: 1}, {a: 1}]，对于引用对象，只简单比较引用，不比较女人
});
```

### reduce(arr, fn\[, initialValue\])

TODO：代码中其他地方都叫fn，这里叫callback

遍历数组，`fn`作为累加器把数组中的每个值（从左到右）开始缩减，最终得到一个值。ECMA-5[`Array.prototype.reduce(fn, initialValue)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)的替代品。

**Parameters**

* `arr:Array`
* `fn(previousValue/** 上一次调用回调返回的值，或者是提供的初始值 */, currentValue/** 当前被处理的元素 */, index/** 当前元素索引 */, arr/** 数组本身 */):Function` 每次遍历到一个元素，执行回调，并将之前回调得到的结果及该元素等传入`fn`，返回值将传入下一次回调。
* `initialValue:*` 可选，初始值

**Return**

任意值，由回调函数`fn`的返回值决定。

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.reduce.apply(util, arguments));
	}
	output([0, 1, 2, 3, 4], function(previousValue, currentValue, index, array) {// 110，求和
		return previousValue + currentValue;
	}, 100);
	output([[1, 2], [3, 4, 5]], function(previousValue, currentValue, index, array) {// [1, 2, 3, 4, 5]，扁平化数组
		return previousValue.concat(currentValue);
	});
});
```

### bind(fn, thisArg\[, arg1\[, arg2\[, ...\]\]\])

返回一个新的方法，使得它的上下文`this`为传入的`thisArg`，并可以配置默认的参数列表，如果新方法调用时又传入了新的参数，新参数将被拼接在配置的参数列表之后。ECMA-5[`Array.prototype.bind(thisArg[, arg1[, arg2[, ...]]])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)的替代品。

**Parameters**

* fn:Function 源方法
* thisArg:Object 新方法调用时的`this`指向
* argN:* 动态参数

**Demo**

```javascript
modulex.use("util", function(util) {
	function fn() {
		console.info(this, arguments);
	}
	var fn2 = util.bind(fn, {a: 1}, 1, 2, 3)
	fn();// window, []
	fn2(4);// {a: 1}, [1, 2, 3, 4]
});
```

### rbind(fn, thisArg\[, arg1\[, arg2\[, ...\]\]\])

跟`util.bind()`基本一样，唯一的区别是参数列表的处理，配置的配置将被拼接在传入参数的后面。没有对应的EMCA方法，是KISSY自己YY出来的一个方法，但可能会很有用。

**Parameters**

str:String

**Demo**

```javascript
modulex.use("util", function(util) {
	function fn() {
		console.info(this, arguments);
	}
	var fn2 = util.rbind(fn, {a: 1}, 1, 2, 3)
	fn();// window, []
	fn2(4);// {a: 1}, [4, 1, 2, 3]
});
```

### later(fn, when\[, periodic\[, thisArg\[, data\]\]\])

延时或周期执行`fn`，返回一个对象，通过返回的对象可以取消代码的运行。

**Parameters**

* fn:Function 被延时或周期运行的方法
* when:Number 延时多少毫秒执行`fn`
* periodic:Boolean 可选，是否以`when`为周期性运行
* thisArg:Object 可选，`fn`运行时的`this`指向
* data:* 可选，运行时传递给`fn`的参数，如果是数组，将会被`apply`到`fn`，即数组里面的数据将逐个传递给`fn`，如果本意是传递一个数组对象，请将该数组再用数组包一层。即`util.later(fn, 1000, false, null, [1, 2, 3])`，则`fn(1, 2, 3)`；若本意是`fn([1, 2, 3])`，需要这样`util.later(fn, 1000, false, null, [[1, 2, 3]])`

_其实data的这种处理方式容易让调用者产生疑惑，可以优化成`bind`的方式_

**Return**

Object {id:Number, interval:Boolean, cancel:function} 相当于延时的handle，`id`和`interval`用作参考，一般有用的是`cancel`方法。

**Demo**

```javascript
modulex.use("util", function(util) {
	var start = util.now();
	function fn() {
		console.info(util.now() - start, arguments, this);
	}
	util.later(fn);// 立即执行
	util.later(fn, 200);// 200ms后
	util.later(fn , 400, false, { _: "400ms" }, "400ms");// 延时400ms，fn("400ms")
	util.later(fn , 600, false, { _: "600ms" }, ["600ms", 2, 3]);// 延时600ms，fn("600ms", 2, 3)
	util.later(fn , 800, false, { _: "800ms" }, [["800ms", 2, 3]]);// 延时800ms，fn(["800ms", 2, 3])
	var handle = util.later(fn, 1000, false, { _: "1000ms" });// 延时1000ms
	handle.cancel();// 取消1000ms的运行
	handle = util.later(fn , 1200, true, { _: "1200ms" });// 周期1200ms运行
	util.later(function() {// 3次运行后，取消1200ms周期
		handle.cancel();
		console.info("1200ms周期被取消");
	}, 1200 * 3 + 100);
});
```

运行结果：

```
11 [] window
201 [] window
401 ["400ms"] Object { _="400ms"}
601 ["600ms", 2, 3] Object { _="600ms"}
802 [["800ms", 2, 3]] Object { _="800ms"}
1202 [] Object { _="1200ms"}
2401 [] Object { _="1200ms"}
3604 [] Object { _="1200ms"}
1200ms周期被取消
```

### buffer(fn\[, ms\[, thisArg\]\])

将源方法`fn`进行封装，返回一个新的方法，调用这个新方法，将延时执行源方法；所有传递给新方法的参数将按原样传递给`fn`；若在延时期间重新调用则，原延时将被取消。

**Parameters**

* fn:Function 需要被封装的方法
* ms:Number 可选，延时多少毫秒执行`fn`，不传或传`0`、`null`等假值是，默认成150ms
* thisArg:Object 可选，`fn`运行时的`this`指向

**Return**

Function 封装后的方法

**Demo**

```javascript
modulex.use("util", function(util) {
	var start = util.now();
	function fn() {
		console.info(util.now() - start, this, arguments);
	}
	var fn0 = util.buffer(fn, 0, { _: 0 }),// 0会被默认成150ms
		fn2 = util.buffer(fn, 200, { _: 200 }),// 由于fn2没有被调用，无输出，只有fn2被调用，内部的fn才会被调用
		fn3 = util.buffer(fn, 500, { _: 500 }),
		fn4 = util.buffer(fn, -1, { _: -1 });
	fn3(3, 2, 1);
	util.later(function() {// 延时期间重新执行fn3，将导致之前的延时失效
		fn3(1, 2, 3);// 约950ms后输出：952 Object { _=500} [1, 2, 3]
	}, 450);
	fn0();// ms虽然为0，但还是会延时到当前代码段结束，所以此处的fn0将被后面的fn0取消
	fn0();
	fn4();// ms为-1的将不会被延时，所以连续两次的fn4都将执行
	fn4();
	console.info("--end--");
});
```

输出结果：

```
5 Object { _=-1} []
9 Object { _=-1} []
--end--
155 Object { _=0} []
959 Object { _=500} [1, 2, 3]
```

### throttle(fn\[, ms\[, thisArg\]\])

返回一个新的方法`fn0`，对方法`fn`的调用进行“限流”，在限流后的`ms`毫秒内，无论多少次调用`fn0`，多不会最终调到`fn`，只有过了给定的时间，调用`fn0`才会调到`fn`。每次调用成功后的`ms`时间内，`fn`又将进入“限流”期。

**Parameters**

* fn:Function 需要“限流”的方法
* ms:Number 时间长度
* thisArg:Object 可选，`fn`运行时的`this`指向

**Return**

Function 封装`fn`的限流器

**Demo**

```javascript
modulex.use("util", function(util) {
	var start = util.now();
	function fn() {
		console.info(util.now() - start, this, arguments);
	}
	var fn0 = util.throttle(fn);
	fn0();
	util.later(fn0, 140, false, null, "140 - NOT called");// 140ms，限流后给定的时间（150ms）内调用，不调用fn
	util.later(fn0, 160, false, null, "160 - called");// 限流结束，调用，重新开始限流
	util.later(fn0, 300, false, null, "300 - NOT called");// 离上次调用（160ms）仅过了140ms，不调用fn
	util.later(fn0, 320, false, null, "320 - called");// 离上次限流开始超过150ms，调用fn
});
```

### extend(classA, classB\[, protoX\[, staticX\]\])

提供原型链类继承的机制，`classA`继承`classB`。`classA.prototype`定义了的属性将不受`classB.prototype`的影响。`classB`的构造器不会在`new classA`的时候被调用。

**Parameters**

* classA:Function 需要继承的接受者类，`extend`方法的唯一受影响者
* classB:Function 被继承的源类，该方法对此类无任何影响，
* protoX:Object 可选，对`classA.prototype`的额外扩展
* staticX:Object 可选，静态扩展，对`classA`的额外扩展，作为类的静态属性

**Return**

Function `classA`本身

**Demo**

```javascript
modulex.use("util", function(util) {
	function A() {
		console.info("A ctor");
	}
	A.prototype.proto0 = "A";// proto0不会被B的proto0覆盖
	A.prototype.proto1 = "A";// proto1被protoX中的proto1覆盖
	function B() {
		console.info("B ctor");// 不会在new A()时调用
	}
	B.prototype.proto0 = "B";// proto0在A中已经存在，不覆盖
	B.prototype.proto2 = "B";// proto2在A中未定义，将被继承到A
	B.prototype.proto3 = "B";// proto3在A中未定义，将被继承到A，但会被protoX中的proto2覆盖
	B.static0 = "B";// 为B添加静态属性，不会被继承到A
	function output(a) {
		console.info(a instanceof A, a instanceof B);
		util.each("proto0|proto1|proto2|proto3|proto4".split("|"), function(v) {// proto test
			console.info(v + ": ", a[v]);
		});
		util.each("superclass|static0|static1".split("|"), function(v) {// proto test
			console.info(v + ": ", A[v]);
		});
	}
	console.log("- before extend -");
	output(new A());
	util.extend(A, B, {// 添加或覆盖到A.prototype
		proto1: "X",// protoX的proto1覆盖了A的proto1
		proto3: "X",// 覆盖B的proto3
		proto4: "X"// 新加
	}, {// 添加或覆盖到A本身
		static1: "X"
	});
	console.log("- after extend -");
	output(new A());
});
```

输出如下：

```
- before extend -
A ctor
true false
proto0: A
proto1: A
proto2: undefined
proto3: undefined
proto4: undefined
superclass: undefined
static0: undefined
static1: undefined
- after extend -
A ctor
true true
proto0: A
proto1: X
proto2: B
proto3: X
proto4: X
superclass: B { proto0="B",  proto2="B",  proto3="B"}
static0: undefined
static1: X
```
### augment(cls, arg1\[, arg2\, arg3, ...\[, overwrite,\[, whitelist\]\]\]\]\])

对类的prototype进行扩展，最末两位参数可以是`overwrite`和`whitelist`，但必须当它们的类型分别为`Boolean`和`Array`时。

**Parameters**

* cls:Function 待扩展的类
* arg1:Object 该对象中的属性扩展进`cls.prototype`
* arg2, arg3, ..., argN 不定长参数，依次对`cls.prototype`，所以越后面的优先级越高，将覆盖之前的属性
* overwrite:Boolean 可选，默认为true
* whitelist:Array 可选，允许被扩展进`cls`的属性

**Return**

`Function` `cls`本身

**Demo**

```javascript
modulex.use("util", function(util) {
	var arg1 = { proto0: 1 },
		arg2 = { proto1: 2 },
		arg3 = { proto1: 3 };
	function output(Clz) {
		util.augment.apply(util, arguments);
		var o = new Clz();
		console.info("proto0: " + o.proto0);
		console.info("proto1: " + o.proto1);
	}
	console.log("简单用法");
	output(function() {}, arg1, arg2, arg3);
	console.log("不覆盖");
	output(function() {}, arg1, arg2, arg3, false);
	console.log("白名单 [\"proto1\"]");
	output(function() {}, arg1, arg2, arg3, ["proto1"]);
	console.log("不覆盖 + 白名单 [\"proto1\"]");
	output(function() {}, arg1, arg2, arg3, false, ["proto1"]);
});
```

输出：

```
简单用法
proto0: 1
proto1: 3
不覆盖
proto0: 1
proto1: 2
白名单 ["proto1"]
proto0: undefined
proto1: 3
不覆盖 + 白名单 ["proto1"]
proto0: undefined
proto1: 2
```

### now()

返回当前客户端的时间毫秒数（当前时间与1970-01-01 00:00:00 UTC的毫秒差），相当于`new Date().getTime()`或`+new Date()`。ECMA-5中[`Date.now()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now)的替代品。

**Parameters**

无

**Return**

Number 当前时间的毫秒数

**Demo**

```javascript
modulex.use("util", function(util) {
	console.info(util.now());// 1429023937128 - 与计算机当前时间有关
	if (Date.now) {
		console.info(Date.now());// 1429023937130
	}
});
```

### equals(a, b)

_BUGGY_ 所有的正则式，不论是字面量还是`new`出来的都等价。

判断`a`与`b`是否等价。一般的`==`或`===`，对于简单类型的数据比较还行，但对于引用类型则无能为力，因为它只能简单地判断两者的引用是否相等，即只能判定两则是否是同一个东西。`util.equals(a, b)`提供了真正判断两个对象是否“内容上相等”的能力。

**Parameters**

* a:* 任意类型数据
* b:* 任意类型数据

**Return**

Boolean 两者是否等价

**Demo**

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

### clone(input[, filter\])

_BUGGY_ `filter`在没有返回值的情况下，对数组和非数组处理不一致，数组因为内部调用了`util.filter`所以会返回空数组。

将`input`克隆一份等价（在不指定`filter`的情况下）但物理上完全隔离的数据，如果`input`是对象或数组，将进行深度拷贝，若`input`为简单值，则直接返回。`filter(v, k)`用以过滤出想留下的属性和值。

**Parameters**

* input:* 任意类型数据
* filter:Function 过滤器

**Return**

`input`对象的双胞胎镜像

**Demo**

```javascript
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

### parseJson(data)

将字符串`data`转成JavaScript值。一定程度上它是`JSON.parse`的替代品，只是没有后者的`reviver`回调。然而`JSON.parse(1)`可以工作，而`util.parseJson(1)`抛错。`data`为`null`的时候返回`null`。

**Parameters**

* data:String

**Return**

任意值 解析后的JavaScript值

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.parseJson.apply(util, arguments));
	}
	output("null");// true
	output("{}");// {}
	output(null);// null
//	output(1);// JSON.parse(1)可以
});
```

### parseXml(data)|parseXML(data)

_TODO_ deprecate parseXML

将格式完好的XML字符串转换成XML文档，若传入的是文档类型（`Document`），直接返回。

**Parameters**

* data:String

**Return**

Document XML文档对象

**Demo**

```javascript
modulex.use("util", function(util) {
	function output() {
		console.info(util.parseXml.apply(util, arguments));
	}
	output("<doc></doc>");// XML Document
	output(util.parseXml("<doc></doc>"));// XML Document
	output(document);// document
});
```

### globalEval(data)

提供一个“安全”的方式来调用“evil”的`eval`，`eval`的环境为当前的`global`对象，对于浏览器来说，就是`window`。跟`eval`不同的是，`globalEval`没有返回值。

**Parameters**

* data:String 字符串形式的JS代码片段。

**Demo**

```javascript
modulex.use("util", function(util) {
	util.globalEval("var xxx = { a: 1 }");
	console.info(window.xxx);// {a : 1}
});
```











