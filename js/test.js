
var article = '';
var articleId;
var flag = true; //第一次加载页面
var userId = id || '5e96e5416dc8847e998b85eb' ; //暂时不能获取id
var start = 0;
var stop = 5;
var title,content,authorInfo,authorNickname,authorIntroduction,
    approve,disapprove,commentNum,articleW,moreBtn,lessBtn,
    contentActions,Box,moreBtnLength;

function reloadInfo() {
    //获取标题和内容盒子
    title = document.querySelectorAll('.a-title');
    content = document.querySelectorAll('.inner-text');

    //获取作者信息框
    authorInfo = document.querySelectorAll('.authorInfo');
    authorNickname = document.querySelectorAll('.author-nickname');
    authorIntroduction = document.querySelectorAll('.author-introduction');

    //获取顶踩，评论
    approve = document.querySelectorAll('.approve');
    disapprove = document.querySelectorAll('.disapprove');
    commentNum = document.querySelectorAll('.commentNum');
    articleW = document.querySelector('.article-w');

    //获取更多按钮,收起按钮
    moreBtn = document.getElementsByClassName('text-more');
    lessBtn = document.querySelectorAll('.text-less');
    contentActions = document.querySelectorAll('.content-actions');

    //获取总的大盒子
    Box = document.querySelectorAll('.article-item');

    //
    moreBtnLength = moreBtn.length;
}
reloadInfo();

//从服务器获取文章
function getArticle(userId,start,stop){

    if (stop > 17) {
        stop = 17;
    }

    axios.get('http://47.97.204.234:3000/article/getArticles',{
        params: {
            userId: userId,
            start: start,
            stop: stop
        }
    })
    .then(function(res){
        console.log(res);

        //重新获取元素数据
        reloadInfo();
        NumAll();

        //article数组拼接
        let a = res.data.articles;
        if (start == 0) {
            article = a;
        } else {
            article.push.apply(article,a);
        }

        //判断是否是第一次加载
        loadArticle(article);
        loadActions(article);
    })
    .catch(function(error){
        console.log(error);
})
}


//点赞文章或者取消点赞
function likeArticle (userId, articleId, like) {
    axios.post('http://47.97.204.234:3000/article/likeArticle',{
        userId: userId,
        articleId: articleId,
        like: like
    })
    .then(function(res){
        getArticle(userId,0,stop);
    })
    .catch(function(error){
        console.log(error);
})
}

//点踩文章或者取消点踩
function dislikeArticle (userId, articleId, dislike) {
    axios.post('http://47.97.204.234:3000/article/dislikeArticle',{
        userId: userId,
        articleId: articleId,
        dislike: dislike
    })
    .then(function(res){
        getArticle(userId,0,stop);
    })
    .catch(function(error){
        console.log(error);
})
}

//加载文章信息
function loadArticle(arr) {

        // 放到页面中
        // 每一个文章
        for(let i = 0; i < arr.length; i++) {
            
            if (i < arr.length) {
                //每一个对应的标题框
                title[i].innerHTML = `${arr[i].title}`;

                //对应的内容
                var con = '';
                for(var k = 0; k < arr[i].content.length; k++) {
                    if ( k < 2) {
                        con += `${arr[i].content[k]}`
                    }  
                }
                content[i].innerHTML =  `${arr[i].nickname}: &nbsp;` + con;
            }

        }
}

//加载作者信息
function loadAuthor(arr) {
    
    for(let i = 0; i < arr.length; i++) {
        authorNickname[i].innerHTML = `${arr[i].nickname}`;
        authorIntroduction[i].innerHTML = `${arr[i].introduction}`
    }
}

//加载功能区信息
function loadActions(arr) {
    for(let i = 0; i < arr.length; i++) {
        commentNum[i].innerHTML = `${arr[i].commentNum}条评论`;
        approve[i].innerHTML = 
        `<i class="iconfont icon-shang"></i>
        赞同 ${arr[i].likeNum}`

        disapprove[i].innerHTML =
        `<i class="iconfont icon-xia"></i>
        反对`

        //如果喜欢的话
        if (arr[i].liked) {
            approve[i].classList.add('liked');
            approve[i].innerHTML = 
            `<i class="iconfont icon-shang"></i>
            已赞同 ${arr[i].likeNum}`
        } else if(arr[i].liked == false){
            approve[i].classList.remove('liked');
        }

        //如果不喜欢（反对）的话
        if (arr[i].disliked) {
            disapprove[i].classList.add('disliked');
            disapprove[i].innerHTML = 
            `<i class="iconfont icon-xia"></i>
            已反对`
        } else if(arr[i].disliked == false){
            disapprove[i].classList.remove('disliked');
        }
    }
}

//功能区is-fixed
function actionsFixed(obj) {
    obj.classList.add('is-fixed');
}

//功能区normal
function actionsNormal(obj) {
    obj.classList.remove('is-fixed')
}

//主方法，拼接数组后都可以通用的
NumAll();
function NumAll() {
    for(let i = 0; i < moreBtnLength; i++) {

        //获取更多
        moreBtn[i].addEventListener('click',function(){

            //获取index序号
            var index = i;
    
            //加载隐藏内容
            moreBtn[index].parentElement.classList.remove('maxLimit');
            authorInfo[index].style.display = 'flex';

            loadAuthor(article);

            content[index].innerHTML = '';

            for(var k = 0; k < article[i].content.length; k++) {
                content[index].innerHTML += `${article[i].content[k]}<br>`;
            }
            content[index].innerHTML += `<br>`
    
            //功能区改变样式
            actionsFixed(contentActions[index]);
    
            //获取更多按钮消失，收起出现
            moreBtn[index].style.display = 'none';
            lessBtn[index].style.display = 'block';
        })
    
        //隐藏
        lessBtn[i].addEventListener('click',function(){
            //获取index序号
            var index = i;
    
            //隐藏内容
            moreBtn[index].parentElement.classList.add('maxLimit');
            authorInfo[index].style.display = 'none';
            content[index].innerHTML = '';
            for(var k = 0; k < article[i].content.length; k++) {
                if ( k < 2) {
                    content[i].innerHTML += `${article[i].content[k]}`
                }
            }
            content[i].innerHTML =  `${article[i].nickname}: &nbsp;` + content[i].innerHTML;
    
            //功能区恢复
            contentActions[index].classList.remove('is-fixed');
    
            moreBtn[index].style.display = 'block';
            lessBtn[index].style.display = 'none';
        })
    
        //点赞
        approve[i].addEventListener('click',function () {
    
            var index = i;
    
            var like = article[index].liked;
    
            if(like == true) {
                like = false;
            } else {
                like = true;
            }
    
            likeArticle(userId, article[index].articleId , like)
        })
    
        //反对
        disapprove[i].addEventListener('click',function () {
    
            var index = i;
    
            var dislike = article[index].disliked;
    
            if(dislike == true) {
                dislike = false;
            } else {
                dislike = true;
            }
    
            dislikeArticle(userId, article[index].articleId , dislike)
        })
    }
}



//如果下拉到最后，没有数据就加载新的
window.addEventListener('scroll',function(){
    //变量scrollHeight是滚动条的总高度
    let scrollHeight = Math.ceil(document.documentElement.scrollHeight || document.body.scrollHeight);
    //变量windowHeight是可视区的高度
    let windowHeight = Math.ceil(document.documentElement.clientHeight || document.body.clientHeight);
    //scrollTop就是触发滚轮事件时滚轮的高度
    let scrollTop = Math.ceil(document.documentElement.scrollTop || document.body.scrollTop);

    // console.log(scrollHeight);
    // console.log(windowHeight);
    // console.log(scrollTop);
    
    if(scrollTop + windowHeight >= scrollHeight - 5) {
        if (start == 0) {
            start = 6;
        }
        if(start <= 14) {
            loadingMoreItem();
        }
    }
})

//从服务器请求新的文章数据
const loadingMoreItem = () => {

    getArticle(userId,start,start+3);

    for(let i = 0; i < 4; i++) {
        var node = Box[0].cloneNode(true);
        articleW.appendChild(node);
    }

    start += 4;
    stop = start+3;
}


//加载新的内容，因为前面的不要加载，所以局部加载
// const loadingMoreContent = (arr,start) => {
//     for(let i = 0,j = start; i < arr.length; i++,j++) {

//         //每一个对应的标题框
//         title[j].innerHTML = `${arr[i].title}`;

//         //对应的内容
//         var con = '';

//         for(var k = 0; k < arr[i].content.length; k++) {
//             if ( k < 2) {
//                 con += `${arr[i].content[k]}`;
//             }  
//         }
//         content[j].innerHTML =  `${arr[i].nickname}: &nbsp;` + con;
//     }

// }