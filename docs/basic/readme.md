# 基本使用

## 基本表达式使用

`{{}}` 就是一个 handlebars 表达式.

**Examples**

```js
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{body}}
  </div>
</div>
```
和 `vue` 相同.

## 基本模板使用

HTML.

```html
<div id="root"></div>
```

模板内容

```js
<script id="tpl1" type="text/x-handlebars-template">
  <div class="entry">
    <h2>{{title}}</h2>
    <div class="body">
      {{body}}
    </div>
  </div>
</script>
```
`script` 标签包裹, 加上 `type="x-handlebars-template"` 就定义了一个基本的模板

下面来使用这个模板

```js

// 获取 script id="tpl1" 模板下面的内容
const source = document.getElementById('tpl1').innerHTML;
// 进行模板编译
const template = Handlebars.compile(source);
// 数据 
const context = {title: "我是标题", body: "这是标题内容!"};
// 将模板和数据绑定并获取绑定后的 html
const html = template(context);

// 渲染到页面上
document.getElementById('root').innerHTML += html;

```

<details>
<summary>完整代码</summary>

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>handlebars-1</title>
</head>

<body>
  <div id="root"></div>  

  <!-- 基本测试模板 -->
  <script id="tpl1" type="text/x-handlebars-template">
    <div class="entry">
      <h2>{{title}}</h2>
      <div class="body">
        {{body}}
      </div>
    </div>
  </script>

  <!-- 引入 handebarsjs -->
  <script src="path/to/handlebars.js"></script>
  <script>
    // 获取 script id="tpl1" 模板下面的内容
    const source = document.getElementById('tpl1').innerHTML;
    // 进行模板编译
    const template = Handlebars.compile(source);
    // 数据 
    const context = {title: "我是标题", body: "这是标题内容!"};
    // 将模板和数据绑定并获取绑定后的 html
    const html = template(context);

    // 渲染到页面上
    document.getElementById('root').innerHTML += html;
  </script>
</body>

</html>
```
</details>

**预览效果**

![](https://user-images.githubusercontent.com/18684575/66895582-c1f49a80-f025-11e9-9c2c-a97c695b3244.png)

也可以通过 `jquery` 获取 `source`

```js
const source = $("#tpl1").html();
```

## 模板内容外置

上面例子中将模板放在了 `html` 中定义，还可以放在外部 `js` 等中定义

```js
const source = `<div id="testJsScript">
  <h2>{{title}}</h2>
  <div class="body">
    <p>{{body}}</p>
    <img src="./resources/img/bg.jpg" />
  </div>
</div>`

const template = Handlebars.compile(source);
const context = { title: 'js 外部模板', body: '外部模板内容!' };
const html = template(context);

document.getElementById('root').innerHTML += html;

```

这样也是可以了, 不仅 `view` `data` 相分离，而且将模板内容外置更加灵活

## 获取 dom 内容

当将内容 `innerHTML` 中后, 可以通过常规方式获取到的.

```js
const oTest = document.getElementById('testJsScript');
```
