# Block Helpers

> 说明待补充.

`Block` 使用方式为 {{`#xxx`}} 

## 基本块 ( Basic Blocks )

```html
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{#aaa}}{{body}}{{/aaa}}
  </div>
</div>
```

```js
Handlebars.registerHelper("aaa", function(options) {
  return options.fn(this);
});

const context = {
  title: '我是标题',
  body: '我是内容'
}
```
输出:
```html
<div class="entry">
  <h1>我是标题</h1>
  <div class="body">
    我是内容
  </div>
</div>
```
上面的示例中，创建了一个名为 `aaa` 的 `Block Helper`, 除了已知 Handlebars 内置了 `list` 以外，是可以取任意名字的。及 `aaa` 可以取名为 `bbb` `ccc` ...

在上述代码的继承上修改

```html
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{#aaa}}{{/aaa}}
  </div>
</div>
```

```js
Handlebars.registerHelper("aaa", function(options) {
  // return options.fn(this);
  return '11111'
});
```
输出:
```html
<div class="entry">
  <h1>我是标题</h1>
  <div class="body">
    11111
  </div>
</div>
```
发现 `#aaa` 中的内容与注册时的函数返回值有极大关联，这里返回值为 `11111`;

下面我们来分析下
```
// html
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{#aaa}}{{body}}{{/aaa}}
  </div>
</div>

// js
Handlebars.registerHelper("aaa", function(options) {
  return options.fn(this);
});


{
  title: '我是标题',
  body: '我是内容内容',
  person: {
   name: '张三'
  }  
}
```
到底发生了什么, 以下仅为自己的理解， `options.fn(this)` 返回的是一个上下文，也就是 `context` 数据，访问时要安装此上下文的结构访问，由于模板 `#aaa` 中的内容为 {{`body`}}。`this` 表示最外层的那一层上下文, 这一层中存在 `.body` 所以 `body` 立刻被查找为 `我是内容内容`。

上面的推论可以通过下面的代码来测试:

```html
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{#aaa}}{{body}}{{/aaa}}
    {{#aaa}}{{person.body}}{{/aaa}}
  </div>
</div>
```

```js
Handlebars.registerHelper("aaa", function(options) {
  return options.fn(this.person);
});

const context = {
  title: '我是标题',
  body: '我是内容内容',
  person: {
   name: '张三',
   body: '我叫张三',
   person: {
     body: '我是张大',
   }
  }
}
```
输出:
```html
<div class="entry">
  <h1>我是标题</h1>
  <div class="body">
    我叫张三
    我是张大
  </div>
</div>
```

当返回 `options.fn(this)` 时输出:

```html
<div class="entry">
  <h1>我是标题</h1>
  <div class="body">
    我是内容内容
    我叫张三
  </div>
</div>
```

## 基础自定义内容快 (Basic Block Variation)

可以添加自定义标签和内容.

```js
const str = `<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{#aaa}}{{body}}{{/aaa}}
    {{#aaa}}{{person.body}}{{/aaa}}
  </div>
</div>`
Handlebars.registerHelper("aaa", function(options) {
  return '<span>' + options.fn(this) + '</span>';
  // return new Handlebars.SafeString( '<span>' + options.fn(this) + '</span>' );
});
const context2 = {
  title: '我是标题',
  body: '我是内容内容',
  person: {
    name: '张三',
    body: '我叫张三',
    person: {
      body: '我是张大',
    }
  }
}
const template2 = Handlebars.compile(str);
document.getElementById('root').innerHTML += template2(context2);
```

这里就添加了 `<span>` 标签包裹内容，实际可以根据需要修改.

## with Helper

可以通过 `with` 递归一个对象

```html
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{#with person}}
      <h2>{{name}}</h2>
      <p>{{body}}</p> 
    {{/with}}
  </div>
</div>
```

```js
const context = {
  title: '我是标题',
  body: '我是内容内容',
  person: {
   name: '张三',
   body: '我叫张三',
   person: {
     body: '我是张大',
   }
  }
}
```

输出:
```html
<div class="entry">
  <h1>我是标题</h1>
  <div class="body">
      <h2>张三</h2>
      <p>我叫张三</p> 
  </div>
</div>
```

## 简单迭代器 (Simple Iterators)

类似 `with`, 内置了 `each` 来递归一个数组.

```html
<ul>
{{#each nav}}
  <li><a href="{{url}}">{{title}}</a></li>
{{/each}}
</ul>
```

```js
const context = {
  nav: [
    { url: "http://www.yehudakatz.com", title: "Katz Got Your Tongue" },
    { url: "http://www.sproutcore.com/block", title: "SproutCore Blog" }
  ]
}
```
输出:
```html
<ul>
  <li><a href="http://www.yehudakatz.com">Katz Got Your Tongue</a></li>
  <li><a href="http://www.sproutcore.com/block">SproutCore Blog</a></li>
</ul>
```

下面来看 context 中支持的数组递归.

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

{{`#programme`}} 由于 `programme` 数据类型为一个数组，所以作为遍历数组处理了. 虽然可以实现列表的渲染， 但是不够灵活，当列表数据不存在需要提示时，要自己处理，于是更灵活的 `#if` 搭配 `#each` 出现了.

+ **下面将新注册一个 `list` helper 来实现递归**

```html
{{#list nav}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
```

```js
Handlebars.registerHelper("list", function(context, options) {
  var ret = "<ul>";

  for (var i = 0, j = context.length; i < j; i++) {
    ret = ret + "<li>" + options.fn(context[i]) + "</li>";
  }

  return ret + "</ul>";

  // 精简方法1：非常精简，但是代码风格不好.
  // return "<ul>" + context.map(item => "<li>" + options.fn(item) + "</li>").join("\n") + "</ul>"
  
  // 精简方法2: 兼顾精简和良好的代码风格.
  // return (
  //   "<ul>" +
  //   context
  //     .map(function(item) {
  //       return "<li>" + options.fn(item) + "</li>";
  //     })
  //     .join("\n") +
  //   "</ul>"
  // );
});


const context = {
  nav: [
    { url: "http://www.yehudakatz.com", title: "Katz Got Your Tongue" },
    { url: "http://www.sproutcore.com/block", title: "SproutCore Blog" }
  ]
}
```
输出:
```html
<ul><li>  <a href="http://www.yehudakatz.com">Katz Got Your Tongue</a>
</li><li>  <a href="http://www.sproutcore.com/block">SproutCore Blog</a>
</li></ul>
```

+ **先来看看下面的数据结构**

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

+ **用 {{`this`}} 来引用遍历的元素 例如:**

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

## 条件判断 ( Conditionals )

内置了条件判断块 `if` 和 `unless`.

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

```js
const context = {
  list: ['js', 'html', 'css'],
  noresult: "数据请求错误"
}
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

当 `context.list` 不存在时会显示 `else` 的内容

```js
const context = {
  // list: ['js', 'html', 'css'],
  noresult: "数据请求错误"
}
```
输出:
```html
<p>数据请求错误</p>
```

下面来看看官方 `if` 代码实现

```js
Handlebars.registerHelper("if", function(conditional, options) {
  if (conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
```

## Hash 参数 ( Hash Arguments )

创建一个可以接收参数的列表，`each` 虽然可以递归数组，但是由于是内置 `helper` 改动后会影响其他效果，所以下面单独注册一个新的列表处理对象.

```html
{{#list nav id="nav-bar" class="top"}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
```

```js
Handlebars.registerHelper("list", function(context, options) {
  var attrs = Object.keys(options.hash)
    .map(function(key) {
      return key + '="' + options.hash[key] + '"';
    })
    .join(" ");

  return (
    "<ul " +
    attrs +
    ">" +
    context
      .map(function(item) {
        return "<li>" + options.fn(item) + "</li>";
      })
      .join("\n") +
    "</ul>"
  );
});

const context = {
  nav: [
    { url: "http://www.yehudakatz.com", title: "Katz Got Your Tongue" },
    { url: "http://www.sproutcore.com/block", title: "SproutCore Blog" }
  ]
}
```
输出:
```html
<ul class="top" id="nav-bar"><li>  <a href="http://www.yehudakatz.com">Katz Got Your Tongue</a>
</li>
<li>  <a href="http://www.sproutcore.com/block">SproutCore Blog</a>
</li></ul>
```

上面取名为 `list`, 名字不是固定的，可以为其他名字, 但是最好不要为 `each`.

来看下面一个例子:
```html
{{#list array}}
  {{@index}}. {{title}}
{{/list}}
```

```js
Handlebars.registerHelper("list", function(context, options) {
  var out = "<ul>",
    data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  for (var i = 0; i < context.length; i++) {
    if (data) {
      data.index = i;
    }

    out += "<li>" + options.fn(context[i], { data: data }) + "</li>";
  }

  out += "</ul>";
  return out;
});

const context = {
  nav: [
    { url: "http://www.yehudakatz.com", title: "Katz Got Your Tongue" },
    { url: "http://www.sproutcore.com/block", title: "SproutCore Blog" }
  ]
}

```
输出:
```html
<ul><li>  0. Katz Got Your Tongue
</li><li>  1. SproutCore Blog
</li></ul>
```

上面的 `@index` 名字可以任意取，例如: `@idx` 但是要与 `helper` 中的名字匹配，即这里对应为: `data.index`。

`options.fn(context[i], { data: data })` 如何理解呢? `options.fn(context[i])` 为传递一个上下文, 第二个参数可以理解为附加的参数，由于 `context` 中，存在 `title` 但不存在 `index` 所以 `data.index = i`, 而 `data` 应该来源于 `Handlebars.createFrame(options.data)`.

## Block Parameters

Notice: Handlebars 3.0 后才支持下面这种写法.

```js
{{#each users as |user userId|}}
  Id: {{userId}} Name: {{user.name}}
{{/each}}
```

## 原始块 ( Raw Blocks )

不转义表达式可以使用 /{{`bar`}}, 但是多个表达式都这样处理就有点麻烦了，于是可以使用下面的处理方式:

```html
{{{{raw-helper}}}}
  {{bar}}
  {{bar}}
{{{{/raw-helper}}}}
```

```js
Handlebars.registerHelper("raw-helper", function(options) {
  return options.fn();
});
```
输出:
```html
{{bar}}
{{bar}}
```

