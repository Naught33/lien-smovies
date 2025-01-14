import { Account, Client, ID, Databases,Query } from 'appwrite';
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6777858c00132a478a7c');    

//constants

const DB_ID = "6777928a0012af756bad";

const account = new Account(client);
const database = new Databases(client);

//functions

async function logInUser(email, password){
    try{
    const session = await account.createEmailPasswordSession(
        email, 
        password
    );
    console.log(session);
    return session;
    } catch(err){
        console.log(err)
        return false;
    }
}

//this is basically in the appwrite docs, however, remove the [USER_ID] since it is not necessary as
//indicated in the docs, then the appwrite system generates them automatically.

//this function sets the user info into a database collection for easier access.

async function addUsertoDB(uid, username, email){
    const result = await database.createDocument(
        DB_ID,
        '677d69370031f663e68d', 
        uid,
        {
            "username": username,
            "email": email
        }
    );
    console.log("[login page]: success" + result);
    return result;
}

    function signUpUser(username, email, password){
    return account.create(ID.unique(), email, password,username)
        .then(function (response) {
            return response;
        }, function (error) {
            return error;
        });
}

async function logOutUser(){
    const result = account.deleteSession('current');
    return result;
}

async function checkLogInStatus(){
    try {
        const user = await account.get();
        console.log(user);
        return true;
    } catch (err) {
        console.log('[indexedDB.js]' + err);
        return false
    }
}

async function getAccountInfo(){
    const accountInfo = await account.get();
    return accountInfo;
}

//for the explore page, we will just fetch all the documents without any specific ordering
//or queries, we will handle searching and ordering separately in 2 different functions.
async function fetchBlogs(){
    const result = await database.listDocuments(
        DB_ID,
        '677792af0020f8485122',
        []
    );
    
    return result;
}

async function fetchSpecificBlog(blogID){
    const result = await database.getDocument(
        DB_ID, // databaseId
        '677792af0020f8485122', // collectionId
        blogID, // documentId
        [] 
    );
    return result;
}

async function fetchBlogsAndOrderByLikes(){
    const result = await database.listDocuments(
        DB_ID,
        '677792af0020f8485122',
        [
            Query.orderDesc("like_count")
        ]
    );
    
    return result;
}

async function fetchBlogsAndOrderByLastUpdated(){
    const result = await database.listDocuments(
        DB_ID,
        '677792af0020f8485122',
        [
            Query.orderDesc("last_updated")
        ]
    );
    
    return result;
}

//here, we will get the blogs based on searched movie titles.
async function searchBlogs(searchTerm){
    const result = await database.listDocuments(
        DB_ID,
        '677792af0020f8485122',
        [
            Query.or([
                Query.contains("movie_title", [searchTerm]),
                Query.contains("title", [searchTerm])
            ]),
            Query.orderAsc("title")
        ]
    );
    
    return result;
}

async function updateBlog(documentID,content){
    const result = await database.updateDocument(
        DB_ID,
        '677792af0020f8485122',
        documentID,
        {"body": content},
        []
    );
    
    console.log(result);
}

async function deleteBlog(documentID){
    const result = await database.deleteDocument(
        DB_ID,
        '677792af0020f8485122',
        documentID
    );
    
    return result;
}

function uploadBlog(
    title,
    body,
    blogCover,
    movieTitle,
    author,
    lastUpdated
){
    const promise = database.createDocument(
        DB_ID,
        '677792af0020f8485122',
        ID.unique(),
        { "title": title,
           "last_updated": lastUpdated,
           "body": body,
           "author": author,
           "blog_cover": blogCover,
           "movie_title": movieTitle 
        }
    );
    
    promise.then(function (response) {
        alert('Blog uploaded successfully! Please wait for 5 seconds');
        return response;
    }, function (error) {
        alert('Blog upload failed, please try again!S');
        return error;
    });
}

async function likeBlog(blogID, user_id,likeValue,newLikeCount){
    const result = await database.createDocument(
        DB_ID,
        '677792b80038e08f9f1d', 
        ID.unique(),
        {
            "blog_id": blogID,
            "like_value": likeValue,
            "users": user_id
        }
    );
    //here we will update the new like count in the blog collection
    const updateResult = await database.updateDocument(
        DB_ID,
        '677792af0020f8485122',
        blogID,
        {"like_count": newLikeCount},
        []
    );
    
    return {
        "result": result,
        "updadeResult":updateResult
    }
}

async function updateLike(like_id,blogID, newLikeValue, newLikeCount){
    const updateLikeValue = await database.updateDocument(
        DB_ID,
        '677792b80038e08f9f1d',
        like_id,
        {"like_value": newLikeValue},
        []
    );
    //here we will update the new like count in the blog collection
    const updateResult = await database.updateDocument(
        DB_ID,
        '677792af0020f8485122',
        blogID,
        {"like_count": newLikeCount},
        []
    );
    
    return {
        "result": updateLikeValue,
        "updadeResult":updateResult
    }
}

async function addComment(blogID, user_id,body,newCommentCount){
    let returnedComment, returnedCommentCount;
    const result = await database.createDocument(
        DB_ID,
        '677792be003146dd360e',
        ID.unique(),
        {
            "blog_id": blogID,
            "body": body,
            "user_id": user_id
        }
    );
    returnedComment = result;
    //here we will update the new comment count in the blog collection
    const updateResult = await database.updateDocument(
        DB_ID,
        '677792af0020f8485122',
        blogID,
        {"comment_count": newCommentCount},
        []
    );
    returnedCommentCount = updateResult;
    console.log(returnedComment + returnedCommentCount);    
    return {
        "result": returnedComment,
        "updateResult": returnedCommentCount
    }
}

async function fetchSpecificLike(user_id, blog_id){
    const result = await database.listDocuments(
        DB_ID,
        '677792b80038e08f9f1d',
        [
            Query.and([
                Query.equal("blog_id", [blog_id]),
                Query.equal("users", [user_id])
            ])
        ]
    );
    
    return result;
}

async function fetchUserLikes(userID){
    const result = await database.listDocuments(
        DB_ID,
        '677792b80038e08f9f1d',
        [   Query.and([
                Query.equal("users", [userID]),
                Query.equal("like_value", true)
        ])
        ]
    );
    return result.total;
}

async function fetchUserComments(userID){
    const result = await database.listDocuments(
        DB_ID,
        '677792be003146dd360e',
        [   
                Query.equal("user_id", [userID]),
        ]
    );
    return result.total;
}

async function fetchComments(){
    const allComments = await database.listDocuments(
        DB_ID,
        '677792be003146dd360e',
        []
    );
    return allComments;
}

async function fetchAssocUser(userid){
    const result = await database.getDocument(
        DB_ID,
        '677d69370031f663e68d',
        userid, 
        []
    );

    return result.username;
}

async function getAggregateBlogs(){
    const result = await fetchBlogs();
    console.log('[AdminHome]' + result);
    return result.total;
}

async function getAggregateLikes(){
    const result = await fetchBlogs();
    const totalLikes = result.documents.reduce((sum, blog) => sum + (blog.like_count || 0), 0);
    console.log('[AdminHome]' + totalLikes);
    return totalLikes;
}

async function getAggregates(){
    const totalBlogs = await getAggregateBlogs();
    const totalLikes = await getAggregateLikes();

    return {
        "total_likes": totalLikes,
        "total_blogs": totalBlogs
    }
}

export {
    logInUser,
    signUpUser,
    logOutUser,
    checkLogInStatus,
    fetchBlogs,
    fetchSpecificBlog,
    updateBlog,
    fetchComments,
    fetchAssocUser,
    deleteBlog,
    uploadBlog,
    likeBlog,
    addComment,
    getAccountInfo,
    searchBlogs,
    fetchBlogsAndOrderByLikes,
    fetchBlogsAndOrderByLastUpdated,
    getAggregates,
    addUsertoDB,
    fetchSpecificLike,
    updateLike,
    fetchUserLikes,
    fetchUserComments
}