var lib = {
    getDom: function (id) {
        return document.getElementById(id);
    },
    createDom: function (type, id, css) {
        var dom = document.createElement(type);
        id !== undefined && (dom.id = id);
        css !== undefined && (dom.className = css);
        return dom;
    },
    createDropdown: function (id, data, onChangeFn) {
        var dp = this.createDom('select', id);
        var text = '';

        for (var i = 0, option; i < data.length; i++) {
            text = chrome.i18n.getMessage(data[i]);
            option = this.createDom('option');
            option.value = data[i].indexOf('_default') > 0 ? '' : data[i];
            option.text = text ? text.replace(/_/gi, ' ') : data[i].replace(/_/gi, ' ');
            dp.appendChild(option);
        }

        onChangeFn && (dp.onchange = function (e) {
            onChangeFn(e);
        });
        return dp;
    },
    createInput: function (id, inputAttrs, lblText, btnText, onClickEvt, onKeyDownEvt) {
        var span = this.createDom('span');
        var label = this.createDom('label')
        var input = this.createDom('input');
        var btn = this.createDom('button');
        input.id = id;
        input.type = 'text';
        for (var i = 0, al = inputAttrs.length; i < al; i++) {
            input.setAttribute(inputAttrs[i].name, inputAttrs[i].value);
        }

        label.id = id + 'Lbl';
        label.htmlFor = id;
        label.innerText = lblText;

        btn.id = id + 'Button';
        btn.innerHTML = btnText;

        onClickEvt && (btn.onclick = function (e) {
            onClickEvt(e);
        });

        onKeyDownEvt && (input.onkeyup = function (e) {
            onKeyDownEvt(e);
        });

        input.onkeydown = function (e) {
            if (e.keyCode == 13) {
                e.currentTarget.nextElementSibling.focus();
                e.currentTarget.nextElementSibling.click();
            }
        };

        span.appendChild(label);
        span.appendChild(input);
        span.appendChild(btn);
        return span;
    },
    createLink: function (href, text, onClickFn) {
        var a = this.createDom('a');
        a.href = href;
        a.innerText = text;
        a.addEventListener('click', onClickFn);
        return a;
    },
    createBtn: function (id, text, onClickFn, css) {
        var btn = this.createDom('button');
        btn.id = id;
        btn.innerText = text;
        css && (btn.className = css);
        btn.addEventListener('click', onClickFn);
        return btn;
    },
    createToggle: function (id, text) {
        var tpl = '', t = {
            on: text.on || 'ON', off: text.off || 'OFF', text: text.text
        };
        var c = this.createDom('span', '', 'tg');
        if (!!t.text) {
            tpl = '<span class="desc">$text</span>'.replace('$text', t.text);
        }
        tpl += '<input id="$id" name="$id" class="tgl tgl-skewed" type="checkbox" data-fn="toggle">'
            + '<label class="tgl-btn" data-tg-off="$off" data-tg-on="$on" for="$id"></label>';
        c.innerHTML = tpl.replace(/$id/gi, id).replace('$off', t.off).replace('$on', t.on);
        return c;
    },
    jump: function (offset) {
        window.scrollTo(0, offset);
    },
    jumpDom: function (domId) {
        var top = document.getElementById(domId).offsetTop - 60;
        window.scrollTo(0, top);
    },
    notice: function (text) {
        alert(text);
    },
    getFileName: function () {
        var tmp = decodeURI(document.URL).split('/');//window.location.pathname.split('/');
        return tmp[tmp.length - 1];//.replace('.txt', '');
    }
};