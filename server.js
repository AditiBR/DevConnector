const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
var passport = require('passport');

const expressApp = express();

//Body parser middleware.. 
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(bodyParser.json());

//DB config
const dbConnectionString = require('./config/keys').mongoURI

//Connect to mongodb
mongoose
.connect(dbConnectionString)
.then(()=> console.log('MongoDB Connected!'))
.catch(err => console.log(err)) ;

//Passport middleware 
expressApp.use(passport.initialize());
//Passport config
require('./config/passport')(passport);

//Let's write our first route
expressApp.get('/',(req,res)=>{
   res.send('Hello');
})

expressApp.use('/api/users',users);
expressApp.use('/api/posts',posts);
expressApp.use('/api/profile',profile);

const port= 8020;

expressApp.listen(port, ()=> console.log(`Server runing on port ${port}`));
