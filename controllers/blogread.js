//imports
import { fetchSpecificBlog, fetchComments, addComment,likeBlog, updateLike, getAccountInfo, fetchSpecificLike } from "../src/appwrite";

//constants
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('id');

const blogBody = document.getElementById('blog-body');
const blogTitle = document.getElementById('title');
const blogAuthor = document.getElementById('author');
const blogDate = document.getElementById('date');
const blogLikes = document.getElementById('likes');
const blogComments = document.getElementById('comments');
const commentContainer = document.getElementById('comment-container');
const commentBtn = document.getElementById('send-comment');
const commentText = document.getElementById('comment-text');
const likeButton = document.getElementById('like-button');



//function definitions
async function fetchAndDisplayBlog(){
   const blog =  await fetchSpecificBlog(blogId);
   blogBody.innerText = blog.body;
   blogTitle.innerText = blog.title;
   blogAuthor.innerText = blog.author;
   blogDate.innerText = blog.last_updated.split('T')[0];
   blogLikes.innerText = blog.like_count;
   blogComments.innerText = blog.comment_count;
}

async function updateLikeUI(){
    let userId = (await getAccountInfo()).$id;
    const userLike = await fetchSpecificLike(userId, blogId);
    if(userLike.total === 0){
        console.log(userLike);
        return;
    }else{
        console.log(userLike.documents[0].like_value);
        if(userLike.documents[0].like_value === false){
            likeButton.name = "heart-outline";
            return;
        }
        likeButton.name = "heart";
    }
}

updateLikeUI();

async function fetchAndDisplayComments() {
    const comments = await fetchComments();

    for (const comment of comments.documents) {

        if(comment.blog_id.$id === blogId){    
            const username = comment.user_id.username; // Await username fetch
            const commentTile = document.createElement('div');
            
            commentTile.className = "comment";
            commentTile.innerHTML = `
                <div class="comment">
                    <div class="comment-header">
                        <div class="logo profile_pic mini-pic">${username.split('')[0]}</div>
                        <p>${username}</p>
                    </div>
                    <div class="comment-body">
                        ${comment.body}
                    </div>
                </div>
            `;
            
            commentContainer.appendChild(commentTile);
        }else{
            continue;
        }
    }
}

async function sendComment(){
    const blogDetails = await fetchSpecificBlog(blogId);
    const userId = await getAccountInfo()
    const blogCommentCount = await blogDetails.comment_count;
    const newCommentCount = blogCommentCount + 1;
    blogComments.innerText = newCommentCount;
    console.log(newCommentCount);
    console.log(userId.$id);
    const addedComment = await addComment(blogId, userId.$id,commentText.value, newCommentCount);
    console.log(addedComment.result);
    const commentTile = document.createElement('div');
            
            commentTile.className = "comment";
            commentTile.innerHTML = `
                <div class="comment">
                    <div class="comment-header">
                        <div class="logo profile_pic mini-pic">${addedComment.result.user_id.username.split('')[0]}</div>
                        <p>${addedComment.result.user_id.username}</p>
                    </div>
                    <div class="comment-body">
                        ${addedComment.result.body}
                    </div>
                </div>
            `;
            
            commentContainer.appendChild(commentTile);
            commentText.value = '';
}

async function addOrRemoveLike(){
    let userId = (await getAccountInfo()).$id;
    const currentLikeCount = (await fetchSpecificBlog(blogId)).like_count;
    let newLikeCount = currentLikeCount + 1;
    const userLike = await fetchSpecificLike(userId, blogId);
    console.log(userLike);
    if(userLike.total === 0){
        //implement adding a like for the first time
        console.log('condition 1');
        await likeBlog(blogId, userId, true, newLikeCount);
        return;
    }

    if(userLike.total > 0 && userLike.documents[0].like_value === false){
        //update the like to true and add the like value to the blogs like_count
        console.log('condition 2');
        await updateLike(userLike.documents[0].$id,blogId, true, newLikeCount);
        return;
    }

    if(userLike.total > 0 && userLike.documents[0].like_value === true){
        //update the like to false and remove the like value to the blogs like_count
        console.log('condition 3');
        newLikeCount = currentLikeCount - 1;
        await updateLike(userLike.documents[0].$id,blogId, false, newLikeCount);
        return;
    }
}


//function calls
fetchAndDisplayBlog();
fetchAndDisplayComments();

//event listeners

commentBtn.addEventListener('click',()=>{
    sendComment();
});

likeButton.addEventListener('click',(e)=>{
    if(e.target.name === "heart"){
        blogLikes.innerText = parseInt(blogLikes.innerText, 10) - 1;
        e.target.name = "heart-outline";
    }else if(e.target.name === "heart-outline"){
        blogLikes.innerText = parseInt(blogLikes.innerText, 10) + 1;
        e.target.name = "heart";
    }
    addOrRemoveLike();
});