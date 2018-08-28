const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const path = require("path")

const Meme = require(path.join(__dirname, "Meme.js"))
const Tag = require(path.join(__dirname, "Tag.js"))

const saltRounds = 10

//schema == structure of the mongodb document
var UserSchema = mongoose.Schema({
    username : {
        type : String, //type == required property
        required : true,
        minlength : 6,
        trim : true, //remove whitespace
        unique: true,
        collation: {locale: "en_US", strength: 1}
    },
    password : {
        type : String, //type == required property
        required : true,
        minlength : 8
    },
    description : {
      type : String,
      trim : true
    },
    owned_memes : [{
      _id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        unique : true,
        sparse : true
      },
      name : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
      },
      shared_with : [{
        user_id : {type : mongoose.Schema.Types.ObjectId, required : true, unique : true, sparse : true},
        username: {
            type: String, //type == required property
            required: true,
            minlength: 6,
            trim: true, //remove whitespace
            unique: true,
            sparse : true,
            collation: {
              locale: 'en_US',
              strength: 1
            }
        }
      }]
    }],
    shared_memes : [{
      _id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        unique : true,
        sparse : true
      },
      name : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
      },
      owner : {
        user_id : {type : mongoose.Schema.Types.ObjectId, required : true},
        username: {
            type: String, //type == required property
            required: true,
            minlength: 6,
            trim: true, //remove whitespace
            collation: {
              locale: 'en_US',
              strength: 1
            }
        }
      }
    }]
})

UserSchema.pre("save", function(next){
  let user = this

  if (!user.isModified("password")) return next()

  bcrypt.hash(user.password, saltRounds, function(err, hash){
    if(!err){
      user.password = hash
      return next()
    }
  })
})

let User = mongoose.model("user", UserSchema)

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

module.exports = {
  createUser, readUser, updateUser,
  validateLogin, addMemeToOwnedMemes,
  updateMemeInOwnedMemes, deleteMemeFromOwnedMemes,
  addMemeToSharedMemes, updateMemeInSharedMemes,
  deleteMemeFromSharedMemes, deleteMemeFromAllSharedMemes,
}
