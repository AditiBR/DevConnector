const express = require('express');
const router = express.Router();  // rather than instantiating whole express just instantiate router part of express

// @route GET api/users/test 
// @desc Tests users route
// @access Public
router.get('/test', (req,res) => res.json({msg: 'User works!'}));

module.exports =router;