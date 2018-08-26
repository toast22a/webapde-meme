const mongoose = require("mongoose")
const {Meme} = require(path.join(__dirname, "model", "Meme.js"))

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

//all comment from previous code





function createMeme(body) {
 
}

// changes in meme can be
// removing of tag
// adding of tag
// removing a user to sharable
// adding a user  sa sharable
function updateMeme(body) {
 
}

function deleteMeme(body) {
 
}

module.exports = {
  createMeme, updateMeme,deleteMeme
}
