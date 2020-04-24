//获取
var withPhone = document.querySelector('.un-password');
var withId = document.querySelector('.password');
var loginNav = document.querySelectorAll('.login-nav span');

//切换状态
loginNav[0].addEventListener('click',function(){
    loginNav[0].classList.add('active');
    loginNav[1].classList.remove('active');
    withPhone.style.display = 'block';
    withId.style.display = 'none';
})
    
loginNav[1].addEventListener('click',function(){
    loginNav[1].classList.add('active');
    loginNav[0].classList.remove('active');
    withId.style.display = 'block';
    withPhone.style.display = 'none';
})

//获取用户名和密码,ID
var login = document.querySelector('#user-login');
var name,word;

//登陆检测
var flag,id;
function stateTest(){
    axios.get('http://47.97.204.234:3000/user/state')
    .then(function(res){
        console.log(res);
        flag = res.data.result;
        if(flag === 'success') {
            id = res.data.userId;
            showPage();
        }
    })
    .catch(function(error){
        console.log(error);
})
}

//如果页面登陆就不用再登录了
window.onload = function(){
    stateTest();
}

axios.defaults.withCredentials=true; //cookie
//登录
login.addEventListener('click', function(){
    name = document.querySelector('#userId').value;
    word = document.querySelector('#user-word').value;
    if(name == "" || name == null) {
        alert("用户名为空");
        return;
    }else if(word == "" || word == null){
        alert("密码为空");
        return;
    }else{
        loginNow();    
    }

})
function loginNow(){
    axios.post('http://47.97.204.234:3000/user/login',{
        username: name+'',
        password: word+''
    },{
        widthCredentials: true //cookie
    })
    .then(function(res){
        console.log(res);
        if(res.data.message === '此账号已经登录'||res.data.result === 'success') {
            stateTest();
            showPage();
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
    hiddenPage();
})

function logOut(){
    axios.post('http://47.97.204.234:3000/user/logout',{
        username: name+'',
        password: word+''
    })
    .then(function(res){
        console.log(res);
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
    //初始化加载5个
    getArticle(id,0,5);
}
//隐藏主页
function hiddenPage() {
    document.querySelector('.container-2').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.login').style.display = 'block';
}

