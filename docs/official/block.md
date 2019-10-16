# Handlebar的表达式

## 基本用法

**View**

```html
<div>
  <h2>{{title}}</h2>
  <ul>  
    {{#programme}}
        <li>{{language}}</li>
    {{/programme}}
  </ul>
</div>
```

**Data**

```js
const context = {
  title: '标题',
  programme: [
    { language: 'js' },
    { language: 'html' },
    { language: 'css' },
  ]
}
```

**渲染后的结果**

```html
<div>
  <h2>标题</h2>
  <ul>
    <li>js</li>
    <li>html</li>
    <li>css</li>
  </ul>
</div>
```

{{`#programme`}} 由于 `programme` 数据类型为一个数组，所以作为遍历数组处理了. 虽然可以实现列表的渲染， 但是不够灵活，当列表数据不存在需要提示时，要自己处理，于是下面更灵活的 `#if` 搭配 `#each` 出现了.

## Block helper

#### each block helper

> 可以使用内置的 {{`#each`}} helper遍历列表块内容，用 {{`this`}} 来引用遍历的元素 例如:

View

```
<h2>{{title}}</h2>
<ul>
    {{#each name}}
        <li>{{this}}</li>
    {{/each}}
</ul>
```

Data:

```js
const context = {
  title: '这是标题',
  name: ["html","css","javascript"]
}
```

这里的 {{`this`}} 指的是数组里的每一项元素，和上面的 `Block` 中的 `#programme` 很像，但原理是不一样的这里的 `name` 是数组，而内置的 `each` 就是为了遍历数组用的，更复杂的数据也同样适用。

#### if else block helper

> {{`#if`}} 与 `JavaScript` 一样，你可以指定条件渲染 `DOM`，如果它的参数返回 `false`，`undefined`, `null`, `""` 或者 `[]` (a "falsy" value), `Handlebar` 将不会渲染 `DOM`，如果存在 `#else` 则执行 {{`#else`}} 后面的渲染 

View:
```html
{{#if list}}
<ul id="list">  
    {{#each list}}
        <li>{{this}}</li>
    {{/each}}
</ul>  
{{else}}
    <p>{{error}}</p>
{{/if}}
```

Data:
```js
const context = {
  list: ['js', 'html', 'css'],
  error: "数据请求错误"
}
```

#### 复杂的 if else block helper

先来看看下面的数据结构

```js
const context = {
  title: '内置 each list 遍历aaa',
  list: {
    list: ['js', 'html', 'css'],
    error: "数据请求错误"
  }
}
```

这里是多层数据结构，与上面的一层数据结构有很多区别，这种如何定义模板内容呢? 可以像下面这样定义.

```html
<h2>{{title}}</h2>

{{#if list.list}}
<ul id="list">  
    {{#each list.list}}
        <li>{{this}}</li>
    {{/each}}
</ul>  
{{else}}
    <p>{{error}}</p>
{{/if}}
</div>
```

渲染后的结果:

```html
<h2>内置 each list 遍历 aaa</h2>

<ul id="list">  
  <li>js</li>
  <li>html</li>
  <li>css</li>
</ul>
```

由于定义的数据结构是 `list.list` 为一个数组，所以对于的模板定义为: {{`#if list.list`}} 与 {{`#each list.list`}}