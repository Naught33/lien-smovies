//imports
import { getAccountInfo } from "./appwrite";

//constants
const adminURL = "./admin/AdminHome.html";
const secondaryAdminURL = "Adminhome.html";
const homeButton = document.getElementById('home');
 


async function changeHomePageUrl(){
    const accountInfo = await getAccountInfo();
    if(accountInfo.labels.length === 0){
        return;
    }

    if(accountInfo.labels[0] === 'admin'){
        if(homeButton.getAttribute('href') === secondaryAdminURL){
            return;
        }
        homeButton.setAttribute('href', adminURL);
        return;
    }

    return;
}

changeHomePageUrl();