"use strict";

const form = document.getElementById("loginForm");
async function getNextPage(event){
event.preventDefault();

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;
const data = {username, password};

try{
    const response = await fetch("/api/login", {
        "method":"POST",
        "headers" : {
            "Content-Type" :"application/json"
        },
        "body":JSON.stringify(data)
    });
    if(response.ok) {
        document.location.href = "/dashboard.ejs";
    } else {
        document.location.href = "/login.ejs"
    }
} catch (err) {
    console.error(err);
}
}
form.addEventListener("submit", getNextPage);