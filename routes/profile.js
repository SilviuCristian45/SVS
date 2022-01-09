//------------------------------------------------------LIBRARIES------------------------------------------------------------------
const express = require('express');
const router = express.Router();

//--------------------------------------------------------Controllers--------------------------------------------------------------
const profileController = require('../controllers/profileController');

//displaying the profiles of the current users
router.get('/', profileController.displayProfiles);

router.post('/addProfile', profileController.addProfile);

//router pt stergerea unui profil cu un id dat
router.get('/deleteProfile/:id', profileController.deleteProfile);

//router pt editarea unui profil  cu un id dat
router.post('/editProfile/:id', profileController.editProfile);

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