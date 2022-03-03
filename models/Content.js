const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ContentModelSchema = new Schema({
  title: String,
  thumbnail : String,
  path: String,
  likes : {
    type:Number,
    default:0
  },
  dislikes : {
    type:Number,
    default:0
  },
  views : {
    type:Number,
    default:0
  },
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