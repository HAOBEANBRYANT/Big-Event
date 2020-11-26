$(function () {
    // 初始化 设置头像插件
    Cropper()

    //为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', chooseFile)
    // 选择文件
    $('#file').on('change', changeImg)
    //确认文件
    $('#btnUpload').on('click', Upload)
})
var newImgURL = null;
var $image = null;
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 裁剪插件
function Cropper() {
    // 1.1 获取裁剪区域的 DOM 元素
    $image = $('#image')
    // 1.2 配置选项


    // 1.3 创建裁剪区域
    $image.cropper(options)
}

// 选择文件
function chooseFile() {
    $('#file').click()
}

// 选中文件
function changeImg(e) {
    let filelist = e.target.files;

    if (filelist.length == 0) return layer.msg('请选择照片！');



    // 获取选中的第一个文件 信息对象
    let file = e.target.files[0]
    console.log(file);
    // 创建文件虚拟路径
    newImgURL = URL.createObjectURL(file)
    console.log(newImgURL);
    // 显示新图片：
    // 调用 裁剪组建  销毁之前的图片， 设置新的 虚拟路径给它 并创建新的裁剪区

    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

}

//确认上传
function Upload() {
    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL,
        },

        success(res) {
            if (res.status != 0) return layer.msg(res.message);
            layer.msg(res.message);
            window.top.getUserinfo();
            // $('#image').attr('src', newImgURL);
        }
    })
}