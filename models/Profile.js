/* Entitate pt regizori */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProfileModelSchema = new Schema({
  name: String,
  users:[{
      type:Schema.Types.ObjectId,
      ref:"User"
  }]
});

// Compile model from schema
let profileModel = mongoose.model('Profile', ProfileModelSchema );
module.exports = profileModel;