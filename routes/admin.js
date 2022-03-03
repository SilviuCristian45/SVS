const express = require('express');
const router = express.Router()
const multer = require('multer');

//----MODELS----
const categoryModel = require('../models/Category');
const contentModel = require('../models/Content');
const producerModel = require('../models/Producer');
const seriesModel = require('../models/Series')

//----CONTROLLERS
const adminController = require('../controllers/adminController');

//---MESSAGE VARIABLE----
let messageForAdmin = "";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'content')
    },
    filename : (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const maxSize = 18 * 1024 * 1024; //10 mb max upload size

const upload = multer({
    storage:storage,
    fileFilter: (req, file, cb) => {
        //console.log(file.mimetype)
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' ||
            file.mimetype === 'video/mp4' || file.mimetype === 'video/m4v' || file.mimetype === 'video/webm') {
            cb(null, true);
        }
        else
            cb(null, false);
    },
    limits:{fileSize:maxSize}
});

//.fields([{name: 'content' , maxCount: 1}], {name:'thumbnail', maxCount:1});
//render the panel 
router.get('/', async (req, res) => {
    //iau toate categoriile pt ca trebuie pasatate in admin panel pt a fi afisate in inputul select
    const categories = await categoryModel.find({}).lean(); 
    const producers = await producerModel.find({}).lean();
    const series = await seriesModel.find({}).lean();
    const contents = await contentModel.find({}).lean();
    res.render('adminpanel.handlebars', {
        categories : categories,
        producers : producers,
        series : series,
        contents : contents,
        message : messageForAdmin
    });
    messageForAdmin = '';
});

//route for uploading content to the server
router.post('/upload', upload.any(), async (req, res) => {
    if(req.files.length > 2)
        throw new Error('Sunt prea multe fisiere incarcate');
    //ar trebui niste validari aici 
     
    //cream un obiect de tip content cu inputul primit 
    const newContent = new contentModel({
        path:req.files[0].originalname,
        thumbnail : req.files[1].originalname,
        title : req.body.title,
        date_published : req.body.datePublication,
        producer : req.body.producers,
        category : req.body.categories,
        parentSeries : (req.body.series !== "null" ? req.body.series : null )
    });

    try {
        messageForAdmin = 'added a new video succesfully';
        const newContentObj = await newContent.save();
        console.log(newContentObj)
        await categoryModel.findByIdAndUpdate(newContentObj.category, {
            $push : {"contents" : newContentObj._id}
        })
        await producerModel.findByIdAndUpdate(newContentObj.producer, {
            $push : {"contents" : newContentObj._id}
        })

    } catch (error) {
        console.log(error)
    }

    res.redirect('/admin');
})

//route for adding a category
router.post('/addCategory', async (req, res) => {
    const newCategory = new categoryModel({
        name:req.body.categoryName
    });

    try {
        messageForAdmin = 'added a new category succesfully';
        await newCategory.save();
    }
    catch(error){
        console.log(error);
    }

    res.redirect('/admin');
});

router.post('/addProducer', async (req, res) => {
    const newProducer = new producerModel({
        name:req.body.producerName
    });

    try {
        messageForAdmin = 'added a new producer succesfully';
        await newProducer.save();
    }
    catch(error){
        console.log(error);
    }

    res.redirect('/admin');
});

router.post('/addSeries', upload.any(), async (req, res) => {
    
    const newSeries = new seriesModel({
        name:req.body.seriesName,
        seasons:req.body.seriesSeasons,
        thumbnail:req.files[0].originalname
    });

    try {
        messageForAdmin = 'added a new series succesfully';
        await newSeries.save();
    }
    catch(error){
        console.log(error);
    }

    res.redirect('/admin');
});


router.post('/addContentSeries', adminController.addContentToSeries);
router.post('/setProducerContent', adminController.setProducerToContent);
router.post('/setCategoryContent', adminController.setCategoryContent);

module.exports = router;