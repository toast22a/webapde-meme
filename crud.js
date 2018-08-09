const express = require("express")
const mongoose = require("mongoose")
const path = require("path")

const {User} = require(path.join(__dirname, "model", "User.js"))
const {Meme} = require(path.join(__dirname, "model", "Meme.js"))
const {Tag} = require(path.join(__dirname, "model", "Tag.js"))

const app = express()

mongoose.connect("mongodb://localhost:27017/memedata", {
    useNewUrlParser : true
})
mongoose.Promise = global.Promise

function handleError(err){
  console.log("An error occurred : " + err)
}

// ========== USER ==========
let sampleUserBody = {
  username : "limesapphire",
  password : "jenny.mochi",
  description : "programmer who dreams to be a programmer who can program the world"
}

function createUser(body) {
  let username = body.username
  let password = body.password
  let description = body.description
  let u = new User({
    username, password, description
  })
  u.save().then((doc)=>{
    console.log("User " + username + " created successfully")
  },(err)=>{
    handleError(err)
  })
}

createUser(sampleUserBody)
