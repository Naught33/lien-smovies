//imports
import { searchBlogs, fetchBlogs } from "../src/appwrite";

//constants
const searchQuery = document.getElementById('search-query');
const searchButton = document.getElementById('search-button');
const blogContainer = document.getElementById('all-blog-container');

//function definitions
function createCards(title, likes, comments, author, blogID, cover){
    const blogCard = document.createElement('div');
    blogCard.className = "blog_card";
    blogCard.style.background = `linear-gradient(0deg, #000000ec,#00000061),url(${cover})`;
    blogCard.style.backgroundSize = 'cover';
    blogCard.style.backgroundPosition = 'center'; 
    blogCard.innerHTML = ` 
    <div class="blog_card">
        <span class="engagement_info">
          <p>
            <ion-icon name="heart"></ion-icon> 
            <span>${likes}</span>
          </p>
          <p>
            <ion-icon name="chatbubble-outline"></ion-icon> 
            <span>${comments}</span>
          </p>
        </span>
        <h3>${title}</h3>
        <p class="author">${author}</p>
      </div>`;
    blogContainer.appendChild(blogCard);
    blogCard.addEventListener('click',()=>{
        //redirect to the read page and pass the blog id in the URL
         window.location.href = `../../blogread.html?id=${blogID}`;
    });
}

function removeCurrentCards(){
    const cards = blogContainer.querySelectorAll('.blog_card');
    cards.forEach(card => {
        card.remove();
        });
}

async function fetchAndDisplayBlogs(){
    const blogs = await fetchBlogs();
    blogs.documents.forEach(blog=>{
        createCards(
            blog.title,
            blog.like_count,
            blog.comment_count, 
            blog.author, 
            blog.$id, 
            blog.blog_cover
        );
    });
}

async function searchBlogsAndDisplay(query){
    if(query === ''){
        return;
    }
    removeCurrentCards();
    const blogs = await searchBlogs(query);
    blogs.documents.forEach(blog=>{
        createCards(
            blog.title,
            blog.like_count,
            blog.comment_count, 
            blog.author, 
            blog.$id, 
            blog.blog_cover
        );
    });
}

//function calls
fetchAndDisplayBlogs();

//event listeners
searchQuery.addEventListener('input',()=>{
    if(searchQuery.value === ''){
        fetchAndDisplayBlogs();
    }
});

searchButton.addEventListener('click',()=>{
    searchBlogsAndDisplay(searchQuery.value);
})