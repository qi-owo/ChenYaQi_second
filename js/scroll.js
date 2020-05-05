//获取
var $ = document.getElementsByClassName.bind(document);
var goTop = $('goTop')[0];
var sidebar = $('sidebar')[0];

window.onscroll = function() {
    //获取离视窗顶部的高度
    var y = document.documentElement.scrollTop || document.body.scrollTop;
    if(y > 100) {
        sidebar.style.height = '52px';
    }else{
        sidebar.style.height = '0';
    }
}

//返回顶部
goTop.addEventListener('click',function(){
     //当前的距顶距离
    var y = document.documentElement.scrollTop || document.body.scrollTop;
    var step = Math.floor(- y/50);
    
    //立即执行函数
    (function scrollToTop(){
        var isTop = document.documentElement.scrollTop || document.body.scrollTop;
        window.scrollBy(0,step);
        var timer = setTimeout(scrollToTop,10);
        //到了顶部就不再向上，清除延时器
        if(isTop == 0){
            clearTimeout(timer);
        }
    })();
})

//获取顶部搜索框
var indexSearch = $('indexSearch')[0];
var search = indexSearch.firstElementChild;
var indexQuestion = $('indexQuestion')[0];

search.onfocus = function() {
    search.style.width = '402px';
    search.style.background = '#fff'
    indexQuestion.style.display = 'none'
}
search.onblur = function() {
    search.style.width = '326px';
    search.style.background = '#f6f6f6'
    indexQuestion.style.display = 'inline-block'
}