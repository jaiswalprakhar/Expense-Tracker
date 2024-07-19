import { handleSignupSubmit } from "./signup.js";
import { handleLoginSubmit } from "./login.js";

const signup  = document.getElementById('signup');
const login = document.getElementById('login');

if(signup)  {
    signup.addEventListener('submit', handleSignupSubmit);
}

if(login)   {
    login.addEventListener('submit', handleLoginSubmit);
}