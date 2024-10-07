const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const flash = require('express-flash');
const logger = require('morgan');
const connectDB = require('./config/database');
const mainRoutes = require('./routes/main');
const refuelRoutes = require('./routes/refuels');
// const testRoutes = require('./routes/test');    // Added 8/12/24   -8/13/24: commented out to see if test view is still working; IT IS!! -- 9/5/24: Don't need to specify whole new test route here as long as I have the get API for /test in main route which directs to getTest method in auth controller
const carRoutes = require('./routes/cars');

//Use .env file in config folder
require('dotenv').config({ path: './config/.env' });

// Passport config
require('./config/passport')(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set('view engine', 'ejs');

//Static Folder
app.use(express.static('public'));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger('dev'));

//Use forms for put / delete
app.use(methodOverride('_method'));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use('/', mainRoutes);
app.use('/refuel', refuelRoutes);
// app.use('/test', testRoutes); // Added 8/12/24 -8/13/24: commented out to see if test view is still working; IT IS!!
app.use('/car', carRoutes)

//Server Running
app.listen(process.env.PORT, () => {
  console.log('Server is running, you better catch it!');
});
