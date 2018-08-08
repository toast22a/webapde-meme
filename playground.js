const express = require("express")
const mongoose = require("mongoose")
const path = require("path")

const {User} = require(path.join(__dirname, "model", "User.js"))
const {Meme} = require(path.join(__dirname, "model", "Meme.js"))

const app = express()

mongoose.connect("mongodb://localhost:27017/memedata", {
    useNewUrlParser : true
})
mongoose.Promise = global.Promise

let username = "Toast22A"
let password = "mypassword"
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
})
