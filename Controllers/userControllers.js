"use strict";
const userModel = require("../Models/userModel");
const companyModel = require("../Models/companyModel");
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
    return res.redirect("/manageEmployee");
}

async function login(req, res) {
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
                return res.sendStatus(400);
            }
            if(user.location){
                req.session.user.location = user.location;
            } else {
                return res.sendStatus(400);
            }
            req.session.isLoggedIn = true;
            console.log("Login Successful. Redirecting to Dashboard.")
            if( 0 <= user.role < 5) {
                res.redirect('/dashboard');
            //req.session.user.role = user.role;
            }
            res.redirect("/dashboard");//OK // This may not actually transmit because of redirect
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

// function editUser(req, res){
//     const username = req.params['username'];
//     userModel.editUserByUsername(req, username);
//     res.sendStatus(200);
    // try{
    //     res.sendStatus(200);
    // } catch(err){
    //     res.sendStatus(error);
    // }

// function deleteUser(req, res){
//     const username = req.params['username'];
//     try{
//         userModel.deleteUserbyUsername(username);
//         res.redirect("/register");
//     } catch(err){
//         res.sendStatus(400);
//     }
// }

module.exports = {
    createNewEmployee,
    createNewOwner,
    login,
    logOut,
    // editUser,
    // deleteUser
}