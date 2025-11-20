//imports
import { fetchBlogsAndOrderByLastUpdated, fetchBlogsAndOrderByLikes, checkLogInStatus, getAccountInfo } from "../src/appwrite";

//constants
const latestContainer = document.getElementById('latest-container');
const popularContainer = document.getElementById('popular-container');

//function definitions

async function getAccountType(){
  const accountInfo = await getAccountInfo();
      if(accountInfo.labels.length === 0){
          return;
      }
  
      if(accountInfo.labels[0] === 'admin'){
          window.location.href = "admin/Adminhome.html"
          return;
      }
  
      return;
}

async function checkLogInStatusAndInitiatePopUp(){
  const isLoggedIn = await checkLogInStatus();
  if(isLoggedIn){
    await getAccountType()
    return;
  }
  const loginPrompt = document.createElement('div');
  loginPrompt.className = "accountPrompt";
  loginPrompt.innerHTML = `
    <div class="prompt">
          <h2>Please Log In or Sign up to Continue.</h2>
          <div class="btn-group">
            <button id="redirect">Login/Signup</button>
            <button id="close-prompt">Cancel</button>
          </div>
    </div>
  `;
  document.body.appendChild(loginPrompt);
  const loginButton = document.getElementById('redirect');
  loginButton.addEventListener('click', ()=>{window.location.href = '/loginsignup.html'});
  const closePromptButton = document.getElementById('close-prompt');
  closePromptButton.addEventListener('click', ()=>{loginPrompt.remove()});

}

function createCards(title, likes, comments, author, blogID, cover, parentContainer){
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
    parentContainer.appendChild(blogCard);
    blogCard.addEventListener('click',()=>{
        //redirect to the read page and pass the blog id in the URL
         window.location.href = `../../blogread.html?id=${blogID}`;
    });
}

async function fetchLatestAndDisplay(){
    const blogs = await fetchBlogsAndOrderByLastUpdated();
    blogs.documents.forEach(blog=>{
        createCards(
            blog.title,
            blog.like_count,
            blog.comment_count,
            blog.author,
            blog.$id,
            blog.blog_cover,
            latestContainer
         );
    });
}

async function fetchPopularAndDisplay(){
    const blogs = await fetchBlogsAndOrderByLikes();
    blogs.documents.forEach(blog=>{
        createCards(
            blog.title,
            blog.like_count,
            blog.comment_count,
            blog.author,
            blog.$id,
            blog.blog_cover,
            popularContainer
        );
    })
}

async function populatePage(){
    await fetchLatestAndDisplay();
    await fetchPopularAndDisplay();
}

populatePage();
checkLogInStatusAndInitiatePopUp();