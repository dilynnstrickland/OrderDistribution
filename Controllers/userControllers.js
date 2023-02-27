"use strict";
const userModel = require("../Models/userModel");
const argon2 = require('argon2');

async function createNewUser(req, res) {
    const {username, password, email, firstName, lastName} = req.body;
    const create = await userModel.addUser(username, password, email, firstName, lastName);
    if(create){
        return res.redirect("/login");
    } else {
        return res.sendStatus(409);//Conflict
    }
}

async function login(req, res) {
    const {username, password} = req.body;

    if (!req.body.username || !req.body.password){
        console.log("check");
        return res.sendStatus(400);
    }

    if (!userModel.getUserByUsername(username)){ // if user non-existent
        console.log("check2");
        return res.sendStatus(400);
    }
    
    const user = userModel.getUserByUsername(username);
    if(!user) {
        console.log("HEY");
        return res.sendStatus(400);
    } 
    console.log("HE");
    const {passwordHash} = user;
    console.log(passwordHash)
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
            req.session.isLoggedIn = true;
            return res.sendStatus(200);//OK
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
    createNewUser,
    login,
    logOut,
    // editUser,
    // deleteUser
}