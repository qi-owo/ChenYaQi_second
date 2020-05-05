//简化代码
var $ = document.getElementsByClassName.bind(document);
var userId;

//从服务器端获取数据
function friendList(userId) {
    axios.get('http://47.97.204.234:3000/user/friendList',{
        params: {
            userId: userId
        }
    })
    .then(function(res) {
        console.log(res);
        if(res.data.message == '获取好友列表成功') {
            loadFriendsList(res.data.friends);
        }
    })
}

//获取id
function stateTest(){
    axios.get('http://47.97.204.234:3000/user/state',{
        widthCredentials: true
    })
    .then(function(res){
        console.log(res.data);
        if(res.data.message === '目前处于登录状态') {
            userId = res.data.userId; //记录id
            getMessage() //记得删除
        }
    })
    .catch(function(error){
        console.log(error);
    })
}

//获取
var body = document.getElementsByTagName('body')[0];
var messageBtn = $('message-btn')[0];
var message = $('user-message')[0];
var notice = $('notice')[0]; //大盒子
var noticeUl = $('notice-ul')[0];
var noticeLi = $('notice-li');
console.log('noticeLi: ', noticeLi);
var friendImg = $('friendImg');
var messageName = $('message-name');
var messageText = $('message-text');

//点击时向服务器获取数据
messageBtn.addEventListener('click',function(e){
    notice.style.display = 'block';
    stateTest();
    friendList(userId);
})

//阻止冒泡
message.addEventListener('click',function(e){
    e= e || window.event;
    if(e.cancelBubble)
        e.cancelBubble = true;
    else
        e.stopPropagation();
})

//点击空白处消失
body.addEventListener('click',function(){
    notice.style.display = 'none';
    menu.style.display = 'none';
})

//获取数据后加载,arr是好友数据
function loadFriendsList(arr) {
    //添加li
    if(noticeLi.length < arr.length) {
        for(let i = noticeLi.length; i < arr.length; i++) {
            let li = noticeLi[0].cloneNode(true);
            noticeUl.appendChild(li);
        }
    }
    //加载信息
    for(let i = 0; i < arr.length; i++) {
        friendImg[i].innerHTML = `<img src="${arr[i].avatar}" alt="">`;
        messageName[i].innerHTML = `${arr[i].nickname}`;
        // messageText[i].innerHTML = `${arr[i].introduction}`;
    }
}

//我的点击事件
var userSelf = $('user-self')[0];
var menu = $('menu')[0];

//添加点击事件
userSelf.addEventListener('click',function(e){
    e= e || window.event;
    if(e.cancelBubble)
        e.cancelBubble = true;
    else
        e.stopPropagation();
    let flag = menu.style.display;
    if(flag === 'none' || flag === '') {
        menu.style.display = 'block';
    }else{
        menu.style.display = 'none';
    }
    notice.style.display = 'none';
})

//阻止冒泡
menu.addEventListener('click',function(e){
    e= e || window.event;
    if(e.cancelBubble)
        e.cancelBubble = true;
    else
        e.stopPropagation();
})

//加载好友消息
function getMessage(){
    axios.get('http://47.97.204.234:3000/chat/getMessage',{
        params: {
            userId: userId
        }
    })
    .then(function(res){
        console.log(res);
    })
    .catch(function(error){
        console.log(error);
    })
}
