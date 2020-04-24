//获取文章评论
function getComments(userId,articleId){
    axios.get('http://47.97.204.234:3000/article/getComments',{
        params: {
            userId: userId,
            articleId: articleId
        }
    })
    .then(function(res){
        console.log(res);
    })
    .catch(function(error){
        console.log(error);
})
}

window.addEventListener('load',function(){
    getComments(userId, article[0].articleId)
})