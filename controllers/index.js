
//const router = express.Router();
const express = require("express")
const router = express.Router()
const app = express()
const path = require("path")
//const User = require(path.join(_dirname, "..", "models", "User.js"))
//const Meme = require("../models/Meme.js")


//router.use("/meme", require("./meme"))
//router.use("/user", require("./user"))

module.exports.controller = function(app) {


    router.get("/",(req,res)=>{
    console.log("GET /")

    var username = req.session.username

    if(username){
      res.render("homepage.hbs", {username})
    } else {
      res.render("index.hbs")
    }



    })

     app.use('/', router);

    //module.exports = router;
}
