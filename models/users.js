const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email :{
        type: String,
        required: true
    } // passport-local-mongoose automatically adds the username and password field in this
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);