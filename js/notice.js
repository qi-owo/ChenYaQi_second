//简化代码
var $ = document.getElementsByClassName.bind(document);
var userId;
var friendsArr; //储存好友列表的信息
axios.defaults.baseURL = 'http://47.97.204.234:3000/';

//从服务器端获取数据，登录后获取
function friendList(userId) {
    axios.get('user/friendList',{
        params: {
            userId: userId
        }
    })
    .then(function(res) {
        if(res.data.message == '获取好友列表成功') {
            friendsArr = res.data.friends;
            loadFriendsList(friendsArr);
        }
    })
}

//获取id
function stateTest(){
    axios.get('http://47.97.204.234:3000/user/state',{
        widthCredentials: true
    })
    .then(function(res){
        if(res.data.message === '目前处于登录状态') {
            userId = res.data.userId; //记录id
            // getMessage() //记得删除
        }
    })
}

//获取
var body = document.getElementsByTagName('body')[0];
var messageBtn = $('message-btn')[0];
var message = $('user-message')[0];
var notice = $('notice')[0]; //大盒子
var noticeUl = $('notice-ul')[0];
var noticeLi = $('notice-li');
var friendImg = $('friendImg');
var messageName = $('message-name');
var messageText = $('message-text');
//聊天相关
var chat = $('chat');
var chatClose = $('chat-close');
var chatTitle = $('chat-title');
var chatArea = $('chat-area');
var chatEdit = $('chat-edit');
var chatBtn = $('chat-send');
var chatEdit = $('chat-edit');

//点击时向服务器获取数据
messageBtn.addEventListener('click',function(){
    notice.style.display = 'block';
    stateTest();
    // friendList(userId);
    initChat();
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
var friends;
function loadFriendsList(arr) {
    //添加li
    if(noticeLi.length < arr.length) {
        for(let i = noticeLi.length; i < arr.length; i++) {
            let li = noticeLi[0].cloneNode(true);
            noticeUl.appendChild(li);
            let chat = $('chat')[0].cloneNode(true);
            $('chatBox')[0].appendChild(chat);
        }
    }
    //加载信息
    for(let i = 0; i < arr.length; i++) {
        friendImg[i].innerHTML = `<img src="${arr[i].avatar}" alt="">`;
        messageName[i].innerHTML = `${arr[i].nickname}`;
        noticeLi[i].setAttribute('data-userId',arr[i].userId);
        chat[i].setAttribute('data-userId',arr[i].userId);
        //显示好友名字
        chatTitle[i].innerText = friendsArr[i].nickname;
    }
}

//我的点击事件
var userSelf = $('user-self')[0];
var menu = $('menu')[0];

//添加点击事件
userSelf.addEventListener('click',function(e){
    var e = e || window.event;
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

/*
聊天功能
*/
//初始化click事件
function initChat() {
    // 点击事件
    for(let i = 0; i < noticeLi.length; i++) {
        noticeLi[i].addEventListener('click',function() {
            //出现对应的聊天框盒子,同时聚焦
            chat[i].style.display = 'block';
            chatEdit[i].focus();
            //去掉新消息提示
            noticeLi[i].classList.remove('new');
            //调整聊天距离
            chatArea[i].scrollTop = chatArea[i].scrollHeight;
        })
        chatClose[i].addEventListener('click',function(){
            chat[i].style.display = 'none'
        })
        // 阻止事件冒泡
        chat[i].addEventListener('click',function(e){
            e = e || window.event;
            if(e.cancelBubble)
                e.cancelBubble = true;
            else
                e.stopPropagation();
        })
        chatBtn[i].addEventListener('click',function() {
            let content = chatEdit[i].value;
            if(content != '') {
                sentMessageLoad(content, i); //服务器处理前先出现
                let friendId = chat[i].getAttribute('data-userId');
                sendMessage(userId, friendId, content);
            }
        })
    }
}

// 发送消息给服务器端
function sendMessage(userId, friendId, content) {
    axios.post('chat/sendMessage',{
        userId: userId,
        friendId: friendId,
        content: content
    })
}

//发送消息
function sentMessageLoad(content, index) {
    //克隆并添加
    let chatR = $('chat-wrap-r')[0].cloneNode(true);
    chatArea[index].appendChild(chatR);
    //渲染聊天内容
    let chatTime = chatR.getElementsByClassName('chat-time')[0];
    let chatImg = chatR.getElementsByClassName('chat-img')[0];
    let chatText = chatR.getElementsByClassName('chat-text')[0];
    //头像和文字,时间
    let avatar = window.localStorage.getItem('avatar');
    chatImg.innerHTML = `<img src="${avatar}" alt="">`;
    chatText.innerText = content;
    chatTime.innerHTML = timeToNormal();
    //清空编辑框
    chatEdit[index].value = '';
    chatEdit[index].focus(); //自动聚焦
    //调整聊天距离
    chatArea[index].scrollTop = chatArea[index].scrollHeight;
}

//定时从服务器获取消息,并渲染
var messageTimer;
function getMessageAuto(userId) {
    messageTimer = setInterval(function(){
        axios.get('chat/getMessage',{
            params: {
                userId: userId
            }
        })
        .then(function(res) {
            if(res.data.message == '获取成功') {
                //右上角显示小红点
                $('notice-dot')[0].style.display = 'block';
                //把数据保存在盒子里
                let messages = res.data.newMessages;
                let senderId = messages.map(function(item){
                    return item.senderId;
                })
                //把聊天盒子转换成数组
                let chatArr = Array.from(chat);
                chatArr.forEach(function(value, index) {
                    senderId.forEach(function(item, num) {
                        //如果发送者的id和盒子id一样，就把内容添加进去
                        if(chat[index].getAttribute('data-userId') === item) {
                            //克隆并添加
                            let chatL = $('chat-wrap-l')[0].cloneNode(true);
                            chatArea[index].appendChild(chatL);
                            // 好友旁边出现new的提示
                            if(chat[index].style.display != 'block') {
                                noticeLi[index].classList.add('new');
                            }
                            
                            // let first = friendsArr.splice(i, 1);
                            // friendsArr.unshift(first[0]);
                            //渲染数据,num是接受数据的序号，index是整个li列表的序号
                            let chatTime = chatL.getElementsByClassName('chat-time')[0];
                            let chatImg = chatL.getElementsByClassName('chat-img')[0];
                            let chatText = chatL.getElementsByClassName('chat-text')[0];
                            chatTime.innerHTML = timeToNormal(messages[num].time);
                            chatText.innerText = messages[num].content;
                            chatImg.innerHTML = `<img src="${friendsArr[index].avatar}" alt="">`;
                            if(index != 0) {
                                //置顶聊天框,chat也要变才能匹配
                                stickyMsg(noticeLi, noticeUl, index);
                                stickyMsg(chat, $('chatBox')[0], index);
                                if(notice.style.display == 'block') {
                                    initChat();
                                }
                                let first = friendsArr.splice(index, 1);
                                friendsArr.unshift(first[0]);
                            }
                            chatArea[0].scrollTop = chatArea[0].scrollHeight;
                        }
                    })
                })
            }
            else if(res.data.message === '暂时没有新消息噢~') {
                for(let i = 0; i < noticeLi.length; i++) {
                    if(noticeLi[i].getAttribute('class').indexOf('new') > -1) return;
                    // 没有的话继续执行
                    $('notice-dot')[0].style.display = 'none';
                }
            }
        })
    },5000)
}

// 聊天消息置顶，更换原有的数组和聊天盒子位置
// obj是需要更换顺序的伪数组，target是父元素，index是更换的序号
function stickyMsg(obj, target, index) {
    let oli = obj[index].cloneNode(true);
    obj[index].remove();
    target.insertBefore(oli, target.firstElementChild);
}

// 时间转换函数，utz时间精确到秒,无传参就输出当前时间
function timeToNormal(obj) {
    var now, hour;
    if(typeof(obj) == "undefined") {
        //获取当前时间
        now = new Date();
        hour = now.getHours();//得到小时
    }else{
        var date= new Date(Date.parse(obj.replace(/-/g,  '/').replace(/T/g, ' ').replace(/Z/g, ' ').substring(0,19)));
        now = date;
        hour = now.getHours() + 8;//得到小时
    }
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    var day = now.getDay();//得到周几
    var min = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;
    var time = "";
    //精确到天
    // time = year + "-" + month + "-" + date;
    //精确到分
    time = year + "-" + month + "-" + date+ " " + hour + ":" + min + ":" + sec;
    return time;
}