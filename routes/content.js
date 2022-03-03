const express = require('express');
const fs = require('fs');
const router = express.Router();
const contentModel = require('../models/Content');
const categoryModel = require('../models/Category');
const seriesModel = require('../models/Series');
const profileModel = require('../models/Profile');
const path = require('path');
const recomandationController = require('../controllers/recommendation')
const popularityController = require('../controllers/popularity');

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
    const profile = await profileModel.findById(req.session.user.profileID).lean()
    const favCategory = await recomandationController.recommendFilms(profile.contentLiked)
    const contentToRecommend = await recomandationController.getRandomContentFromCategories(favCategory, profile.contentViewed)
    const recentContent = await contentModel.find().limit(10).sort({date_published:-1});
    const popularContent = await popularityController.updatePopularityRatings(contentModel);
    
    res.render('newIndex', {
        categories, 
        recentContent: recentContent ? recentContent.map(c => c.toJSON()) : [] ,
        session:req.session,
        contentRecomended : contentToRecommend ? contentToRecommend.map( c => c.toJSON() ) : [],
        popularityContent : popularContent ? popularContent : []
    });
});



router.get('/browse/series', async (req, res) => {
    const serieses = await seriesModel.find().lean(); //convertim in js object
    console.log('randam serialele')
    // for(let i = 0; i < serieses.length; i++){
    //     const continuturiRezultate = await contentModel.find({parentSeries : serieses[i]._id}).lean()
    //     serieses[i].contentsObjects = continuturiRezultate
    // }
    console.log(serieses)
    res.render('series',{series:serieses, session:req.session});
});

//seeing the video page
router.get('/viewContent/:moviePath', async (req, res) => {
   const moviePath = req.params.moviePath; 
   const contentObject = await contentModel.findOne({
       _id : moviePath
   }).lean();
   //adaugam in lista de viewed a profilului curent 
   await profileModel.findOneAndUpdate({_id:req.session.user.profileID}, {$push : {"contentViewed" : moviePath} } )
   await contentModel.findOneAndUpdate({_id:moviePath}, {$inc : {"views" : 1}})
   res.render('content', {movie:contentObject});
});

//streaming the video in the video element from the video page
router.get('/viewContent/video/:movie', (req, res) => {
    const moviePath = req.params.movie; 
    const range = req.headers.range;

    if(!range)
        res.status(400).send('Requires range header');

    //console.log('se trimit chunks pt videoclip ' + moviePath);
    //console.log('range is ' + range);
    const videoPath = './content/'+moviePath;
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

router.get('/thumbnail/:name', (req, res) => {
    const thumbnailName = req.params.name;
    //console.log(path.join(process.cwd(), "/content/"+thumbnailName));
    res.set('Content-Type', 'image/jpeg')
    res.sendFile(path.join(process.cwd(), "/content/"+thumbnailName));
})

//ruta pt afisarea tututor filmelor adaugate in lista de catre user
router.get('/mylist', async (req, res) => {
    //get current logged profile
    const currentProfileID = req.session.user.profileID;
    //get all contents added by the current profile 
    profileModel.findOne({_id:currentProfileID}).lean().populate('mylist').exec(function(err, currentProfile){
       res.render('mylist', {mylistt:currentProfile.mylist, session:req.session})
    });
});

router.get('/addToMyList/:movieID', async (req, res) => {
    const movieID = req.params.movieID;
    const profileLogged = req.session.user.profileID;
    await profileModel.updateOne({_id:profileLogged}, { $push: { mylist: movieID } } );
    res.redirect('/content/mylist');
});

router.post('/search', async (req, res) => {
    const contentSearch = req.body.contentSearch
    console.log(`.*${contentSearch} .*`)
    const result = await contentModel.find({title : { $regex : `.*${contentSearch}.*`} } );
    res.render('searchresult', {content : result.map( r => r.toJSON() ), session:req.session})
})

function isInArray(arr, el){
    for (let index = 0; index < arr.length; index++)
        if(arr[index] == el)
            return true;
    return false;
}

router.get('/rate/:filmID/:vote', async (req, res) => {
    const filmID = req.params.filmID
    const vote = req.params['vote']
    const profilID = req.session.user.profileID

    console.log(vote == 1)

    const currentProfile = await profileModel.findOne({_id:profilID}).lean()

    const alreadyliked = (currentProfile.contentLiked == undefined) ? false : isInArray(currentProfile.contentLiked, filmID)
    const alreadyDisliked = (currentProfile.contentDisLiked == undefined) ? false : isInArray(currentProfile.contentDisLiked, filmID)
    
    console.log(`already liked : ${alreadyliked}`)
    console.log(`already disliked : ${alreadyDisliked}`)

    if(vote == 1 && alreadyliked)
        res.json({message : 'already liked'})
    if(vote == -1 && alreadyDisliked)
        res.json({message : 'already disliked'})

    if(vote == 1 && !alreadyliked && !alreadyDisliked){ //daca a dat like si deja nu a mai avut la liked filmul 
        await contentModel.updateOne({_id:filmID}, {$inc : {likes : vote}}) //increase the like of the viewed content 
        await profileModel.updateOne({_id:profilID}, {$push : {"contentLiked" : filmID}})
    }
    else if(vote == 1 && !alreadyliked && alreadyDisliked){
        await profileModel.updateOne({_id:profilID}, {$pull : {"contentDisLiked" : filmID}})
        await contentModel.updateOne({_id:filmID}, {$inc : {dislikes : -1}}) 
        await contentModel.updateOne({_id:filmID}, {$inc : {likes : vote}})
        await profileModel.updateOne({_id:profilID}, {$push : {"contentLiked" : filmID}})
    }
    else if(vote == -1 && !alreadyDisliked && !alreadyliked){//daca a dat dislike si nu avea la liked filmul
        await contentModel.updateOne({_id:filmID}, {$inc : {dislikes : +1}}) //increase the like of the viewed content 
        await profileModel.updateOne({_id:profilID}, {$push : {"contentDisLiked" : filmID}})
    }
    else if (vote == -1 && !alreadyDisliked && alreadyliked){
        await profileModel.updateOne({_id:profilID}, {$pull : {"contentLiked" : filmID}})
        await contentModel.updateOne({_id:filmID}, {$inc : {dislikes : 1}}) 
        await contentModel.updateOne({_id:filmID}, {$inc : {likes : -1}})
        await profileModel.updateOne({_id:profilID}, {$push : {"contentDisLiked" : filmID}})
    }
    
    res.json({like:'succes'})
});

router.get('/viewSeries/:seriesid', async (req, res) => {
    const seriesID = req.params.seriesid
    const episodes = await contentModel.find({parentSeries : seriesID}).lean()
    console.log('##')
    console.log(episodes)
    res.render('seriesEpisodes', {episodes : episodes, session : req.session})
})

module.exports = router;