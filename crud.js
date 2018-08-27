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

// ========== USER ==========
let sampleCreateUserBody = {
  username : "limesapphire",
  password : "jenny.mochi",
  description : "programmer who dreams to be a programmer who can program the world"
}

let sampleCreateUserBody2 = {
  username : "itsoverhere",
  password : "schnauzer",
  description : "wahaw node js"
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
        User.findById(_id, "_id username description owned_memes shared_memes").then((doc)=>{
          if (doc) resolve(doc)
          else reject(Error("User@" + _id + " not found"))
        }, (err)=>{
          reject(err)
        })
      } else {
        let username = body.username
        User.findOne({username}, "_id username description owned_memes shared_memes").collation({locale : "en_US", strength : 1}).then((doc)=>{
          if (doc) resolve(doc)
          else reject(Error("User " + username + " not found"))
        }, (err)=>{
          reject(err)
        })
      }
    }
  )
}

function updateUser(body) {
  return new Promise(function(resolve, reject){
    let toUpdate = {}
    if (body.password) toUpdate.password = body.password
    if (body.description) toUpdate.description = body.description
    if (body._id) {
      let _id = body._id
      User.findByIdAndUpdate(_id, {$set : toUpdate}, {new : true}).then((doc)=>{
        console.log("User " + doc.username + " updated successfully")
        resolve(doc)
      }, (err)=>{
        reject(err)
      })
    }
    else {
      let username = body.username
      User.findOne({username}, {$set : toUpdate}, {new : true}).collation({locale : "en_US", strength : 1}).then((doc)=>{
        console.log("User " + doc.username + " updated successfully")
        resolve(doc)
      }, (err)=>{
        reject(err)
      })
    }
  })
}

function validateLogin(body) {
  return new Promise(function(resolve, reject){
    let username = body.username
    let password = body.password
    User.findOne({username}, "password").then((doc)=>{
      bcrypt.compare(password, doc.password).then((res)=>{
        if (res) resolve(res)
        else reject(Error("Invalid credentials"))
      }, (err)=>{
        reject(err)
      })
    }, (err)=>{
      reject(err)
    }).collation({locale : "en_US", strength : 1})
  })
}

function addMemeToOwnedMemes(user, meme){
  return new Promise(function(resolve, reject){
    let miniMeme = {}
    miniMeme._id = meme._id
    miniMeme.name = meme.name
    miniMeme.shared_with = meme.shared_with
    User.findByIdAndUpdate(user._id, {$push : {owned_memes : miniMeme}}, {new : true}).then((doc)=>{
      resolve(doc)
    }, (err)=>{
      reject(err)
    })
  })
}

function updateMemeInOwnedMemes(meme){
  return new Promise(function(resolve, reject){
    let miniMeme = {}
    miniMeme._id = meme._id
    miniMeme.name = meme.name
    miniMeme.shared_with = meme.shared_with
    User.update({"owned_memes._id" : meme._id}, {$set : {"owned_memes.$" : miniMeme}}).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}

function deleteMemeFromOwnedMemes(meme){
  /*return new Promise(function(resolve, reject){
    User.findByIdAndUpdate(user._id, {$pull : {owned_memes : {_id : meme._id}}}, {new : true}).then((doc)=>{
      resolve(doc)
    }, (err)=>{
      reject(err)
    })
  })*/
  return new Promise(function(resolve, reject){
    User.update({"owned_memes._id" : meme._id}, {$pull : "owned_memes.$"}).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}

function addMemeToSharedMemes(user, meme){
  return new Promise(function(resolve, reject){
    let miniMeme = {}
    miniMeme._id = meme._id
    miniMeme.name = meme.name
    miniMeme.owner = meme.owner
    User.findByIdAndUpdate(user._id, {$push : {shared_memes : miniMeme}}, {new : true}).then((doc)=>{
      resolve(doc)
    }, (err)=>{
      reject(err)
    })
  })
}

function updateMemeInSharedMemes(meme){
  return new Promise(function(resolve, reject){
    let miniMeme = {}
    miniMeme._id = meme._id
    miniMeme.name = meme.name
    miniMeme.owner = meme.owner
    User.update({"shared_memes._id" : meme._id}, {$set : {"shared_memes.$" : miniMeme}}).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}

function deleteMemeFromSharedMemes(user, meme){
  return new Promise(function(resolve, reject){
    User.findByIdAndUpdate(user._id, {$pull : {shared_memes : {_id : meme._id}}}, {new : true}).then((doc)=>{
      resolve(doc)
    }, (err)=>{
      reject(err)
    })
  })
}

function deleteMemeFromAllSharedMemes(meme){
  return new Promise(function(resolve, reject){
    User.update({"shared_memes._id" : meme._id}, {$pull : "shared_memes.$"}).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}

// ========== TAG ==========

function createTag(body){
  return new Promise(function(resolve, reject){
    let name = body.name
    let t = new Tag({
        name
    })
    t.save().then((doc)=>{
      resolve(doc)
    },(err)=>{
      reject(err)
    })
  })
}


function addMemeToTag(tag, meme){
  return new Promise(function(resolve, reject){
    let _id = tag._id
    let miniMeme = {}
    miniMeme._id = meme._id
    miniMeme.name = meme.name
    miniMeme.owner = meme.owner
    miniMeme.shared_with = meme.shared_with

    Tag.findByIdAndUpdate(_id, {$push: {memes: miniMeme}}, {new : true}).then((doc)=>{
      resolve(doc)
    },(err)=>{
      reject(err)
    })
  })
}

function updateMemeInTags(meme){
  return new Promise(function(resolve, reject){
    let miniMeme = {}
    miniMeme.name = meme.name
    miniMeme.owner = meme.owner
    miniMeme.shared_with = meme.shared_with

    Tag.update({"memes._id" : meme._id}, {$set : {"memes.$" : miniMeme}}).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}

function deleteMemeFromTag(tag, meme){
  return new Promise(function(resolve, reject){
    Tag.findByIdAndUpdate(tag._id, {$pull : {memes : {_id : meme._id}}}, {new : true}).then((doc)=>{
      if (doc.memes.length == 0) {
        Tag.findByIdAndDelete(doc._id).then((result)=>{
          resolve(result)
        }, (err)=>{
          reject(err)
        })
      }
    }, (err)=>{
      reject(err)
    })
  })
}

function deleteMemeFromAllTags(meme){
  return new Promise(function(resolve, reject){
    Tag.update({"memes._id" : meme._id}, {$pull : "memes.$"}).then((result)=>{
      Tag.delete({memes : {$size : 0}}).then((result)=>{
        resolve(result)
      }, (err)=>{
        reject(err)
      })
    }, (err)=>{
      reject(err)
    })
  })
}

function readTag(body){
  return new Promise(function(resolve, reject){
    if (body._id) {
      let _id = body._id
      Tag.findById(_id).then((doc)=>{
        if (doc) resolve(doc)
        else reject(Error("Tag@" + _id + " not found"))
      }, (err)=>{
        reject(err)
      })
    } else {
      let name = body.name
      Tag.findOne({name}).collation({locale : "en_US", strength : 1}).then((doc)=>{
        if (doc) resolve(doc)
        else reject(Error("Tag '" + name + "' not found"))
      }, (err)=>{
        reject(err)
      })
    }
  })
}

// ========== MEME ==========
let sampleCreateMemeBody = {
  name : "This is my meme",
  description : "Haha laugh at my meme",
  owner : {
    _id : "5b6b8646ec3bf1941dcfb7d7",
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

async function createMeme(body) {
  let createDict = {}
  createDict.name = body.name
  createDict.description = body.description

  let owner = await readUser(body.owner)
  createDict.owner = {_id : owner._id, username : owner.username}

  if (body.shared_with) {
    let fn = async function(sharedWithName){
      let realSharedWith = await readUser({username : sharedWithName})
      return realSharedWith
    }
    let realSharedWiths = await Promise.all(body.shared_with.map(fn))
    createDict.shared_with = realSharedWiths
  }

  if (body.tags) {
    let fn = async function(tagName){
      try {
        let realTag = await readTag({name : tagName})
        return realTag
      } catch (err) {
        let realTag = await createTag({name : tagName})
        return realTag
      }
    }
    let realTags = await Promise.all(body.tags.map(fn))
    createDict.tags = realTags
  }

  let m = new Meme(createDict)
  let meme = await m.save()

  let fn = async function(tag){
    await addMemeToTag(tag, meme)
  }

  await Promise.all(meme.tags.map(fn))

  await addMemeToOwnedMemes(meme.owner, meme)

  fn = async function(sharedWith){
    addMemeToSharedMemes(sharedWith, meme)
  }

  await Promise.all(meme.shared_with.map(fn))

  return meme
}

async function updateMeme(body) {
  let updateDict = {}
  updateDict.name = body.name
  updateDict.description = body.description

  if (body.shared_with) {
    let fn = async function(sharedWithName){
      let realSharedWith = await readUser({username : sharedWithName})
      return realSharedWith
    }
    let realSharedWiths = await Promise.all(body.shared_with.map(fn))
    updateDict.shared_with = realSharedWiths
  }

  if (body.tags) {
    let fn = async function(tagName){
      try {
        let realTag = await readTag({name : tagName})
        return realTag
      } catch (err) {
        let realTag = await createTag({name : tagName})
        return realTag
      }
    }
    let realTags = await Promise.all(body.tags.map(fn))
    updateDict.tags = realTags
  }

  let meme = await Meme.findById(body._id)
  let newMeme = await Meme.findByIdAndUpdate(body._id, {$set : updateDict}, {new : true})

  for (let oldTag of meme.tags) {
    if (newMeme.tags.filter(newTag=>oldTag._id.equals(newTag._id)).length==0){
      await deleteMemeFromTag(oldTag, newMeme)
    }
  }

  for (let newTag of newMeme.tags) {
    if (meme.tags.filter(oldTag=>oldTag._id.equals(newTag._id)).length==0){
      await addMemeToTag(newTag, newMeme)
    }
  }

  for (let oldSharedWith of meme.shared_with) {
    if (newMeme.shared_with.filter(newSharedWith=>oldSharedWith._id.equals(newSharedWith._id)).length==0){
      await deleteMemeFromSharedMemes(oldSharedWith, newMeme)
    }
  }

  for (let newSharedWith of newMeme.shared_with) {
    if (meme.shared_with.filter(oldSharedWith=>oldSharedWith._id.equals(newSharedWith._id)).length==0){
      await addMemeToSharedMemes(newSharedWith, newMeme)
    }
  }

  await updateMemeInTags(newMeme)

  await updateMemeInSharedMemes(newMeme)

  await updateMemeInOwnedMemes(newMeme)

  return newMeme
}

async function deleteMeme(body) {
  let _id = body._id
  let meme = await Meme.findById(_id)

  await deleteMemeFromAllTags(meme)
  await deleteMemeFromAllSharedMemes(meme)
  await deleteMemeFromOwnedMemes(meme)

  await Meme.findByIdAndDelete(_id)
}

function readMeme(body){
  return new Promise(function(resolve, reject){
    let _id = body._id
    Meme.findById(_id).then((doc)=>{
      resolve(doc)
    }, (err)=>{
      reject(err)
    })
  })
}

async function getPublicMemes(limit, base=0){
  let memes = await Meme.find({shared_with : {$size : 0}}).skip(base).limit(limit)
  return memes
}

async function getSharedMemesFor(user, limit, base=0){
  user = await readUser({_id : user._id})
  let memes = user.shared_memes
  return memes.slice(base, limit)
}

//createUser(sampleCreateUserBody)
//createMeme(sampleCreateMemeBody)
//deleteMeme(sampleDeleteMemeBody)

/*createUser(sampleCreateUserBody).then((user1)=>{
  createUser(sampleCreateUserBody2).then((user2)=>{
    createMeme({
      name : "Sample meme name",
      description : "Sample meme description",
      owner : {username : "limesapphire"},
      tags : ["funny", "lol"],
      shared_with : ["itsoverhere"]
    }).then((doc)=>{
      updateMeme({
        _id : doc._id,
        name : "Updated meme name",
        description : "Updated meme description",
        tags : ["lol", "shakalaka"],
        shared_with : ["itsoverhere"]
      }).then((doc)=>{
        getPublicMemes(10).then((memes)=>{
          getSharedMemesFor(user2).then((memes2)=>{
            console.log(memes.concat(memes2))
          }, (err)=>{
            console.log(err)
          })
        }, (err)=>{
          console.log(err)
        })
      }, (err)=>{
        console.log(err)
      })
    }, (err)=>{
      console.log(err)
    })
  }, (err)=>{
    console.log(err)
  })
}, (err)=>{
  console.log(err)
})*/

(async function(){
  try {
    let user1 = await createUser(sampleCreateUserBody)
    let user2 = await createUser(sampleCreateUserBody2)

    let meme = await createMeme({
      name : "Sample meme name",
      description : "Sample meme description",
      owner : {username : "limesapphire"},
      tags : ["funny", "lol"],
      shared_with : ["itsoverhere"]
    })

    meme = await updateMeme({
      _id : meme._id,
      name : "Updated meme name",
      description : "Updated meme description",
      tags : ["lol", "shakalaka"],
      shared_with : ["itsoverhere"]
    })

    let meme2 = await createMeme({
      name : "Haha funny meme",
      owner : {username : "limesapphire"},
      tags : ["haha", "lol"],
    })

    let memes1 = await getPublicMemes(10)
    let memes2 = await getSharedMemesFor(user2)

    console.log(memes1.concat(memes2))

  } catch (err) {
    console.log(err)
  }
})()
