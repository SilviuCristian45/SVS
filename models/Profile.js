/* Entitate pt regizori */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProfileModelSchema = new Schema({
  title: String,
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
  }, 
  contentLiked : {
    type:[{
      type:Schema.Types.ObjectId,
      ref:"Content"
    }],
    default:[null]
  },
  contentDisLiked : {
    type:[{
      type:Schema.Types.ObjectId,
      ref:"Content"
    }],
    default:[null]
  },
  contentViewed : {
    type:[{
      type:Schema.Types.ObjectId,
      ref:"Content"
    }]
  }
});

// Compile model from schema
let profileModel = mongoose.model('Profile', ProfileModelSchema );
module.exports = profileModel;