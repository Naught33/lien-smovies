 //imports
 import { fetchBlogsAndOrderByLikes, getAggregates } from "../../src/appwrite";


 //constants
const blogContainer = document.getElementById('blogs-container');
const aggregateBlogs = document.getElementById('aggregate-blogs');
const aggregateLikes = document.getElementById('aggregate-likes');


 //functions

 async function fetchAndDisplayBlogs(){
    const blogs = await fetchBlogsAndOrderByLikes();
    blogs.documents.forEach(blog=>{
        const blogItem = document.createElement('div');
        blogItem.classList.add('blog_card');
        blogItem.style.background = `linear-gradient(0deg, #000000ec,#00000061),url(${blog.blog_cover})`;
        blogItem.style.backgroundSize = 'cover';
        blogItem.style.backgroundPosition = 'center';
        blogItem.innerHTML = `
        <div class="blog_card">
        <span class="engagement_info">
          <p>
            <ion-icon name="heart"></ion-icon> 
            <span>${blog.like_count}</span>
          </p>
          <p>
            <ion-icon name="chatbubble-outline"></ion-icon> 
            <span>${blog.comment_count}</span>
          </p>
        </span>
        <h3>${blog.title}</h3>
        <p class="author">${blog.author}</p>
      </div> 
        `;
        blogContainer.appendChild(blogItem);
        blogItem.addEventListener('click',()=>{
            //redirect to the read page and pass the blog id in the URL
            window.location.href = `../../blogread.html?id=${blog.$id}`;
        });
    });
 }

 async function getAggregateBlogs(){
    const totalBlogs = (await getAggregates()).total_blogs;
    aggregateBlogs.textContent = totalBlogs;
 }

 async function getAggregateLikes(){
    const totalLikes = (await getAggregates()).total_likes;
    aggregateLikes.textContent = totalLikes;
 }

 //function calls

 fetchAndDisplayBlogs();
 getAggregateBlogs();
 getAggregateLikes();

