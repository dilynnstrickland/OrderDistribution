"use strict";
const userModel = require("../Models/userModel");
const companyModel = require("../Models/companyModel");
const locationModel = require("../Models/locationModel");
const argon2 = require('argon2');

async function createNewOwner(req, res) {
    const {username, password, email, firstName, lastName, companyName, companyAddr} = req.body;
    const newCompany = await companyModel.addCompany(companyName, companyAddr);
    const newUser = await userModel.addOwner(username, password, email, firstName, lastName, newCompany);

    if(!newCompany){
        return res.sendStatus(409);//Conflict
    }
    if(!newUser){
        return res.sendStatus(409);//Conflict
    }
    
    return res.redirect("/login");
}

async function createNewEmployee(req, res) {
    const {username, password, email, firstName, lastName, location} = req.body;
    const company = req.session.user.company;
    console.log(company, location);
    const newEmployee = await userModel.addEmployee(username, password, email, firstName, lastName, location, company);

    if(!newEmployee){
        return res.sendStatus(409);//Conflict
    }
    return res.redirect("/dashboard/accounts");
}

async function login(req, res) {
    console.log("Entered login function")
    const {username, password} = req.body;

    if (!req.body.username || !req.body.password){
        console.log("User has not entered username or password");
        return res.sendStatus(400);
    }

    if (!userModel.getUserByUsername(username)){ // if user non-existent
        console.log("User does not exist.");
        return res.sendStatus(400);
    }
    
    const user = userModel.getUserByUsername(username);

    if(!user) {
        console.log("User does not exist");
        return res.sendStatus(400);
    } 
    console.log("User exists.");
    const {passwordHash} = user;
    if(await argon2.verify(passwordHash,password)) {
        req.session.regenerate((err) => {
            if(err) {
                console.error(err);
                return res.sendStatus(500);//Internal Server Error
            } 
            req.session.user = {};
            req.session.user.username = username;
            req.session.user.userID = user.userID;
            req.session.user.email = user.email;
            req.session.user.firstName = user.firstName;
            req.session.user.lastName = user.lastName;
            if(user.company){
                req.session.user.company = user.company;
            } else {
                console.log("Company Not Assigned")
                return res.sendStatus(400);
            }
            if(user.location){
                req.session.user.location = user.location;
                req.session.user.locationID = user.locationID;
            } else {
                console.log("Location not Assigned, redirecting to RFL");
                return res.redirect("/registerFirstLocation");
            }
            req.session.isLoggedIn = true;
            console.log("Login Successful. Redirecting to Dashboard.")
            if( 0 <= user.role < 5) {
                req.session.user.role = user.role;
            }
            return res.redirect('/dashboard'); // OK
        });
    } else {
        return res.sendStatus(400);//Bad Request
    }
    
}

function logOut(req, res) {
    if(req.session.user && req.session.isLoggedIn){
        req.session.destroy();
        res.redirect("/");
    }
}

module.exports = {
    createNewEmployee,
    createNewOwner,
    login,
    logOut,
}