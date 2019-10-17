# 分片 （ Partials ）

可以通过 `Partials` 实现模板的复用。`Partials` 就是普通的模板，他们可以其他模板直接使用, 详见[文档](https://handlebars-draft.knappi.org/guide/partials.html#basic-partials)

## 基本的分片

在使用前需要通过 `Handlebars.registerPartial()` 先注册一个 `partials`

```js
Handlebars.registerPartial('titleEl', '{{name}}')
```

然后像下面这样使用

```html
{{> myPartial }}
```

**最简单的例子:**

```html
<div class="post">
{{> basicPartial titleName="h1"}}
{{> basicPartial titleName="h2"}}
{{> basicPartial titleName="h3"}}
</div>
```

```js
const titleTpl = '<{{titleName}}>{{content}}</{{titleName}}>';
Handlebars.registerPartial('basicPartial', titleTpl);

const context = {
  content: '我是标题'
}
```
输出:
```html
<div class="post">
<h1>我是标题</h1><h2>我是标题</h2><h3>我是标题</h3></div>
```
上面的例子中创建了一个名为 `basicPartial` 的 `partial`, 然后在模板中定义了 `titleName`, `content`。使用时通过参数传递了 `titleName` 的值 `titleName="h1"`；并且 `content` 的值来至于 `context` 的数据.


**下面来看一个稍微复杂一点的例子:**

```html
<div class="post">
  {{> userMessage tagName="h1" }}

  <h1>Comments</h1>

  {{#each comments}}
    {{> userMessage tagName="h2" }}
  {{/each}}
</div>
```

```js
const titleTpl = '<{{tagName}}>By {{author.firstName}} {{author.lastName}}</{{tagName}}>'
    + '<div class="body">{{body}}</div>';
Handlebars.registerPartial('userMessage', titleTpl)

const context = {
  author: { firstName: "Alan", lastName: "Johnson" },
  body: "I Love Handlebars",
  comments: [
    {
      author: { firstName: "Yehuda", lastName: "Katz" },
      body: "Me too!"
    }
  ]
}
```
输出:

```html
<div class="post">
  <h1>By Alan Johnson</h1><div class="body">I Love Handlebars</div>
  <h1>Comments</h1>
  <h2>By Yehuda Katz</h2><div class="body">Me too!</div>
</div>
```

## 动态分片 (Dynamic Partials)

语法如下所示

```html
{{> (whichPartial)}}
```