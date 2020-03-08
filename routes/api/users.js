const express = require('express');
const UserModel = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const router = express.Router();  // rather than instantiating whole express just instantiate router part of express

// @route POST api/users/register
// @desc Register User route
// @access Public
router.post('/register', (req,res) => {   
    UserModel.findOne({email: req.body.email})   //req.body.email - this email should math the textbox name on UI
        .then(user => {
        if(user){
        return res.status(400).json({email: 'Email alreday exists!'});   //response needs to have response code
        }
        else{
        const avatar = gravatar.url(req.body.email, {
            s: 200,  // size
            r: 'pg', // rating
            d: 'mm'  // default mm?
        });
        const newUser = new UserModel({
            name: req.body.name,
            email : req.body.email,
            password: req.body.password,
            avatar,       // avatar: avatar,
        });

        //create an encryption key. which remains same for this application. Picks up the key at 10th iteration
        bcrypt.genSalt(10, (err,salt) =>{
            if(err) throw err;
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err
                newUser.password = hash;
                newUser.save()
                .then(user => res.json(user))  // If we do not have any response code here means it is 200
                .catch(err => console.log(err))
            })
        } );

    }
})
.catch(err => console.log(err)) 
});

module.exports =router;