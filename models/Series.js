/* Entitate pt regizori */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let SeriesModelSchema = new Schema({
  name: String,
  seasons: {type:Number,default:0},
  contents : [{
    type:Schema.Types.ObjectId,
    ref:"Content",
    default:null
    }],
  thumbnail:String
});

// Compile model from schema
let seriesModel = mongoose.model('Series', SeriesModelSchema );
module.exports = seriesModel;