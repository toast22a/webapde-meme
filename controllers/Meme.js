//----------------Sample-------------------//
//var mongoose = require('mongoose')
//var Video = require('../models/user');
//module.exports.controller = function(router) {
//
///**
// * a home page route
// */
//  router.get('/signup', function(req, res) {
//      // any logic goes here
//      res.render('users/signup')
//  });
//
///**
// * About page route
// */
//  router.get('/login', function(req, res) {
//      // any logic goes here
//      res.render('users/login')
//  });
//
//}

var meme = require('../models/Meme');
//const router = express.Router();
//const app = express();
const express = require("express")
const fs = require("fs")
const path = require("path")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const hbs = require("hbs")
const app = express();
const router = express.Router()
const urlencoder = bodyparser.urlencoded({
    extended: false
})

router.use(urlencoder)
const multer = require("multer")



const UPLOAD_PATH = path.resolve(__dirname, "D:\\Desktop\\webapde-meme\\uploads\\" )

const upload = multer({
  dest: UPLOAD_PATH,
    filename: function(req, file, cb){
    cb(null,file.originalname + path.extname(file.originalname));
  },
  limits: {
    fileSize : 10000000,
    files : 2
  }
})

module.exports.controller = function (router) {

    router.get("/searchByTag_guest", urlencoder, (req, res) => {
        console.log("GET /searchByTag_guest")
        var username = req.session.username
        var searched = req.query.searchText
        console.log(searched)
        res.render("searchByTag_guest.hbs", {
            username:username,
            searchTag: searched
        })
    })

    router.get("/guestViewMeme", (req, res) => {
        console.log("GET /guestViewMeme")
        res.render("guestViewMeme.hbs")
    })

    router.get("/searchByTag", urlencoder, (req, res) => {
        console.log("GET /searchByTag")
        var searched = req.query.searchText
        console.log(searched)
        var username = req.session.username
        console.log(username);
        if(username){
             res.render("searchByTag.hbs", {
            username: username,
            searchTag: searched
        })}else{
                 res.render("index.hbs");
             }

    })

    router.get("/privateViewMeme", (req, res) => {
        console.log("GET /privateViewMeme")
        var username = req.session.username
        if(username){
            res.render("privateViewMeme.hbs", {
            username: username
        })
        }else{
            res.render("index.hbs")
        }

    })

    router.get("/viewUser", urlencoder, (req, res) => {
        console.log("GET /viewUser")
        var username = req.session.username
        var desc = req.session.description
        if (desc) {
            res.render("ViewUser.hbs", {
                username: username,
                viewDescription: desc
            })
        } else if(username){
            res.render("ViewUser.hbs", {
                username: username,
                viewDescription: "I love memes as much as i love food."
            })
        }else if(!username){
              res.render("index.hbs")
        }

    })

    router.post("/deleteMeme", urlencoder, (req, res) => {
        console.log("GET /deleteMeme")
        console.log("meme has been deleted")
        var username = req.session.username
        var desc = req.session.description
        if(username){
             res.render("homepage.hbs", {
            username: username
             })
        }else{
             res.render("index.hbs")
        }

    })

    router.post("/editMeme", urlencoder, (req, res) => {
        console.log("POST /editMeme")
        console.log("meme has been edited")
        var username = req.session.username
        if(username){
             res.render("privateViewMeme.hbs", {
            username: username
        })
        }else{
            res.render("index.hbs")
        }

    })


    router.post("/addMeme", upload.single("pic"), (req, res) => {
        console.log("POST  /addMeme")



        var desc = req.body.description
        var tags = req.body.tags
        var sharedto = req.body.shared
        var visibility = req.body.visibility
        var username = req.session.username
        //console.log("pic " + pic)
        console.log("description " + desc)
        console.log("tags " + tags)
        console.log("sharedto " + sharedto)
        console.log("visibility " + visibility)
        //console.log(req.body.title)
        console.log(req.file.originalname)


        if(username){

                if ( tags && sharedto && visibility) {

                console.log("uploaded successfully")
                res.render("privateViewMeme.hbs", {
                    username: username
                })
            } else {
                console.log("missing inputs")
            }
        }else{

        }


    })
}

