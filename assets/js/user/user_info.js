$(function () {
    // 为layui添加校验规则
    layui.form.verify({
        nickname: [/^\S{2,12}$/, '昵称必须在2-12个字符之间~']
    });

    // 加载用户基本信息
    innitUserInfo();
    //重置表单数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        innitUserInfo()
    })

    $('.layui-form').on('submit', submitData)
})

function innitUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success(res) {
            if (res.status != 0) return layer.msg('获取信息失败');
            console.log(res);
            layui.form.val('userForm', res.data);
        }
    })
}

function submitData(e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success(res) {
            if (res.status != 0) return layer.msg(res.message);
            console.log(res);
            //如果没有错误 则通过window。parent  window.top 调用父页面的方法
            window.top.getUserinfo();
        }
    })
}