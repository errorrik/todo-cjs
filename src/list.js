/**
 * @file Todo列表模块
 * @author errorrik
 */


var service = require('./service');

/**
 * 生成Todo项的HTML
 *
 * @inner
 * @param {Object} item Todo项数据
 * @return {string}
 */
function genItemHTML(item) {
    return '<h3>' + item.title + '</h3>'
        + '<p>' + item.desc + '</p>'
        + '<i class="fa fa-check"></i>';
}

/**
 * 初始化列表视图
 *
 * @inner
 * @param {Array} list 列表数据
 */
function initList(list) {
    var html = '';
    list.forEach(function (item) {
        var tagColor = service.tagColor(item.tag);
        html += '<li data-todo-id="' + item.id + '"'
            + (item.done ? ' class="done"' : '')
            + (tagColor ? ' style="border-color:' + tagColor + '"' : '')
            + '>' + genItemHTML(item) + '</li>';
    });

    $('#todo-list')
        .html(html)
        .delegate('li', 'click', function () {
            if (this.className === '') {
                this.className = 'done';
                service.done(this.getAttribute('data-todo-id'));
            }
        });
}

/**
 * 添加Todo项
 *
 * @param {Object} item Todo项数据
 */
exports.add = function (item) {
    var li = document.createElement('li');
    li.setAttribute('data-todo-id', item.id);
    li.innerHTML = genItemHTML(item);

    var tagColor = service.tagColor(item.tag);
    tagColor && (li.style.borderColor = tagColor);

    var listEl = document.getElementById('todo-list');
    listEl.insertBefore(li, listEl.firstChild);
};

/**
 * 初始化列表
 */
exports.init = function () {
    service.todos().then(initList);
};
