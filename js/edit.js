//获取
axios.defaults.baseURL = 'http://47.97.204.234:3000/';
var editBtn = document.querySelector('.menu').firstElementChild;
var index = document.querySelector('.index');

//点击编辑事件
editBtn.addEventListener('click',function () {
    editNow();
})
index.addEventListener('click',function () {
    editHidden();
})

//编辑出现
var menu = $('menu')[0];
function editNow () {
    document.querySelector('.container-2').style.display = 'block';
    document.querySelector('main').style.display = 'none';
    index.parentElement.classList.remove('on');
    menu.style.display = 'none';
    getInfo();
}
//编辑消失
function editHidden () {
    document.querySelector('.container-2').style.display = 'none';
    document.querySelector('main').style.display = 'flex';
    index.parentElement.classList.add('on');
    // NumAll();
}

//得到info
var userData;
function getInfo () {
    axios.get('user/getInfo',{
        params: {
            userId: id
        }
    })
    .then(function(res){
        userData = res.data.info;
        pullInfo(userData);
        window.localStorage.setItem('avatar',res.data.info.avatar);
    })
}

//获取数据并加载到页面
var modify = document.querySelectorAll('.modify');
var box = document.querySelectorAll('.field-info');

function pullInfo (obj) {
    userImg.innerHTML = `<img src="${obj.avatar}" alt="">`
    var i = 0;
    for(let key in obj) {
        if(i == 0) {
            document.querySelector('.real-pic').innerHTML = `<img src="${obj[key]}" alt="">`
        }
        if(i == 1) {
            box[i-1].innerHTML = obj[key] + '';
        }
        if(i >= 2 && i <= 6) {
            if (obj[key] == '') {
                box[i-1].innerHTML = '无';
            }else {
                box[i-1].innerHTML = obj[key] + '';
            }
        }
        i++;
    }
}

//修改用户信息
var dir,contentPlus;
function alterInfo () {
    axios.post('user/alterInfo',{
        userId: id,
        direction: dir,
        content: contentPlus
    })
    .then(function(res){
        var message = res.data.message;
        refreshData(message);
    })
}

//点击修改
var fieldContent = document.querySelectorAll('.Field-content');
var cancelBtn = document.querySelectorAll('.cancelBtn');
var saveBtn = document.querySelectorAll('.saveBtn');
var num;

//点击修改按钮
for( let i = 0; i < modify.length; i++) {
    modify[i].addEventListener('click',function () {

        num = i;

        switch(i) {
            case 0:
                document.getElementById('nickname').value = box[i].innerHTML;
            case 2:
                document.getElementById('introduction').value = box[i].innerHTML;
            case 4:
            document.getElementById('resume').value = box[i].innerHTML;
        }

        box[i].style.display = 'none';
        this.classList.remove('m-show');
        if( i > 0 ) {
            fieldContent[i-1].lastElementChild.style.display = 'block';
        } else {
            document.querySelector('.Field-name').style.display = 'block';
        }
    })

    //点击取消
    cancelBtn[i].addEventListener('click', function(){
        var index = i;
        reData(i);
    })
}

//正式提交
for(var i = 0; i < saveBtn.length; i++) {
    //点击确定
    var index;
    saveBtn[i].setAttribute('index',i);
    saveBtn[i].addEventListener('click',function(){

        dir = + this.getAttribute('index');
        
        switch(dir) {
            case 0:
                contentPlus = document.querySelector('#nickname').value;
                alterInfo();
                break;
            case 1:
                var obj = document.getElementsByName('gender'); 
                for(var i = 0; i < obj.length; i++) {
                    if(obj[i].checked) {
                        contentPlus = obj[i].value;
                    }
                }
                alterInfo();
                break;
            case 2:
                contentPlus = document.querySelector('#introduction').value;
                alterInfo();
                break;
            case 3:
                var index = document.querySelector('#trade').selectedIndex;
                contentPlus = document.querySelector('#trade').options[index].value;
                alterInfo();
                break;
            case 4:
                contentPlus = document.querySelector('#resume').value;
                alterInfo();
                break;
        }
    })
}

//修改后刷新
function refreshData (obj) {
    getInfo();
    switch (obj) {
        case "修改昵称成功":
            reData(0);
            break;
        case "修改性别成功":
            reData(1);
            break;
        case "修改一句话介绍成功":
            reData(2);
            break;
        case "修改所在行业成功":
            reData(3);
            break;
        case "修改个人简介成功":
            reData(4);
            break;
    }
}

//恢复原来状态（退出编辑状态）的函数
function reData (obj) {
    box[obj].style.display = 'inline-block';
    modify[obj].classList.add('m-show');
    if( obj > 0 ) {
        fieldContent[obj-1].lastElementChild.style.display = 'none';
    } else {
        document.querySelector('.Field-name').style.display = 'none';
    }
}


//简化代码
var $ = document.getElementsByClassName.bind(document);

//修改头像
var tx = document.getElementById('tx');

//
var userImg = $('user-self')[0];
function alterAvatar(formData, config) {
    axios.post('user/alterAvatar',formData,config,{
        widthCredentials: true
    })
    .then(function(res){
        alert('修改成功！')
        preview.style.display = 'none';
        getInfo();
    })
    .catch(function(error){
        alert('修改失败！');
    })
}


tx.onchange = function () {
    //创建空表单对象
    var formData = new FormData();
    //将二进制文件追加到表单对象中
    formData.append('img', this.files[0]);
    let config = {
        headers:{'Content-Type':'multipart/form-data'}
    }
    var url = window.URL.createObjectURL(this.files[0]);
    previewImg(url,formData, config);
}

//预览
var preview = $('preview')[0];
var previewBox = $('previewBox')[0];
var previewBack = $('previewBack')[0];
function previewImg (obj, formData, config) {
    preview.style.display = 'block';
    previewBox.innerHTML = `<img src="${obj}" alt="">`
    let confirmAvatar = $('confirmAvatar')[0];
    confirmAvatar.addEventListener('click',function(){
        alterAvatar(formData, config);
    }) 
}

//关闭
previewBack.addEventListener('click',function(){
    preview.style.display = 'none';
})
preview.addEventListener('click',function(){
    this.style.display = 'none';
})

//阻止事件冒泡
var previewW= $('preview-w')[0];
previewW.addEventListener('click',function(e){
    e = e || window.event;
    e= e || window.event;
    if(e.cancelBubble)
        e.cancelBubble = true;
    else
        e.stopPropagation();
})


