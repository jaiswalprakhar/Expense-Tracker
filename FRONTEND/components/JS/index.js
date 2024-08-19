import { handleSignupSubmit } from "./signup.js";
import { handleLoginSubmit } from "./login.js";
import { loadContent } from "./loadContent.js";
//import { handleExpenseSubmit, handlePremiumUser } from "./expenses.js";
import { handleExpenseSubmit } from "./expenses.js";
import { handleForgotPassword } from "./forgotPassword.js";
import { handleUpdatePassword } from "./updatePassword.js";

const signup  = document.getElementById('signup');
const login = document.getElementById('login');
const expenses = document.getElementById('expenses');
//const premiumUser = document.getElementById('buyPremiumMembership');
const forgotPassword = document.getElementById('forgotPassword');
const updatePassword = document.getElementById('updatePassword');

if(signup)  {
    signup.addEventListener('submit', handleSignupSubmit);
}

if(login)   {
    login.addEventListener('submit', handleLoginSubmit);
}

if(expenses)  {
    expenses.addEventListener('submit', handleExpenseSubmit);
}

/*if(premiumUser) {
    premiumUser.addEventListener('click', handlePremiumUser);
}*/

if(forgotPassword)  {
    forgotPassword.addEventListener('submit', handleForgotPassword);
}

if(updatePassword)   {
    updatePassword.addEventListener('submit', handleUpdatePassword);
}

document.addEventListener('DOMContentLoaded', loadContent);