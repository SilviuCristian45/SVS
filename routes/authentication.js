const express = require('express');
const router = express.Router();
const userModel = require('../models/User');
const emailValidator = require('deep-email-validator');
const mongoose = require('mongoose');
const path = require('path')
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.resolve(__dirname, 'config.env') }) 

//configuring the dotenv file
require('dotenv').config({ path: path.resolve(__dirname, 'config.env') })  

router.post('/register', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const pass = req.body.password;

    //console.log(process.env.devmode);

    if(process.env.devmode != 1){ //validate only when devmode is 0 
        if(!validatePassword(pass)){
            res.send('Minimum eight characters, at least one letter lowercase , at least one letter uppercase and one number:');
            return;
        }
    
        const isEmailReal = await isEmailValid(email);
    
        if(isEmailReal.valid === false){
            res.send('Please provide an valid email');
            return;
        }
    }

    const newUser = new userModel({
        _id: new mongoose.Types.ObjectId(),
        username, email, 
        password:pass
    });

    setUpSession(req, newUser._id ,email);

    newUser.save().then( () => {
        req.flash('message','Succesfully registered. Congrats :) and welcome');
        res.redirect('/profiles')
    }).catch(err => console.log(err));
    
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

    setUpSession(req, userFound._id, email);
    
    res.redirect('/profiles');
    //res.redirect('/content/browse');
    //luam clipurile din collection-ul content
    //res.render('index', {userEmail : email});
});

router.get('/resetpass/:targetMail', (req, res) => {
    const emailTarget = req.params.targetMail
    res.render('resetpass.handlebars', {session:req.session, cssfile : ['index.css'], targetMail:emailTarget});
})

router.post('/resetpass', (req, res) => {
    const {email, pass} = req.body
    console.log(email + ' ' + pass)
    userModel.findOneAndUpdate({email : email}, {$set : {password : pass}}).then( result => res.json(result) ).catch( error => console.log(error))
})

router.post('/forgotpass', async (req, res) => {
    const emailTarget = req.body.email;
    emailTarget.trim()
    
    const serverEmail = process.env.mail;
    const passEmail = process.env.pass;

    console.log(serverEmail + ' ' + passEmail)
    let transporter = nodemailer.createTransport({
        host: "smtp.mail.yahoo.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: serverEmail, // generated ethereal user
            pass: passEmail // generated ethereal password
        },
        debug:false,
        logger:false
    });

    //console.log(transporter)
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: serverEmail,     // sender address
        to: emailTarget,             // list of receivers
        subject: "Hello",         // Subject line
        text: "xd", // text
        html : `<a href="http://localhost:3000/authentication/resetpass/${emailTarget}"> reset pass bro </a>`
    });

    res.redirect('/forgotpass.html')
})


function logout(req){
    if(req.session){
        req.session.destroy()
    }
}

router.get('/logout', (req, res) => {
    logout(req)
    res.redirect('/')
})

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

function setUpSession(req, userid, email){
    req.session.authenticated = true;
    req.session.user = {
        userid,
        email
    }
}


module.exports = router;