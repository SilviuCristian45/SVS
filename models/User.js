const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserModelSchema = new Schema({
  username: String,
  password: String,
  email:String,
  profile:{
    type:Schema.Types.ObjectId,
    ref:"Profile"
  }
});

// Compile model from schema
let userModel = mongoose.model('User', UserModelSchema );
module.exports = userModel;