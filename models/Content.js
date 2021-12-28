const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ContentModelSchema = new Schema({
  path: String,
  date_published: Date,
  producer:{
      type:Schema.Types.ObjectId,
      ref:"Producer"
  },
  category:{
    type:Schema.Types.ObjectId,
    ref:"Category",
    default:null
  },
  quality:String,
  parentSeries: {
    type:Schema.Types.ObjectId,
    ref:"Series",
    default:null
  }
});

// Compile model from schema
let contentModel = mongoose.model('Content', ContentModelSchema );
module.exports = contentModel;