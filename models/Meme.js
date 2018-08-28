const mongoose = require("mongoose")
const path = require("path")
const User = require(path.join(__dirname, "User.js"))
const Tag = require(path.join(__dirname, "Tag.js"))

let MemeSchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    minlength : 1,
    trim : true
  },
  description : {
    type : String,
    trim : true
  },
  owner : {
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    username : {
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
  tags : [{
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    name : {
      type : String,
      minlength : 1,
      trim : true
    }
  }],
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
})

let Meme = mongoose.model("meme", MemeSchema)

async function createMeme(body) {
  let createDict = {}
  createDict.name = body.name
  createDict.description = body.description

  let owner = await User.readUser(body.owner)
  createDict.owner = {_id : owner._id, username : owner.username}

  if (body.shared_with) {
    let fn = async function(sharedWithName){
      let realSharedWith = await User.readUser({username : sharedWithName})
      return realSharedWith
    }
    let realSharedWiths = await Promise.all(body.shared_with.map(fn))
    createDict.shared_with = realSharedWiths
  }

  if (body.tags) {
    let fn = async function(tagName){
      try {
        let realTag = await Tag.readTag({name : tagName})
        return realTag
      } catch (err) {
        let realTag = await Tag.createTag({name : tagName})
        return realTag
      }
    }
    let realTags = await Promise.all(body.tags.map(fn))
    createDict.tags = realTags
  }

  let m = new Meme(createDict)
  let meme = await m.save()

  let fn = async function(tag){
    await Tag.addMemeToTag(tag, meme)
  }

  await Promise.all(meme.tags.map(fn))

  await User.addMemeToOwnedMemes(meme.owner, meme)

  fn = async function(sharedWith){
    User.addMemeToSharedMemes(sharedWith, meme)
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
      let realSharedWith = await User.readUser({username : sharedWithName})
      return realSharedWith
    }
    let realSharedWiths = await Promise.all(body.shared_with.map(fn))
    updateDict.shared_with = realSharedWiths
  }

  if (body.tags) {
    let fn = async function(tagName){
      try {
        let realTag = await Tag.readTag({name : tagName})
        return realTag
      } catch (err) {
        let realTag = await Tag.createTag({name : tagName})
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
      await Tag.deleteMemeFromTag(oldTag, newMeme)
    }
  }

  for (let newTag of newMeme.tags) {
    if (meme.tags.filter(oldTag=>oldTag._id.equals(newTag._id)).length==0){
      await Tag.addMemeToTag(newTag, newMeme)
    }
  }

  for (let oldSharedWith of meme.shared_with) {
    if (newMeme.shared_with.filter(newSharedWith=>oldSharedWith._id.equals(newSharedWith._id)).length==0){
      await User.deleteMemeFromSharedMemes(oldSharedWith, newMeme)
    }
  }

  for (let newSharedWith of newMeme.shared_with) {
    if (meme.shared_with.filter(oldSharedWith=>oldSharedWith._id.equals(newSharedWith._id)).length==0){
      await User.addMemeToSharedMemes(newSharedWith, newMeme)
    }
  }

  await Tag.updateMemeInTags(newMeme)

  await User.updateMemeInSharedMemes(newMeme)

  await User.updateMemeInOwnedMemes(newMeme)

  return newMeme
}

async function deleteMeme(body) {
  let _id = body._id
  let meme = await Meme.findById(_id)

  await Tag.deleteMemeFromAllTags(meme)
  await User.deleteMemeFromAllSharedMemes(meme)
  await User.deleteMemeFromOwnedMemes(meme)

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
  user = await User.readUser({_id : user._id})
  return user.shared_memes.slice(base, limit)
}

async function getTaggedPublicMemes(tag, limit, base=0){
  tag = await Tag.readTag({name : tag.name})
  return tag.memes.slice(base, limit)
}

module.exports = {
  createMeme, updateMeme, deleteMeme,
  getPublicMemes, getSharedMemesFor,
  getTaggedPublicMemes
}
