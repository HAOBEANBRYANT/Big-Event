$(function () {
    getUserinfo();

    $('#btnlogout').on('click', logout)
})

function getUserinfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: { Authorization: localStorage.getItem('token') },
        success(res) {
            // console.log(res);
            if (res.status != 0) return alert(res.message)
            randerAvatar(res)

        }
    })
}

function randerAvatar(res) {
    let userName = res.data.nickname || res.data.username;
    // console.log(userName);

    $('#welcome').html('你好&nbsp;&nbsp;' + userName)
    if (res.data.user_pic == null) {
        $('.layui-nav-img').hide();
        let firstname = userName[0].toUpperCase()
        // console.log(firstname);

        $('.text-avatar').text(firstname)
    } else {
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', res.data.user_pic)
    }
}

function logout() {
    layer.confirm('你确定要退出吗?', { icon: 3, title: '提示' }, function (index) {
        //do something
        localStorage.removeItem('token');
        location = './login.html'

        layer.close(index);
    });
}