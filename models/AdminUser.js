const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let AdminUserModelSchema = new Schema({
  username: String,
  password: String,
  rank:Number
});

// Compile model from schema
let adminUserModel = mongoose.model('AdminUser', AdminUserModelSchema );
module.exports = adminUserModel;