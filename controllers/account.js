//imports
import { getAccountInfo, checkLogInStatus, fetchUserLikes, fetchUserComments, logOutUser } from "../src/appwrite";

//constants
const displayName = document.getElementById('username');
const displayPic = document.getElementById('user-pic')
const email = document.getElementById('email');
const dateCreated = document.getElementById('date-created');
const loginOutButton = document.getElementById('logout');
const deleteAccountButton = document.getElementById('delete-account');
const totalLikes = document.getElementById('likes');
const totalComments = document.getElementById('comments');


//function definitions

async function checkIfLoggedIn(){
    const isLoggedIn = await checkLogInStatus();
  if(isLoggedIn){
    fetchAccountInfoAndDisplay();
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
  loginButton.addEventListener('click', ()=>{window.location.href = 'loginsignup.html'});
  const closePromptButton = document.getElementById('close-prompt');
  closePromptButton.addEventListener('click', ()=>{loginPrompt.remove()});
}

async function fetchAccountInfoAndDisplay(){
    const accountInfo = await getAccountInfo();
    const userLikes = await fetchUserLikes(accountInfo.$id);
    const userComments = await fetchUserComments(accountInfo.$id);
    console.log(accountInfo);
    displayName.innerText = accountInfo.name;
    displayPic.innerText = accountInfo.name.split('')[0];
    email.innerText = accountInfo.email;
    dateCreated.innerText = accountInfo.$createdAt.split('T')[0];
    totalLikes.innerText = userLikes;
    totalComments.innerText = userComments;
}

checkIfLoggedIn();

async function logout(){
    await logOutUser();
    window.location.href = "loginsignup.html"
}

function deleteAccount(){
  const confirmation = confirm(`Are you sure you want to delete your account?`);
  if (confirmation) {
    window.location.href = 'index.html'
    return;
  }
  return;
}

//function calls

//event listeners
loginOutButton.addEventListener('click',()=>{
  logout();
});

deleteAccountButton.addEventListener('click',()=>{
  deleteAccount();
});