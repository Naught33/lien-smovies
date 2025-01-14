//imports
import { fetchBlogs, deleteBlog, searchBlogs } from "../../src/appwrite";

//constants
const searchQuery = document.getElementById('search-query');
const searchButton = document.getElementById('search-button');



//function definitions

async function fetchSearchedBlogs(){
    const query = searchQuery.value.trim();
    console.log(query);
    if(query === ''){
        return;
    }
    removeCurrentTiles()
    const fetchedBlogs = await searchBlogs(query);
    console.log(fetchBlogs.documents);
    fetchedBlogs.documents.forEach(blog=>{
        createTiles(blog.title, blog.last_updated, blog.$id);
    });
        
}

function removeCurrentTiles(){
    const tiles = document.querySelectorAll('.blog-tile');
    tiles.forEach(tile => {
        tile.remove();
        });
}

function createTiles(title, lastUpdated,blogID){
    const blogTile = document.createElement('div');
        blogTile.className = "blog-tile";
        blogTile.innerHTML = ` 
        <h4>${title}</h4>
        <p>${lastUpdated.split('T')[0]}</p>
        <div class="btn-group">
          <button style="background: #16DB65; color: white;">Edit</button>
          <button style="background: #FF4343; color: white;">Delete</button>
        </div>`;
        document.body.appendChild(blogTile);
        const deleteButton = blogTile.querySelector('button:nth-child(2)');
        deleteButton.addEventListener('click', () => deleteBlogProcess(blogID));
        const editButton = blogTile.querySelector('button:nth-child(1)');
        editButton.addEventListener('click', () => {window.location.href = `writeblog.html?id=${blogID}`});
}

async function deleteBlogProcess(blogid){
const confirmation = confirm(`Are you sure you want to delete the blog with ID: ${blogid}?`);
  if (confirmation) {
    await deleteBlog(blogid);
    alert(`Blog with ID: ${blogid} deleted.`);
  }
}

async function fetchAndDisplayBlogs(){
    const blogs = await fetchBlogs();
    blogs.documents.forEach(blog=>{
       createTiles(blog.title, blog.last_updated, blog.$id);
    });
}


//function calls

fetchAndDisplayBlogs();

//event listeners

searchButton.addEventListener('click',()=>{
    fetchSearchedBlogs();
});

searchQuery.addEventListener('input',()=>{
    if(searchQuery.value === ''){
        fetchAndDisplayBlogs();
    }
});