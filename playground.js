const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const bcrypt = require("bcrypt")

const {User} = require(path.join(__dirname, "model", "User.js"))
const {Meme} = require(path.join(__dirname, "model", "Meme.js"))

const app = express()

//for local db
mongoose.connect("mongodb://localhost:27017/memedata", {
    useNewUrlParser : true
})

//for MLab-hosted db
/*mongoose.connect("mongodb://memeadmin:memepassword1@ds215502.mlab.com:15502/memedata", {
  useNewUrlParser : true
})*/

mongoose.Promise = global.Promise

/*let username = "Toast22A"
let password = "my"
let description = "Big big bog bog big big bog bog"

let u = new User({username, password, description})

u.save().then((doc)=>{
  console.log(doc)
}, (err)=>{
  console.log("An error occurred: " + err)
})

username = "Bobobobo"
password = "mypassword2"

u = new User({username, password})

u.save().then((doc)=>{
  console.log(doc)
}, (err)=>{
  console.log("An error occurred: " + err)
})*/

User.findById("5b6b80b0d2e1448cfe113694").then((doc)=>{
  bcrypt.compare("mypassword2", doc.password).then((res)=>{
    if (res) console.log("Password matched!")
    else console.log("Password did not match...")
  },(err)=>{
    console.log("Error: " + err)
  })
}, (err)=>{
  console.log("Error: " + err)
})
