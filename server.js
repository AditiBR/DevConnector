const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

const expressApp = express();

//Body parser middleware.. express is the one getting data. urlencoded - textbox might have some characters
// extended - you can come up with your own encoding
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(bodyParser.json());


//DB config
const dbConnectionString = require('./config/keys').mongoURI
mongoose
.connect(dbConnectionString)
.then(()=> console.log('MongoDB Connected!'))
.catch(err => console.log(err)) ;

//Let's write our first route
expressApp.get('/',(req,res)=>{
   res.send('Hello');
})

expressApp.use('/api/users',users);
expressApp.use('/api/posts',posts);
expressApp.use('/api/profile',profile);

const port= 8020;

expressApp.listen(port, ()=> console.log(`Server runing on port ${port}`));
