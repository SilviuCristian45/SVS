/*profile router*/
const express = require('express');
const router = express.Router();

//models
const userModel = require('../models/User');
const profileModel = require('../models/Profile');

//displaying the profiles of the current users
router.get('/', async (req, res) => {
    let currentUser = req.session.user.email;

    const currentUserObj = await userModel.findOne({email:currentUser}).lean(); //returneaza un array si lean le converteste la js objects
    const profilesObjID = currentUserObj.profiles;
    
    const profiles = [];
    //parcurgem profilele si le afisam 
    for (let index = 0; index < currentUserObj.profiles.length; index++) {
        const profileObjId = currentUserObj.profiles[index];
        const profileObj = await profileModel.findOne({_id:profileObjId}).lean();
        profiles.push(profileObj);
    }

    let scripts = [{ script: '/js/profile.js' }]; //scripturile pt front-end pe care o sa le contina view-ul
    res.render('profiles',{profiles, scripts});
});

module.exports = router;