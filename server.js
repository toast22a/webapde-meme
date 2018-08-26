const express = require("express")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const hbs = require("hbs")
const session = require("express-session")
const path = require("path")
const app = express();

//const dburl = "mongodb://localhost:27017/memedata"
const dburl = "mongodb://memeadmin:memepassword1@ds215502.mlab.com:15502/memedata"

const urlencoder = bodyparser.urlencoded({
    extended: false
})

app.use(express.static(path.join(__dirname, "public")))
app.set('views', path.join(__dirname, "views"));
app.use(session({
    secret: "SuperSecretQuatro",
    name: "MissCourtneyIsTheBest",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000*60*60*24*7*3
    }
}))

app.set("view-engine", "hbs")
hbs.registerPartials(path.join(__dirname, "views", "partials"))

app.use(express.static(path.join(__dirname, "public")))

mongoose.connect(dburl, {
    useNewUrlParser : true
})
mongoose.Promise = global.Promise

//homepage
app.get("/",(req,res,next)=>{
    console.log("GET /")
    var username = req.session.username
    if(username){
        res.render("homepage.hbs",{username})
       }else{
        res.render("index.hbs")
       }

})

//app.post("/",(req,res,next)=>{
//    console.log("POST /")
//    var username = req.session.username
//    if(username){
//        res.render("homepage.hbs",{
//                username})
//       }else{
//        res.render("index.hbs")
//       }
//
//})

//meme
app.get("/searchByTag_guest",urlencoder,(req,res)=>{
    console.log("GET /searchByTag_guest")

    var searched = req.query.searchText
    console.log(searched)
    res.render("searchByTag_guest.hbs",{searchTag:searched })
})

app.get("/guestViewMeme", (req,res)=>{
    console.log("GET /guestViewMeme")
    res.render("guestViewMeme.hbs")
})

//user
app.post("/login", urlencoder, (req, res) => {

    console.log("POST /login")
    var username = req.body.loginUser;
    var pass = req.body.loginPassword;


    console.log(pass)

    if(username && pass)
        {
            console.log(username+" has logged in")
            req.session.username=username
            res.render("homepage.hbs",{username})
        }else{
            console.log("missing entry log in failed")
            res.render("index.hbs")
        }
})

//user
app.post("/register",urlencoder,(req,res)=>{
    console.log("POST /register")
     var username = req.body.signUser;
     var pass = req.body.signPassword;
     var desc = req.body.signDescription;

    if(username && pass){
        console.log(username +"has signed up")
        req.session.username=username
        req.session.description=username
        res.render("homepage.hbs",{username})
    }else{
        console.log("missing entry sign up failed")
        res.render("index.hbs")
    }
})

//user
app.get("/logout", (req, res) => {
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

//meme
app.get("/searchByTag",urlencoder,(req,res)=>{
    console.log("GET /searchByTag")
    var searched = req.query.searchText
    console.log(searched)
    var username = req.session.username
    console.log(username);
    res.render("searchByTag.hbs",{username ,searchTag:searched})
})

//meme
app.get("/privateViewMeme",(req,res)=>{
    console.log("GET /privateViewMeme")
     var username = req.session.username
    res.render("privateViewMeme.hbs",{username})
})


//meme
app.get("/viewUser",urlencoder,(req,res)=>{
    console.log("GET /viewUser")
    var username = req.session.username
    var desc = req.session.description
    if(desc){
         res.render("ViewUser.hbs",{username ,viewDescription:desc })
    }else{
         res.render("ViewUser.hbs",{username ,viewDescription: "I love memes as much as i love food."})
    }

})

//meme
app.post("/deleteMeme",urlencoder,(req,res)=>{
    console.log("GET /deleteMeme")
    console.log("meme has been deleted")
    var username = req.session.username
    var desc = req.session.description
     res.render("homepage.hbs",{username})
})

//meme
app.post("/editMeme",urlencoder,(req,res)=>{
    console.log("POST /editMeme")
    console.log("meme has been edited")
    var username = req.session.username
    res.render("privateViewMeme.hbs",{username})
})
//meme
app.post("/addMeme",urlencoder,(req,res)=>{
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

    if(pic && tags && sharedto && visibility)
        {
            console.log("uploaded successfully")
            res.render("privateViewMeme.hbs",{username})
        }else{
            console.log("missing inputs")
        }

})

app.listen(3000, ()=>{
    console.log("Now listening on port 3000")
})
