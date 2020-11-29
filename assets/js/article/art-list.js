let q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
}

$(function () {
    // 修该时间格式
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        let y = padZero(dt.getFullYear());
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 渲染列表
    initArtList();

    //分类下拉
    initCate();

    //为表单绑定submit事件
    $('#form-search').on('submit', search)

    // 为表单绑定删除事件
    $("tbody").on('click', '.btn-delete', del)
})

// 补零
function padZero(n) {
    return n > 9 ? n : 'o' + n;
}

// 加载文章列表
function initArtList() {
    $.ajax({
        method: 'get',
        url: '/my/article/list',
        data: q,
        success(res) {
            if (res.status != 0) return;
            let strHtml = template('tpl-art', res)
            $('tbody').html(strHtml);

            //调用生成页码条方法
            renderPage(res.total)
        }
    })
}

// 初始化文章分类的方法
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            console.log(res);
            if (res.status != 0) return;
            let strHtml = template('tpl-cate', res.data);
            $('select[name="cate_id"]').html(strHtml);
            //通知layui重新渲染下拉框 和其他表单元素
            layui.form.render();
        }
    })
}

// 查询时间处理啊函数
function search(e) {
    e.preventDefault();

    q.cate_id = $('select[name="cate_id"]').val();
    q.state = $('select[name="state"]').val();

    initArtList();

}

// 渲染分页的方法
function renderPage(total) {
    layui.laypage.render({
        elem: 'pageBox', // 分页容器的id
        count: total, // 数据总数
        curr: q.pagenum, //获取起始页
        limit: q.pagesize, // 总容量
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 页码条功能
        limits: [2, 3, 5, 10],  //页容量选项
        // 页码发生切换 触发jump函数
        jump(obj, first) {
            // 把最新的页码赋值给pagenum
            q.pagenum = obj.curr;

            q.pagesize = obj.limit;  // 获取下拉框中选中的页容量 设置给分页查询参数


            if (!first) {
                initArtList()
            }

        }
    })
}

// 删除业务
function del() {
    let id = this.dataset.id;
    // 获取删除按钮的个数
    let rows = $('tboby tr .btn-delete').length
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除文章失败！')
                }
                layer.msg('删除文章成功！')
                // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                // 如果没有剩余的数据了, 则让页码值 - 1 之后,
                // 再重新调用 initTable 方法
                if (rows == 1) {
                    // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                    // 页码值最小必须是 1
                    q.pagenum = q.pagenum <= 1 ? 1 : q.pagenum - 1;
                    console.log(q.pagenum);


                }
                initArtList();
            }
        })

        layer.close(index)
    })
}