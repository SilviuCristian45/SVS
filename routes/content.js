const express = require('express');
const fs = require('fs');
const router = express.Router();
const contentModel = require('../models/Content');
const categoryModel = require('../models/Category');
const seriesModel = require('../models/Series');
const profileModel = require('../models/Profile');

router.get('/browse/profile/:profileID', async (req, res) => {
    req.session.user.profileID = req.params.profileID;
    const categories = await categoryModel.find().lean(); //get all the categories in object format (array de json)
    //parcurg fiecare categorie, pt fiecare o sa avem un array de obiecte content luate cu modelul , lean-uite pt a devenit obiecte 
    //si apoi pasate la template-ul html
    for (let index = 0; index < categories.length; index++) { //parcurgem fiecare categorie
        const element = categories[index];
        const contentsObjects = [];
        //console.log(element.contents);
        for (let i = 0; i < element.contents.length; i++) { //parcurgem content obj id-urile categ. curente 
            const objid = element.contents[i];//stocam obj id-ul curent in aceasta variabila
            const objContent = await contentModel.find({_id:objid}).lean(); //punem sirul de obiecte returnat
            contentsObjects.push(objContent[0]); //punem doar primul obiect din sir (pt ca va fi unul singur in sir)
        }
        categories[index].contentsObjects = contentsObjects; //adaugam un nou camp la categoria curenta,
                                                            // cu sirul curent de obiecte de tip Content , pt a afisa okay in template
    }
    res.render('newIndex', {categories});
});

router.get('/browse/series', async (req, res) => {
    const serieses = await seriesModel.find().lean(); //convertim in js object
    console.log('randam serialele')
    for (let i = 0; i < serieses.length; i++) {
        //serial.contents e un array de refs, trebuie populat
        let contentObjects = [];
        for (let j = 0; j < serieses[i].contents.length; j++) {//parcurgem object id-urile episoadelor din acest serial 
            const serialContent = await contentModel.findOne({_id:serieses[i].contents[j]}).lean(); //preluam documentul corespunzator din db
            contentObjects.push(serialContent);//append la array-ul de obiercte
        }
        serieses[i].contentsObjects = contentObjects; //adaugam un camp in obiectul fiecarui serial unde stocam array-ul de obiecte
    }
    res.render('series',{series:serieses});
});

//seeing the video page
router.get('/viewContent/:moviePath', async (req, res) => {
   const moviePath = req.params.moviePath; 
   const contentObject = await contentModel.findOne({
       path : moviePath
   }).lean();
   res.render('content', {movie:contentObject});
});

//streaming the video in the video element from the video page
router.get('/viewContent/video/:movie', (req, res) => {
    const moviePath = req.params.movie; 
    const range = req.headers.range;

    if(!range)
        res.status(400).send('Requires range header');

    console.log('se trimit chunks pt videoclip ' + moviePath);
    //console.log('range is ' + range);
    const videoPath = './content/'+moviePath;
    console.log(videoPath);
    const videoSize = fs.statSync(videoPath).size;

    const chunkSize = (10**6)/2; //1000 000 bytes = 1MB
    const start = Number(range.replace(/\D/g,'')); //delete all letters
    const end = Math.min(start + chunkSize, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        'Content-Range':`bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges':'bytes',
        'Content-Length':contentLength,
        'Content-Type':'video/mp4'
    };

    res.writeHead(206, headers); //not all video (only a part)
    const stream = fs.createReadStream(videoPath, {start, end} ); //read a certain stream 
    stream.pipe(res); //create socket betweeen client and server 
});

//ruta pt afisarea tututor filmelor adaugate in lista de catre user
router.get('/mylist', async (req, res) => {
    //get current logged profile
    const currentProfileID = req.session.user.profileID;
    //get all contents added by the current profile 
    profileModel.findOne({_id:currentProfileID}).lean().populate('mylist').exec(function(err, currentProfile){
       res.render('mylist', {mylistt:currentProfile.mylist})
    });
});

router.get('/addToMyList/:movieID', async (req, res) => {
    const movieID = req.params.movieID;
    const profileLogged = req.session.user.profileID;
    await profileModel.updateOne({_id:profileLogged}, { $push: { mylist: movieID } } );
    res.redirect('/content/mylist');
});

module.exports = router;