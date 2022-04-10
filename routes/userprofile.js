const express = require('express');
const userModel = require('../models/User');
const router = express.Router();

router.get('/viewProfile', async (req, res) => {
    if(!req.session.authenticated) res.send('user nelogat');

    const currentUser = await userModel.findOne({_id:req.session.user.userid}).lean();

    res.render('userProfile', {user : currentUser, session:req.session, cssfile : ['index.css']} );//
})

router.post('/updateProfile', async (req, res) => {
    if(!req.session.authenticated) res.send('user nelogat');
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const email = req.body.email.trim();
    const currentLoggedUser = req.session.user.userid;

    console.log(username + password + email + currentLoggedUser)

    await userModel.updateOne({_id:currentLoggedUser}, {username:username, password:password, email:email});

    res.redirect('/user/viewProfile');
})

module.exports = router;