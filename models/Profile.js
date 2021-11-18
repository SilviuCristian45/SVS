/* Entitate pt regizori */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProfileModelSchema = new Schema({
  name: String,
  user:{
      type:Schema.Types.ObjectId,
      ref:"User",
      default:'61851dc2f14da82719065f4b'
  }
});

// Compile model from schema
let profileModel = mongoose.model('Profile', ProfileModelSchema );
module.exports = profileModel;