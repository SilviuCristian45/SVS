const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const exphbs  = require('express-handlebars');
const categoryModel = require('./models/Category');

const app = express();

//configuring the dotenv file
require('dotenv').config({ path: path.resolve(__dirname, 'config.env') }) 

const PORT = 3000 || process.env.PORT;

const oneDay = 1000 * 60 * 60 * 24;
//middlewares/routers
app.engine('handlebars', exphbs());({   defaultLayout: 'main.handlebars' })
app.set('view engine', 'handlebars');
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave:true
}));
// app.use(cookieParser());
app.use(express.json({limit: '20mb'}))
app.use(express.urlencoded({ extended: false, limit: '20mb' }))
app.use(express.static('public'));
app.use('/authentication', require('./routes/authentication'));
app.use('/content', require('./routes/content'));
app.use('/profiles', require('./routes/profile'));
app.use('/user', require('./routes/userProfile.js'));
app.use('/admin', require('./routes/admin'));

//database connection 
let mongoDB = 'mongodb://127.0.0.1/svs';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;

//Bind connection to error event (to g`et notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(PORT, () => {
    console.log(`SVS server started on port ${PORT}`);
})