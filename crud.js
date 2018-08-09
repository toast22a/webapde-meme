const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const bcrypt = require("bcrypt")

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
let sampleCreateUserBody = {
  username : "limesapphire",
  password : "jenny.mochi",
  description : "programmer who dreams to be a programmer who can program the world"
}

let sampleReadUserBody = {
  _id : "5b6b8646ec3bf1941dcfb7d7"
  //username : "limeSapphire"
}

let sampleUpdateUserBody = {
  _id : "5b6b8646ec3bf1941dcfb7d7",
  description : "mochi mochi"
}

let sampleValidateLoginBody = {
  username : "limesapphire",
  password : "jenny.mochi"
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

//how to??
function createTag(tag,meme){
    let name = tag.nam
    User.find({})
}

function findByTag(tag){
    if (tag._id) {
    let _id = tag._id
    Tag.findById(_id, "_id tags description owned_memes", (err, doc)=>{
      if (err) handleError(err)
      else if (doc) console.log(JSON.stringify(doc))
      else console.log("Tag" + _id + " not found")
    })
  }else {
    let name = tag.name
    Tag.findOne({name}, "_id tag name description owned_memes", (err, doc)=>{
      if (err) handleError(err)
      else if (doc) console.log(JSON.stringify(doc))
      else console.log("Tag name " +name + " not found")
    }).collation({locale : "en_US", strength : 1})
  }
}

function readUser(body) {
  if (body._id) {
    let _id = body._id
    User.findById(_id, "_id username description owned_memes", (err, doc)=>{
      if (err) handleError(err)
      else if (doc) console.log(JSON.stringify(doc))
      else console.log("User@" + _id + " not found")
    })
  } else {
    let username = body.username
    User.findOne({username}, "_id username description owned_memes", (err, doc)=>{
      if (err) handleError(err)
      else if (doc) console.log(JSON.stringify(doc))
      else console.log("User " + username + " not found")
    }).collation({locale : "en_US", strength : 1})
  }
}

function updateUser(body) {
  let _id = body._id
  let toUpdate = {}
  if (body.password) toUpdate.password = body.password
  if (body.description) toUpdate.description = body.description
  User.findByIdAndUpdate(_id, {$set : toUpdate}, {new : true}, (err, doc)=>{
    if (err) handleError(err)
    else console.log("User " + doc.username + " updated successfully")
  })
}

function validateLogin(body) {
  let username = body.username
  let password = body.password
  User.findOne({username}, "password", (err, doc)=>{
    if (err) handleError(err)
    else if (doc) {
      bcrypt.compare(password, doc.password, (err, res)=>{
        if (err) handleError(err)
        else if (res) console.log("Login successful")
        else console.log("Login failed : wrong password")
      })
    }
    else console.log("User " + username + " not found")
  })
}

// ========== MEME ==========
let sampleCreateMemeBody = {
  name : "This is my meme",
  description : "Haha laugh at my meme",
  owner : {
    user_id : "5b6b8646ec3bf1941dcfb7d7",
    username : "jenny.mochi"
  },
  tags : ["funny", "haha"],
  /*shared_with : [{

  }]*/
}

function createMeme(body) {
  let createDict = {}
  //let name = body.name
  createDict.name = body.name
  //let description = body.description
  createDict.description = body.description
  //let owner = body.owner
  createDict.owner = body.owner
  //if (tags) let tags = body.tags
  if (body.tags) createDict.tags = body.tags
  if (body.shared_with) createDict.shared_with = body.shared_with
  let m = new Meme(createDict)
  m.save().then((doc)=>{
    console.log("Meme '" + doc.name + "' created successfully")
  }, (err)=>{
    handleError(err)
  })
}

createMeme(sampleCreateMemeBody)
