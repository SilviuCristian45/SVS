const express = require('express');
const router = express.Router();
const userModel = require('../models/User');
const contentModel = require('../models/Content');

router.get('/browse', async (req, res) => {
    //res.send('afisam clipurile pt ' + req.session.user.email);
    //get the user object id with this mail 
    const userFound = await userModel.findOne({email:req.session.user.email});
    //res.send('afisam clipurile pt ' + userFound.username + ' cu id : ' + userFound._id);
    const contents = await contentModel.find();
    res.json(contents);
    //luam clipurile din collection-ul content
    //res.render('index', {userEmail : email});
});


module.exports = router;