
//const router = express.Router();
const express = require("express")
const router = express.Router()
const app = express()
const Meme = require("../models/Meme")


module.exports.controller = function(app) {


    router.get("/",(req,res)=>{
    console.log("GET /")

   // var username = req.session.username

//    if(username){
//        res.render("homepage.hbs",{
//                hUsername:username })
//       }else{
        res.render("index.hbs")



    })

    app.use('/', router);

}

