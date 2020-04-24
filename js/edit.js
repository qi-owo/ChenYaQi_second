//获取
var editBtn = document.querySelector('.menu').firstElementChild;
var index = document.querySelector('.index');

//检测登录事件得到id
function getInfo(){
    axios.get('http://47.97.204.234:3000/user/state')
    .then(function(res){
        let id = res.data.userId;
        console.log(id);
    })
    .catch(function(error){
        console.log(error);
})
}

//点击编辑事件
editBtn.addEventListener('click',function () {
    editNow();
})
index.addEventListener('click',function(){
    editHidden();
})

//编辑出现
function editNow () {
    document.querySelector('.container-2').style.display = 'block';
    document.querySelector('main').style.display = 'none';
    index.parentElement.classList.remove('on');
    getInfo();
}
//编辑消失
function editHidden () {
    document.querySelector('.container-2').style.display = 'none';
    document.querySelector('main').style.display = 'flex';
    index.parentElement.classList.add('on');
}

//得到info
var userData;
function getInfo(){
    axios.get('http://47.97.204.234:3000/user/getInfo',{
        params: {
            userId: id
        }
    })
    .then(function(res){
        
        userData = res.data.info;

        console.log(userData);

        pullInfo(userData);
    })
    .catch(function(error){
        console.log(error);
})
}

//获取数据并加载到页面
var modify = document.querySelectorAll('.modify');
var box = document.querySelectorAll('.field-info');

function pullInfo(obj) {
    console.log(obj);
    var i = 0;
    for(let key in obj) {
        // if(i == 0) {
        //     document.querySelector('.real-pic').innerHTML = `<img src="${obj[key]}" alt="">`
        // }
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
var dir,content;
function alterInfo(){
    axios.post('http://47.97.204.234:3000/user/alterInfo',{
        userId: id,
        direction: dir,
        content: content
    })
    .then(function(res){
        var message = res.data.message;
        refreshData(message);
    })
    .catch(function(error){
        console.log(error);
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
                content = document.querySelector('#nickname').value;
                alterInfo();
                break;
            case 1:
                var obj = document.getElementsByName('gender'); 
                for(var i = 0; i < obj.length; i++) {
                    if(obj[i].checked) {
                        content = obj[i].value;
                    }
                }
                alterInfo();
                break;
            case 2:
                content = document.querySelector('#introduction').value;
                alterInfo();
                break;
            case 3:
                var index = document.querySelector('#trade').selectedIndex;
                content = document.querySelector('#trade').options[index].value;
                alterInfo();
                break;
            case 4:
                content = document.querySelector('#resume').value;
                alterInfo();
                break;
        }
    })
}

//修改后刷新
function refreshData(obj) {
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
function reData(obj) {
    box[obj].style.display = 'inline-block';
    modify[obj].classList.add('m-show');
    if( obj > 0 ) {
        fieldContent[obj-1].lastElementChild.style.display = 'none';
    } else {
        document.querySelector('.Field-name').style.display = 'none';
    }
}


        

