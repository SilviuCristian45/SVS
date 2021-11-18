const express = require('express');
const router = express.Router();
const userModel = require('../models/User');
const emailValidator = require('deep-email-validator');
 


router.post('/register', async (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;

    if(!validatePassword(pass)){
        res.send('Minimum eight characters, at least one letter lowercase , at least one letter uppercase and one number:');
        return;
    }

    const isEmailReal = await isEmailValid(email);

    if(isEmailReal.valid === false){
        res.send('Please provide an valid email');
        return;
    }

    const newUser = new userModel({username:'Silviu', email, password:pass});
    newUser.save( err => { console.log(err);} );

    res.send('user inregistrat cu succes');
    
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;

    //get the user from the database with the given email 
    const userFound = await userModel.findOne({email:email});

    if (userFound.password.toString() !== pass) {
        res.send('email or password incorrect');
        return;
    }

    req.session.authenticated = true;
    req.session.user = {
        email,pass
    };

    //console.log(req.session.user);

    res.redirect('/profiles');
    //res.redirect('/content/browse');
    //luam clipurile din collection-ul content
    //res.render('index', {userEmail : email});
});

function validatePassword(password){
    //Minimum eight characters, at least one letter lowercase , at least one letter uppercase and one number:
    let regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    return regex.test(password);
}

//input : email - string 
//output: true/false - bool
async function isEmailValid(email) {
    return emailValidator.validate(email)
}

function sendConfirmationCode(email){

}

//input : password - string 
//output: true/false - bool
function validatePasswordLogin(password){

}

module.exports = router;