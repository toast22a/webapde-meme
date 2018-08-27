//var user = require('../model/User');
const express = require("express")
const fs = require("fs")
const path = require("path")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const hbs = require("hbs")
const multer = require("multer")

const app = express();
const router = express.Router()
//const router = express.Router();
//const app = express();
const urlencoder = bodyparser.urlencoded({
    extended: false
})

router.use(urlencoder)

module.exports.controller = function (router) {

    router.post("/login", urlencoder, (req, res) => {

        console.log("POST /login")

        var user = {
            username: req.body.loginUser,
            password: req.body.loginPassword
        }

        console.log(user.password)

        if (user.username && user.password) {
            console.log(user.username + "has logged in")
            req.session.username = user.username
            res.render("homepage.hbs", {
                username: user.username
            })
        } else {
            console.log("missing entry log in failed")
            res.render("index.hbs")
        }
    })

    router.post("/register", urlencoder, (req, res) => {
        console.log("POST /register")
        var username = req.body.signUser;
        var pass = req.body.signPassword;
        var desc = req.body.signDescription;

        if (username && pass) {
            console.log(username + "has signed up")
            req.session.username = username
            req.session.description = username
            res.render("homepage.hbs", {
                username: username
            })
        } else {
            console.log("missing entry sign up failed")
            res.render("index.hbs")
        }
    })

    router.get("/logout", (req, res) => {
        console.log("GET /logout")
        console.log("User " + req.session.username + " logged out")

        req.session.destroy((err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Succesfully destroyed session")
            }
        });
        res.render("index.hbs")
    })

}
