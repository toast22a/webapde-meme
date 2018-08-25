const mongoose = require("mongoose")

var MemeSchema = mongoose.Schema({
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
  },
  tags : [{
    type : String,
    minlength : 1,
    trim : true
  }],
  shared_with : [{
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
  }]
})

//var Meme = mongoose.model("meme", MemeSchema)

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

module.exports = {
  createMeme, updateMeme,deleteMeme
}
