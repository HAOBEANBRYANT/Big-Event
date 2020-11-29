$(function () {
    innitArticleList();

    $('#btnaddCate').on('click', showWindow);
    // 新增表单 提交事件
    $('body').on('submit', '#form-add', doAdd);
    // 删除按钮 点击事件
    $("tbody").on('click', '.btn-delete', doDelete);
    // 编辑按钮 点击事件
    $('tbody').on('click', '.btn-edit', doEdit);

})

// 保存弹出层的id 用于等下关闭
let layerID = null;
// 渲染
function innitArticleList() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success(res) {
            console.log(res);

            let strHtml = template('tpl-catse', res)
            $('tbody').html(strHtml);

        }
    })
}
// 显示新新增窗口
function showWindow() {
    // 保存弹出层的id
    layerID = layer.open({
        type: 1,
        area: ['500px', '300px'],
        title: '添加文章分类',
        content: $('#tpl-window').html() //这里content是一个普通的String
    });
}

// 新增事件
function doAdd(e) {
    e.preventDefault();
    let title = $('.layui-layer-title').text();
    if (title === '添加文章分类') {
        let datastr = $(this).serialize();
        datastr = datastr.replace('Id=&', '');
        console.log(datastr);
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: datastr,
            success(res) {
                layer.msg(res.message)
                if (res.status != 0) return;

                innitArticleList();
                // 关闭弹出框
                layer.close(layerID);
            }
        })
    } else {
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                layer.msg(res.message);
                if (res.status != 0) return;

                innitArticleList();
                // 关闭弹出框
                layer.close(layerID);
            }
        })
    }

}

// 执行删除
function doDelete() {
    let id = this.getAttribute('data-id');

    layer.confirm('亲 确定要删除🐎？', function (index) {
        //do something
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success(res) {
                // console.log(res);
                layer.msg(res.message);
                if (res.status != 0) return;
                innitArticleList();
            }
        })

        layer.close(index);
    });


}

// 执行编辑
function doEdit() {
    console.log('ok');
    let id = this.dataset.id;
    layerID = layer.open({
        type: 1,
        area: ['500px', '300px'],
        title: '编辑文章分类',
        content: $('#tpl-window').html() //这里content是一个普通的String
    });
    $.ajax({
        method: 'GET',
        url: '/my/article/cates/' + id,
        success(res) {
            console.log(res);

            layui.form.val('form-edit', res.data);
        }

    })
}