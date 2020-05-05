//获取用户名和密码,ID
var login = document.querySelector('#user-login');
var userName = document.querySelector('#userId');
var userWord = document.querySelector('#user-word');

axios.defaults.withCredentials=true; //cookie

//登陆检测
var flag,id;
function stateTestLogin(){
    axios.get('http://47.97.204.234:3000/user/state',{
        widthCredentials: true
    })
    .then(function(res){
        console.log(res.data);
        flag = res.data.message;
        if(flag === '目前处于登录状态') {
            id = res.data.userId;
            stateTest(); //目的获取id
            showPage();
        }
    })
    .catch(function(error){
        console.log(error);
})
}

//如果页面登陆就不用再登录了
window.onload = function(){
    stateTestLogin();
}

var password = document.querySelector('.password');
var inputTest = document.getElementsByClassName('input-test')[0];

password.addEventListener('click',function(e) {
    var e = e || window.event;
    var target = e.target;
    if(target.id == 'userId' || target.id == 'user-word') {
        inputTestNow(target);
    }
})

//登录检测表单
var name, word;
function inputTestNow(obj) {
    name = document.querySelector('#userId').value;
    word = document.querySelector('#user-word').value;
    obj.onblur = function() {
        if(obj.value == '') {
            inputTest.style.display = 'block';
            inputTest.innerHTML = '用户名或密码不能为空！'
        }else{
            inputTest.style.display = 'none';
        }
    }
}

login.addEventListener('click', function(){
    name = document.querySelector('#userId').value;
    word = document.querySelector('#user-word').value;
    if(name == "" || name == null) {
        return;
    }else if(word == "" || word == null){
        return;
    }else{
        console.log(123);
        loginNow();
    }
})

function loginNow(){
    axios.post('http://47.97.204.234:3000/user/login',{
        username: name+'',
        password: word+''
    },{
        widthCredentials: true
    })
    .then(function(res){
        console.log(res);
        if(res.data.message === '此账号已经登录'||res.data.message === '登录成功') {
            window.localStorage.setItem('account',name);
            window.localStorage.setItem('password',word);
            // stateTest();
            // showPage();
            stateTestLogin();
        }else if (res.data.message === '密码错误') {
            inputTest.style.display = 'block';
            inputTest.innerHTML = '密码错误';
        }else if (res.data.message === '该账号不存在') {
            inputTest.style.display = 'block';
            inputTest.innerHTML = '该账号不存在';
        }
    })
    .catch(function(error){
        console.log(error);
    })
}

//退出
var logoutBtn = document.querySelector('.icon-tuichu1').parentElement;
logoutBtn.addEventListener('click',function(){
    logOut();
})

function logOut(){
    let account = window.localStorage.getItem('account');
    let password = window.localStorage.getItem('password');
    axios.post('http://47.97.204.234:3000/user/logout',{
        username: account,
        password: password
    },{
        widthCredentials: true
    })
    .then(function(res){
        hiddenPage();
        console.log(res.data);
        if(res.data.message == '退出登录成功') {
            location.reload();
            storage.clear();//删除
        }
    })
    .catch(function(error){
        console.log(error);
    })
}

//显示主页
function showPage() {
    document.querySelector('.container-2').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    document.querySelector('main').style.display = 'flex';
    document.querySelector('.login').style.display = 'none';
    getArticle(id,0,18);
    (function avatar(){
        axios.get('http://47.97.204.234:3000/user/getInfo',{
        params: {
            userId: id
        }
        })
        .then(function(res){
            var obj = res.data.info.avatar;
            document.querySelector('.user-self').innerHTML = `<img src="${obj}" alt="">`
        })
        .catch(function(error){
            console.log(error);
        })
    })();
}
//隐藏主页
function hiddenPage() {
    document.querySelector('.container-2').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.login').style.display = 'block';
}