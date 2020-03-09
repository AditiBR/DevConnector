const express = require('express');
const router = express.Router();  // rather than instantiating whole express just instantiate router part of express

router.get('/test', (req,res) => res.json({msg: 'Profile works!'}));

module.exports =router;