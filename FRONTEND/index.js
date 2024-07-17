import { handleSignupSubmit } from "./signup.js";

const form  = document.querySelector('form');

form.addEventListener('submit', handleSignupSubmit);