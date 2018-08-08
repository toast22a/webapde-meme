//create mongoose document ticket
const mongoose = require("mongoose")

//schema == structure of the mongodb document
var UserSchema = mongoose.Schema({
    username: {
        type: String, //type == required property
        required: true,
        minlength: 6,
        trim: true, //remove whitespace
        unique: true,
        collation: {
          locale: 'en_US',
          strength: 1
        }
    },
    password: {
        type: String, //type == required property
        required: true,
        minlength: 8,
        trim: true //remove whitespace
    },
    description: {
      type : String,
      trim : true
    },
    memes: [{
      meme_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        unique : true
      },
      name : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
      }
    }]
})

//something you can access, is a persistent object
var User = mongoose.model("user", UserSchema)

//a Ticket object will be given back if others call require("ticket.js")
module.exports = {
    User
}
