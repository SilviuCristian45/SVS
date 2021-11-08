const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const exphbs  = require('express-handlebars');

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
    saveUninitialized:false,
    cookie: { maxAge: oneDay },
    resave:true
}));
// app.use(cookieParser());
app.use(express.json({limit: '20mb'}))
app.use(express.urlencoded({ extended: false, limit: '20mb' }))
app.use(express.static('public'));
app.use('/authentication', require('./routes/authentication'));

//database connection 
let mongoDB = 'mongodb://127.0.0.1/svs';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;

const adminUserModel = require('./models/AdminUser');
const userModel = require('./models/User');

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
    res.send('hello svs');
});

app.listen(PORT, () => {
    console.log(`SVS server started on port ${PORT}`);
})