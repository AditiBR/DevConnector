const express = require('express');
const UserModel = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('./Validation/register');
const validateLoginInput = require('./Validation/login');

const router = express.Router();  // rather than instantiating whole express just instantiate router part of express

// @route POST api/users/register
// @desc Register User route
// @access Public
router.post('/register', (req,res) => {   

    //validate register inputs
    // const validationOutput = validateRegisterInput(req.body);
    // if(validationOutput.isValid)
    const {errors, isValid} = validateRegisterInput(req.body);   // use javascript deconstruction
    if(!isValid){
        return res.status(400).json(errors);
    }

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

// @route POST api/users/login
// @desc User login route
// @access Public

router.post('/login', (req,res) => {

     //validate login inputs
     const {errors, isValid} = validateLoginInput(req.body);
     if(!isValid){
        return res.status(400).json(errors);
     }

    UserModel.findOne({email: req.body.email})
    .then(user => {
        if(!user){
            return res.status(404).json({email: 'User not found!'});
        } else {        
            bcrypt.compare(req.body.password, user.password)
            .then(isMatch => {
                if(isMatch){
                    //return res.json({msg: 'Success logging in!'})

                    //User matched. 
                    //Payload
                    const payload= {
                        id:user.id,
                        name: user.name,
                        avatar: user.avatar
                    };

                    //Sign token (create token)
                    jwt.sign(
                        payload, 
                        keys.secretOrKey,
                        {expiresIn: 3600},
                        (err,token)=>{
                            res.json({
                                success:true,
                                token: 'Bearer ' + token
                            })
                        });
                } else {
                    return res.status(400).json({password: 'Password Incorrect!'});
                }
            })
            .catch(err => console.log(err)) // if we dont write this catch then if we provide correct email and no pasword then Postman will hang
        }
    })
    .catch(err => console.log(err));
})


// @route GET api/users/current
// @desc Return current information
// @access Private - - Private route means you are supposed to authenticate yourself
router.get(
    '/current', 
    passport.authenticate('jwt', {session: false}),  // This is an extra step private vs public route.. session - if we login to facebook in a browser and try to open another instance of browser it recognizes you there session = true. for bank website sesion = false
    (req,res) =>{
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    })

module.exports =router;