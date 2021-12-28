/*profile router*/
const express = require('express');
const router = express.Router();

//models
const userModel = require('../models/User');
const profileModel = require('../models/Profile');
const categoryModel = require('../models/Category');

//displaying the profiles of the current users
router.get('/', async (req, res) => {
    let currentUserID = req.session.user.userid;

    const profilesOfCurrentUser = await profileModel.find({user:currentUserID}).lean();

    let scripts = [{ script: '/js/profile.js' }]; //scripturile pt front-end pe care o sa le contina view-ul
    res.render('profiles',{profiles:profilesOfCurrentUser, scripts});
});

router.post('/addProfile', (req, res) => {
    const newProfileName = req.body.profilename; //noul nume de profil
    const userloggedObjId = req.session.user.userid; //id-ul userului curent 
    const response = new profileModel({name:newProfileName, user:userloggedObjId});
    response.save().then( () => {
        res.redirect('/profiles');
    })
});

//router pt stergerea unui profil cu un id dat
router.get('/deleteProfile/:id', (req, res) => {
    const profileToDelete = req.params.id;
    profileModel.deleteOne({_id:profileToDelete}).then( () => {
        res.redirect('/profiles');
    });
});

//router pt editarea unui profil  cu un id dat
router.post('/editProfile/:id', (req, res) => {
    const profileToEdit = req.params.id;
    profileModel.updateOne({_id:profileToEdit}, {name:req.body.profileId}).then( () => {
        res.redirect('/profiles'); 
    }) 
});

//test many to many functional 

/*
router.get('/categories', (req, res) => {
    //create a new profile model with category Romantic
    const newProfile = new profileModel({
        name:"profilul cu categorii",
        user:"618d5250f1c7ad38cee7e1f1",
        prefferedCategories:["61a6530415c8108a781954f1"]
    });

    newProfile.save().then( async () => {
        //adaug si in fiecare categorie id-ul profilului la array-ul de profile care sunt fani pe categoria respectiva
        await categoryModel.updateMany({_id:newProfile.prefferedCategories}, { $push: { profileFans: newProfile._id } });
    });

    res.json(newProfile);
})
*/

module.exports = router;