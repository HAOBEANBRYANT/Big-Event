// 页面上所有基于jquery的ajax请求之前 预加载一下

$.ajaxPrefilter(function (ajaxOpt) {
    // 拼接基地址
    ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url

    // 为所有 / my / 请求添加 token
    if (ajaxOpt.url.indexOf('/my/') > -1) {
        ajaxOpt.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    // 为所有的ajax请求 添加comeplate 函数
    ajaxOpt.complete = function (res) {
        console.log(res);

        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            layer.msg(res.responseJSON.message, {
                icon: 1,
                time: 1500 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                //do something
                // 清空token
                localStorage.removeItem('token');
                console.log('res');
                // 跳转登陆页面
                location = './login.html';
            });
        }
    }

})