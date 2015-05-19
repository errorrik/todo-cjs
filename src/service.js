/**
 * @file service模块
 * @author errorrik
 */


var when = require('when');

/**
 * 默认Tag列表
 *
 * @inner
 * @const
 * @type {Array}
 */
var DEFAULT_TAGS = [
    {name: '红色', color: '#a20025'},
    {name: '橙色', color: '#fa6800'},
    {name: '黄色', color: '#e3c800'},
    {name: '绿色', color: '#008a00'},
    {name: '蓝色', color: '#0050ef'},
    {name: '紫色', color: '#8a00ff'},
    {name: '灰色', color: '#bbb'}
];

/**
 * 本地Tag列表
 *
 * @inner
 * @type {Array}
 */
var localTags;

/**
 * 本地Tag列表索引，通过name搜索key
 *
 * @inner
 * @type {Object}
 */
var localTagsIndex = {};

/**
 * 本地Todo列表
 *
 * @inner
 * @type {Array}
 */
var localTodos;

/**
 * 获取tags数据
 *
 * @return {Promise}
 */
exports.tags = function () {
    var deferred = when.defer();

    if (!localTags) {
        var tagStr = localStorage.getItem('todo-tags');
        localTags = tagStr ? JSON.parse(tagStr) : DEFAULT_TAGS;
        localTags.forEach(function (tag) {
            localTagsIndex[tag.name] = tag.color;
        });
    }

    deferred.resolve(localTags);
    return deferred.promise;
};

/**
 * 获取tag对应颜色值
 *
 * @param {string} name tag名称
 * @return {string}
 */
exports.tagColor = function (name) {
    if (name) {
        return localTagsIndex[name];
    }
};

/**
 * 获取Todo列表数据
 *
 * @return {Promise}
 */
exports.todos = function () {
    var deferred = when.defer();

    if (!localTodos) {
        var listStr = localStorage.getItem('todo-list');
        localTodos = listStr ? JSON.parse(listStr) : [];
        localTodos.sort(function (a, b) {
            if (a.done === b.done) {
                return b.addTime - a.addTime;
            }
            else if (a.done) {
                return 1;
            }

            return -1;
        });
    }

    deferred.resolve(localTodos);
    return deferred.promise;
};

/**
 * 生成id，用于新建todo时
 *
 * @inner
 * @return {string}
 */
function genId() {
    return (new Date()).getTime() + '';
}

/**
 * 添加Todo项
 *
 * @param {Object} data Todo项数据
 * @return {Promise}
 */
exports.add = function (data) {
    var deferred = when.defer();

    exports.todos().then(function (list) {
        var item = {
            id: genId(),
            title: data.title,
            desc: data.desc,
            addTime: (new Date()).getTime()
        };

        if (data.tag) {
            item.tag = data.tag;
        }

        list.unshift(item);
        localStorage.setItem('todo-list', JSON.stringify(list));
        deferred.resolve(item);
    });

    return deferred.promise;
};

/**
 * 标识Todo项完成
 *
 * @param {string} id Todo项的id
 * @return {Promise}
 */
exports.done = function (id) {
    var deferred = when.defer();

    exports.todos().then(function (list) {
        list.forEach(function (item) {
            if (item.id === id) {
                item.done = true;
                return false;
            }
        });
        localStorage.setItem('todo-list', JSON.stringify(list));
        deferred.resolve();
    });

    return deferred.promise;
};

