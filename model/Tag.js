const mongoose = require("mongoose")

var TagSchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
    lowercase : true,
    trim : true,
    validate : {
      validator : function(v) {
        return /\s/.test(v)
      },
      msg : "Tag cannot contain spaces"
    }
  },
  memes : {
    meme_id : {
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
  }
})

var Tag = mongoose.model("tag", TagSchema)

module.exports = {
  Tag
}
