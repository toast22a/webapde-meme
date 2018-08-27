//create mongoose document ticket
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
//const {User} = require(path.join(__dirname, "model", "User.js"))

const saltRounds = 10 // not secure -- change later

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


//something you can access, is a persistent object
var User = mongoose.model("user", UserSchema)

/*

function createUser(body){

}

function readUser(body){

}

function updateUser(body){

}

//not sure kase sa example ni miss courtney nasa middleware yung validate login
function validateLogin(body){

}

function addMemeToUser(body){

}

function UpdateMemeToUser(body){

}

function DeleteMemeToUser(body){

}

*/
module.exports = {
    User
}
