//简化代码
var $ = document.getElementsByClassName.bind(document);

//全局变量
var article; //返回的是获取到的文章数组
var userId; //当前用户的Id
var start = 0;
var stop = 18;
var Box = $('article-item');

//检测登录状态,用来记录ID的，调用发生在login
function stateTest(){
    axios.get('http://47.97.204.234:3000/user/state',{
        widthCredentials: true
    })
    .then(function(res){
        console.log(res.data);
        if(res.data.message === '目前处于登录状态') {
            userId = res.data.userId; //记录id
        }
    })
    .catch(function(error){
        console.log(error);
    })
}

//获取文章
function getArticle(userId,start,stop) {
    axios.get('http://47.97.204.234:3000/article/getArticles',{
        params: {
            userId: userId,
            start: start,
            stop: stop
        }
    })
    .then(function(res){
        console.log(res);
        article = res.data.articles;
        if(Box.length < article.length) {
            for(let i = Box.length; i <= article.length; i++) {
                let box = Box[0].cloneNode(true);
                box.style.display = 'block';
                articleW.appendChild(box);
            }
        }
        loadArticles(article);
        loadActions(article, 0);
    })
    .catch(function(error){
        console.log(error);
    })
}

//点赞文章或者取消点赞
function likeArticle (userId, articleId, like, index) {
    axios.post('http://47.97.204.234:3000/article/likeArticle',{
        userId: userId,
        articleId: articleId,
        like: like
    })
    .then(function(res){
        console.log(res.data);
        if(res.data.message == '点赞成功' || res.data.message == '取消点赞成功') {
            getArticle(userId, start, stop);
            loadActions(article[index],index);
        }
    })
    .catch(function(error){
        console.log(error);
    })
}

//点踩文章或者取消点踩
function dislikeArticle (userId, articleId, dislike, index) {
    axios.post('http://47.97.204.234:3000/article/dislikeArticle',{
        userId: userId,
        articleId: articleId,
        dislike: dislike
    })
    .then(function(res){
        console.log(res.data);
        if(res.data.message == '点踩成功' || res.data.message == '取消点踩成功') {
            getArticle(userId, start, stop);
            loadActions(article[index],index);
        }
    })
    .catch(function(error){
        console.log(error);
})
}

//获取评论
var dataIndex = []; //dataIndex[num]是第num篇文章的评论数据
function getComments (userId, articleId, index) {
    axios.get('http://47.97.204.234:3000/article/getComments',{
        params: {
            userId: userId,
            articleId: articleId
        }
    })
    .then(function(res){
        console.log(res.data.comments);
        dataIndex[index] = res.data.comments;
        if(res.data.message == '请求成功' || res.data.message == '该文章没有评论') {
            loadComments(res.data.comments,index);
            load[index].style.display = 'none';
            commentFooterPlus[index].style.display = 'flex';
        }
    })
}

//post评论
function commentNow (userId, articleId, content, index) {
    axios.post('http://47.97.204.234:3000/article/comment',{
        userId: userId,
        articleId: articleId,
        content: content
    })
    .then(function(res) {
        console.log(res.data);
        if(res.data.message == '评论成功') {
            alert('评论成功！')
            getComments(userId, articleId, index);
            commentPut[index].value = '';
        }
    })
    .catch(function(error) {
        console.log(error);
    })
}

//删除评论
function deleteComment (userId, commentId, obj, articleId, index) {
    axios.delete('http://47.97.204.234:3000/article/deleteComment',{
        data: {
            userId: userId,
            commentId: commentId
        }
    })
    .then(function(res){
        obj.remove();
        getComments(userId, articleId, index);
    })
    .catch(function(error){
        console.log(error);
    })
}

//点赞评论或者取消点赞
function likeComment (userId, commentId, like, index) {
    axios.post('http://47.97.204.234:3000/article/likeComment',{
        userId: userId,
        commentId: commentId,
        like: like
    })
    .then(function(res) {
        if(res.data.message == '取消点赞成功' || res.data.message == '点赞成功') {
            let articleId = Box[index].getAttribute('data-articleId');
            getComments(userId, articleId, index);
        }
    })
}

//点踩评论或者取消点踩
function dislikeComment (userId, commentId, dislike, index) {
    axios.post('http://47.97.204.234:3000/article/dislikeComment',{
        userId: userId,
        commentId: commentId,
        dislike: dislike
    })
    .then(function(res) {
        if(res.data.message == '取消点踩成功' || res.data.message == '点踩成功') {
            let articleId = Box[index].getAttribute('data-articleId');
            getComments(userId, articleId, index);
        }
    })
}

//获取评论回复
function getReplies(userId, commentId, index, num) {
    axios.get('http://47.97.204.234:3000/article/getReplies',{
        params: {
            userId: userId,
            commentId: commentId
        }
    })
    .then(function(res) {
        console.log(res.data);
        let replies = res.data.replies
        if(res.data.message === '请求成功') {
            loadReplies(replies, index, commentId, num);
        }else if(res.data.message === '该评论没有回复'){
            reply.style.display = 'none';
            commentViewReply[num].style.display = 'none';
        }
    })
}

//删除回复,obj是删除的对象
function deleteReply (userId, replyId, obj, commentId, index, num) {
    axios.delete('http://47.97.204.234:3000/article/deleteReply',{
        data: {
            userId: userId,
            replyId: replyId
        }
    })
    .then(function(res){
        console.log(res.data);
        obj.remove();
        getReplies(userId, commentId, index, num)
    })
    .catch(function(error){
        console.log(error);
    })
}

//点赞回复或者取消点赞
function likeReply(userId, replyId, like, index, commentId) {
    axios.post('http://47.97.204.234:3000/article/likeReply',{
        userId: userId,
        replyId: replyId,
        like: like
    })
    .then(function(res){
        if(res.data.message == '点赞成功' || res.data.message == '取消点赞成功') {
            getReplies(userId, commentId, index);
        }
    })
}

//点踩回复或者取消点踩
function dislikeReply(userId, replyId, dislike, index, commentId) {
    axios.post('http://47.97.204.234:3000/article/dislikeReply',{
        userId: userId,
        replyId: replyId,
        dislike: dislike
    })
    .then(function(res){
        if(res.data.message == '点踩成功' || res.data.message == '取消点踩成功') {
            getReplies(userId, commentId, index);
        }
    })
}

//回复某条评论
function replyNow(userId, commentId, content, index, num) {
    axios.post('http://47.97.204.234:3000/article/reply',{
        userId: userId,
        commentId: commentId,
        content: content
    })
    .then(function(res){
        console.log(res);
        if(res.data.message == '回复成功') {
            alert('回复成功！')
            replyPut[num].value = '';
            commentViewReply[num].style.display = 'inline-block';
        }
    })
}

//获取文章的大盒子、文本标题、文本盒子
var articleW = $('article-w')[0];
var articleTitle = $('a-title');
var articleText = $('inner-text');

//加载文章，相对于整个文章来说,obj是article数组
function loadArticles(obj) {
    for(let i = 0; i < obj.length; i++) {
        Box[i].setAttribute('data-articleId',obj[i].articleId); //文章ID
        Box[i].setAttribute('data-userId',obj[i].userId); //作者ID
        articleTitle[i].innerHTML = `${obj[i].title}`;
        judgeNum(obj[i],i); //加载内容
        content[i].setAttribute('index',i);
        textLess[i].setAttribute('index',i);
        approve[i].setAttribute('index',i);
        disapprove[i].setAttribute('index',i);
        comment[i].setAttribute('index',i);
        commentNum2[i].setAttribute('index',i); 
    }
}

//判断文本内容的长度并加载
function judgeNum(obj,i) {
    var str = '';
    for(let j = 0; j < obj.content.length; j++) {
        str += obj.content[j];
        if(str.length >= 60) {
            articleText[i].innerHTML = obj.nickname + ': &nbsp;' + str;
            return;
        }
    }
}

//获取点赞，反对，评论数
var approve = $('approve');
var disapprove = $('disapprove');
var commentNum2 = $('commentNum2');

//加载点赞、评论数等
function loadActions(obj, index) {
    let i = index;
    let length = obj.length || 1;
    for(i ; i < length; i++) {
        if(obj[i].liked || obj.liked) {
            approve[i].classList.add('liked');
            approve[i].innerHTML = `<i class="iconfont icon-shang"></i>已赞同 ${obj[i].likeNum}`;
        }else{
            approve[i].classList.remove('liked');
            approve[i].innerHTML = `<i class="iconfont icon-shang"></i>赞同 ${obj[i].likeNum}`;
        }
        //判断不喜欢的
        if(obj[i].disliked || obj.disliked) {
            disapprove[i].classList.add('disliked');
        }else{
            disapprove[i].classList.remove('disliked');
        }
        commentNum2[i].innerHTML = `${obj[i].commentNum}条评论`;
    }
}

//点击获取更多事件
//点击收起事件
var load = $('comment-load');
var commentFooterPlus = $('comment-footer');
var loadFlag = [];
articleW.addEventListener('click',function(e) {
    //兼容处理
    var e = e || window.event;
    var target = e.target || e.srcElement;

    if(target.className == 'text-more') {
        // 展开全文
        let index = target.parentElement.getAttribute('index');
        expandText(article, index, target);
    }

    if(target.className == 'text-less') {
        // 收起全文
        let index = target.getAttribute('index');
        lessText(article, index, target);
    }
    //点赞
    if(target.className == 'approve' || target.className == 'approve liked') {
        let index = target.getAttribute('index');
        approveActions(article, index, target);
    }
    //反对
    if(target.className == 'disapprove' || target.className == 'disapprove disliked') {
        let index = target.getAttribute('index');
        disapproveActions(article, index, target);
    }

    //查看评论
    if(target.className == 'commentNum2') {
        let index = target.getAttribute('index');
        let commentFlag = commentContainer[index].style.display;
        if(commentFlag == 'none' || commentFlag == '') {
            commentContainer[index].style.display = 'block';
            commentNum2[index].innerHTML = '收起评论';
            scrollHeight = getScrollTop();
            //判断是否需要加载动画
            if(loadFlag[index] == false) {
                getComments(userId, article[index].articleId, index);
                
            }else{
                load[index].style.display = 'block';
                setTimeout(function(){
                    getComments(userId, article[index].articleId, index);
                },1000)
                loadFlag[index] = false;
            }
        }else if(commentFlag == 'block'){
            commentContainer[index].style.display = 'none';
            window.scrollTo(0, scrollHeight);
            if(dataIndex[index] == undefined) {
                commentNum2[index].innerHTML = `0条评论`;
            }else{
                commentNum2[index].innerHTML = `${dataIndex[index].length}条评论`
            }
        }
    }

    //点击评论
    if(target.className == 'comment-edit-w') {
        let index = target.getAttribute('index');
        commentEdit(index);
    }

    //点击评论发布
    if(target.className == 'commentBtn') {
        let index = target.getAttribute('index');
        postComment(index, target);
    }

})

//展开全文 
// 1.盒子取消最小高度限制 2.以数组的方式获取文章 3.作者盒子加载 4.时间信息加载
var content = $('content-inner'); //文本+获取更多按钮
var textLess = $('text-less');
var textMore = $('text-more');
var contentActions = $('content-actions'); //底部actions
var textDate = $('text-date');
var scrollHeight;
function expandText(arr, index, target) {
    scrollHeight = getScrollTop();
    //去除高度限制
    content[index].classList.remove('maxLimit');
    //加载作者信息
    authorInfo[index].style.display = 'flex';
    loadAuthorInfo(arr, index);
    //加载文章信息
    articleText[index].innerHTML = '';
    for(var k = 0; k < arr[index].content.length; k++) {
        articleText[index].innerHTML += `${arr[index].content[k]}<br>`;
    }
    articleText[index].innerHTML += `<br>`;
    //按钮消失，收起出现
    target.style.display = 'none';
    textLess[index].style.display = 'block';
    //功能区改变样式
    contentActions[index].classList.add('is-fixed');
    //显示时间
    textDate[index].style.display = 'block';
    textDate[index].innerHTML = `编辑于 ${arr[index].issueTime.substring(0,10)}`;
}

//渲染文章作者信息
var authorInfo = $('authorInfo');
var authorPic = $('author-pic');
var authorNickname = $('author-nickname');
var authorIntroduction = $('author-introduction');
function loadAuthorInfo(arr,index) {
    authorPic[index].innerHTML = `<img src="${arr[index].avatar}" alt="">`;
    authorNickname[index].innerHTML = `${arr[index].nickname}`;
    authorIntroduction[index].innerHTML = `${arr[index].introduction}`;
}

//收起全文
function lessText(arr, index, target) {
    //高度限制
    content[index].classList.add('maxLimit');
    //加载作者信息
    authorInfo[index].style.display = 'none';
    //收缩文章信息
    judgeNum(arr[index],index); 
    //按钮消失，收起出现
    target.style.display = 'none';
    textMore[index].style.display = 'block';
    //功能区改变样式
    contentActions[index].classList.remove('is-fixed');
    //时间隐藏
    textDate[index].style.display = 'none';
    //回到原处
    window.scrollTo(0, scrollHeight);
}

//点赞
function approveActions(arr, index, target) {
    let id = arr[index].articleId;
    let liked = !arr[index].liked;
    likeArticle(userId, id, liked, index);
}

//反对
function disapproveActions(arr, index, target) {
    let id = arr[index].articleId;
    let disliked = !arr[index].disliked;
    dislikeArticle(userId, id, disliked, index);
}

//加载评论，先获取
var comment = $('comment');
var commentContainer = $('comment-container');
var commentBox = $('comment-ul-box');
var nestComment = $('nestComment');
var commentNum = $('commentNum');
var commentPage = $('comment-page');
var commentAuthorNickname, commentText, commentImg, 
    commentDate, commentPut, commentBtn, commentLi,
    commentViewReply, commentApprove,commentDisapprove, commentReply;

function loadComments(data, index) { //data是评论数据,index表示第几篇文章
    init(nestComment[index]);
    if(dataIndex[index] == undefined) {
        commentNum[index].innerHTML = `0条评论`;
    }else{
        commentNum[index].innerHTML = `${dataIndex[index].length}条评论`
    }
    init(nestComment[index]);
    //如果没有评论，就此止步
    if(dataIndex[index] == undefined) return;
    //如果评论数大于6，就要分页
    if(commentText.length < dataIndex[index].length) {
        //少几个加几个（坑！）
        for(let i = commentText.length; i < data.length; i++) {
            let newLi = $('newLi')[0].cloneNode(true);
            newLi.style.display = 'block';
            nestComment[index].appendChild(newLi);
        }
    }
    //分页按钮
    // if(dataIndex[index].length > 4) {
    //     commentPage[index].style.display = 'flex';
    //     let page = Math.ceil(dataIndex[index].length / 4);
    //     if(commentPage[index].children.length - 1 < page) {
    //         for(let i = commentPage[index].children.length; i < page; i++) {
    //             let span = commentPage[index].children[1].cloneNode(true);
    //             span.innerHTML = `${i+1}`;
    //             commentPage[index].insertBefore(span, pageNext[index]);
    //         }
    //     }
        // clickPage(data, index);
    // }else{
    //     commentPage[index].style.display = 'none';
    // }
    //初始化
    init(nestComment[index]); 
    loadCommentsLi(data); //根据获取到的数据，详细渲染评论信息,里面有对数据的遍历
    judgeComment(data, index); //判断是否是自己,之后执行判断是否具有删除权利
    commentActions(nestComment[index], data, index); //评论区的功能，利用事件委托
};

//点击页数加载事件
// function clickPage(data, index) {
//     for(let i = 0; i < commentPage[index].children.length; i++) {
//         commentPage[index].children[i].addEventListener('click',function(){
//             nestComment[index].style.top = - 400 * i + 'px';
//             for(let j = 0; j < commentPage[index].children.length; j++) {
//                 commentPage[index].children[j].classList.remove('active');
//             }
//             commentPage[index].children[i].classList.add('active');
//         })
//     }
// }

//获取评论的li内容盒子,加载评论时候发生
function init(obj) {
    commentAuthorNickname = obj.querySelectorAll('.comment-authorNickname');
    commentText = obj.querySelectorAll('.comment-cardText');
    commentImg = obj.querySelectorAll('.comment-authorImg');
    commentDate = obj.querySelectorAll('.comment-date');
    commentViewReply = obj.querySelectorAll('.comment-viewReply');
    commentApprove = obj.querySelectorAll('.comment-approve');
    commentDisapprove = obj.querySelectorAll('.comment-disapprove');
    commentReply = obj.querySelectorAll('.comment-reply');
    commentLi = obj.children; //li
    commentPut = $('comment-edit-w'); //评论框
    commentBtn = $('commentBtn'); //评论发布按钮
    initIndex(commentPut);
    initIndex(commentBtn);
    initIndex(commentApprove);
    initIndex(commentDisapprove);
    initIndex(commentViewReply);
    initIndex(commentReply);
}

//给按钮和评论框赋值
function initIndex(obj) {
    for(let i = 0; i < obj.length; i++) {
        obj[i].setAttribute('index',i);
    } 
}

//加载评论的li内容
function loadCommentsLi(data) {
    for(let i = 0; i < data.length; i++) {
        commentAuthorNickname[i].innerHTML = `${data[i].nickname}`;
        commentText[i].innerHTML = `${data[i].content}`;
        commentImg[i].innerHTML = `<img src="${data[i].avatar}" alt="">`;
        commentDate[i].innerHTML = `${data[i].time.substring(0,10)}`
        commentLi[i].setAttribute('data-userId',data[i].userId); //评论的li
        commentLi[i].setAttribute('data-commentId',data[i].commentId);
        if(data[i].replied) {
            commentViewReply[i].style.display = 'inline-block';
        }else{
            commentViewReply[i].style.display = 'none';
        }
        if(data[i].likeNum > 0) {
            commentApprove[i].innerHTML = `<i class="iconfont icon-dianzan"></i> ${data[i].likeNum}`;
        }else{
            commentApprove[i].innerHTML = `<i class="iconfont icon-dianzan"></i>`;
        }
        commentApprove[i].style.color = data[i].liked ? '#0084ff' : '#8590a6';
        if(data[i].disliked) {
            commentDisapprove[i].innerHTML = `<i class="iconfont icon-cai"></i>
            取消踩`;
        }else{
            commentDisapprove[i].innerHTML = `<i class="iconfont icon-cai"></i>
            踩`;
        }
    }
}

//评论事件
function commentEdit(index) {
    var str = commentPut[index].value;
    checkEmpty(str,commentBtn[index]);
    commentPut[index].onblur = function(){
        var str = commentPut[index].value;
        checkEmpty(str,commentBtn[index]);
    }
}

//检测是否为空，确定发布按钮的颜色
function checkEmpty(str,obj) {
    if(str != '') {
        obj.style.opacity = '1';
    }else{
        obj.style.opacity = '';
    }
}

//发布评论
function postComment(index, target) {
    let opacity = target.style.opacity;
    if(opacity == '1') {
        let content = commentPut[index].value;
        let articleId = article[index].articleId;
        commentNow(userId, articleId, content, index);
    }
}

//判断评论 增加删除事件
function judgeComment(data, index) {
    for(let i = 0; i < data.length; i++) {
        let id = commentLi[i].getAttribute('data-userId');
        let authorId = Box[index].getAttribute('data-userId');
        commentLi[i].addEventListener('mouseenter',function(){
            //判断，如果文章作者的id和当前用户id一样，就可以删除评论
            if(id === userId || authorId === userId) {
                let commentId = commentLi[i].getAttribute('data-commentId');
                let commentDeleteBtn = nestComment[index].querySelectorAll('.comment-delete');
                commentDeleteBtn[i].style.display = 'inline-block';
                commentDeleteBtn[i].onclick = function() {
                    deleteComment(userId, commentId, commentLi[i], article[index].articleId, index);
                }
            }
        })
    }
}

//判读评论是否有回复
//obj是整个评论大盒子，index是整个文章的序号，data是评论数据
function commentActions(obj, data, index) {
    obj.addEventListener('click', function(e){
        var e = e || window.event;
        var target = e.target || e.srcElement;
        //评论点赞
        if(target.className == 'iconfont icon-dianzan') {
            let num = target.parentElement.getAttribute('index');//num是li的序号
            let commentId =  commentLi[num].getAttribute('data-commentId');
            let flag = !data[num].liked;
            likeComment(userId, commentId, flag, index);
        }
        //评论点踩
        if(target.className == 'iconfont icon-cai'|| target.className == 'comment-disapprove') {
            let num = target.parentElement.getAttribute('index') || target.getAttribute('index');//num是li的序号
            let commentId =  commentLi[num].getAttribute('data-commentId');
            let flag = !data[num].disliked;
            dislikeComment(userId, commentId, flag, index);
        }
        //查看回复
        if(target.className == 'comment-viewReply') {
            let num = target.getAttribute('index'); //num是li的序号
            let commentId = commentLi[num].getAttribute('data-commentId');
            getReplies(userId, commentId, index, num);
            reply.style.display = 'block';
        }
        //回复功能
        if(target.className == 'comment-reply') {
            var replyFooter = obj.getElementsByClassName('reply-footer');
            let num = target.getAttribute('index');//num是li的序号
            let replyFlag = replyFooter[num].style.display;
            if(replyFlag === 'none' || replyFlag === '') {
                let commentId =  commentLi[num].getAttribute('data-commentId');
                replyFooter[num].style.display = 'flex';
                replyEdit(userId, commentId, index, num);
                target.innerHTML = `<i class="iconfont icon-huifu"></i>
            收起回复`;
            }else if(replyFlag === 'flex') {
                replyFooter[num].style.display = 'none';
                target.innerHTML = `<i class="iconfont icon-huifu"></i>
            回复`;
            }
            
        }
    })
}

//加载评论到页面 arr是获取到的回复数据
var reply = $('reply')[0];
var replyClose = $('replyClose')[0];
var replyNum = $('replyNum')[0];
var replyUl = document.querySelector('.reply-ul'); //获取大的ul
var replyLi = replyUl.children; //获取动态的评论li
var replyAuthorImg = $('reply-authorImg');
var replyAuthorNickname = $('reply-authorNickname');
var replyDate = $('reply-date');
var replyCardText = $('reply-cardText');
var replyApprove = $('reply-approve');
var replyDisapprove = $('reply-disapprove');
function loadReplies(arr, index, commentId, num) {
    replyNum.innerHTML = `${arr.length}条回复`;
    if(replyLi.length < arr.length) {
        for(let i = replyLi.length; i < arr.length; i++) {
            let newReplyLi = $('reply-li')[0].cloneNode(true); //将要克隆的li
            newReplyLi.style.display = 'block';
            replyUl.appendChild(newReplyLi);
        }
    }
    //渲染回复li的详细信息
    for(let i = 0; i < arr.length; i++) {
        replyLi[i].setAttribute('data-userId',arr[i].userId);
        replyLi[i].setAttribute('data-replyId',arr[i].replyId);
        replyAuthorImg[i].innerHTML = `<img src="${arr[i].avatar}" alt="">`;
        replyAuthorNickname[i].innerHTML = `${arr[i].nickname}`;
        replyDate[i].innerHTML = `${arr[i].time.substring(0,10)}`;
        replyCardText[i].innerHTML = `${arr[i].content}`;
        replyApprove[i].style.color = arr[i].liked ? '#0084ff' : '#8590a6';
        if(arr[i].likeNum > 0) {
            replyApprove[i].innerHTML = `<i class="iconfont icon-dianzan"></i> ${arr[i].likeNum}`;
        }else{
            replyApprove[i].innerHTML = `<i class="iconfont icon-dianzan"></i>`;
        }
        if(arr[i].disliked) {
            replyDisapprove[i].innerHTML = `<i class="iconfont icon-cai"></i>
            取消踩`;
        }else{
            replyDisapprove[i].innerHTML = `<i class="iconfont icon-cai"></i>
            踩`;
        }
    }
    //点赞事件
    approveReply(arr, index, commentId);
    //点踩事件
    disapproveReply(arr, index, commentId);
    //检测回复权限进行删除事件
    judgeReply(arr, index, commentId, num);
    //点击关闭事件
    replyClose.onclick = function() {
        clearReply(arr);
        reply.style.display = 'none';
    }
}

//判断回复删除权限,data是回复的li
function judgeReply(data, index, commentId, num) {
    for(let i = 0; i < data.length; i++) {
        let id = replyLi[i].getAttribute('data-userId');
        let authorId = Box[index].getAttribute('data-userId');
        replyLi[i].addEventListener('mouseenter',function(){
            //判断，如果文章作者的id和当前用户id一样，就可以删除评论
            if(id === userId || authorId === userId) {
                let replyId = replyLi[i].getAttribute('data-replyId');
                console.log('replyId: ', replyId);
                let replyDeleteBtn = reply.querySelectorAll('.reply-delete');
                replyDeleteBtn[i].style.display = 'inline-block';
                replyDeleteBtn[i].onclick = function() {
                    deleteReply(userId, replyId, replyLi[i], commentId, index, num);
                }
            }
        })
    }
}

//回复框初始化
function clearReply(arr) {
    for(let i = 0; i < replyLi.length; i++) {
        replyLi[i].remove();
    }
}

//回复点赞事件
function approveReply(arr, index, commentId) {
    for(let i = 0; i < arr.length; i++) {
        let flag = ! arr[i].liked;
        replyApprove[i].addEventListener('click',function(){
            let replyId = replyLi[i].getAttribute('data-replyId');
            likeReply(userId, replyId, flag, index, commentId);
            return;
        })
    }
}

//回复点踩事件
function disapproveReply(arr, index, commentId) {
    for(let i = 0; i < arr.length; i++) {
        let flag = ! arr[i].disliked;
        replyDisapprove[i].addEventListener('click',function(){
            let replyId = replyLi[i].getAttribute('data-replyId');
            dislikeReply(userId, replyId, flag, index, commentId);
            return;
        })
    }
}

//回复评论事件
var replyPut = $('reply-edit-w');
var replyBtn = $('replyBtn');
function replyEdit(userId, commentId, index, num) {
    var str = commentPut[num].value;
    checkEmpty(str,commentBtn[num]);
    replyPut[num].onblur = function(){
        var str = replyPut[num].value;
        checkEmpty(str,replyBtn[num]);
    }
    replyBtn[num].onclick = function() {
        console.log(1);
        let opacity = replyBtn[num].style.opacity;
        console.log('opacity: ', opacity);
        if(opacity == '1') {
            let content = replyPut[num].value;
            replyNow(userId, commentId, content, index, num);
        }
    }
}


//获取滚动条距离顶部位置
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

// 如果下拉到最后，没有数据就加载新的
// window.addEventListener('scroll',function(){
//     //变量scrollHeight是滚动条的总高度
//     let scrollHeight = Math.ceil(document.documentElement.scrollHeight || document.body.scrollHeight);
//     //变量windowHeight是可视区的高度
//     let windowHeight = Math.ceil(document.documentElement.clientHeight || document.body.clientHeight);
//     //scrollTop就是触发滚轮事件时滚轮的高度
//     let scrollTop = Math.ceil(document.documentElement.scrollTop || document.body.scrollTop);
    
//     if(scrollTop + windowHeight >= scrollHeight - 10) {
//         if (start == 0) {
//             start = 10;
//         }
//         if(start == 10) {
//             loadingMoreItem();
//         }
//     }
// })

//加载更多

// function loadingMoreItem() {
//     stop = 18;

//     getArticle(userId,start,stop);

//     for(let i = 0; i < stop-start+1; i++) {
//         var node = Box[0].cloneNode(true);
//         articleW.appendChild(node);
//     }

//     start++;
// }