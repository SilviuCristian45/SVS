const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CategoryModelSchema = new Schema({
  name: String,
  contents:{
    type:[{
        type:Schema.Types.ObjectId,
        ref:"Content"
      }
    ],
    default:[null]
  },
  profileFans : {
    type:[{
      type:Schema.Types.ObjectId,
      ref:"Profile"
    }],
    default:[null]
  }
});

// Compile model from schema
let categoryModel = mongoose.model('Category', CategoryModelSchema );
module.exports = categoryModel;