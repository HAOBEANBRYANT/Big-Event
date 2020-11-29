$(function () {
    // 请求分类下拉框 数据 并渲染页面
    initCate();
    //富文本编辑器
    initEditor();



    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChoose').on('click', () => {
        $('#coverFile').click();
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', changeImg)

    // 点击发布 和存为草稿  的绑定事件
    $('#btnDraft').on('click', publish)
    $('#btnOK').on('click', draft)

    //表单提交
    $('#form-pub').on('submit', doSubmit)
})

var srate = '已发布';

// 1. 初始化图片裁剪器
var $image = $('#image')

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}


// 请求分类下拉框 数据 并渲染页面
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            if (res.status != 0) return ('下拉获取失败')
            let strHtml = template('tpl-cate', res.data);
            $('select[name="cate_id"]').html(strHtml);
            layui.form.render();
        }
    })
}


// 选中文件
function changeImg(e) {
    // 获取到文件的列表数组
    let filelist = e.target.files;
    // 判断用户是否选择了文件
    if (filelist.length == 0) return layer.msg('请选择照片！');

    // 获取选中的第一个文件 信息对象
    let file = e.target.files[0]

    // 创建文件虚拟路径
    newImgURL = URL.createObjectURL(file)

    // 显示新图片：
    // 调用 裁剪组建  销毁之前的图片， 设置新的 虚拟路径给它 并创建新的裁剪区

    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

}
// 点击发布
function publish() {
    state = '已发布'
}
// 存为草稿 
function draft() {
    state = '草稿'
}

function doSubmit(e) {
    e.preventDefault();
    // 提取表单数据
    let fd = new FormData(this);
    // 把 state 追加进 fd
    fd.append('state', state)
    //将裁剪区域 输出为一个文件
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob);

            // 提交ajax
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success(res) {
                    layer.msg(res.message);
                    // console.log(res);
                    if (res.status != 0) return;
                    location = '/article/art-list.html'

                }
            })
        })



}