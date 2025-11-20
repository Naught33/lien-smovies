//imports
import fetchMoviePosters from "../../src/tmdbApi";
import { uploadBlog, getAccountInfo } from "../../src/appwrite";

//constants
const currentDate = new Date().toLocaleDateString('en-US');

let movieURL = null;

//element grabbing
const blogTitle = document.getElementById('title');
const blogContent = document.getElementById('content');
const movieTitle = document.getElementById('movie_title');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const moviePosterURL = document.getElementById('posterURL');
const uploadButton = document.getElementById('uploadButton');
const DiscardButton = document.getElementById('discardButton');
const fetchPostersButton = document.getElementById('getposterbtn');
const posterModal = document.getElementById('poster-modal');
const postersHolder = document.getElementById('poster-holder');
const closeModal = document.getElementById('close-modal');

function fetchMoviePoster(searchQuery){
    posterModal.style.display = "block";
    postersHolder.innerHTML = "";
        fetchMoviePosters(searchQuery).then(posterUrls => {
        posterUrls.forEach(url => {
                const posterElement = document.createElement('div');
                posterElement.style.background = `url(${url})`;
                posterElement.style.backgroundPosition = 'center';
                posterElement.style.backgroundSize = 'cover';
                posterElement.classList.add('blog_card');
                postersHolder.appendChild(posterElement);

                posterElement.addEventListener('click',()=>{
                    moviePosterURL.innerText = url;
                    posterModal.style.display = "none";
                    movieURL = url;
                    console.log(movieURL);
                })
            });
        });
    }

function updateWordCharCount(){
    //word count
    const wordcount = blogContent.textContent.split(' ').length;
    //char count
    const charcount = blogContent.textContent.length;
    //update whenever the body or title changes
    wordCount.textContent = wordcount;
    charCount.textContent = `${charcount}/2500`;
}

function cancel(){
    const confirmation = confirm(`Are you sure you want to discard progress?`);
    if (confirmation) {
        blogTitle.textContent = "Click here to insert blog title...";
        blogContent.textContent = "Click here to Insert body...";
        moviePosterURL.textContent = "not chosen...";
        wordCount.textContent = "0"
        charCount.textContent = "0/2500"
        blogTitle.style.opacity = 0.5;
        blogContent.style.opacity = 0.5;
        return;
    }
    return;    
}

function confirmUpload(){
    if(movieURL === null || blogTitle.textContent ==='' || blogContent.textContent ==='' || blogTitle.textContent ==='Click here to insert blog title...' || blogContent.textContent ==='Click here to Insert body...'){
        alert("Please make sure you have written a blog and chosen a poster for it!");
        return;
    }

    uploadBlog(
        blogTitle.textContent,
        blogContent.textContent,
        movieURL,
        movieTitle.value,
        "Lien",
        currentDate
    );

    setTimeout(()=>{
        window.location.reload();
    },4000);

}

uploadButton.addEventListener('click',()=>{
    confirmUpload()
    console.log(movieURL);
});

DiscardButton.addEventListener('click',()=>{
    cancel();
});

blogTitle.addEventListener('input',(e)=>{
    if(e.target.textContent === "Click here to insert blog title..."){
        e.target.style.opacity = 0.5;
    }else{
        e.target.style.opacity = 1;
    }
});

blogContent.addEventListener('input',(e)=>{
    if(e.target.textContent === "Click here to insert blog title..."){
        e.target.style.opacity = 0.5;
        wordCount.textContent = "0";
        charCount.textContent = "0/2500";
    }else{
        e.target.style.opacity = 1;
        updateWordCharCount();
    }
});

fetchPostersButton.addEventListener('click',()=>{
    if(movieTitle.value === ''){
        alert("Please enter a movie title");
        return;
    }
    fetchMoviePoster(movieTitle.value);
});

closeModal.addEventListener('click',()=>{
    posterModal.style.display = "none";
});