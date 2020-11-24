// 页面上所有基于jquery的ajax请求之前 预加载一下

$.ajaxPrefilter(function (ajaxOpt) {
    // 拼接基地址
    ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url
})