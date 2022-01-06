const contentModel = require('../models/Content');
const seriesModel = require('../models/Series');

const addContentToSeries = (req, res) => {
    res.json({message:'ok'});
}

module.exports.addContentToSeries = addContentToSeries;