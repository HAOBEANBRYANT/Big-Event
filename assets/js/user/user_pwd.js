$(function () {
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格哦~'],
        newpwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样哦~'
            }
        },
        confirmpwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一样哦~'
            }
        }
    })

    $('.layui-form').on('submit', pwdChange)

})

function pwdChange(e) {
    e.preventDefault();

    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success(res) {
            if (res.status != 0) return layer.msg(res.message);
            layer.msg('修改密码成功', {
                icon: 6,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                //do something
                localStorage.removeItem('token');
                window.top.location = '/login.html'
            });
        }
    })
}