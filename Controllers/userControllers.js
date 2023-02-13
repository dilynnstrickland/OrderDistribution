"use strict";
const userModel = require("../Models/userModel");
const argon2 = require('argon2');

async function createNewUser(req, res) {
    const {username, password, role, location} = req.body;
    const create = await userModel.addUser(username, password, role, location);
    if(create){
        return res.redirect("/login");
    } else {
        return res.sendStatus(409);//Conflict
    }
}

async function login(req, res) {
    const {username, password} = req.body;
    const user = userModel.getUserByUsername(username);
    if(!user) {
        return res.redirect("/");
    } 
    const {passwordhash} = user;
    if(await argon2.verify(passwordhash, password)) {
        req.session.regenerate((err) => {
            if(err) {
                console.error(err);
                return res.sendStatus(500);//Internal Server Error
            } 
            req.session.user = {};
            req.session.user.username = username;
            req.session.user.userID = user.userid;
            req.session.role = user.role;
            req.session.user.location = user.location;
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