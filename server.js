const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const exphbs  = require('express-handlebars');
const flush = require('connect-flash')

const categoryModel = require('./models/Category');
const profileModel = require('./models/Profile');

const app = express();

//configuring the dotenv file
require('dotenv').config({ path: path.resolve(__dirname, 'config.env') }) 

const PORT = 3000 || process.env.PORT;

const oneDay = 1000 * 60 * 60 * 24;
//middlewares/routers
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:false,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: oneDay  },
    resave:false
}));
app.engine('handlebars', exphbs());({   defaultLayout: 'main.handlebars' })
app.set('view engine', 'handlebars');
// app.use(cookieParser());
app.use(express.json({limit: '20mb'}))
app.use(express.urlencoded({ extended: false, limit: '20mb' }))
app.use(express.static('public'));
app.use(flush());

const checkForLogging = (req, res, next) => {
    if(req.session.user == undefined)
        res.redirect('/')
    else 
        next()
}

app.use('/authentication', require('./routes/authentication'));
app.use('/content',checkForLogging, require('./routes/content'));
app.use('/profiles',checkForLogging, require('./routes/profile'));
app.use('/user', require('./routes/userProfile.js'));
app.use('/admin', require('./routes/admin'));
app.get('/session' , (req, res) => res.json(req.session))

//database connection 
let mongoDB = 'mongodb://127.0.0.1/svs';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;

//Bind connection to error event (to g`et notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.post('/sendLikedContent' , async (req, res) => {
    const {firstlikedContent} = req.body;
    const userProfile = req.session.user.profileID;
    console.log(`get some fims liked ${firstlikedContent} from ${userProfile}`)
    // for(let i = 0; i < firstlikedContent.length; i++){
    //     await profileModel.findOneAndUpdate({_id : userProfile}, {$push : {'contentLiked' : firstlikedContent[i]}})
    //     console.log(i)
    // }
    await profileModel.findOneAndUpdate({_id : userProfile}, {$push : {'contentLiked' : firstlikedContent}})
    res.redirect('../profiles')
    console.log("nush daca s-a redirectat")
})

app.listen(PORT, () => {
    console.log(`SVS server started on port ${PORT}`);
})