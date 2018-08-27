const mongoose = require("mongoose")
//const {Tag} = require(path.join(__dirname, "model", "Tag.js"))

var TagSchema = mongoose.Schema({
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

var Tag = mongoose.model("tag", TagSchema)
/*
function readTag(tag){

}


function createTag(tagString,meme){

}

//if meme gets edited the meme in tag should be updated
function updateMemeToTag(tag_id,meme){

}

function addMemeToTag(tag_id,meme){

}

function deleteMemeFromTag(tag_id, meme){

}

*/

function readTag(tag){

}


function createTag(tagString,meme){

}

//if meme gets edited the meme in tag should be updated
function updateMemeToTag(tag_id,meme){

}

function addMemeToTag(tag_id,meme){

}

function deleteMemeFromTag(tag_id, meme){

}



module.exports = {
  readTag,createTag,updateMemeToTag,addMemeToTag,deleteMemeFromTag
}
