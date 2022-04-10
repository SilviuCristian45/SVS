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

//
router.get('/switchProifle', profileController.displayProfiles)

module.exports = router;