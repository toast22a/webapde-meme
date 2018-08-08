//create mongoose document ticket
const mongoose = require("mongoose")

//schema == structure of the mongodb document
var UserSchema = mongoose.Schema({
    username: { 
        type: String, //type == required property
        required: true,
        minlength: 6,
        trim: true //remove whitespace
    },
    password: {
        type: String, //type == required property
        required: true,
        minlength: 6,
        trim: true //remove whitespace
    },
    description: String
})

//something you can access, is a persistent object
var Ticket = mongoose.model("ticket", TicketSchema)

//a Ticket object will be given back if others call require("ticket.js")
module.exports = {
    Ticket
}