### 概览
`util`是一个常用的工具集。

### 属性

#### _debug: "@DEBUG@"

没用的东西

#### version: "1.1.6"

版本号

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

#### 对象工具

**keys(o)**

获取对象`o`中的所有属性值，并返回为一个数组。ECMA-5的`Object.keys(o)`的替换，实际上KISSY在实现的时候，如果判断存在`Object.keys(o)`，则直接使用这个方法。

#### 数组工具

#### 函数工具

**noop()**

一个空方法。可以用作默认的callback填充方法，这样就不需要到处创建空的默认方法了。

**bind()**










**augment(r, varArgs)**

**available(id, fn)**

**buffer(fn, ms, context)**

**clone(input, filter)**

**each(object, fn, context)**



**equals(a, b)**

**every(arr, fn, context)**

**extend(r, s, px, sx)**

**filter(arr, fn, context)**

**globalEval(data)**

**inArray(item, arr)**

**indexOf(item, arr, fromIndex)**



**lastIndexOf(item, arr, fromIndex)**

**later(fn, when, periodic, context, data)**

**makeArray(o)**

**map(arr, fn, context)**

**merge(varArgs)**

**mix(r, s, ov, wl, deep)**

**namespace(name, holder)**

**now:now()**

**param(o, sep, eq, serializeArray)**

**parseJson(data)**

**parseXML(data)**

**parseXml(data)**

**rbind()**

**ready(fn)**

**reduce(arr, callback, initialValue)**

**some(arr, fn, context)**

**stamp(o, readOnly, marker)**

**throttle(fn, ms, context)**

**ucfirst(s)**

**unique(a, override)**

**unparam(str, sep, eq)**


