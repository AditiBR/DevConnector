const express = require('express');
const expressApp = express();

//Let's write our first route
expressApp.get('/',(req,res)=>{
   res.send('Hello');
})

const port= 8020;

expressApp.listen(port, ()=> console.log(`Server runing on port ${port}`));
