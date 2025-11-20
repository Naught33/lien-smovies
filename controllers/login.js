import { addUsertoDB, logInUser, signUpUser } from "../src/appwrite";


const switchSignUp = document.getElementById('clickable_1');
const switchLogin = document.getElementById('clickable_2');
const loginForm = document.getElementById('Login');
const signupForm = document.getElementById('Signup');
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const loginMessage = document.getElementById('messageLogin');
const signupMessage = document.getElementById('messageSignup');
const info = document.getElementById('info');
let LoginIsVisible = true;




function validateLogin(){
    let email = document.getElementById('lemail').value;
    let password = document.getElementById('password').value;
    if(email == "" || password == ""){
        loginMessage.innerText = "please fill in all fields";
        loginMessage.style.opacity = '1';
        loginMessage.style.color = 'red';
        loginForm.classList.add('shakeForm');
        console.log("Conditions failed");
        setTimeout(()=>{
            loginForm.classList.remove('shakeForm');
        },4000);
        return false;
    }
    return true;
}


async function validateSignUp(){
    let username = document.getElementById('cusername').value;
    let password = document.getElementById('cpassword').value;
    let email = document.getElementById('email').value;

    if(username=="" || password=="" || email==""){
        signupMessage.innerText = "please fill in all fields";
        signupMessage.style.opacity = '1';
        signupMessage.style.color = 'red';
        signupForm.classList.add('shakeSignup');
        setTimeout(()=>{
            signupForm.classList.remove('shakeSignup');
            },4000);
        return
    }

            //implement sign up logic here
            signUpUser(username, email, password).then((res)=>{
                addUsertoDB(res.$id, username, email)
                console.log(res);
                switchEntryState();
                loginMessage.innerText = "Account created, now login";
                loginMessage.style.opacity = '1';
                loginMessage.style.color = 'green';
            });
    }



function switchEntryState(){
    if(LoginIsVisible == true){
        loginForm.classList.add('loginhidden');
        signupForm.classList.add('signupopen');
        LoginIsVisible = false;
    }else{
        loginForm.classList.remove('loginhidden');
        signupForm.classList.remove('signupopen');
        LoginIsVisible = true;
    }
}

async function handleLoginResult(){
    let email = document.getElementById('lemail').value;
    let password = document.getElementById('password').value;
    if(!validateLogin()){
        console.log('[login]'+validateLogin());
        return;
    }
    const login = await logInUser(email, password);
    if(login===false){
        loginMessage.innerText = "Invalid email or password";
    }
    window.location.href = "index.html";
}

switchSignUp.addEventListener('click',()=>{
    switchEntryState();
});

switchLogin.addEventListener('click',()=>{
    switchEntryState();
    console.log('clicked')
});

loginButton.addEventListener('click',(e)=>{
    e.preventDefault()
    handleLoginResult();
});

signupButton.addEventListener('click',(e)=>{
    e.preventDefault();
    validateSignUp();
});