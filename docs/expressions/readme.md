# 表达式

> 表达式是 `{{` 内容 `}}` 包裹的内容, [文档](https://handlebars-draft.knappi.org/guide/expressions.html)

## 基本使用

```html
<p>{{lastname}} {{firstname}}</p>
```

```js
const context = {
  firstname: '三',
  lastname: '张'
}
```

输出

```html
<p>张 三</p>
```

## Path 解析式

#### 点分割(dot-separted) 表达式

```html
<p>{{people.lastname}} {{people.firstname}}</p>
```

```js
const context = {
  people: {
    firstname: '三',
    lastname: '张'
  }
}
```
输出:
```html
<p>张 三</p>
```

Notice: 之前的版本中使用 `/` 代替 `.` 像这样 {{`people/lastname`}} 但是这种写法已经废弃了!

## 文字部分 (Literal segments)

```html
{{!-- wrong: {{array.0.item}} --}}
correct: array.[0].item: {{array.[0].item}}

{{!-- wrong: {{array.[0].item-class}} --}}
correct: array.[0].[item-class]: {{array.[0].[item-class]}}

{{!-- wrong: {{./true}}--}}
correct: ./[true]: {{./[true]}}

```

```js
const context = {
  array: [
    {
      item: "item1",
      "item-class": "class1"
    }
  ],
  true: "yes"
}
```
输出
```html
correct: array.[0].item: item1

correct: array.[0].[item-class]: class1

correct: ./[true]: yes
```

`array` 的类型是一个数组, 如果想通过表达式直接输出一个 `item`. js 的语法是这样: `array[0].item` 即 {{`array[0].item`}} 。但在 `Handlebars` 中是错误的。也不是 `array.0.item` 。正确的写法为 `array.[0].item`。
`item-class` 是中划线 `-` 分割的, 使用的时候需要 [item-class] 方式使用。
`true` 为一个布尔值，使用的时候需要 [true]。

更多有特殊含义的 `字符` 请看[官方文档](https://handlebars-draft.knappi.org/guide/expressions.html#literal-segments)

## HTML 标签转义 (HTML Escaping)

```js
const context = {
  title: '我是标题',
  content: "<div><p><strong><a href='http://www.baidu.com' target='_blank'><span>我是内容</span></a></strong><p></div>"
}
```

```html
{{{content}}}
```

注意使用 {{{ 而不是 {{

相关官方说明:

> Handlebars HTML-escapes values returned by a {{`expression`}}. If you don't want Handlebars to escape a value, use the "triple-stash", {{{.

## Helpers 

有点像 Vue 的 `过滤器`, 但是使用方式还是有些区别的。下面是官方的介绍.

> Helpers can be used to implement functionality that is not part of the Handlebars language itself.

通过 `Handlebars.registerHelper` 注册一个.

```
// View
<p>{{uppercase js}}</p>

// 注册一个 Helpers
Handlebars.registerHelper('uppercase', function(string) {
  return string.toUpperCase()
});

// Data:
const context = {
  js: 'JavaScript',
}

// 输出
<p>JAVASCRIPT</p>

```
新注册的名字 `uppercase` 可以是任意的名字，但是使用的时候必须与其一致，使用时要放在 `data` `前`

+ #### Prevent HTML-escaping of helper return values

之前使用 `}}}` 而不是 `}}` 处理 html 标签转义的，这里介绍一个使用 `}}` 处理转义的方法. [在线demo](https://handlebars-draft.knappi.org/examples/helper-safestring.html)

+ #### 多个参数的 Helpers

```html
<!-- 错误用法 -->
<p>{{ link '百度' aaa}}</p>

<!-- 正确用法 -->
<p>{{ link '百度' url}}</p>
```

```js
Handlebars.registerHelper('link', function(text, url) {
  url = Handlebars.escapeExpression(url);
  text = Handlebars.escapeExpression(text)
  return new Handlebars.SafeString(`<a href="${url}">${text}</a>`)
});

const context = {
  url: 'https://www.baidu.com',
}
```

输出
```html
<p><a href="">百度</a></p>
<p><a href="https://www.baidu.com">百度</a></p>
```

注意注册 Helper 时的处理函数的 `形参` url 需要与模板的报错一致.

下面来看一个 **实际数据** 的使用场景.

```html
{{link people.text people.url}}
```

```js
// helpers
Handlebars.registerHelper('link', function(text, url) {
  url = Handlebars.escapeExpression(url);
  text = Handlebars.escapeExpression(text)
  return new Handlebars.SafeString(`<a href="${url}">${text}</a>`)
});


// data 
const context = {
  people: {
    firstname: '斯坦森',
    lastname: '郭达',
    url: 'http://baijiahao.baidu.com/s?id=1612097038745896999&wfr=spider&for=pc',
    text: '斯坦森郭达'
  }
}
```

输出:
```html
<a href="http://baijiahao.baidu.com/s?id&#x3D;1612097038745896999&amp;wfr&#x3D;spider&amp;for&#x3D;pc">斯坦森郭达</a>
```
PS: 地址转义问题需要解决.

+ #### 传递普通参数 ( Literal arguments )

`未理解`

```html
{{link ''}}
```

+ #### 传递Hash参数 (Helpers with Hash arguments)

```html
{{link people.text class="person" }}
```

```js
Handlebars.registerHelper('link', function(text, options) {
  console.log(options);
  // => 
  // {
  //   data: { root:  ''},
  //   hash: { class: 'person' },
  //   name: 'link'
  // }
});

```

+ #### [Subexpressions](https://handlebars-draft.knappi.org/guide/expressions.html#subexpressions)

+ #### 去掉空格 (Whitespace Control)

默认情况下空格的数量与模板定义时的空格是一致，但是我们可以去掉空格，有两个方式:

1: 模板定义时去掉空格

2: 模板正常定义，但是使用 `~` 去掉空格。

我推荐第一种方式，因为可以先正常写模板，最后压缩至一行就可以了。因为第二种方案书写起来也比较繁琐.

```html

<div>
{{#each nav ~}}
  <a href="{{url}}">
    {{~#if test}}
      {{~title}}
    {{~^~}}
      Empty
    {{~/if~}}
  </a>
{{~/each}}
<div>

<div>
{{#each nav}}<a href="{{url}}">{{#if test}}{{title}}{{^}}Empty{{/if}}</a>{{/each}}
<div>

<div>
{{#each nav}}
  <a href="{{url}}">
    {{#if test}}
      {{title}}
    {{~^~}}
      Empty
    {{/if}}
  </a>
{{~/each}}
<div>
```

```js
const context = {
  nav: [{ url: "foo", test: true, title: "bar" }, { url: "bar" }]
}
```

输出:
```html
// 方案2:
<div>
<a href="foo">bar</a><a href="bar">Empty</a><div>

// 方案1:
<div>
<a href="foo">bar</a><a href="bar">Empty</a>
<div>

// 默认输出
<div>
  <a href="foo">
      bar  </a>  <a href="bar">
Empty
  </a><div>
```

## 不转义 Handlebars 表达式

```js
\{{escaped}}
```
输出:
```html
{{escaped}}
``` 
