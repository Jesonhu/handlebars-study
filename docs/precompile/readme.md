# 预编译模板.

什么是预编译呢? 下面先来回顾下两种模板的书写方式.

方式1: `<script>` 添加模板.
```script
<script id="tpl1" type="text/x-handlebars-template">
    <div class="entry">
      <h2>{{title}}</h2>
      <div class="body">
        {{body}}
      </div>
    </div>
  </script>
```

```js
const source = document.getElementById('tpl1').innerHTML;

const template = Handlebars.compile(source);
const context = { title: 'js 外部模板', body: '外部模板内容!' };
const html = template(context);

document.getElementById('root').innerHTML += html;
```

方式2: 定义模板字符串
```js
const source = `<div class="entry">
      <h2>{{title}}</h2>
      <div class="body">
        {{body}}
      </div>
</div>`

const template = Handlebars.compile(source);
const context = { title: 'js 外部模板', body: '外部模板内容!' };
const html = template(context);

document.getElementById('root').innerHTML += html;
```

这两种方式除了 `source` 定义的方式不同，其他操作一致。第一种方式模板比第二种有更友好的语法提示。

通过看预编译的[简单介绍](https://handlebars-draft.knappi.org/topics/precompilation.html#getting-started), 发现编译后的 `.js` 与 `方式2` 一样。但是 `example.handlebars` 中的模板仍然保留了第一种方式友好的语法提示。

当然预编译的过程中可以添加更多的特性，详情请看[文档](https://handlebars-draft.knappi.org/topics/precompilation.html#getting-started)
