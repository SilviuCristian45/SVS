const express = require('express');
const fs = require('fs');
const router = express.Router();
const userModel = require('../models/User');
const contentModel = require('../models/Content');
const categoryModel = require('../models/Category');

router.get('/browse', async (req, res) => {
    const categories = await categoryModel.find().lean(); //get all the categories in json format (array de json)
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
    //console.log(categories[0].contentsObjects); --DEBUG STUFF--
    res.render('newIndex', {categories});
    
    //const contents = await contentModel.find(); //get all contents 
    //const contentPaths = contents.map( (content) => { return content.path } );
    //res.render('index', {contentPaths});
});

//seeing the video page
router.get('/viewContent/:moviePath', (req, res) => {
   const moviePath = req.params.moviePath; 
   res.render('content', {moviePath});
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

module.exports = router;