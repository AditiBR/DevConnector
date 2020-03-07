const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

const expressApp = express();


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
