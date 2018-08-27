const mongoose = require("mongoose")

const User = require(path.join(__dirname, "model", "User.js"))
const Meme = require(path.join(__dirname, "model", "Meme.js"))

let TagSchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
    lowercase : true,
    trim : true,
    validate : {
      validator : function(v) {
        return !(/\s/.test(v))
      },
      msg : "Tag cannot contain spaces"
    }
  },
  memes : [{
    _id : {
      type : mongoose.Schema.Types.ObjectId,
      required : true,
      //unique : true,
      //sparse : true
    },
    name : {
      type : String,
      required : true,
      minlength : 1,
      trim : true
    },
    owner : {
      _id : {type : mongoose.Schema.Types.ObjectId, required : true},
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
    },
    shared_with : [{
      _id : {type : mongoose.Schema.Types.ObjectId, required : true},
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
    }]
  }]
})

let Tag = mongoose.model("tag", TagSchema)

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

module.exports = {
  createTag, addMemeToTag, updateMemeInTags,
  deleteMemeFromTag, deleteMemeFromAllTags,
  readTag
}
