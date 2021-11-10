const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ContentModelSchema = new Schema({
  path: String,
  date_published: Date,
  producer:{
      type:Schema.Types.ObjectId,
      ref:"Producer"
  },
  quality:String
});

// Compile model from schema
let contentModel = mongoose.model('Content', ContentModelSchema );
module.exports = contentModel;