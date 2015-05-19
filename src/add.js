/**
 * @file 添加Todo模块
 * @author errorrik
 */


var $ = require('jquery');

/**
 * tag选中的值
 *
 * @inner
 * @type {string}
 */
var tagValue;

/**
 * tag输入视图操作对象
 *
 * @inner
 * @type {Object}
 */
var tag = {
    /**
     * 初始化tag输入视图
     *
     * @inner
     * @return {Promise}
     */
    init: function () {
        var deferred = require('when').defer();
        require('./service').tags().then(function (tags) {
            var html = '';
            tags.forEach(function (item) {
                html += '<li id="add-tag-' + item.name
                    + '" title="' + item.name
                    + '" style="background:' + item.color
                    + '"></li>';
            });

            $('#add-tag')
                .html(html)
                .delegate('li', 'click', function () {
                    if (this.className === '') {
                        tag.reset();
                        tagValue = this.getAttribute('title');
                        this.className = 'checked';
                    }
                    else {
                        tag.reset();
                    }
                });

            deferred.resolve();
        });

        return deferred.promise;
    },

    /**
     * 重置tag输入视图
     *
     * @inner
     */
    reset: function () {
        if (tagValue) {
            document.getElementById('add-tag-' + tagValue).className = '';
        }
        tagValue = null;
    },

    /**
     * 获取tag选中的值
     *
     * @inner
     * @return {string}
     */
    getValue: function () {
        return tagValue;
    }
};

/**
 * 显示表单
 *
 * @inner
 */
function show() {
    $('#add-form').show();
    $('#add').hide();
}

/**
 * 隐藏表单
 *
 * @inner
 */
function hide() {
    $('#add-form').hide();
    $('#add').show();
}

/**
 * 重置表单
 *
 * @inner
 */
function reset() {
    $('#add-title').val('');
    $('#add-desc').val('');
    tag.reset();
}

/**
 * 添加Todo
 *
 * @inner
 */
function addData() {
    var titleEl = $('#add-title');
    var descEl = $('#add-desc');
    var okEl = $('#add-ok');

    var title = titleEl.val();
    if (!title) {
        hide();
        return;
    }

    titleEl.attr('disabled', 1);
    descEl.attr('disabled', 1);
    okEl.attr('disabled', 1);
    require('./service')
        .add({
            title: title,
            desc: descEl.val(),
            tag: tag.getValue()
        })
        .then(function (data) {
            reset();
            hide();
            titleEl.removeAttr('disabled');
            descEl.removeAttr('disabled');
            okEl.removeAttr('disabled');

            require('./list').add(data);
        });
}

/**
 * 初始化Todo添加表单
 */
exports.init = function () {
    tag.init().then(function () {
        $('#add').click(show);
        $('#add-cancel').click(hide);
        $('#add-ok').click(addData);
    });
};
