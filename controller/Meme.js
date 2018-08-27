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

var user = require('../model/Meme');


module.exports.controller = function (router) {

    router.get("/searchByTag_guest", urlencoder, (req, res) => {
        console.log("GET /searchByTag_guest")

        var searched = req.query.searchText
        console.log(searched)
        res.render("searchByTag_guest.hbs", {
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
        res.render("searchByTag.hbs", {
            tagUsername: username,
            searchTag: searched
        })
    })

    router.get("/privateViewMeme", (req, res) => {
        console.log("GET /privateViewMeme")
        var username = req.session.username
        res.render("privateViewMeme.hbs", {
            Username: username
        })
    })

    router.get("/viewUser", urlencoder, (req, res) => {
        console.log("GET /viewUser")
        var username = req.session.username
        var desc = req.session.description
        if (desc) {
            res.render("ViewUser.hbs", {
                viewUsername: username,
                viewDescription: desc
            })
        } else {
            res.render("ViewUser.hbs", {
                viewUsername: username,
                viewDescription: "I love memes as much as i love food."
            })
        }

    })

    router.post("/deleteMeme", urlencoder, (req, res) => {
        console.log("GET /deleteMeme")
        console.log("meme has been deleted")
        var username = req.session.username
        var desc = req.session.description
        res.render("homepage.hbs", {
            hUsername: username
        })
    })

    router.post("/editMeme", urlencoder, (req, res) => {
        console.log("POST /editMeme")
        console.log("meme has been edited")
        var username = req.session.username
        res.render("privateViewMeme.hbs", {
            Username: username
        })
    })

    router.post("/addMeme", urlencoder, (req, res) => {
        console.log("POST  /addMeme")
        var pic = req.body.pic
        var desc = req.body.description
        var tags = req.body.memeTags
        var sharedto = req.body.shared
        var visibility = req.body.visibility
        var username = req.session.username
        console.log(pic)
        console.log(desc)
        console.log(tags)
        console.log(sharedto)
        console.log(visibility)

        if (pic && tags && sharedto && visibility) {
            console.log("uploaded successfully")
            res.render("privateViewMeme.hbs", {
                Username: username
            })
        } else {
            console.log("missing inputs")
        }

    })
}