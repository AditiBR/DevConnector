const JwtStrategy = require('passport-jwt').Strategy;  // mentioning we are using JWT version of the passport
const ExtractJwt = require('passport-jwt').ExtractJwt;  // Extract the token. This lib will figure out where the header is in request and locate the authorization section and get the token
const mongoose = require('mongoose');
const UserModel = require('../models/User');  // const UserModel = mongoose.model('users')
const keys =require('./keys');

//options to extract token
const opts ={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

//jwt_payload is the decrypted payload 

module.exports = passport => {   
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload);

        //Varify if the token is valid
        UserModel.findById(jwt_payload.id)
        .then(user =>{
            if(user){
                return done(null, user)
            } else{
                return done(null, false)
            }           
        })
       .catch(err => console.log(err)) 
       //.catch(error => console.log(done(error)));  // How to validate this path?

    }) )
}

