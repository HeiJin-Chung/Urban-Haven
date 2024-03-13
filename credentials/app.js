let loginCard=document.getElementById('card-front');
let signupCard=document.getElementById('card-back');

let reglink=document.getElementById('regHere');
let signlink=document.getElementById('signHere');

reglink.addEventListener('click',()=>{
    loginCard.style.display="none";
    signupCard.style.display="flex";
});

signlink.addEventListener('click',()=>{
    loginCard.style.display="flex";
    signupCard.style.display="none";
});

const api_login='https://prod-155.westus.logic.azure.com:443/workflows/c446aa74884d4ff88316f0599e98f8d2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mGDWGKQr6wAPSA9AO6wQGvwbbEDauooFzkULilR-rF0';

const api_signin='https://prod-19.westus.logic.azure.com:443/workflows/19ca5e3bc35a4e0d9357191e0859166c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=PJPyJI7imhzpOzV40XfiQ0wUWVfEiOUrr7yCXGRXhxI';

async function login(){
    showLoadingOverlay();

    let email= document.getElementById('em').value;
    let pwd= document.getElementById('pwd').value;

    var myHeaders=new Headers();
    myHeaders.append("Content-Type","application/json");

    var record=JSON.stringify({
        email:email,
        password:pwd
    });

    const options={
        method:'POST',
        headers:myHeaders,
        body:record,
        redirect:'follow'
    }

    const response=await fetch(api_login,options);
    var result=await response.json();

    
    hideLoadingOverlay();
    
    if(result.status===200){
        let username=result.payload[0].crdeb_name;
        window.location.href = `/homePage?username=${encodeURIComponent(username)}`;
    }else{
        document.getElementById('pwdL-error').innerText='Incorrect Email/Password';
    }

}

function signin(){
    showLoadingOverlay();

    let username=document.getElementById('username').value;
    let email= document.getElementById('em2').value;
    let pwd= document.getElementById('pwd2').value;

    if(!validateUsername(username)){
        hideLoadingOverlay();
        return;
    }

    if(!validateMail(email) ){
        hideLoadingOverlay();
        return;
      }

    if(!validatePassword(pwd)){
      hideLoadingOverlay();
      return;
    }

    var myHeaders=new Headers();
    myHeaders.append("Content-Type","application/json");

    var record=JSON.stringify({
        username:username,
        email:email,
        password:pwd,
    });

    const options={
        method:'POST',
        headers:myHeaders,
        body:record,
        redirect:'follow'
    }

    fetch(api_signin,options)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            hideLoadingOverlay();
            
            if (result.status === 200){
                window.location.href = `/homePage?username=${encodeURIComponent(username)}`;
                
            }else if(result.status===500){
                document.getElementById('error-msg').innerText='User with the given Username/Email already exists';
            }
        })
        .catch((error) => console.log("Error: ", error));
}

// Loading screen
function showLoadingOverlay() {
    let loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "block";
}

function hideLoadingOverlay() {
    let loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "none";
}

/* Validation Code */

function validateUsername(username){

    if (!username) {
        document.getElementById('error-msg').innerText='Username cannot be empty';
        return false;
    }

    // Check if the username length is between 3 and 16 characters
    if (username.length < 3 || username.length > 16) {
        document.getElementById('error-msg').innerText='Username length should be between 3 and 16 characters';
        return false;
    }

    // Check if the username consists of a single word (no spaces)
    if (!/^\w+$/.test(username)) {
        document.getElementById('error-msg').innerText='Username must be a single word';
        return false;
    }

    document.getElementById('error-msg').innerText = "";    
return true;
}

function validateMail(email){
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email)) {
        document.getElementById('error-msg').innerText = "";
        return true;
    }else {
      document.getElementById('error-msg').innerText = 'Invalid email address';
      return false;
    }
}

function validatePassword(pwd){
    
    if(pwd===""){
      document.getElementById('error-msg').innerText='Password is Required'
      return false;
    }

    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (passwordRegex.test(pwd)){
      document.getElementById('error-msg').innerText ="";
      return true;
    }else{
        document.getElementById('error-msg').innerText = 'Password must be at least 8 characters long & include  Uppercase, lowercase & digits';
        return false;
    }

}