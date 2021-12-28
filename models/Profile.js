/* Entitate pt regizori */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProfileModelSchema = new Schema({
  name: String,
  user:{
      type:Schema.Types.ObjectId,
      ref:"User"
  },
  prefferedCategories : {
    type:[{
      type:Schema.Types.ObjectId,
      ref:"Category"
    }],
    default:[null]
  },
  mylist : {
    type:[{
      type:Schema.Types.ObjectId,
      ref:"Content"
    }],
    default:[null]
  }
});

// Compile model from schema
let profileModel = mongoose.model('Profile', ProfileModelSchema );
module.exports = profileModel;