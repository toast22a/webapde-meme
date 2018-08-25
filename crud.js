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

function printError(err, functionName){
  if (functionName) console.log("["+functionName+"] An error occurred : " + err)
  else console.log("An error occurred : " + err)
}

// ========== USER ==========
let sampleCreateUserBody = {
  username : "limesapphire",
  password : "jenny.mochi",
  description : "programmer who dreams to be a programmer who can program the world"
}

let sampleReadUserBody = {
  username : "limeSapphire"
}

let sampleUpdateUserBody = {
  username : "limesapphire",
  description : "mochi mochi"
}

let sampleValidateLoginBody = {
  username : "limesapphire",
  password : "jenny.mochi"
}

// OK
function createUser(body) {
  return new Promise(
    function (resolve, reject) {
      let username = body.username
      let password = body.password
      let description = body.description
      let u = new User({
        username, password, description
      })
      u.save().then((doc)=>{
        console.log("User " + username + " created successfully")
        resolve(doc)
      },(err)=>{
        printError(err, "createUser")
        reject(err)
      })
    }
  )
}

function readUser(body) {
  return new Promise(
    function(resolve, reject){
      if (body._id) {
        let _id = body._id
        User.findById(_id, "_id username description owned_memes").then((doc)=>{
          if (doc) resolve(doc)
          else reject("User@" + _id + " not found")
        }, (err)=>{
          printError(err, "readUser")
          reject(err)
        })
      } else {
        let username = body.username
        User.findOne({username}, "_id username description owned_memes").collation({locale : "en_US", strength : 1}).then((doc)=>{
          if (doc) resolve(doc)
          else reject("User " + username + " not found")
        }, (err)=>{
          printError(err, "readUser")
          reject(err)
        })
      }
    }
  )
}

function updateUser(body) {
  let toUpdate = {}
  if (body.password) toUpdate.password = body.password
  if (body.description) toUpdate.description = body.description
  if (body._id) {
    let _id = body._id
    User.findByIdAndUpdate(_id, {$set : toUpdate}, {new : true}).then((doc)=>{
      console.log("User " + doc.username + " updated successfully")
      resolve(doc)
    }, (err)=>{
      printError(err, "updateUser")
      reject(err)
    })
  }
  else {
    let username = body.username
    User.findOne({username}, {$set : toUpdate}, {new : true}).collation({locale : "en_US", strength : 1}).then((doc)=>{
      console.log("User " + doc.username + " updated successfully")
      resolve(doc)
    }, (err)=>{
      printError(err, "updateUser")
      reject(err)
    })
  }
}

function validateLogin(body) {
  let username = body.username
  let password = body.password
  User.findOne({username}, "password", (err, doc)=>{
    if (err) printError(err)
    else if (doc) {
      bcrypt.compare(password, doc.password, (err, res)=>{
        if (err) printError(err)
        else if (res) console.log("Login successful")
        else console.log("Login failed : wrong password")
      })
    }
    else console.log("User " + username + " not found")
  }).collation({locale : "en_US", strength : 1})
}

// ========== TAG ==========

function createTag(tagString,meme){
    let name = tagString
    let t =new Tag({
        name
    })
    t.save().then((doc)=>{
        console.log("Tag '" + doc.name + "' created successfully")
        addMemeToTag(doc._id, meme)
    },(err)=>{
        printError(err, "createTag")
    })
}



function addMemeToTag(tag_id,meme){
    let _id = tag_id
    let pseudoMeme = {}
    pseudoMeme.meme_id = meme._id
    pseudoMeme.name = meme.name
    pseudoMeme.owner = meme.owner
    pseudoMeme.shared_with = meme.shared_with

    Tag.findByIdAndUpdate(_id, {$push: {memes: pseudoMeme}}, {new : true}).then((doc)=>{
      console.log("Meme '" + pseudoMeme.name + "' added successfully to tag '" + doc.name + "'")
    },(err)=>{
      printError(err, "addMemeToTag")
    });
}

function deleteMemeFromTag(tag_id, meme){
    let m_id = meme.meme_id
    Tag.findById(tag_id, "_id tags description owned_memes", (err, doc)=>{
      if (err) printError(err)
      else if (doc) {
        doc.memes.pull({_id: m_id})
        if (doc.memes.length == 0) {
          Tag.findByIdAndDelete(t_id).then((result)=>{
            console.log("Tag " + doc.name + " deleted successfully")
          }, (err)=>{
            printError(err)
          })
        }
      }
    })
}

function readTag(tag){
    if (tag._id) {
    let _id = tag._id
    Tag.findById(_id, "_id tags description owned_memes", (err, doc)=>{
      if (err) printError(err)
      else if (doc) console.log("Found tag '" + doc.name + "'")
      else console.log("Tag@" + _id + " not found")
    })
  }else {
    let name = tag.name
    Tag.findOne({name}, "_id tag name description owned_memes", (err, doc)=>{
      if (err) printError(err)
      else if (doc) console.log("Found tag '" + doc.name + "'")
      else console.log("Tag '" + name + "' not found")
    }).collation({locale : "en_US", strength : 1})
  }
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

let sampleUpdateMemeBody = {
  _id : "5b6b99833db4de961eb610bd",
  name : "This is my updated meme",
  description : "haha heehee",
  tags : []
}

let sampleDeleteMemeBody = {
  _id : "5b6bab0519bbe997c64adfd2"
}

function createMeme(body) {
  let createDict = {}
  createDict.name = body.name
  createDict.description = body.description
  createDict.owner = body.owner
  if (body.tags) createDict.tags = body.tags
  if (body.shared_with) createDict.shared_with = body.shared_with
  let m = new Meme(createDict)
  m.save().then((doc)=>{
    console.log("Meme '" + doc.name + "' created successfully")
    doc.tags.forEach(function(tagString){
      let tagEntry = readTag({name : tagString})
      if (tagEntry) addMemeToTag(tagEntry._id, doc)
      else createTag(tagString, doc)
    })
  }, (err)=>{
    printError(err, "createMeme")
  })
}

function updateMeme(body) {
  let _id = body._id
  let updateDict = {}
  if (body.name) updateDict.name = body.name
  if (body.description) updateDict.description = body.description
  if (body.tags) updateDict.tags = body.tags
  if (body.shared_with) updateDict.shared_with = body.shared_with
  Meme.findByIdAndUpdate(_id, {$set : updateDict}, {new : true}).then((doc)=>{
    doc.tags.forEach(function(tagString){

    })
    console.log("Meme '" + doc.name + "' updated successfully")
  }, (err)=>{
    printError(err)
  })
}

function deleteMeme(body) {
  let _id = body._id
  Meme.findById(_id).then((doc)=>{
    doc.tags.forEach(function(tagString){
      Tag.findOne({name : tagString}).then((tagDoc)=>{
        deleteMemeFromTag(tagDoc._id, doc)
      }, (err)=>{
        printError(err, "deleteMeme")
      })
    })
    Meme.findByIdAndDelete(doc._id).then((result)=>{
      console.log(result.deletedCount + " memes deleted successfully")
    }, (err)=>{
      printError(err, "deleteMeme")
    })
  }, (err)=>{
    printError(err, "deleteMeme")
  })
}


//createUser(sampleCreateUserBody)
//createMeme(sampleCreateMemeBody)
//deleteMeme(sampleDeleteMemeBody)

createUser(sampleCreateUserBody).then((doc)=>{
  readUser(sampleReadUserBody).then((doc)=>{
    console.log(doc.username)
  }, (err)=>{
    console.log(err)
  })
}, (err)=>{
  console.log(err)
})
