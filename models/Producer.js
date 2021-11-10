/* Entitate pt regizori */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProducerModelSchema = new Schema({
  name: String,
  contents : [{
    type:Schema.Types.ObjectId,
    ref:"Content"
    }],
});

// Compile model from schema
let producerModel = mongoose.model('Producer', ProducerModelSchema );
module.exports = producerModel;