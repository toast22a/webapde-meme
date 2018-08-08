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
    user_id : {type : mongoose.Schema.Types.ObjectId, required : true, unique : true},
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
})

var Meme = mongoose.model("meme", MemeSchema)

module.exports = {
  Meme
}
