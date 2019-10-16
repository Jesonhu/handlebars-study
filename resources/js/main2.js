!(function(win, Hb) {
  const main = {
    init() {
      this.createNameListHelper();
      const context = this.getData();
      this.setHbHtml('tpl_1', context);
    },
    setHbHtml(tplId, context) {
      const source = document.getElementById(tplId).innerHTML;
      const template = Hb.compile(source);
      const html = template(context);

      document.getElementById('root').innerHTML += html;
    },

    createNameListHelper() {
      Handlebars.registerHelper('list', (items, options) => {
        let str = '<ul>';

        for (let i = 0, len = items.length; i < len; i++) {
          str = str +'<li>'+ options.fn(items[i]) +'</li>';
        }

        return str + '</ul>';
      });
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
      return {
        people: [
          {firstName: "三", lastName: "张"},
          {firstName: "四", lastName: "李"},
          {firstName: "五", lastName: "王"}
        ]
      }
    }
  }

  win.__MAIN__ = main;
})(window, Handlebars);