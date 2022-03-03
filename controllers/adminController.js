const categoryModel = require('../models/Category');
const contentModel = require('../models/Content');
const producerModel = require('../models/Producer');
const seriesModel = require('../models/Series');

const addContentToSeries = async (req, res) => {
    //get the id's of the series and content we want to manipulate
    //add the given content into the given series
    const seriesID = req.body.seriesName;
    const contentID = req.body.contentName;
    //sterg contentID-ul din sirul vechiului sau seriesID
    const content = await contentModel.findById(contentID).lean();
    const oldSeriesID = content.parentSeries;
    if(oldSeriesID)
        await seriesModel.findOneAndUpdate({_id:oldSeriesID}, {$pull : {"contents" : {$in : contentID}}});
    console.log('adaugam in serialul '+seriesID+' ' + contentID)
    await seriesModel.findOneAndUpdate({_id:seriesID}, {$push : {"contents" : contentID}});
    await contentModel.findOneAndUpdate({_id:contentID}, {$set : {"parentSeries" : seriesID} } );
    res.redirect('/admin')
}

const setProducerToContent = async (req, res) => {
    const contentID = req.body.contentName;
    const producerID = req.body.producers;
    //find old producer 
    const oldProducerContent = await contentModel.findById(contentID).lean();
    const oldProducerContentID = oldProducerContent.producer; 
    await producerModel.findOneAndUpdate({_id:oldProducerContentID}, {$pull : {"contents" : {$in : contentID}}});
    await producerModel.findOneAndUpdate({_id:producerID}, {$push : {"contents" : contentID}});
    await contentModel.findOneAndUpdate({_id:contentID}, {$set : {"producer" : producerID} } );
    res.redirect('/admin')
}

const setCategoryContent = async (req, res) => {
    const contentID = req.body.contentName;
    const categoryID = req.body.categories;
    //find the old category of contentID 
    const oldCategory = await contentModel.findById(contentID).lean();
    const oldCategoryID = oldCategory.category;
    //remove the contentID from the content list of old category
    await categoryModel.findOneAndUpdate({_id:oldCategoryID}, { $pull: { "contents": { $in: contentID } } });
    await categoryModel.findOneAndUpdate({_id:categoryID}, {$push : {"contents" : contentID}});
    await contentModel.findOneAndUpdate({_id:contentID} , {$set : {"category" : categoryID}});
    //delete the content from category
    
    res.redirect('/admin');
}

module.exports.addContentToSeries = addContentToSeries;
module.exports.setProducerToContent = setProducerToContent;
module.exports.setCategoryContent = setCategoryContent;