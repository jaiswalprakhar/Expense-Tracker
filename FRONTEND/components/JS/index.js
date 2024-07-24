import { handleSignupSubmit } from "./signup.js";
import { handleLoginSubmit } from "./login.js";
import { loadContent } from "./loadContent.js";
import { handleExpenseSubmit } from "./expenses.js";

const signup  = document.getElementById('signup');
const login = document.getElementById('login');
const expenses = document.getElementById('expenses');

if(signup)  {
    signup.addEventListener('submit', handleSignupSubmit);
}

if(login)   {
    login.addEventListener('submit', handleLoginSubmit);
}

if(expenses)  {
    expenses.addEventListener('submit', handleExpenseSubmit);
}

document.addEventListener('DOMContentLoaded', loadContent);