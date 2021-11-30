const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserModelSchema = new Schema({
  username: String,
  password: String,
  email:String,
  profiles:{
    type:[{
        type:Schema.Types.ObjectId
      }
    ],
    ref:"Profile",
    default:['618d4f41633aaf355f05f4a3']
  }
});

// Compile model from schema
let userModel = mongoose.model('User', UserModelSchema );
module.exports = userModel;