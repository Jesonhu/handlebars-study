!(function(win, Hb) {
  const main = {
    init() {
      const context = this.getData();
      this.setHbHtml('tpl1', context);

      const context2 = this.getData2();
      this.setHbHtml('tpl1', context2);

      this.testJsScript();

      const listContext = this.getListData();
      this.setHbHtml('tpl2', listContext);

      const eachListContext = this.getEachListData();
      this.setHbHtml('tpl3', eachListContext);

      const eachInnerListContext = this.getEachInnerListData();
      this.setHbHtml('tpl4', eachInnerListContext);

      console.log( document.getElementById('testJsScript') );
    },
    setHbHtml(tplId, context) {
      const source = document.getElementById(tplId).innerHTML;
      const template = Hb.compile(source);
      const html = template(context);

      document.getElementById('root').innerHTML += html;
    },
    testJsScript() {
      const source = `<div id="testJsScript">
        <h2>{{title}}</h2>
        <div class="body">
          <p>{{body}}</p>
          <img src="./resources/img/bg.jpg" />
        </div>
      </div>`
      const template = Hb.compile(source);
      const context = { title: 'js 外部模板', body: '外部模板内容!' };
      const html = template(context);

      document.getElementById('root').innerHTML += html;
    },

    // ================================================================================
    // 数据内容
    // ================================================================================

    getData() {
      return {title: "我是标题", body: "这是标题内容!"}
    },

    getData2() {
      return {title: "我是模板复用标题", body: "<p>这是标题内容!</p>"}
    },

    getListData() {
      return {
        title: '前端编程语言',
        programme: [
          { language: 'js' },
          { language: 'html' },
          { language: 'css' },
        ]
      }
    },

    getEachListData() {
      return {
        title: '内置 each 遍历',
        name: ['js', 'html', 'css']
      }
    },

    getEachInnerListData() {
      return {
        // title: '内置 each list 遍历',
        list: ['js', 'html', 'css'],
        error: "数据请求错误"
      }
    }
  }

  win.__MAIN__ = main;
})(window, Handlebars);