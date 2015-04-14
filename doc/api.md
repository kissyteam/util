### 概览
`util`是一个常用的工具集。

### 属性

#### _debug: "@DEBUG@"

没用的东西

#### version: "1.1.6"

版本号

#### 库与框架必备工具

**ready(fn)**

用于注册DOMReady时的监听事件，若DOM已然ready，直接指定回调的方法。这个方式是所有的JS库和框架必备的神器，所以不需要多做介绍。

**noop()**

一个空方法。可以用作默认的callback填充方法，这样就不需要到处创建空的默认方法了。jQuery、angular等都配备了这个实际上没用的方法。

#### 类型判断 isXxx系列

**type(o)**

通用类型判断，输出`o`的类型，类型为全小写的字符串，适合于`switch`语句的选择因子。类似于`typeof`，但比后者更为精确，以下是两者的对比：

o | util.type(o) | typeof o | 说明
-- | -- | -- | --
undefined | "undefined" | "undefined" | -
null | "null" | "object" | 修正了JS的歧义
"" | "string" | "string" | -
0 | "number" | "number" | -
NaN | "number" | "number" | 未修正JS的歧义，仍可能产生问题
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
	var arr = [undefined, null, "", 0, NaN, true, false, {}, [], /\w+/, function() {}, new Date, new String, new Number, new Boolean, new RegExp, window, document];
	util.each(arr, function(v) {
		console.info(v, "\t", util.type(v), "\t", typeof v);
	});
});
```

**isArray:isArray()**

判断类型否为数组。优先使用ECMA5的`Array.isArray()`。

**is类型Boolean(o)**

判断是否为布尔值，只有`true/false`时为`true`。

**isDate(o)**

判断类型是否为`Date`类型。

**isFunction(o)**

判断类型是否为`Function`。

**isNull(o)**

判断是否为`null`。

**isNumber(o)**

判断类型是否为数字（注意`NaN`也为`true`，这跟`typeof NaN`为`"number"`一样）。

**isObject(o)**

判断是否为对象（注意`null`时为`false`，这跟`typeof null`为`object`相悖）。

**isEmptyObject(o)**

判断是否为空对象，即含有可枚举的属性的对象。

_这个方法有问题 {}, true, false, 0, 1234, "", undefined... 很多都返回true_

**isPlainObject(obj)**

判断是否为自定义对象，`isObject`对`window`、`document`、`Math`以及`new`出来的自定义类的对象等也判定为`true`，这个方法用于判定使用字面量`{a: 1}`，`new Object()`、`Object.create`、`JSON.parse`、`eval`所创建的对象。

**isRegExp(o)**

判断是否为正则表达式。

**isString(o)**

判断是否为字符串字面量（`"string"`），或字符串对象（`new String("string")`）。

**isUndefined(o)**

判断是否为`undefined`。

**isWindow(obj)**

判断是否为`window`对象。

#### 字符串工具

**guid([prefix])**

每次调用创建一个唯一的字符串（其实就是递增一个数值），可选的`prefix`，可以在前面加前缀。

该方法没什么实际用处。

**camelCase(name)**

将字符串由蛇型（snake-case）转成骆驼型（camelCase）。

注意：没有反方法`snakeCase`。

**escapeHTML(str)|escapeHtml(str)**

将字符``& > < ` / " '``替换成对应的HTML的实体``&amp; &gt; &lt; &#x60; &#x2F; &quot; &#x27;``，以便安全地展示在HTML页面中。

**unEscapeHTML(str)|unEscapeHtml(str)**

顾名思义，与`escapeHTML`反向的动作。

**escapeRegExp(str)**

用于将用户输入的字符串中的正则敏感的元字符进行转义后。

**startsWith(str, prefix)**

判断字符串`str`是否以`prefix`打头。ECMA-5原生`String.prototype.startsWith(prefix)`的替代。

**endsWith(str, suffix)**

判断字符串`str`是否以`suffix`打头。ECMA-5原生`String.prototype.endsWith(suffix)`的替代。

**trim(str)**

去除字符串头尾空格。ECMA-5原生`String.prototype.trim()`的替代。

**substitute(str, o[, regexp])**

使用对象`o`中对应的属性值替换`str`中的`{key}`子串，这个方法最早出现在[prototype.js](http://prototypejs.org/)中。可选参数`regexp `用于自定义用于替换的子串的模式。

**urlEncode(s)**

实际上就是调用了`encodeURIComponent`。

**urlDecode(s)**

调用`decodeURIComponent`，但会先把字符串中的`+`号转成空格。

#### 数组|对象混合工具

广义上讲，数组或类数组是一种以数字作为属性名的特殊对象。所以很多方法，既可以用于数组，也可以用于对象。

**each(object, fn, context)**

用来遍历对象的属性键值（v-k，对数组或类数组来说，k是index）对，并对每个属性执行一次`fn(v, k)`，`context`用以指定`fn`中的`this`。当应用于数组是，“类似”于ECMA-5的[`Array.prototype.forEach(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)，不同的是，这里可以以`return false`的方式提前结束。

#### 对象工具

**keys(o)**

获取对象`o`中的所有属性值，并返回为一个数组。ECMA-5的`Object.keys(o)`的替换，实际上KISSY在实现的时候，如果判断存在`Object.keys(o)`，则直接使用这个方法。

#### 数组工具

**makeArray(o)**

创建数组，若传入的参数为`undefined`或`null`，返回一个新德空数组；若传入的是数组，直接返回；传入的对象含有`length`属性时，尝试转成数组并返回。

该方法纯属鸡肋，只有在将类数组（如`arguments`）转换成真正的数组的时候有用。而且，无法转换如`options`这样类数组的HTML集合。

**indexOf(item, arr\[, fromIndex\])**

查找`item`在`arr`中第一次出现的位置，`fromIndex`用以指定从哪个位置开始找起，默认为0。

注意：`util.indexOf("1", "1234")`也能返回正确的`0`，但这并不说明这么用是正确的，它能正确返回的原因是`String`的下标访问方式。所以`util.indexOf("12", "1234") = -1`。对于字符串，请使用`string.indexOf(substr)`。

**lastIndexOf(item, arr\[, fromIndex\])**

与`indexOf`类似，查找`item`在`arr`中最后一次出现的位置，`fromIndex`默认为`arr.length - 1`。同样注意，不要用在`String`上。

**inArray(item, arr)**

判断`item`是否在`arr`中。跟`jQuery`的`inArray`返回的结果是数字（jQuery的`inArray`其实是`indexOf`）不同，这里返回布尔值`true/false`。

**every(arr, fn\[, context\])**

遍历数组，若每个元素`fn(v, k)`都返回真值（不一定要`true`），则整个表达式返回`true`；否则提前结束遍历，表达式返回`false`。`context`指代`fn`中的`this`。ECMA-5中[`Array.protoype.every(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)的替代品。

**some(arr, fn\[, context\])**

遍历数组，若某个元素`fn(v, k)`返回真值（不一定要`true`），则提前结束遍历，表达式返回`true`；若所有元素都不返回真值，返回`false`。`context`同上。ECMA-5中[`Array.protoype.some(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)的替代品。

**filter(arr, fn\[, context\])**

遍历数组，将`fn(v, k)`返回`true`的`v`组成一个新的数组，新数组的长度小于等于原数组，用于将`arr`中符合条件的值过滤出来。`context`同上。ECMA-5中[`Array.protoype.filter(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)的替代品。

**map(arr, fn\[, context\])**

遍历数组，把`fn(v, k)`的返回值组成一个新的数组，用于将数组“映射”成一个等长的新数组。ECMA-5中[`Array.protoype.map(fn, context)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)的替代品。

**reduce(arr, fn\[, initialValue\])**

TODO：代码中其他地方都叫fn，这里叫callback

遍历数组，`fn(previousValue/** 上一次调用回调返回的值，或者是提供的初始值 */, currentValue/** 当前被处理的元素 */, index/** 当前元素索引 */, arr/** 数组本身 */)`作为累加器把数组中的每个值（从左到右）开始缩减，最终为一个值。ECMA-5中[`Array.protoype.reduce(fn, initialValue)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)的替代品。

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

**bind()**

**rbind()**


#### 时间工具

**now()**

返回当前客户端的时间毫秒数（当前时间与1970-01-01 00:00:00 UTC的毫秒差），相当于`new Date().getTime()`。ECMA-5中[`Date.now()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now)的替代品。

**通用工具**

**equals(a, b)**

判断`a`与`b`是否等价。一般的`==`或`===`，对于简单类型的数据比较还行，但对于引用类型则无能为力，因为它只能简单地判断两者的引用是否相等，即只能判定两则是否是同一个东西。`util.equals(a, b)`提供了真正判断两个对象是否“内容上相等”的能力。以下是两者的对比：

o1, o2 | o1 == o2 | o1 === o2 | util.equals(o1, o2) | 说明
-- | -- | -- | -- | --
undefined, undefined | true | true | true | -
null, null | true | true | true | -
undefined, null | true | false | true | 未处理JS的不足，易出错
NaN, NaN | false | false | false | 未处理JS的不足
"", "" | true | true | true | -
"", new String("") | true | false | false | 包裹对象确实与字面量应该不同
new String(""), new String("") | false | false | true | 对象等价
0, 0 | true | true | true | -
0, new Number(0) | true | false | false | 包裹对象确实与字面量应该不同
new Number(0), new Number(0) | false | false | true | 
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






**augment(r, varArgs)**

**available(id, fn)**

**buffer(fn, ms, context)**

**clone(input, filter)**

**extend(r, s, px, sx)**

**globalEval(data)**

**later(fn, when, periodic, context, data)**

**merge(varArgs)**

**mix(r, s, ov, wl, deep)**

**namespace(name, holder)**

**param(o, sep, eq, serializeArray)**

**parseJson(data)**

**parseXML(data)**

**parseXml(data)**

**stamp(o, readOnly, marker)**

**throttle(fn, ms, context)**

**ucfirst(s)**

**unique(a, override)**

**unparam(str, sep, eq)**
