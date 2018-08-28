
//const router = express.Router();
const express = require("express")
const router = express.Router()
const app = express()
const Meme = require("../models/Meme")


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
