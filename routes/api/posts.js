const express = require('express');
const router = express.Router();  // rather than instantiating whole express just instantiate router part of express
const mongoose = require('mongoose');
const passport = require('passport');

//post model
const PostModel = require('../../models/Post');

//profile model
const ProfileModel = require('../../models/Profile');

// @route POST api/posts
// @desc Create post
// @access Private
router.post(
    '/', 
    passport.authenticate('jwt', {session: false}),
    (req,res) => {
        const newPost = new PostModel({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.body.id
        });

        newPost.save()
         .then(post => {
            res.json(post)
         })
         .catch(err=> console.log(err));

 });

// @route GET api/posts
// @desc Get posts
// @access Public
router.get('/', (req,res) => {
    PostModel.find()       //find() is to find 0 or more unlike fineOne() is to find 1 record
     .sort({date: -1})
     .then(posts => {
         if(posts){
             console.log(posts);
             res.json(posts)
         } else{
             res.status(404).json({nopostfound : 'No posts found'})
         }
        })
        .catch(err => console.log(err))
});

// @route   GET api/posts/:id ??????????????did not work????????????????
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
    PostModel.findById(req.params.id)
      .then(post => res.json(post))
      .catch(err =>
        res.status(404).json({ nopostfound: 'No post found with that ID' })
      );
  });

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        ProfileModel.findOne({ user: req.user.id }).then(profile => {        // can ignore this line
           PostModel.findById(req.params.id)
             .then(post => {
            // Check for post owner
                if (post.user.toString() !== req.user.id) {
                return res
                    .status(401)
                    .json({ notauthorized: 'User not authorized' });
                }
    
                // Delete
                post.remove().then(() => res.json({ success: true }));
           })
          .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
      });
    }
  );

  
// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
    '/like/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id }).then(profile => {    // can ignore this line
        PostModel.findById(req.params.id)
          .then(post => {
            if (
              post.likes.filter(like => like.user.toString() === req.user.id)
                .length > 0
            ) {
              return res
                .status(400)
                .json({ alreadyliked: 'User already liked this post' });
            }
  
            // Add user id to likes array
            post.likes.unshift({ user: req.user.id });
  
            post.save().then(post => res.json(post));
          })
          .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
      });
    }
  );

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
//here we are validating if user alreday liked the post if yes then remove person from likes array else do nothing. but we can create dislikes[] here and make sure same person has not liked and unliked the post same time
router.post(
    '/unlike/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id }).then(profile => {
        PostModel.findById(req.params.id)
          .then(post => {
            if (
              post.likes.filter(like => like.user.toString() === req.user.id)
                .length === 0
            ) {
              return res
                .status(400)
                .json({ notliked: 'You have not yet liked this post' });
            }
  
            // Get remove index
            const removeIndex = post.likes
              .map(item => item.user.toString())
              .indexOf(req.user.id);
  
            // Splice out of array
            post.likes.splice(removeIndex, 1);
  
            // Save
            post.save().then(post => res.json(post));
          })
          .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
      });
    }
  );

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
    '/comment/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { errors, isValid } = validatePostInput(req.body);
  
      // Check Validation
      if (!isValid) {
        // If any errors, send 400 with errors object
        return res.status(400).json(errors);
      }
  
      PostModel.findById(req.params.id)
        .then(post => {
          const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
          };
  
          // Add to comments array
          post.comments.unshift(newComment);
  
          // Save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    }
  );

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
    '/comment/:id/:comment_id',   //id is the post id ad comment_id is the id of the post ... always the data coming in from URL/param is a string even if is ID like in here
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      PostModel.findById(req.params.id)
        .then(post => {
          // Check to see if comment exists
          if (
            //post.comments.findById(req.params.comment_id)   // this is same as below
            post.comments.filter(
              comment => comment._id.toString() === req.params.comment_id
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ commentnotexists: 'Comment does not exist' });
          }
  
          // Get remove index
          const removeIndex = post.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);
  
          // Splice comment out of array
          post.comments.splice(removeIndex, 1);
  
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    }
  );

module.exports =router;