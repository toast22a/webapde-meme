const express = require("express")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const hbs = require("hbs")
const session = require("express-session")
const app = express();

const urlencoder = bodyparser.urlencoded({
    extended: false
})
app.set('views', __dirname + '/views');
app.use(session({
    secret: "SuperSecretQuatro",
    name: "MissCourtneyIsTheBest",
    resave: true,
    saveUninitialized: true,
    // store: new mongostore({
    //   mongooseConnection:mongoose.connection,
    //   ttl : 60*60*24
    // })
    cookie: {
      maxAge: 1000*60*60*24*7*3
    }
}))

app.set("view-engine", "hbs")

app.use(express.static(__dirname + "/public"))

mongoose.connect("mongodb://localhost:27017/ticketdata", {
    useNewUrlParser : true
})
mongoose.Promise = global.Promise


app.get("/",(req,res,next)=>{
    console.log("GET /")
    var username = req.session.username
    if(username){
        res.render("homepage.hbs",{
                hUsername:username})
       }else{
        res.render("index.hbs")
       }
    
})

//app.post("/",(req,res,next)=>{
//    console.log("POST /")
//    var username = req.session.username
//    if(username){
//        res.render("homepage.hbs",{
//                hUsername:username})
//       }else{
//        res.render("index.hbs")
//       }
//    
//})


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

app.post("/login", urlencoder, (req, res) => {
    
    console.log("POST /login")
    var username = req.body.loginUser;
    var pass = req.body.loginPassword;
    
   
    console.log(pass)
    
    if(username && pass)
        {
            console.log(username+"has logged in")
            req.session.username=username
            res.render("homepage.hbs",{
                hUsername:username})
        }else{
            console.log("missing entry log in failed")
            res.render("index.hbs")
        }
})

app.post("/register",urlencoder,(req,res)=>{
    console.log("POST /register")
     var username = req.body.signUser;
     var pass = req.body.signPassword;
     var desc = req.body.signDescription;

    if(username && pass){
        console.log(username +"has signed up")
        req.session.username=username
        req.session.description=username
        res.render("homepage.hbs",{
        hUsername:username})
    }else{
        console.log("missing entry sign up failed")
        res.render("index.hbs")
    }
})

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

app.get("/searchByTag",urlencoder,(req,res)=>{
    console.log("GET /searchByTag")
    var searched = req.query.searchText
    console.log(searched)
    var username = req.session.username
    
    res.render("searchByTag.hbs",{tagUsername:username,searchTag:searched })
})

app.get("/privateViewMeme",(req,res)=>{
    console.log("GET /privateViewMeme")
     var username = req.session.username
    res.render("privateViewMeme.hbs",{Username : username})
})



app.get("/viewUser",urlencoder,(req,res)=>{
    console.log("GET /viewUser")
    var username = req.session.username
    var desc = req.session.description
    res.render("ViewUser.hbs",{viewUsername : username,viewDescription:desc },)
})

app.post("/deleteMeme",urlencoder,(req,res)=>{
    console.log("GET /deleteMeme")
     console.log("meme has been deleted")
    var username = req.session.username
    var desc = req.session.description
     res.render("homepage.hbs",{hUsername:username})
})


app.post("/editMeme",urlencoder,(req,res)=>{
    console.log("POST /editMeme")
    console.log("meme has been edited")
    var username = req.session.username
    res.render("privateViewMeme.hbs",{Username : username})
})

app.listen(3000, ()=>{
    console.log("Now listening on port 3000")
})