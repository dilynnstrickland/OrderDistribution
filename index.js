"use strict";
require("dotenv").config();

const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded( {extended: false }));
app.use(express.static("public", {index: "index.html", extensions: ["html"]}));

// The maximum request body size is 100 kilobytes; however, my word list was
// ~150kb. So I just doubled the request body size limit
app.use(express.json({limit: '200kb'}));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on ${process.env.PORT}`);
});