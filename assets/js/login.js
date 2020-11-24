$(function () {
    // 点击注册账号的来连接-------------------------
    $('#link-reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link-login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //    为 登陆添加表单验证规则-------------------
    layui.form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格!!!'
        ],
        repwd: function (value) {
            let pwd1 = $('.reg-box [name=password]').val();
            // console.log(value);
            // console.log(pwd1);

            if (value != pwd1) return '两次不一样'
        }
    });

    // 监听注册表单事件-----------------------------
    $('#regform').on('submit', submitData);

    // 监听登陆表单事件-----------------------------
    $('#loginform').on('submit', submitLogin)
})

// 根路径
// let baseUrl = 'http://ajax.frontend.itheima.net'

function submitData(e) {
    e.preventDefault(); //阻止表单默认提交
    // 获取表单数据
    let data = $(this).serialize();
    // console.log(data);


    // 发送ajax请求
    $.ajax({
        method: 'POST',
        url: '/api/reguser',
        data: data,
        success(res) {
            // 无论错对都打印
            layui.layer.msg(res.message);
            if (res.status != 0) return;

            // 将用户名和密码自动填入登陆页面
            let uname = $('.reg-box [name=username]').val().trim();
            let upassword = $('.reg-box [name=password]').val().trim();

            $('.login-box [name=username]').val(uname);
            $('.login-box [name=password]').val(upassword);
            // 清空表单
            $('#regform')[0].reset();

            // 跳转
            $("#link-login").click();

        }
    })
}

function submitLogin(e) {
    e.preventDefault();
    let loginData = $(this).serialize();

    $.ajax({
        method: 'POST',
        url: '/api/login',
        data: loginData,
        success(res) {
            console.log(res);
            if (res.status != 0) return layer.msg(res.message)

            layer.msg(res.message, {
                icon: 6,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                //保存token
                localStorage.setItem('token', res.token)
                // 跳转
                location = '/index.html'
            });


        }
    })
}