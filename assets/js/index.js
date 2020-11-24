$(function () {
    getUserinfo();

    $('#btnlogout').on('click', logout)
})

function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success(res) {
            console.log(res);

            if (res.status != 0) return layui.layer.msg(res.message)
            // 渲染用户信息
            randerAvatar(res.data);
        }
    })
}

function randerAvatar(userData) {
    // 获取用户名
    let userName = userData.nickname || userData.username;
    $("#welcome").html('欢迎&nbsp;&nbsp;' + userName);
    // 按需渲染用户头像
    if (userData.user_pic != null) {
        $('.layui-nav-img').attr('src', userData.user_pic);
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide();
        // 获取字符
        let firstName = userName[0].toUpperCase();
        $('.text-avatar').text(firstName);

    }
}


function logout() {
    layui.layer.confirm('你确定退出吗', { icon: 3, title: '提示' }, function (index) {
        //do something
        localStorage.removeItem('token');
        location = './login.html';
        layer.close(index)

    })
}