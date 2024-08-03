import { handleSignupSubmit } from "./signup.js";
import { handleLoginSubmit } from "./login.js";
import { loadContent } from "./loadContent.js";
import { handleExpenseSubmit, handlePremiumUser } from "./expenses.js";

const signup  = document.getElementById('signup');
const login = document.getElementById('login');
const expenses = document.getElementById('expenses');
const premiumUser = document.getElementById('buyPremiumMembership');

if(signup)  {
    signup.addEventListener('submit', handleSignupSubmit);
}

if(login)   {
    login.addEventListener('submit', handleLoginSubmit);
}

if(expenses)  {
    expenses.addEventListener('submit', handleExpenseSubmit);
}

if(premiumUser) {
    premiumUser.addEventListener('click', handlePremiumUser);
}

document.addEventListener('DOMContentLoaded', loadContent);