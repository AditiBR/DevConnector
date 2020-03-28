const express = require('express');
const router = express.Router();  // rather than instantiating whole express just instantiate router part of express
const mongoose = require('mongoose');
const passport = require('passport');
const ProfileModel = require('../../models/Profile');

// Load User Model
const User = require('../../models/User');
// Load Validation
const validateProfileInput = require('../api/Validation/profile');
const validateExperienceInput = require('../api/validation/experience');
const validateEducationInput = require('../api/validation/education');

//@route POST api/profile
//@desc Create user profile
//@access Private
router.post('/',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const { errors, isValid } = validateProfileInput(req.body);
        // Check Validation
        if (!isValid) {
          // Return any errors with 400 status
          return res.status(400).json(errors);
        }
    
        // Get fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;  // have if() check as not all the fields on UI are mandatory there are optional fields as well
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername)
          profileFields.githubusername = req.body.githubusername;
    
        // Skills - Spilt into array
        //if (req.body.skills) profileFields.skills = req.body.skills.split(","); // another way for below check
        if (typeof req.body.skills !== "undefined") {
          profileFields.skills = req.body.skills.split(",");
        }
    
        // Social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    
        ProfileModel.findOne({ user: req.user.id }).then(profile => {
          if (profile) {
            // Update
            ProfileModel.findOneAndUpdate(
              { user: req.user.id },  // this is same as where in SQL command like Update ...set... where userid=<id>
              { $set: profileFields }, // This is set from above command
              { new: true } // this is not new record.. colection=table and each row = documen.  in NoSql not every row/document has diff structure unlike we have in SQL row so 
             // this new:true is allow the document to come new data because they may not have given this data before when created earlier
            ).then(profile => res.json(profile));
          } else {
            // Create    
            // Check if handle exists
            ProfileModel.findOne({ handle: profileFields.handle }).then(profile => {
              if (profile) {
                errors.handle = "That handle already exists";
                return res.status(400).json(errors);
              }
              // Save Profile
              new ProfileModel(profileFields).save().then(profile => res.json(profile));
            });
          }
        });
      })

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const errors = {};
  
      ProfileModel.findOne({ user: req.user.id })
     .populate("user", ["name", "avatar"])
        .then(profile => {
          if (!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors);
          }
          res.json(profile);
        })
        .catch(err => res.status(404).json(err));
    }
  );

  
// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
    const errors = {};
  
    ProfileModel.find()
      .populate("user", ["name", "avatar"])
      .then(profiles => {
        if (!profiles) {
          errors.noprofile = "There are no profiles";
          return res.status(404).json(errors);
        }
  
        res.json(profiles);
      })
      .catch(err => res.status(404).json({ profile: "There are no profiles" }));
  });

  
// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handleParam", (req, res) => {
    const errors = {};
  
    ProfileModel.findOne({ handle: req.params.handleParam })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          res.status(404).json(errors);
        }
  
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  });
  
// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
//Mostly used behind the scene as user doesn't know the user id so this API is not used by end user
router.get("/user/:user_id", (req, res) => {
    const errors = {};
  
    ProfileModel.findOne({ user: req.params.user_id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          res.status(404).json(errors);
        }
  
        res.json(profile);
      })
      .catch(err =>
        res.status(404).json({ profile: "There is no profile for this user" })
      );
  });  

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Profile.findOneAndRemove({ user: req.user.id }).then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
          res.json({ success: true })
        );
      });
    }
  );

module.exports =router;